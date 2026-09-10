begin;
select plan(33);

-- These are the SAME cases as specs/002-configure-and-price/contracts/pricing-cases.json,
-- which tests/unit/pricing.test.ts runs against the TypeScript mirror. If one
-- suite passes and this one fails, the two implementations of the pricing rule
-- have drifted. Keep the two files in step.
--
-- Seeded terms:    3mo x1.15, 6mo x1.07, 12mo x1.00 (default)
-- Seeded cadences: weekly AED 250, fortnightly AED 150 (default)
-- Zone minimums:   AED 150 on both zones (feature 007)

\set t3   '\'60000000-0000-4000-8000-000000000003\''
\set t6   '\'60000000-0000-4000-8000-000000000006\''
\set t12  '\'60000000-0000-4000-8000-000000000012\''
\set cfn  '\'61000000-0000-4000-8000-000000000001\''
\set cwk  '\'61000000-0000-4000-8000-000000000002\''

set local role anon;
set local request.jwt.claims to '{}';

-- ── fixture: empty basket costs nothing, not a bare service fee ──────

select is(
  (public.price_basket('[]'::jsonb, :t12, :cfn, null) ->> 'monthly_total_aed')::numeric,
  0::numeric,
  'an empty basket totals zero'
);

select is(
  (public.price_basket('[]'::jsonb, :t12, :cfn, null) ->> 'service_fee_aed')::numeric,
  0::numeric,
  'an empty basket carries no service fee'
);

-- ── fixture: single desk plant at the defaults ───────────────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]'::jsonb,
     :t12, :cfn, null) ->> 'monthly_total_aed')::numeric,
  156.00::numeric,
  'one desk plant plus the fortnightly fee is AED 156'
);

-- ── fixture: quantities multiply and lines sum ───────────────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":4},
       {"variant_id":"40000000-0000-4000-8000-000000000103","quantity":3}]'::jsonb,
     :t12, :cfn, null) ->> 'plants_subtotal_aed')::numeric,
  45.00::numeric,
  'four snake plants and three ZZ plants come to AED 45'
);

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":4},
       {"variant_id":"40000000-0000-4000-8000-000000000103","quantity":3}]'::jsonb,
     :t12, :cfn, null) ->> 'monthly_total_aed')::numeric,
  195.00::numeric,
  'and AED 195 with the fee'
);

-- ── fixture: weekly raises the fee, not the plant prices ─────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":4}]'::jsonb,
     :t12, :cwk, null) ->> 'service_fee_aed')::numeric,
  250.00::numeric,
  'weekly carries the higher service fee'
);

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":4}]'::jsonb,
     :t12, :cwk, null) ->> 'plants_subtotal_aed')::numeric,
  24.00::numeric,
  'and leaves the plant subtotal alone'
);

-- ── fixture: the three-month multiplier ──────────────────────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":4}]'::jsonb,
     :t3, :cfn, null) ->> 'monthly_total_aed')::numeric,
  200.10::numeric,
  'a three-month term multiplies the whole subtotal'
);

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":4}]'::jsonb,
     :t3, :cfn, null) ->> 'flexibility_cost_aed')::numeric,
  26.10::numeric,
  'and states the cost of the shorter term in money'
);

-- ── fixture: the multiplier rounds once, not per line ────────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":3},
       {"variant_id":"40000000-0000-4000-8000-000000000108","quantity":1}]'::jsonb,
     :t6, :cwk, null) ->> 'monthly_total_aed')::numeric,
  324.21::numeric,
  'the six-month multiplier rounds once, to AED 324.21'
);

-- ── fixture: out of stock but published is unavailable ───────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":2},
       {"variant_id":"40000000-0000-4000-8000-000000000109","quantity":1}]'::jsonb,
     :t12, :cfn, null) ->> 'monthly_total_aed')::numeric,
  162.00::numeric,
  'an out-of-stock plant is excluded from the total'
);

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":2},
       {"variant_id":"40000000-0000-4000-8000-000000000109","quantity":1}]'::jsonb,
     :t12, :cfn, null) ->> 'has_unavailable_lines')::boolean,
  true,
  'and is flagged rather than silently dropped'
);

