-- Local seed for Planty. See specs/001-foundation-accounts-catalog/quickstart.md
--
-- Test sign-ins (local only, the code is always 123456):
--   050 000 0001  Priya    private customer
--   050 000 0002  Nadia    owner of Northwind Labs
--   050 000 0003  Omar     Planty operator
--   050 000 0004  Tariq    Planty technician

-- ── auth users ───────────────────────────────────────────────────────
-- GoTrue requires the token columns to be empty strings, not NULL.
-- auth.users.phone is stored WITHOUT the leading '+'.

insert into auth.users (
  instance_id, id, aud, role, phone, phone_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token, email_change,
  email_change_token_new, email_change_token_current,
  phone_change, phone_change_token, reauthentication_token
)
values
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
   '971500000001', now(),
   '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
   '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
   '971500000002', now(),
   '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
   '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated',
   '971500000003', now(),
   '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
   '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated',
   '971500000004', now(),
   '{"provider":"phone","providers":["phone"]}', '{}', now(), now(),
   '', '', '', '', '', '', '', '');

-- Profile rows already exist: handle_new_user() fired on the inserts above.
update public.profiles set display_name = 'Priya', email = 'priya@example.com'
  where id = '10000000-0000-4000-8000-000000000001';
update public.profiles set display_name = 'Nadia', email = 'nadia@northwind.example'
  where id = '10000000-0000-4000-8000-000000000002';
update public.profiles set display_name = 'Omar', email = 'omar@planty.example'
  where id = '10000000-0000-4000-8000-000000000003';
update public.profiles set display_name = 'Tariq', email = 'tariq@planty.example'
  where id = '10000000-0000-4000-8000-000000000004';

insert into public.staff_roles (account_id, role) values
  ('10000000-0000-4000-8000-000000000003', 'operator'),
  ('10000000-0000-4000-8000-000000000004', 'technician');

-- ── plant catalog (feature 001 US2) ──────────────────────────────────
-- Prices are the hypothesis in docs/PRD.md §7, to be replaced with evidence.

insert into public.plant_species (id, common_name, botanical_name, light_requirement, watering_interval_days, pet_safe, description) values
  ('40000000-0000-4000-8000-000000000001', 'Snake plant', 'Dracaena trifasciata', 'low', 21, false,
   'The most forgiving plant we rent. Thrives in air-conditioned offices, tolerates low light, and shrugs off a missed week.'),
  ('40000000-0000-4000-8000-000000000002', 'ZZ plant', 'Zamioculcas zamiifolia', 'low', 21, false,
   'Glossy, architectural and almost impossible to kill. Our default choice for meeting rooms away from windows.'),
  ('40000000-0000-4000-8000-000000000003', 'Golden pothos', 'Epipremnum aureum', 'low', 10, false,
   'Trailing green that softens shelves and dividers. Fast growing, so it always looks freshly tended.'),
  ('40000000-0000-4000-8000-000000000004', 'Chinese evergreen', 'Aglaonema commutatum', 'low', 12, false,
   'Patterned leaves that read as colour without needing flowers. Handles the dry air of a cooled office.'),
  ('40000000-0000-4000-8000-000000000005', 'Kentia palm', 'Howea forsteriana', 'medium', 10, true,
   'The statement palm. Pet safe, elegant, and the plant most people picture when they picture a lobby.'),
  ('40000000-0000-4000-8000-000000000006', 'Areca palm', 'Dypsis lutescens', 'bright', 7, true,
   'Feathery, generous and pet safe. Wants a bright corner and rewards it with real presence.');

