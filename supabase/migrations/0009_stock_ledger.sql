-- Feature 006: stock ledger & depot (spec FR-001..FR-012)
--
-- Until now a replacement was free to the customer and invisible to the
-- business: a plant died, a fresh one went out, and no count moved. The PRD
-- calls a replacement rate above four percent a month a reason to change the
-- palette or the pricing, and it could not be computed at all.
--
-- Every change to stock now writes an immutable movement, and the three flows
-- that already moved stock are rewritten to go through it. A ledger that
-- recorded only new movements would be worse than none, because it would look
-- complete while the counts drifted from it.

create type public.stock_reason as enum (
  'received', 'allocated', 'released', 'replaced',
  'rotated_out', 'rotated_in', 'recovered',
  'written_off', 'lost', 'adjusted'
);

-- ── the fourth count ─────────────────────────────────────────────────
-- A plant back from a customer is not sellable the moment it lands. Putting it
-- straight into ready-to-send would let the catalogue promise a plant nobody
-- would actually ship.

alter table public.plant_variants
  add column stock_recovering integer not null default 0 check (stock_recovering >= 0);

alter table public.plant_variants drop column stock_available;

alter table public.plant_variants
  add column stock_available integer
    generated always as (stock_total - stock_allocated - stock_recovering) stored;

alter table public.plant_variants drop constraint plant_variants_stock_sane;

alter table public.plant_variants
  add constraint plant_variants_stock_sane
    check (stock_allocated + stock_recovering <= stock_total);

-- ── the ledger ───────────────────────────────────────────────────────

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.plant_variants (id) on delete restrict,
  reason public.stock_reason not null,
  delta_total integer not null default 0,
  delta_allocated integer not null default 0,
  delta_recovering integer not null default 0,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  request_id uuid references public.plant_change_requests (id) on delete set null,
  note text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  constraint stock_movement_moves_something check (
    delta_total <> 0 or delta_allocated <> 0 or delta_recovering <> 0
  )
);

create index stock_movements_variant
  on public.stock_movements (variant_id, created_at desc);
create index stock_movements_reason on public.stock_movements (reason, created_at desc);

alter table public.stock_movements enable row level security;

-- Select only, for operators. There is deliberately no insert, update or
-- delete policy for any role: the functions below are the only writer, and
-- nothing may rewrite what happened (FR-002, SC-006).
create policy "stock movements: operator reads"
  on public.stock_movements for select to authenticated
  using ((select public.is_operator()));

-- ── the single writer ────────────────────────────────────────────────

