-- Feature 004: visit engine (spec FR-001..FR-019)
--
-- Constitution IV: a visit is not done until its record is complete. That is a
-- guard in complete_visit(), not a disabled button, because a rule enforced
-- only in the interface is broken by the first retry or lost connection.
--
-- This migration also discharges the correction feature 001's plan recorded:
-- technicians lose their blanket read of sites and gain sight of one only while
-- they have an unfinished visit there.

create type public.visit_status as enum ('planned', 'done', 'missed');
create type public.plant_condition as enum
  ('healthy', 'needs_attention', 'declining', 'replaced');

-- ── tables ───────────────────────────────────────────────────────────

create table public.visits (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions (id) on delete cascade,
  site_id uuid not null references public.sites (id) on delete restrict,
  scheduled_date date not null,
  status public.visit_status not null default 'planned',
  technician_id uuid references public.profiles (id) on delete set null,
  sequence_no smallint,
  completed_at timestamptz,
  completed_by uuid references public.profiles (id),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- FR-004: this is the idempotency guarantee. Generation may run any number
  -- of times; a date already covered is never covered twice.
  constraint visits_one_per_day unique (subscription_id, scheduled_date)
);

create index visits_day on public.visits (scheduled_date, sequence_no);
create index visits_technician on public.visits (technician_id, scheduled_date);
create index visits_subscription on public.visits (subscription_id, scheduled_date desc);

create trigger visits_updated_at
  before update on public.visits
  for each row execute procedure extensions.moddatetime (updated_at);

create table public.visit_plant_records (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits (id) on delete cascade,
  subscription_line_id uuid not null references public.subscription_lines (id) on delete restrict,
  condition public.plant_condition not null,
  note text,
  recorded_at timestamptz not null default now(),
  constraint visit_records_one_per_plant unique (visit_id, subscription_line_id)
);

create table public.visit_photos (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits (id) on delete cascade,
  storage_path text not null,
  taken_by uuid references public.profiles (id),
  taken_at timestamptz not null default now()
);

create index visit_photos_visit on public.visit_photos (visit_id);

-- Private, unlike the catalogue bucket: these are photographs inside a
-- customer's office.
insert into storage.buckets (id, name, public)
values ('visits', 'visits', false)
on conflict (id) do nothing;

-- ── access helpers ───────────────────────────────────────────────────

create function public.can_access_visit(p_visit_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
      from public.visits v
      join public.subscriptions s on s.id = v.subscription_id
     where v.id = p_visit_id
       and (
         v.technician_id = auth.uid()
         or s.owner_account_id = auth.uid()
         or (s.organization_id is not null
             and public.org_role(s.organization_id) is not null)
         or public.is_operator()
       )
  );
$$;

