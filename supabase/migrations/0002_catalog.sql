-- Feature 001 US2: plant catalog (spec FR-020..FR-027)
-- Species, priced size variants, price history, and the publish guard.
-- Published variants are readable by anon: transparent pricing with no account
-- is constitution principle III and success criterion SC-002.

-- ── species ──────────────────────────────────────────────────────────

create table public.plant_species (
  id uuid primary key default gen_random_uuid(),
  common_name text not null check (char_length(common_name) between 2 and 80),
  botanical_name text not null check (char_length(botanical_name) between 2 and 120),
  light_requirement public.light_requirement not null,
  watering_interval_days smallint not null check (watering_interval_days between 1 and 60),
  pet_safe boolean not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger plant_species_updated_at
  before update on public.plant_species
  for each row execute procedure extensions.moddatetime (updated_at);

-- ── variants ─────────────────────────────────────────────────────────

create table public.plant_variants (
  id uuid primary key default gen_random_uuid(),
  species_id uuid not null references public.plant_species (id) on delete cascade,
  size_tier public.size_tier,
  height_min_cm smallint check (height_min_cm > 0),
  height_max_cm smallint,
  photo_path text,
  price_aed numeric(10,2) check (price_aed > 0),
  stock_total integer not null default 0 check (stock_total >= 0),
  stock_allocated integer not null default 0 check (stock_allocated >= 0),
  stock_available integer generated always as (stock_total - stock_allocated) stored,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plant_variants_height_range check (
    height_max_cm is null or height_min_cm is null or height_max_cm >= height_min_cm
  ),
  -- FR-026: stock can never be set below what is already out with customers.
  constraint plant_variants_stock_sane check (stock_allocated <= stock_total)
);

-- One sellable variant per size band per species.
create unique index plant_variants_species_tier
  on public.plant_variants (species_id, size_tier)
  where size_tier is not null;

create index plant_variants_published on public.plant_variants (published)
  where published;

create trigger plant_variants_updated_at
  before update on public.plant_variants
  for each row execute procedure extensions.moddatetime (updated_at);

-- ── price history ────────────────────────────────────────────────────

create table public.plant_variant_price_history (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.plant_variants (id) on delete cascade,
  price_aed numeric(10,2) not null,
  changed_by uuid references public.profiles (id),
  changed_at timestamptz not null default now()
);

create index plant_variant_price_history_variant
  on public.plant_variant_price_history (variant_id, changed_at desc);

create function public.record_variant_price()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.price_aed is not null
     and (tg_op = 'INSERT' or new.price_aed is distinct from old.price_aed)
  then
    insert into public.plant_variant_price_history (variant_id, price_aed, changed_by)
    values (new.id, new.price_aed, auth.uid());
  end if;
  return new;
end;
$$;

create trigger plant_variants_price_history
  after insert or update of price_aed on public.plant_variants
  for each row execute procedure public.record_variant_price();

-- ── publish eligibility ──────────────────────────────────────────────
-- One function is the single definition of "complete", used by both the guard
-- below and the operator interface, so the two can never disagree (research R5).

create function public.variant_publish_gaps(target_variant_id uuid)
returns text[]
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(
    array_remove(array[
      case when v.size_tier is null then 'a size tier' end,
      case when v.photo_path is null or v.photo_path = '' then 'a photo' end,
      case when v.price_aed is null then 'a monthly price' end,
      case when v.height_min_cm is null or v.height_max_cm is null then 'a height range' end
    ], null),
    array[]::text[]
  )
  from public.plant_variants v
  where v.id = target_variant_id;
$$;

create function public.guard_variant_publish()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  gaps text[];
begin
  if new.published and not old.published then
    gaps := public.variant_publish_gaps(new.id);
    if array_length(gaps, 1) > 0 then
      raise exception 'cannot publish: this variant still needs %',
        array_to_string(gaps, ', ');
    end if;
  end if;
  return new;
end;
$$;

create trigger plant_variants_guard_publish
  before update on public.plant_variants
  for each row execute procedure public.guard_variant_publish();

-- ── plant_species policies ───────────────────────────────────────────

alter table public.plant_species enable row level security;

-- FR-023: a species is public once it has at least one published variant.
create policy "species: public read of published"
  on public.plant_species for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.plant_variants v
      where v.species_id = plant_species.id and v.published
    )
  );

create policy "species: operator reads all"
  on public.plant_species for select
  to authenticated
  using ((select public.is_operator()));

create policy "species: operator writes"
  on public.plant_species for insert
  to authenticated
  with check ((select public.is_operator()));

create policy "species: operator updates"
  on public.plant_species for update
  to authenticated
  using ((select public.is_operator()))
  with check ((select public.is_operator()));

create policy "species: operator deletes"
  on public.plant_species for delete
  to authenticated
  using ((select public.is_operator()));

-- ── plant_variants policies ──────────────────────────────────────────

alter table public.plant_variants enable row level security;

create policy "variants: public read of published"
  on public.plant_variants for select
  to anon, authenticated
  using (published);

create policy "variants: operator reads all"
  on public.plant_variants for select
  to authenticated
  using ((select public.is_operator()));

create policy "variants: operator writes"
  on public.plant_variants for insert
  to authenticated
  with check ((select public.is_operator()));

create policy "variants: operator updates"
  on public.plant_variants for update
  to authenticated
  using ((select public.is_operator()))
  with check ((select public.is_operator()));

create policy "variants: operator deletes"
  on public.plant_variants for delete
  to authenticated
  using ((select public.is_operator()));

-- ── price history policies ───────────────────────────────────────────
-- Append-only: written by trigger, readable by operators, rewritable by nobody.

alter table public.plant_variant_price_history enable row level security;

create policy "price history: operator reads"
  on public.plant_variant_price_history for select
  to authenticated
  using ((select public.is_operator()));

-- ── catalog images ───────────────────────────────────────────────────
-- Public read because the published catalog is public; operator-only write.

insert into storage.buckets (id, name, public)
values ('catalog', 'catalog', true)
on conflict (id) do nothing;

create policy "catalog images: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'catalog');

create policy "catalog images: operator uploads"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'catalog' and (select public.is_operator()));

create policy "catalog images: operator replaces"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'catalog' and (select public.is_operator()));

create policy "catalog images: operator deletes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'catalog' and (select public.is_operator()));
