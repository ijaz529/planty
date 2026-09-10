-- Feature 005: replacements & rotations (spec FR-001..FR-014)
--
-- One table serves two opposite promises. A REPLACEMENT is Planty honouring
-- its guarantee: free, unlimited, on decline. A ROTATION is the customer
-- spending a counted quarterly entitlement for something different. They share
-- a lifecycle because the mechanism is identical; they are kept visibly apart
-- because metering the guarantee would break the product's central claim.
--
-- Rotations remaining is DERIVED, never stored. A counter would have to be
-- decremented on spend and restored on decline, on withdrawal and on
-- cancellation, and one missed path makes it lie forever.

create type public.change_kind as enum ('replacement', 'rotation');
create type public.change_status as enum
  ('requested', 'approved', 'declined', 'fulfilled', 'withdrawn');

alter table public.subscriptions
  add column rotation_allowance smallint not null default 2
    check (rotation_allowance between 0 and 12);

create table public.plant_change_requests (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions (id) on delete cascade,
  subscription_line_id uuid not null references public.subscription_lines (id) on delete restrict,
  kind public.change_kind not null,
  requested_variant_id uuid references public.plant_variants (id) on delete restrict,
  reason text,
  status public.change_status not null default 'requested',
  visit_id uuid references public.visits (id) on delete set null,
  requested_by uuid references public.profiles (id),
  decided_by uuid references public.profiles (id),
  decided_at timestamptz,
  decision_note text,
  fulfilled_by uuid references public.profiles (id),
  fulfilled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A rotation must say what is wanted instead; a replacement must not, because
  -- Planty chooses a like-for-like plant.
  constraint change_kind_target check (
    (kind = 'rotation' and requested_variant_id is not null)
    or (kind = 'replacement' and requested_variant_id is null)
  )
);

-- FR-003: at most one open request per plant.
create unique index change_requests_one_open_per_line
  on public.plant_change_requests (subscription_line_id)
  where status in ('requested', 'approved');

create index change_requests_subscription
  on public.plant_change_requests (subscription_id, created_at desc);
create index change_requests_visit on public.plant_change_requests (visit_id);
create index change_requests_open on public.plant_change_requests (status)
  where status in ('requested', 'approved');

create trigger change_requests_updated_at
  before update on public.plant_change_requests
  for each row execute procedure extensions.moddatetime (updated_at);

-- ── the rotation window ──────────────────────────────────────────────
-- 90 days from installation, not calendar quarters: a customer who joined in
-- March should not get a two-week first quarter.

create function public.rotation_period_start(p_subscription_id uuid)
returns date
language sql
security definer
set search_path = ''
stable
as $$
  select case
    -- Before installation the subscription is in its first window, which runs
    -- from when it was created — otherwise a request made between ordering and
    -- installation would fall outside every window and cost nothing.
    when current_date < s.installation_date then s.created_at::date
    else s.installation_date
         + (floor((current_date - s.installation_date) / 90.0)::int * 90)
  end
    from public.subscriptions s
   where s.id = p_subscription_id;
$$;

create function public.rotation_period_end(p_subscription_id uuid)
returns date
language sql
security definer
set search_path = ''
stable
as $$
  select s.installation_date
         + ((floor(greatest((current_date - s.installation_date), 0) / 90.0)::int + 1) * 90)
    from public.subscriptions s
   where s.id = p_subscription_id;
$$;

-- Derived (research R3): only requests that are still alive or already done
-- count against the allowance, so a declined or withdrawn rotation returns its
-- credit by state alone.
create function public.rotations_remaining(p_subscription_id uuid)
returns integer
language sql
security definer
set search_path = ''
stable
as $$
  select greatest(
    (select rotation_allowance from public.subscriptions where id = p_subscription_id)
    - (select count(*)
         from public.plant_change_requests r
        where r.subscription_id = p_subscription_id
          and r.kind = 'rotation'
          and r.status in ('requested', 'approved', 'fulfilled')
          and r.created_at >= public.rotation_period_start(p_subscription_id)),
    0)::integer;
$$;

grant execute on function public.rotation_period_start(uuid) to authenticated;
grant execute on function public.rotation_period_end(uuid) to authenticated;
grant execute on function public.rotations_remaining(uuid) to authenticated;

-- ── asking ───────────────────────────────────────────────────────────

