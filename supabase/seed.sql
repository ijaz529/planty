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
  ('40000000-0000-4000-8000-000000000101', '40000000-0000-4000-8000-000000000001', 'desk', 30, 45, 'seed/snake-desk.svg', 55.00, 24, true),
  ('40000000-0000-4000-8000-000000000102', '40000000-0000-4000-8000-000000000001', 'floor', 80, 110, 'seed/snake-floor.svg', 95.00, 10, true),
  ('40000000-0000-4000-8000-000000000103', '40000000-0000-4000-8000-000000000002', 'desk', 30, 45, 'seed/zz-desk.svg', 60.00, 18, true),
  ('40000000-0000-4000-8000-000000000104', '40000000-0000-4000-8000-000000000002', 'floor', 70, 100, 'seed/zz-floor.svg', 105.00, 8, true),
  ('40000000-0000-4000-8000-000000000105', '40000000-0000-4000-8000-000000000003', 'desk', 25, 40, 'seed/pothos-desk.svg', 45.00, 30, true),
  ('40000000-0000-4000-8000-000000000106', '40000000-0000-4000-8000-000000000004', 'desk', 30, 45, 'seed/aglaonema-desk.svg', 65.00, 14, true),
  ('40000000-0000-4000-8000-000000000107', '40000000-0000-4000-8000-000000000004', 'floor', 70, 95, 'seed/aglaonema-floor.svg', 100.00, 6, true),
  ('40000000-0000-4000-8000-000000000108', '40000000-0000-4000-8000-000000000005', 'statement', 160, 190, 'seed/kentia-statement.svg', 175.00, 5, true),
  -- Published but out of stock: must render as unavailable, not disappear (FR-024).
  ('40000000-0000-4000-8000-000000000109', '40000000-0000-4000-8000-000000000006', 'statement', 160, 190, 'seed/areca-statement.svg', 165.00, 0, true),
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
