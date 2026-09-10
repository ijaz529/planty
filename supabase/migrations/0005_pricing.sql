-- Feature 002: configure & price (spec FR-001..FR-018)
--
-- price_basket() is the authority for every number a customer sees.
-- src/lib/pricing.ts mirrors it so the basket stays responsive; the shared
-- fixtures in specs/002-configure-and-price/contracts/pricing-cases.json are
-- run against both, so the two cannot drift silently.
--
-- Nothing here encodes a price level. Planty's prices are the first observable
-- rental prices in this market and are still a hypothesis, so every rate, fee
-- and multiplier is operator-edited data (constitution, Market Constraints).

-- ── rental terms ─────────────────────────────────────────────────────

create table public.rental_terms (
  id uuid primary key default gen_random_uuid(),
  months smallint not null unique check (months between 1 and 36),
  label text not null check (char_length(label) between 2 and 40),
  price_multiplier numeric(5,4) not null check (price_multiplier between 0.5 and 2.0),
  is_default boolean not null default false,
  active boolean not null default true,
  sort_order smallint not null default 0
);

-- Exactly one default among the active terms.
create unique index rental_terms_single_default
  on public.rental_terms ((true)) where is_default and active;

-- ── visit cadences ───────────────────────────────────────────────────

create table public.service_cadences (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z_]+$'),
  label text not null check (char_length(label) between 2 and 40),
  visits_per_month numeric(4,2) not null check (visits_per_month > 0),
  monthly_fee_aed numeric(10,2) not null check (monthly_fee_aed >= 0),
  is_default boolean not null default false,
  active boolean not null default true,
  sort_order smallint not null default 0
);

create unique index service_cadences_single_default
  on public.service_cadences ((true)) where is_default and active;

-- ── zone minimum (FR-015) ────────────────────────────────────────────
-- Constitution I: a basket that will not pay for the visit is not an order.

alter table public.service_zones
  add column minimum_monthly_aed numeric(10,2) not null default 0
    check (minimum_monthly_aed >= 0);

-- ── bundles ──────────────────────────────────────────────────────────
-- Deliberately no price column: a bundle's price is computed from its
-- contents, so it can never advertise a number its contents do not produce.

