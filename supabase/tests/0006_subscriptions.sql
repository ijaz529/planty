begin;
select plan(28);

-- Seeded: Nadia (...0002) owns Northwind, whose office site (5000...0001) is in
-- Business Bay (Mon+Wed, minimum AED 150). Priya (...0001) owns a Marina home.
-- Omar (...0003) is an operator. Kentia (...108) has stock 5.

-- A valid installation day for Business Bay (first Mon/Wed on or after the
-- minimum), a Friday the zone is not served on, and a too-early day.
select min(d)::date as good
  from generate_series(public.min_installation_date(),
                       public.min_installation_date() + 14, '1 day') d
 where extract(dow from d) in (1, 3) \gset
select min(d)::date as bad
  from generate_series(public.min_installation_date(),
                       public.min_installation_date() + 14, '1 day') d
 where extract(dow from d) = 5 \gset
select (public.min_installation_date() - 1)::text as early \gset

\set kentia '40000000-0000-4000-8000-000000000108'
-- Baselines: the seed has its own active subscription holding stock, so every
-- stock assertion below is a delta from where this test started.
select stock_allocated as base_alloc, stock_available as base_avail
  from public.plant_variants where id = '40000000-0000-4000-8000-000000000108' \gset
\set snake  '40000000-0000-4000-8000-000000000101'

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

-- Captured as Nadia, because every count it is compared against is read as
-- Nadia. Taken as postgres it would count subscriptions she cannot see.
select count(*)::int as base_subs from public.subscriptions \gset

-- ── refusals come first, and leave nothing behind ────────────────────

-- Feature 007 dropped the seeded minimum to AED 150, which a single desk plant
-- plus the fortnightly fee already clears. The refusal itself still has to
-- work, so raise the minimum for this one assertion and put it back after.
reset role;
update public.service_zones set minimum_monthly_aed = 400.00
 where id = (select zone_id from public.sites
              where id = '50000000-0000-4000-8000-000000000001');
set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select throws_like(
  'select public.create_subscription(
      ''[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]''::jsonb,
      ''60000000-0000-4000-8000-000000000012'', ''61000000-0000-4000-8000-000000000001'', ''50000000-0000-4000-8000-000000000001'', ' || quote_literal(:'good') || ', null, null)',
  '%below minimum%',
  'a basket below the zone minimum is refused'
);

reset role;
update public.service_zones set minimum_monthly_aed = 150.00
 where id = (select zone_id from public.sites
              where id = '50000000-0000-4000-8000-000000000001');
set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select throws_like(
  'select public.create_subscription(
      ''[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":2}]''::jsonb,
      ''60000000-0000-4000-8000-000000000012'', ''61000000-0000-4000-8000-000000000001'', ''50000000-0000-4000-8000-000000000001'', ' || quote_literal(:'bad') || ', null, null)',
  '%day we serve%',
  'an installation day the zone is not served on is refused'
);

select throws_like(
  'select public.create_subscription(
      ''[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":2}]''::jsonb,
      ''60000000-0000-4000-8000-000000000012'', ''61000000-0000-4000-8000-000000000001'', ''50000000-0000-4000-8000-000000000001'', ' || quote_literal(:'early') || ', null, null)',
  '%earliest installation%',
  'an installation day before the minimum is refused'
);

select throws_like(
  'select public.create_subscription(
      ''[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":2}]''::jsonb,
      ''60000000-0000-4000-8000-000000000012'', ''61000000-0000-4000-8000-000000000001'', ''50000000-0000-4000-8000-000000000002'', ' || quote_literal(:'good') || ', null, null)',
  '%your own sites%',
  'someone else-s site cannot be ordered against'
);

-- FR-004: the client passes what it displayed; a mismatch is refused.
select throws_like(
  'select public.create_subscription(
      ''[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":2}]''::jsonb,
      ''60000000-0000-4000-8000-000000000012'', ''61000000-0000-4000-8000-000000000001'', ''50000000-0000-4000-8000-000000000001'', ' || quote_literal(:'good') || ', null, 123.45)',
  '%price changed: now AED 220%',
  'a stale expected total is refused with the new price'
);

select is(
  (select count(*)::int from public.subscriptions), :base_subs,
  'no refusal left a subscription behind'
);

-- ── a real order ─────────────────────────────────────────────────────

create temp table t_sub as
  select public.create_subscription(
    '[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":2}]'::jsonb,
    '60000000-0000-4000-8000-000000000012', '61000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', :'good', null, 220.00) as id;

select is(
  (select status from public.subscriptions where id = (select id from t_sub)),
  'pending'::public.subscription_status,
  'an order starts pending'
);

