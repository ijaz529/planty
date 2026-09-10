-- 0012: one way to move the depot.
--
-- Feature 008 seeded a depot and left moving it to whoever was willing to write
-- SQL against a geography column. Every route the business plans is measured
-- from this point, so getting it wrong makes every suggestion confidently wrong
-- and nothing on screen would say so.
--
-- This is an upsert rather than an update because the table is a singleton: the
-- caller should not have to know whether a row exists, and offering both an
-- insert and an update path is two ways to get the coordinate order wrong
-- instead of one.

create function public.set_depot(
  p_label text,
  p_lat double precision,
  p_lon double precision
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_label text := nullif(trim(p_label), '');
begin
  if not public.is_operator() then
    raise exception 'only an operator can move the depot';
  end if;

  -- FR-003. A depot with no name is no more useful than a bare coordinate.
  if v_label is null then
    raise exception 'give the depot a name';
  end if;

  if p_lat is null or p_lon is null then
    raise exception 'drop the pin before saving';
  end if;

  -- PostGIS is (longitude, latitude). This is the one place that order is
  -- written down for the depot, which is the point of routing it through here.
  --
  -- Written as an upsert on the singleton constraint rather than an update
  -- followed by an insert. Two reasons. It is one statement for what is one
  -- idea, and Supabase runs `authenticated` with safe updates on, which refuses
  -- an UPDATE with no WHERE clause — and a singleton table has nothing sensible
  -- to put in one.
  --
  -- Worth knowing: pgTAP did not catch that refusal. Role-level settings are
  -- applied at login, and a test that reaches `authenticated` through
  -- `set local role` never picks them up. The browser found it instead.
  insert into public.depot (label, location)
  values (v_label, extensions.st_point(p_lon, p_lat)::extensions.geography)
      on conflict (singleton) do update
     set label = excluded.label,
         location = excluded.location;
end;
$$;

comment on function public.set_depot(text, double precision, double precision) is
  'Move the depot, or place the first one. Operators only. Takes (lat, lon).';

grant execute on function public.set_depot(text, double precision, double precision)
  to authenticated;