insert into public.plant_variants (id, species_id, size_tier, height_min_cm, height_max_cm, photo_path, price_aed, stock_total, published) values
  ('40000000-0000-4000-8000-000000000101', '40000000-0000-4000-8000-000000000001', 'desk', 30, 45, 'seed/snake-desk.jpg', 6.00, 24, true),
  ('40000000-0000-4000-8000-000000000102', '40000000-0000-4000-8000-000000000001', 'floor', 80, 110, 'seed/snake-floor.jpg', 16.00, 10, true),
  ('40000000-0000-4000-8000-000000000103', '40000000-0000-4000-8000-000000000002', 'desk', 30, 45, 'seed/zz-desk.jpg', 7.00, 18, true),
  ('40000000-0000-4000-8000-000000000104', '40000000-0000-4000-8000-000000000002', 'floor', 70, 100, 'seed/zz-floor.jpg', 19.00, 8, true),
  ('40000000-0000-4000-8000-000000000105', '40000000-0000-4000-8000-000000000003', 'desk', 25, 40, 'seed/pothos-desk.jpg', 5.00, 30, true),
  ('40000000-0000-4000-8000-000000000106', '40000000-0000-4000-8000-000000000004', 'desk', 30, 45, 'seed/aglaonema-desk.jpg', 8.00, 14, true),
  ('40000000-0000-4000-8000-000000000107', '40000000-0000-4000-8000-000000000004', 'floor', 70, 95, 'seed/aglaonema-floor.jpg', 18.00, 6, true),
  ('40000000-0000-4000-8000-000000000108', '40000000-0000-4000-8000-000000000005', 'statement', 160, 190, 'seed/kentia-statement.jpg', 35.00, 5, true),
  -- Published but out of stock: must render as unavailable, not disappear (FR-024).
  ('40000000-0000-4000-8000-000000000109', '40000000-0000-4000-8000-000000000006', 'statement', 160, 190, 'seed/areca-statement.jpg', 32.00, 0, true),
  -- Deliberately incomplete draft: publishing it must fail and name the gaps (FR-022).
  ('40000000-0000-4000-8000-000000000110', '40000000-0000-4000-8000-000000000006', 'floor', null, null, null, null, 4, false);

-- ── business account (feature 001 US3) ───────────────────────────────

insert into public.organizations (id, name, billing_email) values
  ('20000000-0000-4000-8000-000000000001', 'Northwind Labs', 'accounts@northwind.example');

insert into public.organization_members (organization_id, account_id, role) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'owner');

-- ── service zones and sites (feature 001 US4) ────────────────────────
-- PostGIS geography takes (longitude, latitude). Dubai is around 55.2, 25.2 —
-- a reversed pair lands in the Indian Ocean.
-- Weekdays: 0 = Sunday … 6 = Saturday.

insert into public.service_zones (id, name, boundary, service_weekdays, active) values
  ('30000000-0000-4000-8000-000000000001', 'Business Bay',
   extensions.st_geogfromtext('POLYGON((55.255 25.175, 55.292 25.175, 55.292 25.200, 55.255 25.200, 55.255 25.175))'),
   array[1,3]::smallint[], true),
  ('30000000-0000-4000-8000-000000000002', 'Dubai Marina',
   extensions.st_geogfromtext('POLYGON((55.130 25.065, 55.160 25.065, 55.160 25.095, 55.130 25.095, 55.130 25.065))'),
   array[2,4]::smallint[], true);

insert into public.sites (id, organization_id, label, location, building, unit, makani, access_notes) values
  ('50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
   'Northwind office',
   extensions.st_geogfromtext('POINT(55.270 25.187)'),
   'Bay Square Building 8', 'Level 3', '2467887634',
   'Reception holds the pass. Ask for the office manager.');

insert into public.sites (id, owner_account_id, label, location, building, unit, access_notes) values
  ('50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001',
   'Home',
   extensions.st_geogfromtext('POINT(55.142 25.079)'),
   'Marina Gate 2', 'Apartment 1204',
   'Building access code 4417. One cat, keep the door shut.');

-- ── pricing configuration (feature 002) ──────────────────────────────
-- These numbers are the PRD's hypothesis, not observed market rates: no UAE
-- operator publishes a rental price. They are data precisely so they can be
-- replaced with evidence without a deploy.

insert into public.rental_terms (id, months, label, price_multiplier, is_default, active, sort_order) values
  ('60000000-0000-4000-8000-000000000003',  3, '3 months',  1.1500, false, true, 1),
  ('60000000-0000-4000-8000-000000000006',  6, '6 months',  1.0700, false, true, 2),
  ('60000000-0000-4000-8000-000000000012', 12, '12 months', 1.0000, true,  true, 3);

insert into public.service_cadences (id, code, label, visits_per_month, monthly_fee_aed, is_default, active, sort_order) values
  ('61000000-0000-4000-8000-000000000001', 'fortnightly', 'Every 2 weeks', 2.17, 150.00, true,  true, 1),
  ('61000000-0000-4000-8000-000000000002', 'weekly',      'Every week',    4.33, 250.00, false, true, 2);

update public.service_zones set minimum_monthly_aed = 150.00;

-- ── starter bundles (feature 002) ────────────────────────────────────
-- No stored price: each bundle is priced from its contents at the default
-- term and cadence, so it cannot advertise a number it does not produce.