select is(
  (select l ->> 'status'
     from jsonb_array_elements(
       public.price_basket(
         '[{"variant_id":"40000000-0000-4000-8000-000000000109","quantity":1}]'::jsonb,
         :t12, :cfn, null) -> 'lines') l),
  'unavailable',
  'the out-of-stock line reports its status'
);

-- ── fixture: an unpublished draft is never sellable ──────────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1},
       {"variant_id":"40000000-0000-4000-8000-000000000110","quantity":5}]'::jsonb,
     :t12, :cfn, null) ->> 'monthly_total_aed')::numeric,
  156.00::numeric,
  'an unpublished draft contributes nothing'
);

-- ── fixture: a quantity beyond stock is capped ───────────────────────

-- Derived from live stock rather than a hardcoded number: other seeded
-- subscriptions legitimately reserve kentias.
select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":9}]'::jsonb,
     :t12, :cfn, null) ->> 'plants_subtotal_aed')::numeric,
  (select stock_available * price_aed from public.plant_variants
    where id = '40000000-0000-4000-8000-000000000108'),
  'a quantity beyond stock is capped at what exists'
);

select is(
  (select (l ->> 'status')
     from jsonb_array_elements(
       public.price_basket(
         '[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":9}]'::jsonb,
         :t12, :cfn, null) -> 'lines') l),
  'capped',
  'and the line says it was capped'
);

select is(
  (select (l ->> 'requested_quantity')::int
     from jsonb_array_elements(
       public.price_basket(
         '[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":9}]'::jsonb,
         :t12, :cfn, null) -> 'lines') l),
  9,
  'while still reporting what was asked for'
);

-- ── fixture: an all-unavailable basket shows no bare fee ─────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000109","quantity":3}]'::jsonb,
     :t3, :cwk, null) ->> 'monthly_total_aed')::numeric,
  0::numeric,
  'a basket of only unavailable lines totals zero'
);

-- ── fixture: an unknown id is unavailable, not an error ──────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1},
       {"variant_id":"40000000-0000-4000-8000-0000000009ff","quantity":2}]'::jsonb,
     :t12, :cfn, null) ->> 'monthly_total_aed')::numeric,
  156.00::numeric,
  'an unknown variant id prices as unavailable rather than raising'
);

-- ── fixture: a realistic small office ────────────────────────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":6},
       {"variant_id":"40000000-0000-4000-8000-000000000103","quantity":4},
       {"variant_id":"40000000-0000-4000-8000-000000000102","quantity":3},
       {"variant_id":"40000000-0000-4000-8000-000000000107","quantity":2},
       {"variant_id":"40000000-0000-4000-8000-000000000108","quantity":1}]'::jsonb,
     :t3, :cwk, null) ->> 'monthly_total_aed')::numeric,
  497.95::numeric,
  'a realistic small office at the shortest term comes to AED 497.95'
);

-- ── invariants (SC-003) ──────────────────────────────────────────────

select is(
  (select sum((l ->> 'line_total_aed')::numeric)
     from jsonb_array_elements(
       public.price_basket(
         '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":6},
           {"variant_id":"40000000-0000-4000-8000-000000000103","quantity":4},
           {"variant_id":"40000000-0000-4000-8000-000000000108","quantity":1}]'::jsonb,
         :t3, :cwk, null) -> 'lines') l),
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":6},
       {"variant_id":"40000000-0000-4000-8000-000000000103","quantity":4},
       {"variant_id":"40000000-0000-4000-8000-000000000108","quantity":1}]'::jsonb,
     :t3, :cwk, null) ->> 'plants_subtotal_aed')::numeric,
  'displayed line totals sum exactly to the displayed subtotal'
);