-- SC-002: the snapshot equals the authority.
select is(
  (select monthly_total_aed from public.subscriptions where id = (select id from t_sub)),
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":2}]'::jsonb,
     '60000000-0000-4000-8000-000000000012', '61000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001') ->> 'monthly_total_aed')::numeric,
  'the snapshot total equals what price_basket says'
);

select is(
  (select organization_id from public.subscriptions where id = (select id from t_sub)),
  '20000000-0000-4000-8000-000000000001'::uuid,
  'an organization site makes an organization subscription'
);

select is(
  (select billing_email from public.subscriptions where id = (select id from t_sub)),
  'accounts@northwind.example',
  'and uses the organization billing email'
);

select alike(
  (select payment_reference from public.subscriptions where id = (select id from t_sub)),
  'PL-%',
  'a payment reference is issued'
);

select is(
  (select ends_on - installation_date from public.subscriptions where id = (select id from t_sub))
    > 300,
  true,
  'a 12-month term ends about a year after installation'
);

select is(
  (select stock_allocated from public.plant_variants where id = :'kentia') - :base_alloc,
  2,
  'ordering two kentias reserves two more than before'
);

select is(
  (select count(*) from public.subscription_status_events
    where subscription_id = (select id from t_sub) and to_status = 'pending'),
  1::bigint,
  'creation wrote a status event'
);

-- ── the last plants (SC-003) ─────────────────────────────────────────
-- The authority caps a quantity at what remains and discloses it, so asking
-- for four of the three left orders three. Asking for one more when none are
-- left is refused, and refusal reserves nothing.

create temp table t_sub3 as
  select public.create_subscription(
    '[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":4}]'::jsonb,
    '60000000-0000-4000-8000-000000000012', '61000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', :'good', null, null) as id;

select is(
  (select quantity from public.subscription_lines where subscription_id = (select id from t_sub3)),
  :base_avail - 2,
  'asking for more than remains orders exactly what remains, as the basket disclosed'
);

select is(
  (select stock_available from public.plant_variants where id = :'kentia'),
  0,
  'and every remaining kentia is now reserved'
);

select throws_like(
  'select public.create_subscription(
      ''[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":1}]''::jsonb,
      ''60000000-0000-4000-8000-000000000012'', ''61000000-0000-4000-8000-000000000001'', ''50000000-0000-4000-8000-000000000001'', ' || quote_literal(:'good') || ', null, null)',
  '%nothing in this basket can be ordered%',
  'ordering when none remain is refused'
);

select is(
  (select count(*)::int from public.subscriptions), :base_subs + 2,
  'and the refusal created no subscription'
);

select lives_ok(
  $$select public.cancel_subscription((select id from t_sub3), 'test cleanup')$$,
  'the capped order can be cancelled'
);

select is(
  (select stock_allocated from public.plant_variants where id = :'kentia') - :base_alloc,
  2,
  'which returns exactly what that order reserved'
);

-- ── customer lifecycle ───────────────────────────────────────────────

select throws_like(
  $$select public.mark_subscription_paid((select id from t_sub))$$,
  '%only an operator%',
  'a customer cannot record a payment'
);

select lives_ok(
  $$select public.cancel_subscription((select id from t_sub), 'changed my mind')$$,
  'a customer can cancel a pending subscription'
);

select is(
  (select stock_allocated from public.plant_variants where id = :'kentia') - :base_alloc,
  0,
  'cancelling released the reservation'
);

select lives_ok(
  $$select public.cancel_subscription((select id from t_sub), 'again')$$,
  'cancelling twice is harmless'
);

select is(
  (select stock_allocated from public.plant_variants where id = :'kentia') - :base_alloc,
  0,
  'and does not release stock twice'
);

-- ── operator lifecycle and isolation ─────────────────────────────────

create temp table t_sub2 as
  select public.create_subscription(
    '[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":3}]'::jsonb,
    '60000000-0000-4000-8000-000000000012', '61000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', :'good', null, null) as id;

-- Priya is in no organization and must see none of Northwind's orders.
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select is(
  (select count(*) from public.subscriptions
    where organization_id = '20000000-0000-4000-8000-000000000001'),
  0::bigint,
  'an outsider sees no subscriptions of another organization'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select lives_ok(
  $$select public.mark_subscription_paid((select id from t_sub2))$$,
  'an operator records the payment'
);

-- The customer may not cancel it once active.
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select throws_like(
  $$select public.cancel_subscription((select id from t_sub2), null)$$,
  '%cancelled by Planty%',
  'a customer cannot cancel an active subscription'
);

select * from finish();
rollback;
