begin;
select plan(26);

-- The seed leaves one active Northwind subscription with four lines, its
-- visits generated and the first two assigned to Tariq (...0004).
-- Nadia (...0002) is the customer, Priya (...0001) an outsider, Omar (...0003)
-- an operator. Default rotation allowance is 2 per 30-day window (007).

select id as sub_id from public.subscriptions where status = 'active' limit 1 \gset
select id as kentia_line from public.subscription_lines
 where subscription_id = :'sub_id' and species_name = 'Kentia palm' \gset
select id as zz_line from public.subscription_lines
 where subscription_id = :'sub_id' and species_name = 'ZZ plant' \gset
select id as snake_line from public.subscription_lines
 where subscription_id = :'sub_id' and size_tier = 'floor' \gset

\set pothos '40000000-0000-4000-8000-000000000105'
\set areca  '40000000-0000-4000-8000-000000000109'

set local role authenticated;
set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

-- ── the allowance starts full ────────────────────────────────────────

select is(
  public.rotations_remaining(:'sub_id'), 2,
  'a new subscription starts with its full rotation allowance'
);

-- The window ends thirty days after installation. The FIRST one is a little
-- longer than thirty days, because it opens when the subscription is created
-- so a request made while waiting for installation still counts.
select is(
  public.rotation_window_days(), 30,
  'the swap window is thirty days, not a quarter'
);

select is(
  public.rotation_period_end(:'sub_id'),
  (select installation_date + 30 from public.subscriptions where id = :'sub_id'),
  'the window ends thirty days after installation'
);

select is(
  public.rotation_period_start(:'sub_id')
    <= (select installation_date from public.subscriptions where id = :'sub_id'),
  true,
  'and the first window is already open before installation day'
);

-- ── a free replacement ───────────────────────────────────────────────

select lives_ok(
  format($$select public.request_plant_change(%L, 'replacement', null, 'browning near the vent')$$, :'kentia_line'),
  'a customer can ask for a declining plant to be replaced'
);

select is(
  public.rotations_remaining(:'sub_id'), 2,
  'and a replacement costs no rotation credit'
);

select throws_like(
  format($$select public.request_plant_change(%L, 'replacement', null, 'again')$$, :'kentia_line'),
  '%already has an open request%',
  'a second open request on the same plant is refused'
);

-- ── spending rotations ───────────────────────────────────────────────

select lives_ok(
  format($$select public.request_plant_change(%L, 'rotation', %L, 'bored of it')$$, :'zz_line', :'pothos'),
  'a customer can spend a rotation to swap a plant'
);

select is(
  public.rotations_remaining(:'sub_id'), 1,
  'which costs exactly one credit'
);

select throws_like(
  format($$select public.request_plant_change(%L, 'rotation', %L, 'out of stock choice')$$, :'snake_line', :'areca'),
  '%in stock%',
  'a rotation to an out-of-stock plant is refused'
);

select is(
  public.rotations_remaining(:'sub_id'), 1,
  'and a refused rotation costs nothing'
);

-- Spend the last one, then find the wall.
select public.request_plant_change(:'snake_line', 'rotation', :'pothos', 'variety');

select is(
  public.rotations_remaining(:'sub_id'), 0,
  'spending the last credit leaves none'
);

select id as third_line from public.subscription_lines
 where subscription_id = :'sub_id'
   and id not in (:'kentia_line', :'zz_line', :'snake_line') limit 1 \gset

select throws_like(
  format($$select public.request_plant_change(%L, 'rotation', %L, 'one more')$$, :'third_line', :'pothos'),
  '%no rotations left until%',
  'a rotation beyond the allowance is refused, naming the renewal date'
);

-- FR-007: the guarantee is never metered by the rotation allowance.
select lives_ok(
  format($$select public.request_plant_change(%L, 'replacement', null, 'this one is dying')$$, :'third_line'),
  'and a free replacement is still possible with no rotations left'
);

-- ── deciding ─────────────────────────────────────────────────────────

select id as rot_req from public.plant_change_requests
 where subscription_line_id = :'zz_line' and status = 'requested' \gset
select id as rep_req from public.plant_change_requests
 where subscription_line_id = :'kentia_line' and status = 'requested' \gset

select throws_like(
  format($$select public.decide_plant_change(%L, true, null)$$, :'rot_req'),
  '%only an operator%',
  'a customer cannot decide their own request'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select lives_ok(
  format($$select public.decide_plant_change(%L, false, 'we only rotate flowering plants')$$, :'rot_req'),
  'an operator can decline a rotation with a reason'
);

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  public.rotations_remaining(:'sub_id'), 1,
  'declining a rotation returns the credit exactly'
);

-- Withdrawing does the same.
select id as last_rot from public.plant_change_requests
 where subscription_line_id = :'snake_line' and status = 'requested' \gset

select lives_ok(
  format($$select public.withdraw_plant_change(%L)$$, :'last_rot'),
  'a customer can withdraw their own request'
);

select is(
  public.rotations_remaining(:'sub_id'), 2,
  'and withdrawing returns that credit too'
);

select lives_ok(
  format($$select public.withdraw_plant_change(%L)$$, :'last_rot'),
  'withdrawing twice is harmless'
);

-- ── approval rides the next visit (FR-011, SC-005) ───────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}';

select lives_ok(
  format($$select public.decide_plant_change(%L, true, 'covered by the guarantee')$$, :'rep_req'),
  'an operator approves the replacement'
);

select is(
  (select v.scheduled_date from public.plant_change_requests r
     join public.visits v on v.id = r.visit_id where r.id = :'rep_req'),
  (select min(scheduled_date) from public.visits where status = 'planned'),
  'and it is attached to the next planned visit at that site'
);

-- ── fulfilment moves stock ───────────────────────────────────────────

select public.request_plant_change(:'zz_line', 'rotation', :'pothos', 'trying again');
select id as rot2 from public.plant_change_requests
 where subscription_line_id = :'zz_line' and status = 'requested' \gset
select public.decide_plant_change(:'rot2', true, null);

select stock_allocated as pothos_before from public.plant_variants where id = :'pothos' \gset

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}';

select lives_ok(
  format($$select public.fulfil_plant_change(%L)$$, :'rot2'),
  'the assigned technician marks the swap carried out'
);

select is(
  (select stock_allocated from public.plant_variants where id = :'pothos') - :pothos_before,
  4,
  'which reserves the incoming plants'
);

select is(
  (select species_name from public.subscription_lines where id = :'zz_line'),
  'Golden pothos',
  'and the subscription now describes what is actually in the room'
);

-- ── isolation (SC-006) ───────────────────────────────────────────────

set local request.jwt.claims to '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}';

select is(
  (select count(*) from public.plant_change_requests), 0::bigint,
  'an outsider sees no requests'
);

select * from finish();
rollback;
