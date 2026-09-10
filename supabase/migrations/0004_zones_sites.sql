-- Feature 001 US4: service zones and sites (spec FR-014..FR-019)
--
-- Constitution principle I: route density is the business. The zone boundary
-- is therefore a database rule, not a form validation — an address outside
-- every served zone cannot become a site at all.

create table public.service_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 80),
  boundary extensions.geography(Polygon, 4326) not null,
  -- 0 = Sunday … 6 = Saturday, matching Postgres extract(dow).
  service_weekdays smallint[] not null
    check (
      array_length(service_weekdays, 1) > 0
      and service_weekdays <@ array[0,1,2,3,4,5,6]::smallint[]
    ),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_zones_boundary on public.service_zones using gist (boundary);

create trigger service_zones_updated_at
  before update on public.service_zones
  for each row execute procedure extensions.moddatetime (updated_at);

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  owner_account_id uuid references public.profiles (id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete cascade,
  label text not null check (char_length(label) between 2 and 80),
  location extensions.geography(Point, 4326) not null,
  building text not null check (char_length(building) between 1 and 160),
  unit text,
  makani text check (makani ~ '^\d{10}$'),
  access_notes text,
  zone_id uuid not null references public.service_zones (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A site belongs to a person or to a company, never both and never neither.
  constraint sites_one_owner check (
    (owner_account_id is not null) <> (organization_id is not null)
  )
);

create index sites_owner on public.sites (owner_account_id);
create index sites_organization on public.sites (organization_id);
create index sites_zone on public.sites (zone_id);

create trigger sites_updated_at
  before update on public.sites
  for each row execute procedure extensions.moddatetime (updated_at);

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.profiles (id) on delete cascade,
  location extensions.geography(Point, 4326) not null,
  area_note text,
  created_at timestamptz not null default now()
);

create index waitlist_entries_account on public.waitlist_entries (account_id);

-- ── zone resolution ──────────────────────────────────────────────────

create function public.zone_for_point(p extensions.geography)
returns uuid
language sql
security definer
set search_path = ''
stable
as $$
  select id from public.service_zones
  where active and extensions.st_covers(boundary, p)
  limit 1;
$$;

create function public.assign_site_zone()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  found_zone uuid;
begin
  found_zone := public.zone_for_point(new.location);

  if found_zone is null then
    raise exception
      'we do not serve this location yet'
      using hint = 'Join the waitlist and we will tell you when we reach this area.';
  end if;

  new.zone_id := found_zone;
  return new;
end;
$$;

create trigger sites_assign_zone
  before insert or update of location on public.sites
  for each row execute procedure public.assign_site_zone();

-- ── grandfathering ───────────────────────────────────────────────────
-- Reshaping or retiring a zone must never delete a customer's site (FR-019).
-- The stored zone_id stands; operators get a list of what to look at.

create view public.sites_needing_zone_review
with (security_invoker = true)
as
  select
    s.id,
    s.label,
    s.building,
    s.zone_id,
    z.name as zone_name,
    z.active as zone_active,
    not extensions.st_covers(z.boundary, s.location) as outside_boundary
  from public.sites s
  join public.service_zones z on z.id = s.zone_id
  where not z.active or not extensions.st_covers(z.boundary, s.location);

-- ── service_zones policies ───────────────────────────────────────────

alter table public.service_zones enable row level security;

-- Readable signed out so the marketing surface can say where Planty serves.
create policy "zones: public reads active"
  on public.service_zones for select
  to anon, authenticated
  using (active);

create policy "zones: operator reads all"
  on public.service_zones for select
  to authenticated
  using ((select public.is_operator()));

create policy "zones: operator writes"
  on public.service_zones for insert
  to authenticated
  with check ((select public.is_operator()));

create policy "zones: operator updates"
  on public.service_zones for update
  to authenticated
  using ((select public.is_operator()))
  with check ((select public.is_operator()));

create policy "zones: operator deletes"
  on public.service_zones for delete
  to authenticated
  using ((select public.is_operator()));

-- ── sites policies ───────────────────────────────────────────────────
-- access_notes need no separate rule: they are columns of a row that is
-- already restricted to the owner, the owning organization and staff.

alter table public.sites enable row level security;

create policy "sites: owner or organization reads"
  on public.sites for select
  to authenticated
  using (
    owner_account_id = (select auth.uid())
    or (organization_id is not null and public.org_role(organization_id) is not null)
    or (select public.is_operator())
    -- Feature 004 narrows this to sites on a visit assigned to the technician.
    or (select public.is_technician())
  );

create policy "sites: owner or organization creates"
  on public.sites for insert
  to authenticated
  with check (
    owner_account_id = (select auth.uid())
    or (organization_id is not null and public.org_role(organization_id) is not null)
    or (select public.is_operator())
  );

create policy "sites: owner or organization updates"
  on public.sites for update
  to authenticated
  using (
    owner_account_id = (select auth.uid())
    or (organization_id is not null and public.org_role(organization_id) is not null)
    or (select public.is_operator())
  )
  with check (
    owner_account_id = (select auth.uid())
    or (organization_id is not null and public.org_role(organization_id) is not null)
    or (select public.is_operator())
  );

create policy "sites: owner or organization owner deletes"
  on public.sites for delete
  to authenticated
  using (
    owner_account_id = (select auth.uid())
    or (organization_id is not null and public.org_role(organization_id) = 'owner')
    or (select public.is_operator())
  );

-- ── waitlist policies ────────────────────────────────────────────────

alter table public.waitlist_entries enable row level security;

create policy "waitlist: read own"
  on public.waitlist_entries for select
  to authenticated
  using (account_id = (select auth.uid()) or (select public.is_operator()));

create policy "waitlist: add own"
  on public.waitlist_entries for insert
  to authenticated
  with check (account_id = (select auth.uid()));

create policy "waitlist: operator clears"
  on public.waitlist_entries for delete
  to authenticated
  using ((select public.is_operator()));