insert into public.bundles (id, name, suits, description, published, sort_order) values
  ('62000000-0000-4000-8000-000000000001', 'Desk Starter',
   'A small team of 6 to 10 people',
   'Enough green to change how a room feels, without crowding a desk.', true, 1),
  ('62000000-0000-4000-8000-000000000002', 'Small Office',
   'A team of 20 to 40 in one open floor',
   'Desk plants for the working area, floor plants to soften the corners, and one plant people notice on the way in.', true, 2),
  ('62000000-0000-4000-8000-000000000003', 'Studio Floor',
   'A full floor, a showroom, or a reception people wait in',
   'Statement planting where visitors arrive, backed by low-maintenance greenery through the working space.', true, 3),
  -- Contains the zero-stock Areca: must render as temporarily unavailable.
  ('62000000-0000-4000-8000-000000000004', 'Reception Pair',
   'A lobby that needs two matching statement plants',
   'Two full-height palms either side of an entrance.', true, 4);

insert into public.bundle_items (bundle_id, variant_id, quantity) values
  -- Desk Starter: 4 snake desk + 2 pothos desk
  ('62000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000101', 4),
  ('62000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000105', 2),
  -- Small Office
  ('62000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000101', 6),
  ('62000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000103', 4),
  ('62000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000102', 3),
  ('62000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000108', 1),
  -- Studio Floor
  ('62000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000101', 8),
  ('62000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000103', 6),
  ('62000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000107', 4),
  ('62000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000108', 2),
  -- Reception Pair: the out-of-stock Areca
  ('62000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000109', 2);

-- ── operator settings (feature 003) ──────────────────────────────────
insert into public.operator_settings (key, value) values
  ('bank_details', E'Planty Plants LLC\nEmirates NBD\nIBAN AE00 0000 0000 0000 0000 000\nQuote your payment reference on the transfer.');

-- ── an active subscription and its visits (feature 004) ──────────────
-- So there is a real route to work on day one. Placed via the same function a
-- customer uses, then activated, then visits generated.

do $$
declare
  v_install date;
  v_id uuid;
begin
  -- The next day Business Bay (Mon+Wed) is served, at least two working days out.
  select min(d)::date into v_install
    from generate_series(public.min_installation_date(),
                         public.min_installation_date() + 14, '1 day') d
   where extract(dow from d) in (1, 3);

  insert into public.subscriptions (
    id, organization_id, site_id, status, payment_method, payment_reference,
    billing_email, term_months, term_label, term_multiplier,
    cadence_code, cadence_label, cadence_fee_aed,
    plants_subtotal_aed, service_fee_aed, monthly_total_aed, quote,
    installation_date, ends_on, reserved_until, created_by
  )
  select
    gen_random_uuid(), '20000000-0000-4000-8000-000000000001',
    '50000000-0000-4000-8000-000000000001', 'active', 'invoice',
    'PL-000001', 'accounts@northwind.example',
    12, '12 months', 1.0000,
    'fortnightly', 'Every 2 weeks', 150.00,
    1030.00, 150.00, 1180.00,
    public.price_basket(
      '[{"variant_id":"40000000-0000-4000-8000-000000000101","quantity":6},
        {"variant_id":"40000000-0000-4000-8000-000000000103","quantity":4},
        {"variant_id":"40000000-0000-4000-8000-000000000102","quantity":3},
        {"variant_id":"40000000-0000-4000-8000-000000000108","quantity":1}]'::jsonb,
      '60000000-0000-4000-8000-000000000012',
      '61000000-0000-4000-8000-000000000001', null),
    v_install, v_install + interval '12 months', now() + interval '7 days',
    '10000000-0000-4000-8000-000000000002'
  returning id into v_id;

  insert into public.subscription_lines
    (subscription_id, variant_id, species_name, size_tier, unit_price_aed, quantity, line_total_aed)
  values
    (v_id, '40000000-0000-4000-8000-000000000101', 'Snake plant', 'desk', 55.00, 6, 330.00),
    (v_id, '40000000-0000-4000-8000-000000000103', 'ZZ plant', 'desk', 60.00, 4, 240.00),
    (v_id, '40000000-0000-4000-8000-000000000102', 'Snake plant', 'floor', 95.00, 3, 285.00),
    (v_id, '40000000-0000-4000-8000-000000000108', 'Kentia palm', 'statement', 175.00, 1, 175.00);

  insert into public.subscription_status_events (subscription_id, from_status, to_status, note)
  values (v_id, null, 'pending', 'seeded'), (v_id, 'pending', 'active', 'seeded as paid');

  update public.plant_variants set stock_allocated = stock_allocated + 6
   where id = '40000000-0000-4000-8000-000000000101';
  update public.plant_variants set stock_allocated = stock_allocated + 4
   where id = '40000000-0000-4000-8000-000000000103';
  update public.plant_variants set stock_allocated = stock_allocated + 3
   where id = '40000000-0000-4000-8000-000000000102';
  update public.plant_variants set stock_allocated = stock_allocated + 1
   where id = '40000000-0000-4000-8000-000000000108';