-- The narrowed rule (feature 001's recorded correction): a technician may see
-- a site while they are assigned an unfinished visit there, and not after.
create function public.technician_sees_site(p_site_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.visits v
     where v.site_id = p_site_id
       and v.technician_id = auth.uid()
       and v.status = 'planned'
  );
$$;

-- ── generation ───────────────────────────────────────────────────────

create function public.generate_visits(p_horizon_days integer default 28)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  s record;
  d date;
  today date := (now() at time zone 'Asia/Dubai')::date;
  stop_on date;
  gap integer;
  guard integer;
  created integer := 0;
begin
  for s in
    select sub.id, sub.site_id, sub.installation_date, sub.ends_on,
           z.service_weekdays, c.visits_per_month
      from public.subscriptions sub
      join public.sites si on si.id = sub.site_id
      join public.service_zones z on z.id = si.zone_id
      left join public.service_cadences c on c.code = sub.cadence_code
     where sub.status = 'active'
  loop
    -- Spacing comes from the cadence in DAYS, then snaps forward to a day the
    -- zone is actually served. Counting served days instead would make a
    -- fortnightly subscription weekly in any zone served twice a week.
    gap := greatest(round(30.44 / nullif(coalesce(s.visits_per_month, 4.33), 0))::integer, 1);

    d := greatest(s.installation_date, today);
    stop_on := least(s.ends_on, today + p_horizon_days);

    -- Start on the first served day on or after that.
    guard := 0;
    while d <= stop_on
      and not (extract(dow from d)::smallint = any (s.service_weekdays))
      and guard < 400
    loop
      d := d + 1;
      guard := guard + 1;
    end loop;

    while d <= stop_on loop
      insert into public.visits (subscription_id, site_id, scheduled_date)
      values (s.id, s.site_id, d)
      on conflict (subscription_id, scheduled_date) do nothing;
      if found then
        created := created + 1;
      end if;

      -- Jump a full cadence gap, then forward to the next served day.
      d := d + gap;
      guard := 0;
      while d <= stop_on
        and not (extract(dow from d)::smallint = any (s.service_weekdays))
        and guard < 400
      loop
        d := d + 1;
        guard := guard + 1;
      end loop;
    end loop;
  end loop;

  -- FR-006: a subscription that is no longer active keeps what happened and
  -- loses what was merely planned.
  delete from public.visits v
   using public.subscriptions sub
   where sub.id = v.subscription_id
     and sub.status <> 'active'
     and v.status = 'planned'
     and not exists (select 1 from public.visit_plant_records r where r.visit_id = v.id)
     and not exists (select 1 from public.visit_photos p where p.visit_id = v.id);

  return created;
end;
$$;

grant execute on function public.generate_visits(integer) to authenticated;

-- ── assignment and completion ────────────────────────────────────────

create function public.assign_visit(
  p_visit_id uuid,
  p_technician_id uuid,
  p_sequence_no smallint default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.visit_status;
begin
  if not public.is_operator() then
    raise exception 'only an operator can assign a visit';
  end if;

  select status into v_status from public.visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;
  if v_status <> 'planned' then
    raise exception 'this visit is already finished';
  end if;

  if p_technician_id is not null and not exists (
       select 1 from public.staff_roles
        where account_id = p_technician_id and role = 'technician')
  then
    raise exception 'that person is not a technician';
  end if;

  update public.visits
     set technician_id = p_technician_id, sequence_no = p_sequence_no
   where id = p_visit_id;
end;
$$;

grant execute on function public.assign_visit(uuid, uuid, smallint) to authenticated;

create function public.complete_visit(p_visit_id uuid, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_visit public.visits;
  v_photos integer;
  v_expected integer;
  v_recorded integer;
begin
  select * into v_visit from public.visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;
  if v_visit.technician_id is distinct from auth.uid() and not public.is_operator() then
    raise exception 'this visit is not yours';
  end if;
  if v_visit.status <> 'planned' then
    raise exception 'this visit is already finished';
  end if;

  -- Constitution IV, enforced where it cannot be skipped.
  select count(*) into v_photos from public.visit_photos where visit_id = p_visit_id;
  if v_photos = 0 then
    raise exception 'add at least one photo before completing';
  end if;

  select count(*) into v_expected
    from public.subscription_lines where subscription_id = v_visit.subscription_id;
  select count(*) into v_recorded
    from public.visit_plant_records where visit_id = p_visit_id;
  if v_recorded < v_expected then
    raise exception 'record a condition for every plant first';
  end if;

  update public.visits
     set status = 'done', completed_at = now(), completed_by = auth.uid(),
         note = coalesce(p_note, note)
   where id = p_visit_id;
end;
$$;

grant execute on function public.complete_visit(uuid, text) to authenticated;

create function public.miss_visit(p_visit_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_visit public.visits;
begin
  if coalesce(trim(p_reason), '') = '' then
    raise exception 'say why the visit could not be done';
  end if;

  select * into v_visit from public.visits where id = p_visit_id for update;
  if not found then
    raise exception 'visit not found';
  end if;
  if v_visit.technician_id is distinct from auth.uid() and not public.is_operator() then
    raise exception 'this visit is not yours';
  end if;
  if v_visit.status <> 'planned' then
    raise exception 'this visit is already finished';
  end if;

  update public.visits
     set status = 'missed', completed_at = now(), completed_by = auth.uid(),
         note = p_reason
   where id = p_visit_id;
end;
$$;

grant execute on function public.miss_visit(uuid, text) to authenticated;

-- ── policies ─────────────────────────────────────────────────────────

alter table public.visits enable row level security;

create policy "visits: customer, assigned technician or operator"
  on public.visits for select to authenticated
  using (public.can_access_visit(id));

alter table public.visit_plant_records enable row level security;

create policy "visit records: via visit"
  on public.visit_plant_records for select to authenticated
  using (public.can_access_visit(visit_id));

-- The technician writes the record while the visit is theirs and unfinished.
create policy "visit records: assigned technician writes"
  on public.visit_plant_records for insert to authenticated
  with check (
    exists (select 1 from public.visits v
             where v.id = visit_id and v.status = 'planned'
               and (v.technician_id = (select auth.uid()) or (select public.is_operator())))
  );

create policy "visit records: assigned technician corrects"
  on public.visit_plant_records for update to authenticated
  using (
    exists (select 1 from public.visits v
             where v.id = visit_id and v.status = 'planned'
               and (v.technician_id = (select auth.uid()) or (select public.is_operator())))
  )
  with check (
    exists (select 1 from public.visits v
             where v.id = visit_id and v.status = 'planned'
               and (v.technician_id = (select auth.uid()) or (select public.is_operator())))
  );

alter table public.visit_photos enable row level security;

create policy "visit photos: via visit"
  on public.visit_photos for select to authenticated
  using (public.can_access_visit(visit_id));

create policy "visit photos: assigned technician adds"
  on public.visit_photos for insert to authenticated
  with check (
    exists (select 1 from public.visits v
             where v.id = visit_id and v.status = 'planned'
               and (v.technician_id = (select auth.uid()) or (select public.is_operator())))
  );

-- Storage: private bucket, readable by anyone who may see the visit.
create policy "visit photos: read own"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'visits'
    and public.can_access_visit((split_part(name, '/', 1))::uuid)
  );

create policy "visit photos: technician uploads"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'visits'
    and exists (
      select 1 from public.visits v
       where v.id = (split_part(name, '/', 1))::uuid
         and v.status = 'planned'
         and (v.technician_id = (select auth.uid()) or (select public.is_operator()))
    )
  );

-- A technician must know which plants are at the stop (FR-008). Feature 003's
-- policy on subscription_lines only covers the customer, so the assigned
-- technician gets a narrow read of its own — the plants, never the money, and
-- only while the visit is unfinished.

create policy "subscription lines: assigned technician reads"
  on public.subscription_lines for select
  to authenticated
  using (
    exists (
      select 1 from public.visits v
       where v.subscription_id = subscription_lines.subscription_id
         and v.technician_id = (select auth.uid())
         and v.status = 'planned'
    )
  );

-- ── feature 001's recorded correction, discharged ────────────────────
-- Technicians no longer read every site. They read a site while they have an
-- unfinished visit there, and not afterwards.

drop policy "sites: owner or organization reads" on public.sites;

create policy "sites: owner or organization reads"
  on public.sites for select
  to authenticated
  using (
    owner_account_id = (select auth.uid())
    or (organization_id is not null and public.org_role(organization_id) is not null)
    or (select public.is_operator())
    or public.technician_sees_site(id)
  );

-- FR-019: a zone's days can change after visits exist. Existing visits stay
-- (nobody's plan should vanish), and operators get a list to act on.

create function public.visits_off_service_days()
returns table (id uuid, scheduled_date date, label text, zone_name text)
language sql
security definer
set search_path = ''
stable
as $$
  select v.id, v.scheduled_date, si.label, z.name
    from public.visits v
    join public.sites si on si.id = v.site_id
    join public.service_zones z on z.id = si.zone_id
   where v.status = 'planned'
     and public.is_operator()
     and not (extract(dow from v.scheduled_date)::smallint = any (z.service_weekdays))
   order by v.scheduled_date;
$$;

grant execute on function public.visits_off_service_days() to authenticated;

-- ── nightly generation ───────────────────────────────────────────────
-- 22:00 UTC is 02:00 in Asia/Dubai: after the working day, before the next.

create extension if not exists pg_cron;

select cron.schedule(
  'planty-generate-visits',
  '0 22 * * *',
  $$select public.generate_visits(28)$$
);
