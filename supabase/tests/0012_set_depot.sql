begin;
select plan(11);

-- Omar (...0003) is an operator, Tariq (...0004) the technician, Nadia
-- (...0002) a customer. Feature 008 seeded one depot in Al Quoz.

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

-- ── an operator moves it (FR-001, FR-002) ────────────────────────────

select lives_ok(
  $$select public.set_depot('Ras Al Khor depot', 25.1800, 55.3400)$$,
  'an operator can move the depot'
);

select is(
  (select label from public.depot_point()), 'Ras Al Khor depot',
  'the name follows'
);

select ok(
  (select abs(lat - 25.1800) < 0.0001 and abs(lon - 55.3400) < 0.0001
     from public.depot_point()),
  'and so does the position, latitude and longitude the right way round'
);

select is(
  (select count(*) from public.depot), 1::bigint,
  'moving it does not leave the old one behind (FR-007, SC-004)'
);

-- ── what it refuses (FR-003) ─────────────────────────────────────────

select throws_like(
  $$select public.set_depot('   ', 25.18, 55.34)$$,
  '%give the depot a name%',
  'a depot with no name is refused'
);

select throws_like(
  $$select public.set_depot('Somewhere', null, 55.34)$$,
  '%drop the pin%',
  'a depot with no pin is refused'
);

select is(
  (select label from public.depot_point()), 'Ras Al Khor depot',
  'and a refusal leaves the depot where it was'
);

-- ── who may (FR-004, SC-002) ─────────────────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select throws_like(
  $$select public.set_depot('Nadia depot', 25.2, 55.3)$$,
  '%only an operator%',
  'a customer cannot move the depot'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}';

select throws_like(
  $$select public.set_depot('Tariq depot', 25.2, 55.3)$$,
  '%only an operator%',
  'nor can the technician who drives from it'
);

-- ── placing the first one (FR-005) ───────────────────────────────────

reset role;
delete from public.depot;
set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select public.set_depot('First depot', 25.10, 55.20);

select is(
  (select count(*) from public.depot), 1::bigint,
  'the same call places the first depot when there is none'
);

select is(
  (select label from public.depot_point()), 'First depot',
  'and it is the one just placed'
);

select * from finish();
rollback;