end $$;

-- ── a day worth routing (feature 008) ────────────────────────────────
--
-- One customer means one stop a day, and a route planner with one stop
-- demonstrates nothing. These are the rest of a real round: five more offices
-- inside the Business Bay polygon, and two homes inside Dubai Marina.
--
-- Every one goes in through the same path as the first — pinned inside a served
-- zone, priced by price_basket, stock allocated — so the numbers on screen are
-- arrived at rather than typed. Visits come from generate_visits() below, which
-- puts Business Bay on its Mondays and Wednesdays and Marina on its Tuesdays
-- and Thursdays, exactly as it would in production.
--
-- Baskets lean on the plants with spare stock, so nothing here changes which
-- variants are out of stock.

insert into public.sites (id, organization_id, owner_account_id, label, location, building, unit, access_notes) values
  ('50000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', null,
   'Northwind Bay Square 6', extensions.st_geogfromtext('POINT(55.270 25.193)'),
   'Bay Square Building 6', 'Level 2', 'Loading bay at the back, before 11am.'),
  ('50000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', null,
   'Northwind Executive', extensions.st_geogfromtext('POINT(55.265 25.185)'),
   'Executive Towers Tower B', 'Office 1907', 'Sign in at the desk; lifts need a pass.'),
  ('50000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000001', null,
   'Northwind Bay Avenue', extensions.st_geogfromtext('POINT(55.260 25.178)'),
   'Bay Avenue', 'Unit 4', 'Shutter is up from 8am.'),
  ('50000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000001', null,
   'Northwind Churchill', extensions.st_geogfromtext('POINT(55.282 25.188)'),
   'Churchill Towers', 'Office 2204', 'Ask for facilities on arrival.'),
  ('50000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000001', null,
   'Northwind Opus', extensions.st_geogfromtext('POINT(55.276 25.183)'),
   'The Opus', 'Level 5', 'Service lift only.'),
  ('50000000-0000-4000-8000-000000000008', null, '10000000-0000-4000-8000-000000000001',
   'Marina Gate', extensions.st_geogfromtext('POINT(55.140 25.080)'),
   'Marina Gate 1', 'Apartment 3302', 'Concierge holds a key.'),
  ('50000000-0000-4000-8000-000000000009', null, '10000000-0000-4000-8000-000000000001',
   'Cluster R', extensions.st_geogfromtext('POINT(55.145 25.070)'),
   'JLT Cluster R', 'Apartment 808', 'Buzzer 808. No pets.');

do $$
declare
  v_site record;
  v_install date;
  v_quote jsonb;
  v_id uuid;
  v_ref integer := 1;
  v_weekdays smallint[];
