begin;
select plan(12);

-- Seeded accounts (see supabase/seed.sql):
--   ...0001 Priya  customer
--   ...0002 Nadia  customer
--   ...0003 Omar   operator
--   ...0004 Tariq  technician

-- ── anonymous ────────────────────────────────────────────────────────

set local role anon;
set local request.jwt.claims to '{}';

select is(
  (select count(*) from public.profiles),
  0::bigint,
  'anon cannot read profiles'
);

select is(
  (select count(*) from public.staff_roles),
  0::bigint,
  'anon cannot read staff roles'
);

-- ── a customer ───────────────────────────────────────────────────────

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select is(
  (select count(*) from public.profiles),
  1::bigint,
  'a customer sees exactly one profile row'
);

select is(
  (select display_name from public.profiles
   where id = '10000000-0000-4000-8000-000000000001'),
  'Priya',
  'a customer sees their own profile'
);

select is(
  (select count(*) from public.profiles
   where id = '10000000-0000-4000-8000-000000000002'),
  0::bigint,
  'a customer cannot see another profile'
);

select lives_ok(
  $$update public.profiles set display_name = 'Priya K.'
    where id = '10000000-0000-4000-8000-000000000001'$$,
  'a customer can update their own display name'
);

select is(
  (select display_name from public.profiles
   where id = '10000000-0000-4000-8000-000000000001'),
  'Priya K.',
  'the display name update persisted'
);

-- Phone is immutable through column privileges, not a policy.
select throws_ok(
  $$update public.profiles set phone = '+971509999999'
    where id = '10000000-0000-4000-8000-000000000001'$$,
  '42501',
  'permission denied for table profiles',
  'a customer cannot change their own phone'
);

select is(
  (select count(*) from public.staff_roles),
  0::bigint,
  'a customer holds and sees no staff roles'
);

select throws_like(
  $$insert into public.staff_roles (account_id, role)
    values ('10000000-0000-4000-8000-000000000001', 'operator')$$,
  '%row-level security%',
  'a customer cannot grant themselves the operator role'
);

-- ── an operator ──────────────────────────────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select is(
  (select count(*) >= 4 from public.profiles),
  true,
  'an operator can read all profiles'
);

-- The instance must never lose its last operator.
select throws_like(
  $$delete from public.staff_roles
    where account_id = '10000000-0000-4000-8000-000000000003'
      and role = 'operator'$$,
  '%at least one operator%',
  'the last operator cannot be removed'
);

select * from finish();
rollback;