create function public.request_plant_change(
  p_line_id uuid,
  p_kind public.change_kind,
  p_requested_variant_id uuid default null,
  p_reason text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub public.subscriptions;
  v_line public.subscription_lines;
  v_id uuid;
  v_available integer;
begin
  select l.* into v_line from public.subscription_lines l where l.id = p_line_id;
  if not found then
    raise exception 'plant not found';
  end if;

  select * into v_sub from public.subscriptions where id = v_line.subscription_id;

  if not public.can_access_subscription(v_sub.id) and not public.is_operator() then
    raise exception 'plant not found';
  end if;
  if v_sub.status <> 'active' then
    raise exception 'this subscription is not active';
  end if;

  if exists (select 1 from public.plant_change_requests
              where subscription_line_id = p_line_id
                and status in ('requested', 'approved'))
  then
    raise exception 'that plant already has an open request';
  end if;

  if p_kind = 'rotation' then
    if public.rotations_remaining(v_sub.id) <= 0 then
      raise exception 'no rotations left until %',
        to_char(public.rotation_period_end(v_sub.id), 'DD Mon YYYY');
    end if;

    select stock_available into v_available
      from public.plant_variants
     where id = p_requested_variant_id and published;
    if v_available is null or v_available <= 0 then
      raise exception 'choose a plant that is in stock';
    end if;
  end if;

  insert into public.plant_change_requests
    (subscription_id, subscription_line_id, kind, requested_variant_id, reason, requested_by)
  values (v_sub.id, p_line_id, p_kind, p_requested_variant_id, nullif(trim(p_reason), ''), auth.uid())
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.request_plant_change(uuid, public.change_kind, uuid, text)
  to authenticated;

-- ── deciding ─────────────────────────────────────────────────────────

create function public.decide_plant_change(
  p_request_id uuid,
  p_approve boolean,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_req public.plant_change_requests;
  v_site uuid;
  v_visit uuid;
  v_available integer;
begin
  if not public.is_operator() then
    raise exception 'only an operator can decide a request';
  end if;

  select * into v_req from public.plant_change_requests where id = p_request_id for update;
  if not found then
    raise exception 'request not found';
  end if;
  if v_req.status <> 'requested' then
    raise exception 'this request has already been decided';
  end if;

  if not p_approve then
    update public.plant_change_requests
       set status = 'declined', decided_by = auth.uid(), decided_at = now(),
           decision_note = p_note
     where id = p_request_id;
    return;  -- the rotation credit returns by state alone (research R3)
  end if;

  -- A rotation whose plant sold out between asking and approving cannot be
  -- approved; the credit stays with the customer.
  if v_req.kind = 'rotation' then
    select stock_available into v_available
      from public.plant_variants where id = v_req.requested_variant_id and published;
    if v_available is null or v_available <= 0 then
      raise exception 'choose a plant that is in stock';
    end if;
  end if;

  select site_id into v_site from public.subscriptions where id = v_req.subscription_id;

  -- FR-011: approved work rides the next visit already going to that site.
  select id into v_visit
    from public.visits
   where site_id = v_site and status = 'planned'
   order by scheduled_date
   limit 1;

  update public.plant_change_requests
     set status = 'approved', decided_by = auth.uid(), decided_at = now(),
         decision_note = p_note, visit_id = v_visit
   where id = p_request_id;
end;
$$;

grant execute on function public.decide_plant_change(uuid, boolean, text) to authenticated;

create function public.withdraw_plant_change(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_req public.plant_change_requests;
begin
  select * into v_req from public.plant_change_requests where id = p_request_id for update;
  if not found then
    raise exception 'request not found';
  end if;
  if not public.can_access_subscription(v_req.subscription_id) and not public.is_operator() then
    raise exception 'request not found';
  end if;
  if v_req.status in ('withdrawn', 'declined', 'fulfilled') then
    return;  -- idempotent
  end if;

  update public.plant_change_requests
     set status = 'withdrawn'
   where id = p_request_id;
end;
$$;

grant execute on function public.withdraw_plant_change(uuid) to authenticated;

-- ── carrying it out ──────────────────────────────────────────────────

create function public.fulfil_plant_change(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_req public.plant_change_requests;
  v_line public.subscription_lines;
  v_available integer;
  v_name text;
begin
  select * into v_req from public.plant_change_requests where id = p_request_id for update;
  if not found then
    raise exception 'request not found';
  end if;
  if v_req.status <> 'approved' then
    raise exception 'this request is not approved yet';
  end if;

  if not public.is_operator()
     and not exists (select 1 from public.visits v
                      where v.id = v_req.visit_id and v.technician_id = auth.uid())
  then
    raise exception 'this request is not yours';
  end if;

  select * into v_line from public.subscription_lines where id = v_req.subscription_line_id;

  -- Stock moves now, not at approval (research R4): an approval is an
  -- intention, a fulfilment is a fact.
  if v_req.kind = 'rotation' then
    select stock_available, s.common_name into v_available, v_name
      from public.plant_variants pv
      join public.plant_species s on s.id = pv.species_id
     where pv.id = v_req.requested_variant_id
       for update of pv;
    if v_available is null or v_available < v_line.quantity then
      raise exception 'not enough % in stock', coalesce(v_name, 'that plant');
    end if;

    update public.plant_variants
       set stock_allocated = stock_allocated + v_line.quantity
     where id = v_req.requested_variant_id;

    update public.plant_variants
       set stock_allocated = greatest(stock_allocated - v_line.quantity, 0)
     where id = v_line.variant_id;

    -- The line now describes the plant that is actually in the room.
    update public.subscription_lines l
       set variant_id = v_req.requested_variant_id,
           species_name = sp.common_name,
           size_tier = pv.size_tier::text
      from public.plant_variants pv
      join public.plant_species sp on sp.id = pv.species_id
     where l.id = v_line.id and pv.id = v_req.requested_variant_id;
  end if;
  -- A replacement is like for like: the same variant, a healthy specimen. The
  -- allocation does not change; feature 006 tracks the individual plant.

  update public.plant_change_requests
     set status = 'fulfilled', fulfilled_by = auth.uid(), fulfilled_at = now()
   where id = p_request_id;
end;
$$;

grant execute on function public.fulfil_plant_change(uuid) to authenticated;

-- ── policies ─────────────────────────────────────────────────────────

alter table public.plant_change_requests enable row level security;

create policy "change requests: customer, assigned technician or operator"
  on public.plant_change_requests for select to authenticated
  using (
    public.can_access_subscription(subscription_id)
    or (select public.is_operator())
    or exists (select 1 from public.visits v
                where v.id = visit_id and v.technician_id = (select auth.uid()))
  );

-- ── the guarantee, in the customer's own words (constitution V) ───────

insert into public.operator_settings (key, value) values (
  'replacement_exclusions',
  E'We replace any plant that declines under our care, free, as often as needed.\n\nWe cannot replace free of charge when a plant has been damaged by someone else, when we could not get in on a scheduled visit, when plants have been moved without telling us, or when the room''s light or temperature has changed from what we agreed. We will always tell you which of these applies and what it would cost.'
)
on conflict (key) do nothing;
