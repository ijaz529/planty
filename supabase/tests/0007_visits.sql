begin;
select plan(23);

-- The seed leaves several active subscriptions with their visits generated and
-- the whole of the first day assigned to Tariq (...0004). This suite works on
-- PL-000001, the Northwind office (Business Bay, Mon+Wed, fortnightly). Nadia
-- (...0002) is its customer, Priya (...0001) an outsider, Omar (...0003) an
-- operator.

-- Pinned by reference: the seed has several active subscriptions now, so
-- `limit 1` would pick an arbitrary one with different plants on it.
select id as sub_id from public.subscriptions
 where payment_reference = 'PL-000001' \gset
-- Tariq now has a whole round, so take the stop belonging to the pinned
-- subscription rather than whichever one sorts first.
select id as visit1, site_id as site1 from public.visits
 where technician_id = '10000000-0000-4000-8000-000000000004'
   and subscription_id = :'sub_id'
 order by scheduled_date limit 1 \gset

-- ── generation rules (SC-002, SC-003) ────────────────────────────────

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select is(
  (select count(*) from public.visits v
     join public.sites si on si.id = v.site_id
     join public.service_zones z on z.id = si.zone_id
    where not (extract(dow from v.scheduled_date)::smallint = any (z.service_weekdays))),
  0::bigint,
  'every generated visit falls on a day its zone is served'
);

select is(
  (select count(*) from public.visits v
     join public.subscriptions s on s.id = v.subscription_id
    where v.scheduled_date > s.ends_on or v.scheduled_date < s.installation_date),
  0::bigint,
  'and none falls outside the subscription term'
);

-- Fortnightly in a zone served twice a week must be 14 days apart, not 7.
select is(
  (select min(gap) from (
     select scheduled_date - lag(scheduled_date) over (order by scheduled_date) as gap
       from public.visits where subscription_id = :'sub_id') g
   where gap is not null),
  14,
  'a fortnightly subscription is spaced a fortnight apart, not every served day'
);

select is(
  public.generate_visits(28), 0,
  'running generation again creates nothing'
);

-- ── the completion guard (SC-001) ────────────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}';

select throws_like(
  format($$select public.complete_visit(%L, null)$$, :'visit1'),
  '%at least one photo%',
  'a visit cannot be completed without a photo'
);

insert into public.visit_photos (visit_id, storage_path, taken_by)
values (:'visit1', :'visit1' || '/one.jpg', '10000000-0000-4000-8000-000000000004');

select throws_like(
  format($$select public.complete_visit(%L, null)$$, :'visit1'),
  '%condition for every plant%',
  'nor without a verdict on every plant'
);

-- Record a condition for every plant but one.
insert into public.visit_plant_records (visit_id, subscription_line_id, condition)
select :'visit1', l.id, 'healthy'
  from public.subscription_lines l
 where l.subscription_id = :'sub_id'
 order by l.id limit 3;

select throws_like(
  format($$select public.complete_visit(%L, null)$$, :'visit1'),
  '%condition for every plant%',
  'a partial record is still not enough'
);

insert into public.visit_plant_records (visit_id, subscription_line_id, condition, note)
select :'visit1', l.id, 'declining', 'browning tips near the vent'
  from public.subscription_lines l
 where l.subscription_id = :'sub_id'
   and l.id not in (select subscription_line_id from public.visit_plant_records
                     where visit_id = :'visit1');

select lives_ok(
  format($$select public.complete_visit(%L, 'watered, wiped, one to watch')$$, :'visit1'),
  'with a photo and every plant recorded, the visit completes'
);

select is(
  (select status from public.visits where id = :'visit1'),
  'done'::public.visit_status,
  'and is marked done'
);

select is(
  (select completed_by from public.visits where id = :'visit1'),
  '10000000-0000-4000-8000-000000000004'::uuid,
  'stamped with who did it'
);

