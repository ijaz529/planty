begin;
select plan(16);

-- Seeded catalog (see supabase/seed.sql):
--   6 species, 9 published variants, 1 published-but-zero-stock variant,
--   1 deliberately incomplete draft variant (...110).

-- ── anonymous: the whole point of the product ────────────────────────

set local role anon;
set local request.jwt.claims to '{}';

select is(
  (select count(*) from public.plant_variants),
  9::bigint,
  'anon sees exactly the nine published variants'
);

select is(
  (select count(*) from public.plant_variants where not published),
  0::bigint,
  'anon never sees a draft variant'
);

select is(
  (select count(*) from public.plant_species),
  6::bigint,
  'anon sees every species that has a published variant'
);

-- SC-002: a price is visible without an account.
select is(
  (select price_aed from public.plant_variants
   where id = '40000000-0000-4000-8000-000000000101'),
  55.00::numeric,
  'anon can read a published price'
);

-- FR-024: out of stock is a state, not a disappearance.
select is(
  (select stock_available from public.plant_variants
   where id = '40000000-0000-4000-8000-000000000109'),
  0,
  'a published zero-stock variant is still visible, with zero available'
);

select is(
  (select count(*) from public.plant_variant_price_history),
  0::bigint,
  'anon cannot read price history'
);

select throws_like(
  $$insert into public.plant_species
      (common_name, botanical_name, light_requirement, watering_interval_days, pet_safe)
    values ('Weed', 'Fake plantus', 'low', 7, true)$$,
  '%row-level security%',
  'anon cannot add a species'
);

-- ── a signed-in customer has no more catalog power than anon ─────────

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select is(
  (select count(*) from public.plant_variants),
  9::bigint,
  'a customer sees the same nine published variants'
);

-- RLS denies an UPDATE by matching no rows, not by raising: the honest
-- assertion is that the price is unchanged afterwards.
update public.plant_variants set price_aed = 1
  where id = '40000000-0000-4000-8000-000000000101';

select is(
  (select price_aed from public.plant_variants
   where id = '40000000-0000-4000-8000-000000000101'),
  55.00::numeric,
  'a customer cannot change a price'
);

-- ── operator ─────────────────────────────────────────────────────────

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select is(
  (select count(*) from public.plant_variants),
  10::bigint,
  'an operator sees drafts as well as published variants'
);

-- FR-022 / SC-004: the guard names what is missing.
select is(
  (select public.variant_publish_gaps('40000000-0000-4000-8000-000000000110')),
  array['a photo', 'a monthly price', 'a height range'],
  'the gap function lists exactly what the draft variant lacks'
);

select throws_like(
  $$update public.plant_variants set published = true
    where id = '40000000-0000-4000-8000-000000000110'$$,
  '%cannot publish%a photo, a monthly price, a height range%',
  'publishing an incomplete variant is refused and names the gaps'
);

select lives_ok(
  $$update public.plant_variants
      set photo_path = 'seed/areca-floor.svg', price_aed = 120, height_min_cm = 70, height_max_cm = 100
    where id = '40000000-0000-4000-8000-000000000110'$$,
  'an operator can fill in the missing fields'
);

select lives_ok(
  $$update public.plant_variants set published = true
    where id = '40000000-0000-4000-8000-000000000110'$$,
  'a complete variant publishes'
);

-- FR-026: stock cannot fall below what is already with customers.
select throws_like(
  $$update public.plant_variants set stock_allocated = 5, stock_total = 2
    where id = '40000000-0000-4000-8000-000000000101'$$,
  '%plant_variants_stock_sane%',
  'stock total cannot be set below the allocated quantity'
);

-- FR-025: a price change is recorded, so past pricing stays explainable.
select is(
  (select count(*) from public.plant_variant_price_history
   where variant_id = '40000000-0000-4000-8000-000000000110'),
  1::bigint,
  'setting a price wrote one history row'
);

select * from finish();
rollback;
