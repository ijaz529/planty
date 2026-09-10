-- 0011: a depot to start the day at, and one action to renumber it.
--
-- Feature 004 gave a technician a day of stops and left the order to an
-- operator typing sequence numbers one at a time. Feature 007 made that the
-- number the business turns on: at AED 5 a plant the service fee is the only
-- line that pays a salary, and it rests entirely on stops per day.
--
-- The algorithm itself is in src/lib/route.ts, where it can be tested against
-- two hundred random days. This file holds the two things Postgres must own:
-- where a day starts, and who may renumber one.

-- ── the depot (FR-001) ───────────────────────────────────────────────

create table public.depot (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  location geography(point, 4326) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Planty has one van and one technician. When that stops being true this
  -- constraint is the thing to drop, and everything else already takes a depot
  -- as an argument.
  singleton boolean not null default true,
  constraint depot_is_singleton unique (singleton)
);

comment on table public.depot is
  'Where a technician starts and finishes a day. One row by construction.';

create trigger depot_updated_at
  before update on public.depot
  for each row execute procedure extensions.moddatetime (updated_at);

alter table public.depot enable row level security;

create policy "depot: staff can read it"
  on public.depot for select to authenticated
  using (public.is_operator() or public.is_technician());

create policy "depot: operators can set it"
  on public.depot for all to authenticated
  using (public.is_operator())
  with check (public.is_operator());

-- ── applying a suggested route (FR-008 … FR-011) ─────────────────────

create function public.apply_route(p_visit_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_days integer;
  v_finished integer;
  v_count integer;
begin
  if not public.is_operator() then
    raise exception 'only an operator can order a day';
  end if;

  if p_visit_ids is null or array_length(p_visit_ids, 1) is null then
    raise exception 'no stops to order';
  end if;

  -- Every id must exist, or a typo silently reorders a partial day.
  select count(*) into v_count
    from public.visits where id = any(p_visit_ids);
  if v_count <> array_length(p_visit_ids, 1) then
    raise exception 'those stops do not all exist';
  end if;

  -- FR-010: a route is one day's driving. Ordering across days would produce a
  -- sequence that means nothing on either of them.
  select count(distinct scheduled_date) into v_days
    from public.visits where id = any(p_visit_ids);
  if v_days > 1 then
    raise exception 'a route must be one day of stops';
  end if;

  -- FR-011: a finished stop already happened, and renumbering it would rewrite
  -- history to match a plan made afterwards.
  select count(*) into v_finished
    from public.visits
   where id = any(p_visit_ids) and status <> 'planned';
  if v_finished > 0 then
    raise exception 'that day has stops that are already finished';
  end if;

  update public.visits v
     set sequence_no = ordered.position
    from (
      select id, row_number() over (order by ordinality)::smallint as position
        from unnest(p_visit_ids) with ordinality as t(id, ordinality)
    ) ordered
   where v.id = ordered.id;

  return array_length(p_visit_ids, 1);
end;
$$;

comment on function public.apply_route(uuid[]) is
  'Renumber one day of planned stops into the given order. Operators only.';

grant execute on function public.apply_route(uuid[]) to authenticated;

-- Al Quoz: the industrial quarter most Dubai plant nurseries and their
-- warehouses sit in. An operator moves it once they have a real address.
insert into public.depot (label, location)
values ('Al Quoz depot', st_point(55.2340, 25.1290)::geography);

-- ── what the planner reads ───────────────────────────────────────────
--
-- PostGIS geography comes back over the API as binary, which is no use to an
-- algorithm in the browser. These two hand out plain numbers, and keep the
-- coordinate order in one place: PostGIS is (longitude, latitude), and getting
-- that backwards puts Dubai in the sea.

create function public.depot_point()
returns table (label text, lat double precision, lon double precision)
language sql
security definer
set search_path = ''
stable
as $$
  select d.label, extensions.st_y(d.location::extensions.geometry),
         extensions.st_x(d.location::extensions.geometry)
    from public.depot d
   where public.is_operator() or public.is_technician()
   limit 1;
$$;

grant execute on function public.depot_point() to authenticated;

create function public.route_candidates(p_date date)
returns table (
  visit_id uuid,
  site_label text,
  lat double precision,
  lon double precision
)
language sql
security definer
set search_path = ''
stable
as $$
  select v.id, s.label,
         extensions.st_y(s.location::extensions.geometry),
         extensions.st_x(s.location::extensions.geometry)
    from public.visits v
    join public.sites s on s.id = v.site_id
   where v.scheduled_date = p_date
     and v.status = 'planned'
     and public.is_operator()
   order by v.sequence_no nulls last, s.label;
$$;

comment on function public.route_candidates(date) is
  'One day of unfinished stops with plain coordinates, for the route planner.';

grant execute on function public.route_candidates(date) to authenticated;
