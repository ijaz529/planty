begin;
select plan(17);

-- Seeded: Northwind Labs (...0001) owned by Nadia (...0002).
-- Priya (...0001) belongs to no organization. Omar (...0003) is an operator.

-- ── an outsider sees nothing ─────────────────────────────────────────

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select is(
  (select count(*) from public.organizations),
  0::bigint,
  'a person in no organization sees none'
);

select is(
  (select count(*) from public.organization_members),
  0::bigint,
  'an outsider sees no memberships'
);

select is(
  (select count(*) from public.organization_invites),
  0::bigint,
  'an outsider sees no invitations'
);

-- Creating an organization makes the creator its owner, atomically.
select lives_ok(
  $$select public.create_organization('Priya Consulting', 'billing@priya.example')$$,
  'a signed-in person can create an organization'
);

select is(
  (select public.org_role(id) from public.organizations where name = 'Priya Consulting'),
  'owner'::public.org_role,
  'the creator becomes the owner'
);

select is(
  (select count(*) from public.organizations),
  1::bigint,
  'the creator now sees exactly their own organization, not Northwind'
);

-- ── an owner runs their organization ─────────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  (select count(*) from public.organizations),
  1::bigint,
  'the owner sees only their own organization'
);

select is(
  (select name from public.organizations limit 1),
  'Northwind Labs',
  'and it is the right one'
);

-- FR-010: an invitation for a number with no account waits for that number.
select lives_ok(
  $$select public.invite_to_organization(
      '20000000-0000-4000-8000-000000000001', '+971500000009', 'member')$$,
  'an owner can invite a number that has never signed in'
);

select is(
  (select count(*) from public.organization_invites
   where phone = '+971500000009'),
  1::bigint,
  'the invitation is stored until that number appears'
);

-- Inviting someone who already has an account adds them directly.
select lives_ok(
  $$select public.invite_to_organization(
      '20000000-0000-4000-8000-000000000001', '+971500000001', 'member')$$,
  'an owner can invite an existing account'
);

select is(
  (select role from public.organization_members
   where organization_id = '20000000-0000-4000-8000-000000000001'
     and account_id = '10000000-0000-4000-8000-000000000001'),
  'member'::public.org_role,
  'an existing account becomes a member immediately'
);

-- FR-012: the organization can never be left ownerless.
select throws_like(
  $$delete from public.organization_members
    where organization_id = '20000000-0000-4000-8000-000000000001'
      and account_id = '10000000-0000-4000-8000-000000000002'$$,
  '%at least one owner%',
  'the last owner cannot be removed'
);

select throws_like(
  $$update public.organization_members set role = 'member'
    where organization_id = '20000000-0000-4000-8000-000000000001'
      and account_id = '10000000-0000-4000-8000-000000000002'$$,
  '%at least one owner%',
  'the last owner cannot be demoted'
);

-- ── a member is not an owner ─────────────────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select throws_like(
  $$select public.invite_to_organization(
      '20000000-0000-4000-8000-000000000001', '+971500000008', 'member')$$,
  '%only an owner%',
  'a member cannot invite people'
);

-- ── the invitation is honoured when that number first signs in ───────
-- FR-010: the conversion happens inside the sign-up transaction, so there is
-- no window where a signed-in person is missing their organization.

set local role postgres;
set local request.jwt.claims to '{}';

insert into auth.users (
  instance_id, id, aud, role, phone, phone_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change,
  email_change_token_new, email_change_token_current,
  phone_change, phone_change_token, reauthentication_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '10000000-0000-4000-8000-000000000009', 'authenticated', 'authenticated',
  '971500000009', now(),
  '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
  '', '', '', '', '', '', '', ''
);

select is(
  (select count(*) from public.organization_members
   where account_id = '10000000-0000-4000-8000-000000000009'
     and organization_id = '20000000-0000-4000-8000-000000000001'),
  1::bigint,
  'the pending invitation became a membership on first sign-in'
);

select is(
  (select count(*) from public.organization_invites
   where phone = '+971500000009'),
  0::bigint,
  'and the invitation was consumed'
);

select * from finish();
rollback;