-- ── stale basket reprices instead of erroring ────────────────────────

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]'::jsonb,
     '99999999-0000-4000-8000-000000000000', null, null) -> 'term' ->> 'months')::int,
  12,
  'an unknown term id falls back to the active default'
);

-- ── the zone minimum ─────────────────────────────────────────────────

-- Signed out: guidance only, never enforcement (FR-018).
select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]'::jsonb,
     :t12, :cfn, '50000000-0000-4000-8000-000000000001') ->> 'site_applied')::boolean,
  false,
  'anon cannot apply a site minimum'
);

-- Nadia owns Northwind, whose site is in a zone with an AED 150 minimum.
set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

-- Feature 007, FR-004 / SC-005. At AED 5 a plant the old AED 400 minimum would
-- have bound on nearly every customer and overridden the advertised price. At
-- AED 150 a single desk plant plus the fortnightly fee already clears it.
select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]'::jsonb,
     :t12, :cfn, '50000000-0000-4000-8000-000000000001') ->> 'meets_minimum')::boolean,
  true,
  'an ordinary small order is priced from the list, not the minimum'
);

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]'::jsonb,
     :t12, :cfn, '50000000-0000-4000-8000-000000000001') ->> 'shortfall_aed')::numeric,
  0.00::numeric,
  'with nothing owed to reach it'
);

-- The rule itself still works; it is the seeded number that stopped biting.
-- Raise the minimum inside this transaction and the refusal comes back.
reset role;
update public.service_zones set minimum_monthly_aed = 400.00
 where id = (select zone_id from public.sites
              where id = '50000000-0000-4000-8000-000000000001');
set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]'::jsonb,
     :t12, :cfn, '50000000-0000-4000-8000-000000000001') ->> 'meets_minimum')::boolean,
  false,
  'a basket below the zone minimum is still refused when one bites'
);

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]'::jsonb,
     :t12, :cfn, '50000000-0000-4000-8000-000000000001') ->> 'shortfall_aed')::numeric,
  244.00::numeric,
  'and the shortfall is stated in money'
);

reset role;
update public.service_zones set minimum_monthly_aed = 150.00
 where id = (select zone_id from public.sites
              where id = '50000000-0000-4000-8000-000000000001');
set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000108","quantity":2}]'::jsonb,
     :t12, :cfn, '50000000-0000-4000-8000-000000000001') ->> 'meets_minimum')::boolean,
  true,
  'a big enough basket clears the minimum'
);

-- FR-016 / research R6: a foreign site id must fall back to guidance, so it
-- cannot be used to discover whether someone else's site exists.
select is(
  (public.price_basket(
     '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":1}]'::jsonb,
     :t12, :cfn, '50000000-0000-4000-8000-000000000002') ->> 'site_applied')::boolean,
  false,
  'someone else-s site does not apply its minimum'
);

-- ── bundles price from their contents (FR-012) ───────────────────────

set local role anon;
set local request.jwt.claims to '{}';

select is(
  (public.bundle_price('62000000-0000-4000-8000-000000000001') ->> 'plants_subtotal_aed')::numeric,
  34.00::numeric,
  'Desk Starter prices from its four snake plants and two pothos'
);

select is(
  (public.bundle_price('62000000-0000-4000-8000-000000000004') ->> 'has_unavailable_lines')::boolean,
  true,
  'a bundle containing an out-of-stock plant reports it as unavailable'
);

-- ── only operators configure pricing ─────────────────────────────────

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select throws_like(
  $$insert into public.rental_terms (months, label, price_multiplier)
    values (24, 'Cheap', 0.5)$$,
  '%row-level security%',
  'a customer cannot invent a rental term'
);

select throws_like(
  $$insert into public.bundles (name, suits) values ('Free stuff', 'me')$$,
  '%row-level security%',
  'a customer cannot create a bundle'
);

select * from finish();
rollback;