begin
  for v_site in
    select s.id, s.organization_id, s.owner_account_id, s.zone_id, b.basket
      from public.sites s
      join (values
        ('50000000-0000-4000-8000-000000000003'::uuid,
         '[{"variant_id":"40000000-0000-4000-8000-000000000105","quantity":4},
           {"variant_id":"40000000-0000-4000-8000-000000000106","quantity":2}]'::jsonb),
        ('50000000-0000-4000-8000-000000000004'::uuid,
         '[{"variant_id":"40000000-0000-4000-8000-000000000105","quantity":3},
           {"variant_id":"40000000-0000-4000-8000-000000000104","quantity":2}]'::jsonb),
        ('50000000-0000-4000-8000-000000000005'::uuid,
         '[{"variant_id":"40000000-0000-4000-8000-000000000105","quantity":5}]'::jsonb),
        ('50000000-0000-4000-8000-000000000006'::uuid,
         '[{"variant_id":"40000000-0000-4000-8000-000000000106","quantity":2},
           {"variant_id":"40000000-0000-4000-8000-000000000104","quantity":1}]'::jsonb),
        ('50000000-0000-4000-8000-000000000007'::uuid,
         '[{"variant_id":"40000000-0000-4000-8000-000000000105","quantity":2},
           {"variant_id":"40000000-0000-4000-8000-000000000107","quantity":1}]'::jsonb),
        ('50000000-0000-4000-8000-000000000008'::uuid,
         '[{"variant_id":"40000000-0000-4000-8000-000000000105","quantity":3}]'::jsonb),
        ('50000000-0000-4000-8000-000000000009'::uuid,
         '[{"variant_id":"40000000-0000-4000-8000-000000000106","quantity":2}]'::jsonb)
      ) as b(site_id, basket) on b.site_id = s.id
     order by s.id
  loop
    -- The next day this site's own zone is served, at least two working days
    -- out — the same rule checkout applies.
    select service_weekdays into v_weekdays
      from public.service_zones where id = v_site.zone_id;

    select min(d)::date into v_install
      from generate_series(public.min_installation_date(),
                           public.min_installation_date() + 14, '1 day') d
     where extract(dow from d)::smallint = any(v_weekdays);

    v_quote := public.price_basket(
      v_site.basket,
      '60000000-0000-4000-8000-000000000012',
      '61000000-0000-4000-8000-000000000001',
      null);

    insert into public.subscriptions (
      organization_id, owner_account_id, site_id, status, payment_method,
      payment_reference, billing_email, term_months, term_label, term_multiplier,
      cadence_code, cadence_label, cadence_fee_aed,
      plants_subtotal_aed, service_fee_aed, monthly_total_aed, quote,
      installation_date, ends_on, reserved_until, created_by
    ) values (
      v_site.organization_id, v_site.owner_account_id, v_site.id, 'active', 'invoice',
      'PL-' || lpad((1 + v_ref)::text, 6, '0'),
      case when v_site.organization_id is not null
           then 'accounts@northwind.example' else 'priya@example.com' end,
      12, '12 months', 1.0000,
      'fortnightly', 'Every 2 weeks', 150.00,
      (v_quote ->> 'plants_subtotal_aed')::numeric,
      (v_quote ->> 'service_fee_aed')::numeric,
      (v_quote ->> 'monthly_total_aed')::numeric,
      v_quote,
      v_install, v_install + interval '12 months', now() + interval '7 days',
      coalesce(v_site.owner_account_id, '10000000-0000-4000-8000-000000000002')
    ) returning id into v_id;

    insert into public.subscription_lines
      (subscription_id, variant_id, species_name, size_tier, unit_price_aed, quantity, line_total_aed)
    select v_id, pv.id, sp.common_name, pv.size_tier, pv.price_aed,
           (b ->> 'quantity')::integer,
           pv.price_aed * (b ->> 'quantity')::integer
      from jsonb_array_elements(v_site.basket) b
      join public.plant_variants pv on pv.id = (b ->> 'variant_id')::uuid
      join public.plant_species sp on sp.id = pv.species_id;

    insert into public.subscription_status_events (subscription_id, from_status, to_status, note)
    values (v_id, null, 'pending', 'seeded'), (v_id, 'pending', 'active', 'seeded as paid');

    update public.plant_variants pv
       set stock_allocated = pv.stock_allocated + (b ->> 'quantity')::integer
      from jsonb_array_elements(v_site.basket) b
     where pv.id = (b ->> 'variant_id')::uuid;

    v_ref := v_ref + 1;
  end loop;
end $$;

select public.generate_visits(28);

-- Give Tariq the whole of the first day. One technician drives one round, so
-- half a day assigned would be a state the business never actually reaches —
-- and it leaves a day worth planning a route for.
--
-- Numbered by site label rather than by anything meaningful, which is the point:
-- it is the arbitrary order the route planner exists to improve on.
update public.visits v
   set technician_id = '10000000-0000-4000-8000-000000000004',
       sequence_no = d.rn
  from (
    select vv.id, row_number() over (order by si.label)::smallint as rn
      from public.visits vv
      join public.sites si on si.id = vv.site_id
     where vv.status = 'planned'
       and vv.scheduled_date = (select min(scheduled_date)
                                  from public.visits where status = 'planned')
  ) d
 where v.id = d.id;

-- ── ledger opening balances (feature 006) ────────────────────────────
-- Migrations run before this file, so migration 0009's opening entries found an
-- empty catalogue. Everything above set stock directly; record it now so the
-- ledger reconciles against the counts from the first day (FR-003).

insert into public.stock_movements (variant_id, reason, delta_total, note)
select id, 'adjusted', stock_total, 'opening balance (seed)'
  from public.plant_variants
 where stock_total <> 0;

insert into public.stock_movements (variant_id, reason, delta_allocated, note)
select id, 'adjusted', stock_allocated, 'opening allocation (seed)'
  from public.plant_variants
 where stock_allocated <> 0;