select isnt(
  (select completed_at from public.visits where id = :'visit1'),
  null,
  'and when'
);

select throws_like(
  format($$select public.complete_visit(%L, null)$$, :'visit1'),
  '%already finished%',
  'completing twice changes nothing'
);

-- No done visit anywhere lacks its record.
select is(
  (select count(*) from public.visits v
    where v.status = 'done'
      and (not exists (select 1 from public.visit_photos p where p.visit_id = v.id)
           or (select count(*) from public.visit_plant_records r where r.visit_id = v.id)
              < (select count(*) from public.subscription_lines l
                  where l.subscription_id = v.subscription_id))),
  0::bigint,
  'no completed visit is missing its photo or a plant verdict'
);

-- ── the narrowed technician access (feature 001-s recorded correction) ──

-- The point being tested is that a technician keeps sight of a site while they
-- still have work there, so the second stop has to be at that same site rather
-- than merely on the same round. The seed assigns Tariq one day, so this suite
-- gives him the subscription's next stop itself instead of relying on the seed
-- to have done it.
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select id as visit2 from public.visits
 where status = 'planned' and subscription_id = :'sub_id'
 order by scheduled_date limit 1 \gset

select public.assign_visit(:'visit2', '10000000-0000-4000-8000-000000000004', 9::smallint);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}';

select is(
  (select count(*) from public.sites where id = :'site1'),
  1::bigint,
  'a technician sees a site while assigned an unfinished visit there'
);

select alike(
  (select access_notes from public.sites where id = :'site1'),
  '%Reception%',
  'including how to get in'
);

-- Finish the remaining assigned visit; the site should then disappear.
insert into public.visit_photos (visit_id, storage_path, taken_by)
values (:'visit2', :'visit2' || '/one.jpg', '10000000-0000-4000-8000-000000000004');
insert into public.visit_plant_records (visit_id, subscription_line_id, condition)
select :'visit2', l.id, 'healthy' from public.subscription_lines l
 where l.subscription_id = :'sub_id';
select public.complete_visit(:'visit2', null);

select is(
  (select count(*) from public.sites where id = :'site1'),
  0::bigint,
  'and stops seeing it once no unfinished visit remains'
);

-- ── isolation (SC-005) ───────────────────────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

-- Priya has her own Marina subscriptions now, so "sees nothing" is no longer
-- the invariant. What must hold is that she sees nothing of Northwind's.
select is(
  (select count(*) from public.visits v
     join public.subscriptions s on s.id = v.subscription_id
    where s.organization_id = '20000000-0000-4000-8000-000000000001'),
  0::bigint,
  'an outsider sees no visits of another organization'
);

select is(
  (select count(*) from public.visit_photos p
     join public.visits v on v.id = p.visit_id
     join public.subscriptions s on s.id = v.subscription_id
    where s.organization_id = '20000000-0000-4000-8000-000000000001'),
  0::bigint,
  'nor any of its photos'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  (select count(*) from public.visits where id = :'visit1'), 1::bigint,
  'the customer sees their own visit'
);

select is(
  (select count(*) from public.visit_plant_records where visit_id = :'visit1') > 0,
  true,
  'and the verdicts recorded at it'
);

select throws_like(
  format($$select public.assign_visit(%L, '10000000-0000-4000-8000-000000000004', 1::smallint)$$, :'visit1'),
  '%only an operator%',
  'a customer cannot assign a technician'
);

-- ── cancelling a subscription clears planned work, keeps history ──────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select public.cancel_subscription(:'sub_id', 'test');
select public.generate_visits(28);

select is(
  (select count(*) from public.visits
    where subscription_id = :'sub_id' and status = 'planned'),
  0::bigint,
  'cancelling a subscription removes its planned visits'
);

select is(
  (select count(*) from public.visits
    where subscription_id = :'sub_id' and status = 'done'),
  2::bigint,
  'and keeps the ones that actually happened'
);

select * from finish();
rollback;
