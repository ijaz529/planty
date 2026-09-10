begin;
select plan(16);

-- Seeded zones: Business Bay (...0001, Mon+Wed), Dubai Marina (...0002, Tue+Thu).
-- Seeded sites: Northwind office (Business Bay, organization-owned),
--               Priya's home (Marina, personally owned).
-- PostGIS geography is (longitude, latitude).

-- ── anonymous ────────────────────────────────────────────────────────

set local role anon;
set local request.jwt.claims to '{}';

select is(
  (select count(*) from public.service_zones),
  2::bigint,
  'anon can see which areas Planty serves'
);

select is(
  (select count(*) from public.sites),
  0::bigint,
  'anon cannot see anyone-s sites'
);

-- ── zone containment is the business rule (constitution I) ───────────

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select is(
  public.zone_for_point(extensions.st_geogfromtext('POINT(55.270 25.187)')),
  '30000000-0000-4000-8000-000000000001'::uuid,
  'a Business Bay point resolves to the Business Bay zone'
);

select is(
  public.zone_for_point(extensions.st_geogfromtext('POINT(55.142 25.079)')),
  '30000000-0000-4000-8000-000000000002'::uuid,
  'a Marina point resolves to the Marina zone'
);

select is(
  public.zone_for_point(extensions.st_geogfromtext('POINT(55.900 24.500)')),
  null,
  'a point out in the desert resolves to no zone'
);

-- FR-016 / SC-005: an unservable address cannot become a customer.
select throws_like(
  $$insert into public.sites (owner_account_id, label, location, building, zone_id)
    values ('10000000-0000-4000-8000-000000000001', 'Desert villa',
            extensions.st_geogfromtext('POINT(55.900 24.500)'), 'Nowhere',
            '30000000-0000-4000-8000-000000000001')$$,
  '%do not serve this location yet%',
  'a site outside every served zone is refused'
);

-- The zone is assigned by the trigger, so a wrong zone_id cannot be smuggled in.
select lives_ok(
  $$insert into public.sites (id, owner_account_id, label, location, building, zone_id)
    values ('50000000-0000-4000-8000-000000000009',
            '10000000-0000-4000-8000-000000000001', 'Second home',
            extensions.st_geogfromtext('POINT(55.145 25.080)'), 'Marina Gate 1',
            '30000000-0000-4000-8000-000000000001')$$,
  'a site inside a served zone is accepted'
);

select is(
  (select zone_id from public.sites
   where id = '50000000-0000-4000-8000-000000000009'),
  '30000000-0000-4000-8000-000000000002'::uuid,
  'the trigger assigns the zone that actually covers the pin, not the one supplied'
);

-- ── who can see a site ───────────────────────────────────────────────

select is(
  (select count(*) from public.sites),
  2::bigint,
  'a personal site owner sees their own sites only'
);

select is(
  (select count(*) from public.sites
   where id = '50000000-0000-4000-8000-000000000001'),
  0::bigint,
  'and cannot see an organization site they do not belong to'
);

-- Nadia owns Northwind, so she sees its site and its access notes.
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  (select count(*) from public.sites),
  1::bigint,
  'an organization owner sees the organization site'
);

select alike(
  (select access_notes from public.sites
   where id = '50000000-0000-4000-8000-000000000001'),
  '%Reception holds the pass%',
  'and can read its access notes'
);

-- FR-018: access notes are invisible to outsiders, because the row is.
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select is(
  (select access_notes from public.sites
   where id = '50000000-0000-4000-8000-000000000001'),
  null,
  'an outsider cannot read another site-s access notes'
);

-- ── waitlist ─────────────────────────────────────────────────────────

select lives_ok(
  $$insert into public.waitlist_entries (account_id, location, area_note)
    values ('10000000-0000-4000-8000-000000000001',
            extensions.st_geogfromtext('POINT(55.900 24.500)'), 'Al Ain road')$$,
  'someone outside a zone can join the waitlist'
);

-- ── grandfathering: reshaping a zone must not delete a site (FR-019) ──

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

update public.service_zones set active = false
  where id = '30000000-0000-4000-8000-000000000002';

select is(
  (select count(*) from public.sites
   where id = '50000000-0000-4000-8000-000000000002'),
  1::bigint,
  'retiring a zone leaves the sites in it intact'
);

select is(
  (select count(*) from public.sites_needing_zone_review
   where zone_id = '30000000-0000-4000-8000-000000000002'),
  2::bigint,
  'and the affected sites are listed for an operator to review'
);

select * from finish();
rollback;