create table public.bundles (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  suits text not null check (char_length(suits) between 2 and 160),
  description text,
  published boolean not null default false,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger bundles_updated_at
  before update on public.bundles
  for each row execute procedure extensions.moddatetime (updated_at);

create table public.bundle_items (
  bundle_id uuid not null references public.bundles (id) on delete cascade,
  variant_id uuid not null references public.plant_variants (id) on delete cascade,
  quantity smallint not null check (quantity between 1 and 500),
  primary key (bundle_id, variant_id)
);

-- ── the pricing authority ────────────────────────────────────────────
--
-- All arithmetic is in integer fils (hundredths of a dirham) so no binary
-- floating point touches money. Rounding happens exactly twice: once per line,
-- and once when the term multiplier is applied to the subtotal. Rounding at the
-- end instead would let the displayed lines disagree with the displayed total,
-- which SC-003 forbids.

create function public.price_basket(
  p_items jsonb,
  p_term_id uuid default null,
  p_cadence_id uuid default null,
  p_site_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_term public.rental_terms;
  v_cadence public.service_cadences;
  v_lines jsonb := '[]'::jsonb;
  v_plants_fils bigint := 0;
  v_fee_fils bigint := 0;
  v_priceable boolean := false;
  v_has_unavailable boolean := false;
  v_subtotal_fils bigint;
  v_total_fils bigint;
  v_cheapest_multiplier numeric;
  v_cheapest_fils bigint;
  v_minimum_fils bigint := 0;
  v_site_applied boolean := false;
  v_meets boolean := true;
  v_shortfall_fils bigint := 0;
  r record;
begin
  -- An unknown or inactive term or cadence falls back to the default: a stale
  -- basket must reprice, never error.
  select * into v_term from public.rental_terms
   where id = p_term_id and active;
  if not found then
    select * into v_term from public.rental_terms where is_default and active;
  end if;

  select * into v_cadence from public.service_cadences
   where id = p_cadence_id and active;
  if not found then
    select * into v_cadence from public.service_cadences where is_default and active;
  end if;

  if v_term.id is null or v_cadence.id is null then
    raise exception 'pricing is not configured: an active default term and cadence are required';
  end if;

  for r in
    select
      item.variant_id,
      item.quantity as requested,
      v.id as found_id,
      v.published,
      coalesce(v.stock_available, 0) as stock_available,
      v.price_aed,
      v.size_tier,
      s.common_name
    from jsonb_to_recordset(coalesce(p_items, '[]'::jsonb))
         as item(variant_id uuid, quantity int)
    left join public.plant_variants v on v.id = item.variant_id
    left join public.plant_species s on s.id = v.species_id
    where item.quantity is not null and item.quantity >= 1
  loop
    declare
      v_status text;
      v_qty int;
      v_unit_fils bigint;
      v_line_fils bigint;
    begin
      if r.found_id is null or not r.published or r.price_aed is null
         or r.stock_available <= 0
      then
        v_status := 'unavailable';
        v_qty := 0;
        v_unit_fils := coalesce(round(r.price_aed * 100), 0);
        v_line_fils := 0;
        v_has_unavailable := true;
      elsif r.stock_available < r.requested then
        v_status := 'capped';
        v_qty := r.stock_available;
        v_unit_fils := round(r.price_aed * 100);
        v_line_fils := v_unit_fils * v_qty;
        v_plants_fils := v_plants_fils + v_line_fils;
        v_priceable := true;
      else
        v_status := 'ok';
        v_qty := r.requested;
        v_unit_fils := round(r.price_aed * 100);
        v_line_fils := v_unit_fils * v_qty;
        v_plants_fils := v_plants_fils + v_line_fils;
        v_priceable := true;
      end if;

      v_lines := v_lines || jsonb_build_object(
        'variant_id', r.variant_id,
        'species_name', coalesce(r.common_name, 'Unknown plant'),
        'size_tier', r.size_tier,
        'unit_price_aed', round(v_unit_fils / 100.0, 2),
        'requested_quantity', r.requested,
        'quantity', v_qty,
        'line_total_aed', round(v_line_fils / 100.0, 2),
        'status', v_status
      );
    end;
  end loop;

  -- No priceable line means no visit, so no service fee. An all-unavailable
  -- basket must total zero rather than showing a bare fee.
  if v_priceable then
    v_fee_fils := round(v_cadence.monthly_fee_aed * 100);
  end if;

  v_subtotal_fils := v_plants_fils + v_fee_fils;
  v_total_fils := round(v_subtotal_fils * v_term.price_multiplier);

  select min(price_multiplier) into v_cheapest_multiplier
    from public.rental_terms where active;
  v_cheapest_fils := round(v_subtotal_fils * coalesce(v_cheapest_multiplier, 1));

  -- The minimum binds only to a site the caller may actually see. A foreign or
  -- non-existent id falls back to guidance, so this cannot be used to probe
  -- whether someone else's site exists.
  if p_site_id is not null then
    select round(z.minimum_monthly_aed * 100) into v_minimum_fils
      from public.sites st
      join public.service_zones z on z.id = st.zone_id
     where st.id = p_site_id
       and (
         st.owner_account_id = auth.uid()
         or (st.organization_id is not null
             and public.org_role(st.organization_id) is not null)
         or public.is_operator()
       );
    if found then
      v_site_applied := true;
      v_meets := v_total_fils >= v_minimum_fils;
      v_shortfall_fils := greatest(v_minimum_fils - v_total_fils, 0);
    end if;
  end if;

  if not v_site_applied then
    -- Guidance only: show the smallest minimum any active zone requires.
    select coalesce(round(min(minimum_monthly_aed) * 100), 0) into v_minimum_fils
      from public.service_zones where active;
    v_meets := true;
    v_shortfall_fils := 0;
  end if;

  return jsonb_build_object(
    'currency', 'AED',
    'lines', v_lines,
    'plants_subtotal_aed', round(v_plants_fils / 100.0, 2),
    'service_fee_aed', round(v_fee_fils / 100.0, 2),
    'subtotal_aed', round(v_subtotal_fils / 100.0, 2),
    'term', jsonb_build_object(
      'id', v_term.id, 'months', v_term.months,
      'label', v_term.label, 'multiplier', v_term.price_multiplier),
    'cadence', jsonb_build_object(
      'id', v_cadence.id, 'code', v_cadence.code, 'label', v_cadence.label,
      'visits_per_month', v_cadence.visits_per_month,
      'monthly_fee_aed', v_cadence.monthly_fee_aed),
    'monthly_total_aed', round(v_total_fils / 100.0, 2),
    'cheapest_monthly_total_aed', round(v_cheapest_fils / 100.0, 2),
    'flexibility_cost_aed', round((v_total_fils - v_cheapest_fils) / 100.0, 2),
    'has_unavailable_lines', v_has_unavailable,
    'site_applied', v_site_applied,
    'minimum_monthly_aed', round(v_minimum_fils / 100.0, 2),
    'meets_minimum', v_meets,
    'shortfall_aed', round(v_shortfall_fils / 100.0, 2)
  );
end;
$$;

grant execute on function public.price_basket(jsonb, uuid, uuid, uuid)
  to anon, authenticated;

-- ── bundle pricing (FR-012) ──────────────────────────────────────────

create function public.bundle_price(p_bundle_id uuid)
returns jsonb
language sql
security definer
set search_path = ''
stable
as $$
  select public.price_basket(
    coalesce(
      (select jsonb_agg(jsonb_build_object('variant_id', bi.variant_id,
                                           'quantity', bi.quantity))
         from public.bundle_items bi where bi.bundle_id = p_bundle_id),
      '[]'::jsonb),
    null, null, null
  );
$$;

grant execute on function public.bundle_price(uuid) to anon, authenticated;

-- ── policies ─────────────────────────────────────────────────────────

alter table public.rental_terms enable row level security;

create policy "terms: public reads active"
  on public.rental_terms for select to anon, authenticated using (active);
create policy "terms: operator reads all"
  on public.rental_terms for select to authenticated
  using ((select public.is_operator()));
create policy "terms: operator writes"
  on public.rental_terms for insert to authenticated
  with check ((select public.is_operator()));
create policy "terms: operator updates"
  on public.rental_terms for update to authenticated
  using ((select public.is_operator()))
  with check ((select public.is_operator()));
create policy "terms: operator deletes"
  on public.rental_terms for delete to authenticated
  using ((select public.is_operator()));

alter table public.service_cadences enable row level security;

create policy "cadences: public reads active"
  on public.service_cadences for select to anon, authenticated using (active);
create policy "cadences: operator reads all"
  on public.service_cadences for select to authenticated
  using ((select public.is_operator()));
create policy "cadences: operator writes"
  on public.service_cadences for insert to authenticated
  with check ((select public.is_operator()));
create policy "cadences: operator updates"
  on public.service_cadences for update to authenticated
  using ((select public.is_operator()))
  with check ((select public.is_operator()));
create policy "cadences: operator deletes"
  on public.service_cadences for delete to authenticated
  using ((select public.is_operator()));

alter table public.bundles enable row level security;

create policy "bundles: public reads published"
  on public.bundles for select to anon, authenticated using (published);
create policy "bundles: operator reads all"
  on public.bundles for select to authenticated
  using ((select public.is_operator()));
create policy "bundles: operator writes"
  on public.bundles for insert to authenticated
  with check ((select public.is_operator()));
create policy "bundles: operator updates"
  on public.bundles for update to authenticated
  using ((select public.is_operator()))
  with check ((select public.is_operator()));
create policy "bundles: operator deletes"
  on public.bundles for delete to authenticated
  using ((select public.is_operator()));

alter table public.bundle_items enable row level security;

create policy "bundle items: public reads published"
  on public.bundle_items for select to anon, authenticated
  using (exists (select 1 from public.bundles b
                  where b.id = bundle_id and b.published));
create policy "bundle items: operator reads all"
  on public.bundle_items for select to authenticated
  using ((select public.is_operator()));
create policy "bundle items: operator writes"
  on public.bundle_items for insert to authenticated
  with check ((select public.is_operator()));
create policy "bundle items: operator updates"
  on public.bundle_items for update to authenticated
  using ((select public.is_operator()))
  with check ((select public.is_operator()));
create policy "bundle items: operator deletes"
  on public.bundle_items for delete to authenticated
  using ((select public.is_operator()));
