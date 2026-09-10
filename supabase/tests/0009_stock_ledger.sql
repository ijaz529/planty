begin;
select plan(23);

-- Seeded: one active Northwind subscription holding 6 snake desk, 4 ZZ desk,
-- 3 snake floor and 1 kentia. Omar (...0003) is an operator, Tariq (...0004)
-- the technician, Nadia (...0002) the customer.

select id as sub_id from public.subscriptions where status = 'active' limit 1 \gset
select id as kentia_line from public.subscription_lines
 where subscription_id = :'sub_id' and species_name = 'Kentia palm' \gset
select id as zz_line from public.subscription_lines
 where subscription_id = :'sub_id' and species_name = 'ZZ plant' \gset

\set kentia '40000000-0000-4000-8000-000000000108'
\set pothos '40000000-0000-4000-8000-000000000105'
\set zz     '40000000-0000-4000-8000-000000000103'

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

-- ── the ledger reconciles (SC-001) ───────────────────────────────────

create or replace function pg_temp.unreconciled() returns bigint
language sql as $$
  select count(*)
    from public.plant_variants v
    left join (select variant_id, sum(delta_total) dt, sum(delta_allocated) da,
                      sum(delta_recovering) dr
                 from public.stock_movements group by variant_id) m
      on m.variant_id = v.id
   where v.stock_total <> coalesce(m.dt, 0)
      or v.stock_allocated <> coalesce(m.da, 0)
      or v.stock_recovering <> coalesce(m.dr, 0);
$$;

select is(pg_temp.unreconciled(), 0::bigint,
  'every plant reconciles against its movements from the start');

-- ── receiving and writing off ────────────────────────────────────────

select stock_total as k_total, stock_available as k_ready
  from public.plant_variants where id = :'kentia' \gset

select lives_ok(
  format($$select public.receive_stock(%L, 10, 'delivery from the nursery')$$, :'kentia'),
  'an operator can receive a delivery'
);

select is(
  (select stock_total from public.plant_variants where id = :'kentia'),
  :k_total + 10,
  'which raises what Planty owns'
);

select is(
  (select stock_available from public.plant_variants where id = :'kentia'),
  :k_ready + 10,
  'and what is ready to send'
);

select is(
  (select reason::text from public.stock_movements
    where variant_id = :'kentia' order by created_at desc limit 1),
  'received',
  'and records why'
);

select lives_ok(
  format($$select public.write_off_stock(%L, 2, 'root rot')$$, :'kentia'),
  'an operator can write off a dead plant'
);

select is(
  (select stock_total from public.plant_variants where id = :'kentia'),
  :k_total + 8,
  'which removes it from the fleet'
);

select throws_like(
  format($$select public.write_off_stock(%L, 1000, 'oops')$$, :'kentia'),
  '%more than the depot holds%',
  'writing off more than the depot holds is refused'
);

select throws_like(
  format($$select public.receive_stock(%L, 0, null)$$, :'kentia'),
  '%at least one%',
  'receiving nothing is refused'
);

select is(pg_temp.unreconciled(), 0::bigint,
  'and the ledger still reconciles');

-- ── a replacement costs a plant (FR-008) ─────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';
select public.request_plant_change(:'kentia_line', 'replacement', null, 'declining') as r \gset
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';
select public.decide_plant_change(:'r', true, null);

select stock_total as before_total, stock_allocated as before_alloc
  from public.plant_variants where id = :'kentia' \gset

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}';

select lives_ok(
  format($$select public.fulfil_plant_change(%L)$$, :'r'),
  'the technician carries out the replacement'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select is(
  (select stock_total from public.plant_variants where id = :'kentia'),
  :before_total - 1,
  'Planty owns one fewer, because one died'
);

select is(
  (select stock_allocated from public.plant_variants where id = :'kentia'),
  :before_alloc,
  'and the customer still has the same number, a fresh one having taken its place'
);

select is(
  (select count(*) from public.stock_movements
    where reason = 'replaced' and request_id = :'r'),
  1::bigint,
  'recorded as a replacement against that request'
);

-- ── a swap sends plants to recovery, not back to the shelf (FR-010) ──

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';
select public.request_plant_change(:'zz_line', 'rotation', :'pothos', 'variety') as r2 \gset
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';
select public.decide_plant_change(:'r2', true, null);

select stock_recovering as zz_recovering_before, stock_available as zz_ready_before
  from public.plant_variants where id = :'zz' \gset

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}';
select public.fulfil_plant_change(:'r2');
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select is(
  (select stock_recovering from public.plant_variants where id = :'zz'),
  :zz_recovering_before + 4,
  'the outgoing plants land in recovery'
);

select is(
  (select stock_available from public.plant_variants where id = :'zz'),
  :zz_ready_before,
  'and are not offered as ready to send'
);

select lives_ok(
  format($$select public.recover_stock(%L, 4, 'looking well again')$$, :'zz'),
  'an operator can return recovered plants to stock'
);

select is(
  (select stock_available from public.plant_variants where id = :'zz'),
  :zz_ready_before + 4,
  'which makes them sellable again'
);

select is(pg_temp.unreconciled(), 0::bigint,
  'and every count still reconciles after replacements and swaps');

-- ── the ledger cannot be rewritten (SC-006) ──────────────────────────

-- RLS with no write policy denies by matching no rows, not by raising, so the
-- honest assertion is that nothing changed.
select count(*)::int as movements_before from public.stock_movements \gset
select sum(delta_total)::int as total_before from public.stock_movements \gset

update public.stock_movements set delta_total = 999;
delete from public.stock_movements;

select is(
  (select count(*)::int from public.stock_movements), :movements_before,
  'no role can delete a movement'
);

select is(
  (select sum(delta_total)::int from public.stock_movements), :total_before,
  'nor alter one'
);

-- ── who may act ──────────────────────────────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select throws_like(
  format($$select public.receive_stock(%L, 5, null)$$, :'kentia'),
  '%only an operator%',
  'a customer cannot receive stock'
);

select is(
  (select count(*) from public.stock_movements), 0::bigint,
  'and cannot read the ledger at all'
);

select * from finish();
rollback;
