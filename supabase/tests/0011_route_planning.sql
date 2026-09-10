begin;
select plan(15);

-- Seeded: one active Northwind subscription with visits generated, Omar
-- (...0003) an operator, Tariq (...0004) the technician, Nadia (...0002) the
-- customer. Feature 011 adds one depot row.

-- ── the depot (FR-001, FR-002) ───────────────────────────────────────

select is(
  (select count(*) from public.depot), 1::bigint,
  'there is exactly one depot'
);

select throws_like(
  $$insert into public.depot (label, location)
    values ('Second van', extensions.st_point(55.3, 25.2)::extensions.geography)$$,
  '%depot_is_singleton%',
  'a second depot is refused while Planty has one van'
);

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select is(
  (select count(*) from public.depot_point()), 1::bigint,
  'an operator can read where the day starts'
);

select ok(
  (select lat between 24.5 and 26.0 and lon between 54.5 and 56.5
     from public.depot_point()),
  'and it is in Dubai, not in the sea with its coordinates swapped'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}';

select is(
  (select count(*) from public.depot_point()), 1::bigint,
  'the technician can read it too, because they drive from it'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  (select count(*) from public.depot), 0::bigint,
  'a customer cannot see where Planty keeps its plants'
);

select is(
  (select count(*) from public.depot_point()), 0::bigint,
  'not even through the function that hands out coordinates'
);

-- ── the day the planner reads (FR-003, FR-006) ───────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select min(scheduled_date)::text as day
  from public.visits where status = 'planned' \gset

select ok(
  (select count(*) > 0 from public.route_candidates(:'day'::date)),
  'an operator can list a day of unfinished stops with coordinates'
);

select is(
  (select count(*) from public.route_candidates(:'day'::date) where lat is null),
  0::bigint,
  'and the seeded sites all have a pin'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  (select count(*) from public.route_candidates(:'day'::date)), 0::bigint,
  'a customer cannot enumerate the round'
);

-- ── applying a route (FR-008 … FR-011) ───────────────────────────────

select throws_like(
  format($$select public.apply_route(array(
             select id from public.visits where scheduled_date = %L))$$, :'day'),
  '%only an operator%',
  'a customer cannot renumber a day'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

-- Reverse the day and prove the numbering follows the array, not the clock.
create temp table t_reversed as
  select id, row_number() over (order by scheduled_date, sequence_no desc nulls last) as wanted
    from public.visits
   where scheduled_date = :'day'::date and status = 'planned';

select lives_ok(
  $$select public.apply_route(array(select id from t_reversed order by wanted))$$,
  'an operator can apply a route'
);

select is(
  (select count(*) from public.visits v join t_reversed r on r.id = v.id
    where v.sequence_no <> r.wanted),
  0::bigint,
  'and every stop is numbered in the order it was given'
);

select throws_like(
  $$select public.apply_route(array(
      select id from public.visits where status = 'planned'
       order by scheduled_date limit 40))$$,
  '%one day of stops%',
  'a route spanning two days is refused'
);

-- FR-011: a finished stop already happened. Finishing one needs the role
-- reset: as `authenticated` this update is denied by matching no rows rather
-- than raising, and the test would then pass for the wrong reason.
reset role;
update public.visits set status = 'done', completed_at = now()
 where id = (select id from t_reversed order by wanted limit 1);
set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select throws_like(
  $$select public.apply_route(array(select id from t_reversed order by wanted))$$,
  '%already finished%',
  'a day with a finished stop on it is refused'
);

select * from finish();
rollback;
