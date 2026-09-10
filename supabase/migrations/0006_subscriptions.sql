-- Feature 003: checkout & subscription (spec FR-001..FR-017)
--
-- Three security-definer functions are the only write path. create_subscription
-- re-prices through price_basket() (the authority from 0005), checks the zone
-- minimum and installation day, reserves stock under row locks, and snapshots
-- everything the customer agreed to. Payment is by invoice; an operator records
-- it, and that transition is the seam a card processor's webhook will use.

create type public.subscription_status as enum ('pending', 'active', 'cancelled');
create type public.payment_method as enum ('invoice');

create sequence public.payment_reference_seq start 1000;

-- ── tables ───────────────────────────────────────────────────────────

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_account_id uuid references public.profiles (id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete cascade,
  site_id uuid not null references public.sites (id) on delete restrict,
  status public.subscription_status not null default 'pending',
  payment_method public.payment_method not null,
  payment_reference text not null unique,
  billing_email text not null check (billing_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  term_months smallint not null,
  term_label text not null,
  term_multiplier numeric(5,4) not null,
  cadence_code text not null,
  cadence_label text not null,
  cadence_fee_aed numeric(10,2) not null,
  plants_subtotal_aed numeric(10,2) not null,
  service_fee_aed numeric(10,2) not null,
  monthly_total_aed numeric(10,2) not null,
  quote jsonb not null,
  installation_date date not null,
  ends_on date not null,
  reserved_until timestamptz not null,
  stock_released boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_one_owner check (
    (owner_account_id is not null) <> (organization_id is not null)
  )
);

create index subscriptions_owner on public.subscriptions (owner_account_id);
create index subscriptions_org on public.subscriptions (organization_id);
create index subscriptions_status on public.subscriptions (status);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure extensions.moddatetime (updated_at);

create table public.subscription_lines (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions (id) on delete cascade,
  variant_id uuid not null references public.plant_variants (id) on delete restrict,
  species_name text not null,
  size_tier text,
  unit_price_aed numeric(10,2) not null,
  quantity integer not null check (quantity >= 1),
  line_total_aed numeric(10,2) not null
);

create index subscription_lines_sub on public.subscription_lines (subscription_id);

create table public.subscription_status_events (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions (id) on delete cascade,
  from_status public.subscription_status,
  to_status public.subscription_status not null,
  changed_by uuid references public.profiles (id),
  note text,
  changed_at timestamptz not null default now()
);

create index subscription_events_sub on public.subscription_status_events (subscription_id, changed_at);

create table public.operator_settings (
  key text primary key check (key ~ '^[a-z_]+$'),
  value text not null,
  updated_at timestamptz not null default now()
);

-- ── helpers ──────────────────────────────────────────────────────────

-- Who may act on a subscription as its customer.
create function public.can_access_subscription(target uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.subscriptions s
    where s.id = target
      and (
        s.owner_account_id = auth.uid()
        or (s.organization_id is not null
            and public.org_role(s.organization_id) is not null)
      )
  );
$$;

-- Today plus two Monday-to-Friday days, in Asia/Dubai.
create function public.min_installation_date()
returns date
language plpgsql
set search_path = ''
stable
as $$
declare
  d date := (now() at time zone 'Asia/Dubai')::date;
  working integer := 0;
begin
  while working < 2 loop
    d := d + 1;
    if extract(dow from d) between 1 and 5 then
      working := working + 1;
    end if;
  end loop;
  return d;
end;
$$;

grant execute on function public.min_installation_date() to anon, authenticated;

-- ── the order ────────────────────────────────────────────────────────

create function public.create_subscription(
  p_items jsonb,
  p_term_id uuid,
  p_cadence_id uuid,
  p_site_id uuid,
  p_installation_date date,
  p_billing_email text default null,
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

  -- Site must be the caller's, or their organization's, or the caller an operator.
  select * into v_site from public.sites where id = p_site_id;
  if not found or not (
       v_site.owner_account_id = caller
       or (v_site.organization_id is not null
           and public.org_role(v_site.organization_id) is not null)
       or public.is_operator()
     )
  then
    raise exception 'choose one of your own sites';
  end if;

  select * into v_zone from public.service_zones where id = v_site.zone_id;
  if not v_zone.active then
    raise exception 'we no longer serve this site''s area';
  end if;

  -- The authority prices it, now, with the site so the minimum applies.
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

  -- Billing email: given, else the organization's, else the profile's.
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

  -- Reserve stock under row locks, in a fixed order so two orders cannot
  -- deadlock. Each check happens with the row locked, so two orders cannot both
  -- see the last plant as available.
  select array_agg((l ->> 'variant_id')::uuid order by (l ->> 'variant_id')::uuid)
    into v_ids
    from jsonb_array_elements(v_quote -> 'lines') l
   where l ->> 'status' in ('ok', 'capped');

  perform 1 from public.plant_variants
   where id = any (v_ids) order by id for update;

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

    update public.plant_variants
       set stock_allocated = stock_allocated + v_qty
     where id = v_variant_id;
  end loop;

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
    v_site.organization_id,
    p_site_id, 'pending', 'invoice',
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
    now() + interval '7 days',
    caller
  );

  insert into public.subscription_lines
    (subscription_id, variant_id, species_name, size_tier, unit_price_aed, quantity, line_total_aed)
  select v_id,
         (l ->> 'variant_id')::uuid,
         l ->> 'species_name',
         l ->> 'size_tier',
         (l ->> 'unit_price_aed')::numeric,
         (l ->> 'quantity')::integer,
         (l ->> 'line_total_aed')::numeric
    from jsonb_array_elements(v_quote -> 'lines') l
   where l ->> 'status' in ('ok', 'capped');

  insert into public.subscription_status_events (subscription_id, from_status, to_status, changed_by)
  values (v_id, null, 'pending', caller);

  return v_id;
end;
$$;

grant execute on function public.create_subscription(jsonb, uuid, uuid, uuid, date, text, numeric)
  to authenticated;

-- ── lifecycle ────────────────────────────────────────────────────────

create function public.mark_subscription_paid(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.subscription_status;
begin
  if not public.is_operator() then
    raise exception 'only an operator can record a payment';
  end if;

  select status into v_status from public.subscriptions where id = p_id for update;
  if not found then
    raise exception 'subscription not found';
  end if;
  if v_status = 'active' then
    return;  -- already done; recording twice is harmless
  end if;
  if v_status = 'cancelled' then
    raise exception 'cannot activate a cancelled subscription';
  end if;

  update public.subscriptions set status = 'active' where id = p_id;
  insert into public.subscription_status_events (subscription_id, from_status, to_status, changed_by, note)
  values (p_id, 'pending', 'active', auth.uid(), 'payment recorded');
end;
$$;

grant execute on function public.mark_subscription_paid(uuid) to authenticated;

create function public.cancel_subscription(p_id uuid, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub public.subscriptions;
  v_operator boolean := public.is_operator();
begin
  select * into v_sub from public.subscriptions where id = p_id for update;
  if not found then
    raise exception 'subscription not found';
  end if;

  if not v_operator and not public.can_access_subscription(p_id) then
    raise exception 'subscription not found';
  end if;

  if v_sub.status = 'cancelled' then
    return;  -- idempotent
  end if;

  if v_sub.status = 'active' and not v_operator then
    raise exception 'active subscriptions are cancelled by Planty — contact us';
  end if;

  -- Release the reservation exactly once.
  if not v_sub.stock_released then
    update public.plant_variants v
       set stock_allocated = greatest(v.stock_allocated - l.quantity, 0)
      from public.subscription_lines l
     where l.subscription_id = p_id and v.id = l.variant_id;
  end if;

  update public.subscriptions
     set status = 'cancelled', stock_released = true
   where id = p_id;

  insert into public.subscription_status_events (subscription_id, from_status, to_status, changed_by, note)
  values (p_id, v_sub.status, 'cancelled', auth.uid(), p_note);
end;
$$;

grant execute on function public.cancel_subscription(uuid, text) to authenticated;

-- ── policies ─────────────────────────────────────────────────────────
-- No direct insert/update/delete for anyone: the functions above are the write path.

alter table public.subscriptions enable row level security;

create policy "subscriptions: customer reads own"
  on public.subscriptions for select to authenticated
  using (
    owner_account_id = (select auth.uid())
    or (organization_id is not null and public.org_role(organization_id) is not null)
    or (select public.is_operator())
  );

alter table public.subscription_lines enable row level security;

create policy "subscription lines: via parent"
  on public.subscription_lines for select to authenticated
  using (public.can_access_subscription(subscription_id) or (select public.is_operator()));

alter table public.subscription_status_events enable row level security;

create policy "subscription events: via parent"
  on public.subscription_status_events for select to authenticated
  using (public.can_access_subscription(subscription_id) or (select public.is_operator()));

alter table public.operator_settings enable row level security;

create policy "settings: signed-in reads"
  on public.operator_settings for select to authenticated using (true);

create policy "settings: operator writes"
  on public.operator_settings for insert to authenticated
  with check ((select public.is_operator()));

create policy "settings: operator updates"
  on public.operator_settings for update to authenticated
  using ((select public.is_operator()))
  with check ((select public.is_operator()));