create function public.record_stock_movement(
  p_variant_id uuid,
  p_reason public.stock_reason,
  p_delta_total integer default 0,
  p_delta_allocated integer default 0,
  p_delta_recovering integer default 0,
  p_subscription_id uuid default null,
  p_request_id uuid default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  if p_delta_total = 0 and p_delta_allocated = 0 and p_delta_recovering = 0 then
    return;
  end if;

  update public.plant_variants
     set stock_total = stock_total + p_delta_total,
         stock_allocated = stock_allocated + p_delta_allocated,
         stock_recovering = stock_recovering + p_delta_recovering
   where id = p_variant_id;

  if not found then
    raise exception 'plant not found';
  end if;

  insert into public.stock_movements (
    variant_id, reason, delta_total, delta_allocated, delta_recovering,
    subscription_id, request_id, note, created_by
  ) values (
    p_variant_id, p_reason, p_delta_total, p_delta_allocated, p_delta_recovering,
    p_subscription_id, p_request_id, p_note, auth.uid()
  );
exception
  when check_violation then
    select s.common_name into v_name
      from public.plant_variants v
      join public.plant_species s on s.id = v.species_id
     where v.id = p_variant_id;
    raise exception 'that would leave an impossible stock position for %',
      coalesce(v_name, 'this plant');
end;
$$;

-- ── operator actions ─────────────────────────────────────────────────

create function public.receive_stock(
  p_variant_id uuid, p_quantity integer, p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_operator() then
    raise exception 'only an operator can change stock';
  end if;
  if p_quantity is null or p_quantity < 1 then
    raise exception 'quantity must be at least one';
  end if;

  perform public.record_stock_movement(
    p_variant_id, 'received', p_quantity, 0, 0, null, null, p_note);
end;
$$;

create function public.write_off_stock(
  p_variant_id uuid, p_quantity integer, p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_available integer;
  v_name text;
begin
  if not public.is_operator() then
    raise exception 'only an operator can change stock';
  end if;
  if p_quantity is null or p_quantity < 1 then
    raise exception 'quantity must be at least one';
  end if;

  select v.stock_available, s.common_name into v_available, v_name
    from public.plant_variants v
    join public.plant_species s on s.id = v.species_id
   where v.id = p_variant_id
     for update of v;

  if v_available is null or v_available < p_quantity then
    raise exception 'cannot write off more than the depot holds: % ready to send',
      coalesce(v_available, 0);
  end if;

  perform public.record_stock_movement(
    p_variant_id, 'written_off', -p_quantity, 0, 0, null, null, p_note);
end;
$$;

create function public.recover_stock(
  p_variant_id uuid, p_quantity integer, p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recovering integer;
begin
  if not public.is_operator() then
    raise exception 'only an operator can change stock';
  end if;
  if p_quantity is null or p_quantity < 1 then
    raise exception 'quantity must be at least one';
  end if;

  select stock_recovering into v_recovering
    from public.plant_variants where id = p_variant_id for update;

  if v_recovering is null or v_recovering < p_quantity then
    raise exception 'only % plants are recovering', coalesce(v_recovering, 0);
  end if;

  perform public.record_stock_movement(
    p_variant_id, 'recovered', 0, 0, -p_quantity, null, null, p_note);
end;
$$;

grant execute on function public.receive_stock(uuid, integer, text) to authenticated;
grant execute on function public.write_off_stock(uuid, integer, text) to authenticated;
grant execute on function public.recover_stock(uuid, integer, text) to authenticated;

-- ── the metric ───────────────────────────────────────────────────────
-- Null rather than zero on an empty fleet: a replacement rate of zero with no
-- plants reads as success (FR-012).

create function public.replacement_rate(p_days integer default 30)
returns numeric
language sql
security definer
set search_path = ''
stable
as $$
  select case
    when coalesce((select sum(stock_total) from public.plant_variants), 0) = 0
      then null
    else round(
      100.0 * coalesce((
        select sum(-m.delta_total) from public.stock_movements m
         where m.reason in ('written_off', 'replaced', 'lost')
           and m.created_at >= now() - make_interval(days => p_days)
      ), 0) / (select sum(stock_total) from public.plant_variants),
      2)
  end
  where public.is_operator();
$$;

grant execute on function public.replacement_rate(integer) to authenticated;

-- ── the flows that already moved stock, rewritten ────────────────────

create or replace function public.create_subscription(
  p_items jsonb, p_term_id uuid, p_cadence_id uuid, p_site_id uuid,
  p_installation_date date, p_billing_email text default null,
  p_expected_total numeric default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
  v_site public.sites;
  v_zone public.service_zones;
  v_quote jsonb;
  v_total numeric(10,2);
  v_email text;
  v_line jsonb;
  v_variant_id uuid;
  v_qty integer;
  v_available integer;
  v_name text;
  v_id uuid := gen_random_uuid();
  v_reference text;
  v_priceable integer := 0;
  v_ids uuid[];
begin
  if caller is null then
    raise exception 'you must be signed in to place an order';
  end if;

  select * into v_site from public.sites where id = p_site_id;
  if not found or not (
       v_site.owner_account_id = caller
       or (v_site.organization_id is not null
           and public.org_role(v_site.organization_id) is not null)
       or public.is_operator())
  then
    raise exception 'choose one of your own sites';
  end if;

  select * into v_zone from public.service_zones where id = v_site.zone_id;
  if not v_zone.active then
    raise exception 'we no longer serve this site''s area';
  end if;

  v_quote := public.price_basket(p_items, p_term_id, p_cadence_id, p_site_id);
  v_total := (v_quote ->> 'monthly_total_aed')::numeric;

  if not (v_quote ->> 'site_applied')::boolean then
    raise exception 'choose one of your own sites';
  end if;
  select count(*) into v_priceable
    from jsonb_array_elements(v_quote -> 'lines') l
   where l ->> 'status' in ('ok', 'capped');
  if v_priceable = 0 then
    raise exception 'nothing in this basket can be ordered right now';
  end if;
  if not (v_quote ->> 'meets_minimum')::boolean then
    raise exception 'below minimum: short by AED %', v_quote ->> 'shortfall_aed';
  end if;
  if p_expected_total is not null and p_expected_total <> v_total then
    raise exception 'price changed: now AED %', v_total;
  end if;

  if p_installation_date < public.min_installation_date() then
    raise exception 'earliest installation is %', public.min_installation_date();
  end if;
  if not (extract(dow from p_installation_date)::smallint = any (v_zone.service_weekdays)) then
    raise exception 'installation must be on a day we serve %', v_zone.name;
  end if;

  v_email := nullif(trim(p_billing_email), '');
  if v_email is null and v_site.organization_id is not null then
    select billing_email into v_email from public.organizations
     where id = v_site.organization_id;
  end if;
  if v_email is null then
    select email into v_email from public.profiles where id = caller;
  end if;
  if v_email is null then
    raise exception 'a billing email is required';
  end if;

  select array_agg((l ->> 'variant_id')::uuid order by (l ->> 'variant_id')::uuid)
    into v_ids
    from jsonb_array_elements(v_quote -> 'lines') l
   where l ->> 'status' in ('ok', 'capped');

  perform 1 from public.plant_variants
   where id = any (v_ids) order by id for update;

  v_reference := 'PL-' || lpad(nextval('public.payment_reference_seq')::text, 6, '0');

  insert into public.subscriptions (
    id, owner_account_id, organization_id, site_id, status, payment_method,
    payment_reference, billing_email,
    term_months, term_label, term_multiplier,
    cadence_code, cadence_label, cadence_fee_aed,
    plants_subtotal_aed, service_fee_aed, monthly_total_aed, quote,
    installation_date, ends_on, reserved_until, created_by
  ) values (
    v_id,
    case when v_site.organization_id is null then v_site.owner_account_id end,
    v_site.organization_id, p_site_id, 'pending', 'invoice',
    v_reference, v_email,
    (v_quote -> 'term' ->> 'months')::smallint,
    v_quote -> 'term' ->> 'label',
    (v_quote -> 'term' ->> 'multiplier')::numeric,
    v_quote -> 'cadence' ->> 'code',
    v_quote -> 'cadence' ->> 'label',
    (v_quote -> 'cadence' ->> 'monthly_fee_aed')::numeric,
    (v_quote ->> 'plants_subtotal_aed')::numeric,
    (v_quote ->> 'service_fee_aed')::numeric,
    v_total, v_quote,
    p_installation_date,
    p_installation_date + ((v_quote -> 'term' ->> 'months')::int || ' months')::interval,
    now() + interval '7 days', caller
  );

  -- Reserve through the ledger, so every allocation can be explained later.
  for v_line in
    select l from jsonb_array_elements(v_quote -> 'lines') l
     where l ->> 'status' in ('ok', 'capped')
     order by (l ->> 'variant_id')
  loop
    v_variant_id := (v_line ->> 'variant_id')::uuid;
    v_qty := (v_line ->> 'quantity')::integer;
    v_name := v_line ->> 'species_name';

    select stock_available into v_available
      from public.plant_variants where id = v_variant_id;
    if v_available is null or v_available < v_qty then
      raise exception 'not enough % in stock', v_name;
    end if;

    perform public.record_stock_movement(
      v_variant_id, 'allocated', 0, v_qty, 0, v_id, null, 'order placed');
  end loop;

  insert into public.subscription_lines
    (subscription_id, variant_id, species_name, size_tier, unit_price_aed, quantity, line_total_aed)
  select v_id, (l ->> 'variant_id')::uuid, l ->> 'species_name', l ->> 'size_tier',
         (l ->> 'unit_price_aed')::numeric, (l ->> 'quantity')::integer,
         (l ->> 'line_total_aed')::numeric
    from jsonb_array_elements(v_quote -> 'lines') l
   where l ->> 'status' in ('ok', 'capped');

  insert into public.subscription_status_events (subscription_id, from_status, to_status, changed_by)
  values (v_id, null, 'pending', caller);

  return v_id;
end;
$$;

create or replace function public.cancel_subscription(p_id uuid, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub public.subscriptions;
  v_operator boolean := public.is_operator();
  v_line record;
begin
  select * into v_sub from public.subscriptions where id = p_id for update;
  if not found then
    raise exception 'subscription not found';
  end if;
  if not v_operator and not public.can_access_subscription(p_id) then
    raise exception 'subscription not found';
  end if;
  if v_sub.status = 'cancelled' then
    return;
  end if;
  if v_sub.status = 'active' and not v_operator then
    raise exception 'active subscriptions are cancelled by Planty — contact us';
  end if;

  if not v_sub.stock_released then
    for v_line in
      select variant_id, quantity from public.subscription_lines
       where subscription_id = p_id
    loop
      perform public.record_stock_movement(
        v_line.variant_id, 'released', 0, -v_line.quantity, 0, p_id, null,
        'subscription cancelled');
    end loop;
  end if;

  update public.subscriptions
     set status = 'cancelled', stock_released = true
   where id = p_id;

  insert into public.subscription_status_events (subscription_id, from_status, to_status, changed_by, note)
  values (p_id, v_sub.status, 'cancelled', auth.uid(), p_note);
end;
$$;

-- A replacement now costs Planty the plant it costs in reality (FR-008).
create or replace function public.fulfil_plant_change(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_req public.plant_change_requests;
  v_line public.subscription_lines;
  v_available integer;
  v_name text;
begin
  select * into v_req from public.plant_change_requests where id = p_request_id for update;
  if not found then
    raise exception 'request not found';
  end if;
  if v_req.status <> 'approved' then
    raise exception 'this request is not approved yet';
  end if;
  if not public.is_operator()
     and not exists (select 1 from public.visits v
                      where v.id = v_req.visit_id and v.technician_id = auth.uid())
  then
    raise exception 'this request is not yours';
  end if;

  select * into v_line from public.subscription_lines where id = v_req.subscription_line_id;

  if v_req.kind = 'rotation' then
    select v.stock_available, s.common_name into v_available, v_name
      from public.plant_variants v
      join public.plant_species s on s.id = v.species_id
     where v.id = v_req.requested_variant_id
       for update of v;
    if v_available is null or v_available < v_line.quantity then
      raise exception 'not enough % in stock', coalesce(v_name, 'that plant');
    end if;

    perform public.record_stock_movement(
      v_req.requested_variant_id, 'rotated_in', 0, v_line.quantity, 0,
      v_req.subscription_id, p_request_id, 'swap: plants delivered');

    -- The outgoing plants come back to the depot but are not sellable until an
    -- operator says they have recovered.
    perform public.record_stock_movement(
      v_line.variant_id, 'rotated_out', 0, -v_line.quantity, v_line.quantity,
      v_req.subscription_id, p_request_id, 'swap: plants collected');

    update public.subscription_lines l
       set variant_id = v_req.requested_variant_id,
           species_name = sp.common_name,
           size_tier = pv.size_tier::text
      from public.plant_variants pv
      join public.plant_species sp on sp.id = pv.species_id
     where l.id = v_line.id and pv.id = v_req.requested_variant_id;
  else
    -- A replacement: the dead plant leaves the fleet, a fresh one takes its
    -- place at the customer. Owned falls by one per plant; the customer's
    -- allocation does not move, because they still have the same number.
    select v.stock_available, s.common_name into v_available, v_name
      from public.plant_variants v
      join public.plant_species s on s.id = v.species_id
     where v.id = v_line.variant_id
       for update of v;
    if v_available is null or v_available < v_line.quantity then
      raise exception 'no % ready to send', coalesce(v_name, 'plant');
    end if;

    perform public.record_stock_movement(
      v_line.variant_id, 'replaced', -v_line.quantity, 0, 0,
      v_req.subscription_id, p_request_id, 'replaced under guarantee');
  end if;

  update public.plant_change_requests
     set status = 'fulfilled', fulfilled_by = auth.uid(), fulfilled_at = now()
   where id = p_request_id;
end;
$$;

-- ── the operator's view ──────────────────────────────────────────────

create function public.depot_positions()
returns table (
  variant_id uuid, species_name text, size_tier text,
  owned integer, with_customers integer, recovering integer, ready integer,
  last_movement timestamptz
)
language sql
security definer
set search_path = ''
stable
as $$
  select v.id, s.common_name, v.size_tier::text,
         v.stock_total, v.stock_allocated, v.stock_recovering, v.stock_available,
         (select max(m.created_at) from public.stock_movements m where m.variant_id = v.id)
    from public.plant_variants v
    join public.plant_species s on s.id = v.species_id
   where public.is_operator()
   order by s.common_name, v.size_tier;
$$;

grant execute on function public.depot_positions() to authenticated;

-- ── opening balances ─────────────────────────────────────────────────
-- Stock exists before this migration: the seeded catalogue and whatever the
-- seeded subscription allocated. Without opening entries the ledger would not
-- reconcile against the counts on day one (FR-003).

insert into public.stock_movements (variant_id, reason, delta_total, note)
select id, 'adjusted', stock_total, 'opening balance at ledger start'
  from public.plant_variants
 where stock_total <> 0;

insert into public.stock_movements (variant_id, reason, delta_allocated, note)
select id, 'adjusted', stock_allocated, 'opening allocation at ledger start'
  from public.plant_variants
 where stock_allocated <> 0;
