# Phase 1 Data Model: Configure & Price

**Feature**: `002-configure-and-price` · **Date**: 2026-09-10

One migration, `0005_pricing.sql`. Money is `numeric(10,2)` in AED. All new
tables have Row Level Security enabled.

---

## 1. `rental_terms`

An offered commitment length and what it does to the monthly price.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `months` | `smallint` | not null, unique, `CHECK (between 1 and 36)` |
| `label` | `text` | not null |
| `price_multiplier` | `numeric(5,4)` | not null, `CHECK (between 0.5000 and 2.0000)` |
| `is_default` | `boolean` | not null, default `false` |
| `active` | `boolean` | not null, default `true` |
| `sort_order` | `smallint` | not null, default 0 |

Partial unique index: exactly one row may have `is_default` true among active
rows.

Seeded: 3 months × 1.15, 6 months × 1.07, 12 months × 1.00 (default). The
longest term is the 1.00 anchor, so shorter terms read as a premium for
flexibility rather than longer terms reading as a discount.

## 2. `service_cadences`

How often a technician comes, and the recurring fee that carries.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `code` | `text` | not null, unique, `CHECK (code ~ '^[a-z_]+$')` |
| `label` | `text` | not null |
| `visits_per_month` | `numeric(4,2)` | not null, `CHECK (> 0)` |
| `monthly_fee_aed` | `numeric(10,2)` | not null, `CHECK (>= 0)` |
| `is_default` | `boolean` | not null, default `false` |
| `active` | `boolean` | not null, default `true` |
| `sort_order` | `smallint` | not null, default 0 |

Partial unique index on the single active default, as above.

Seeded: `weekly` at 4.33 visits and AED 250; `fortnightly` at 2.17 visits and
AED 150 (default). Weekly is the Dubai market norm but the research prefers the
longer cadence on cost grounds, so the default is fortnightly and weekly is the
paid upgrade — which is what constitution "cadence is a priced tier" requires.

## 3. `service_zones` — added column

| Column | Type | Constraints |
|---|---|---|
| `minimum_monthly_aed` | `numeric(10,2)` | not null, default 0, `CHECK (>= 0)` |

Satisfies FR-015. Seeded at AED 400 for both zones.

## 4. `bundles` and `bundle_items`

### `bundles`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | not null, `CHECK (char_length between 2 and 80)` |
| `suits` | `text` | not null — who it is for, in a customer's words |
| `description` | `text` | nullable |
| `published` | `boolean` | not null, default `false` |
| `sort_order` | `smallint` | not null, default 0 |
| `created_at` / `updated_at` | `timestamptz` | not null, default `now()` |

**No price column** (research R5). A bundle's price is computed from its items.

### `bundle_items`

| Column | Type | Constraints |
|---|---|---|
| `bundle_id` | `uuid` | references `bundles(id)` on delete cascade |
| `variant_id` | `uuid` | references `plant_variants(id)` on delete cascade |
| `quantity` | `smallint` | not null, `CHECK (between 1 and 500)` |
| | | PK `(bundle_id, variant_id)` |

---

## 5. `price_basket()` — the pricing authority

```
price_basket(
  p_items      jsonb,   -- [{"variant_id": uuid, "quantity": int}, ...]
  p_term_id    uuid default null,     -- null → the active default
  p_cadence_id uuid default null,     -- null → the active default
  p_site_id    uuid default null      -- null → minimum is guidance only
) returns jsonb
```

`stable`, `security definer`, `set search_path = ''`, executable by `anon` and
`authenticated`.

**Algorithm**, in fils (integer hundredths) throughout:

1. Resolve term and cadence; fall back to the active default when null or
   inactive. Unknown ids are treated as null rather than raising, so a stale
   basket reprices instead of erroring.
2. For each item, join `plant_variants`. Classify each line:
   - `ok` — published with `stock_available >= quantity`
   - `capped` — published, `0 < stock_available < quantity`; quantity is reduced
     to `stock_available` and the original is reported
   - `unavailable` — unpublished, or `stock_available = 0`
3. Line total = unit price in fils × effective quantity. Rounded per line
   (research R2).
4. `plants_subtotal` = sum of `ok` and `capped` line totals. Unavailable lines
   contribute nothing.
5. `service_fee` = the cadence's monthly fee. Charged only when at least one
   line is priceable, so an all-unavailable basket totals zero rather than
   showing a bare fee.
6. `subtotal` = `plants_subtotal + service_fee`.
7. `monthly_total` = `round(subtotal × term multiplier)`, one rounding.
8. `cheapest_monthly_total` = the same subtotal at the lowest active multiplier;
   `flexibility_cost` = `monthly_total − cheapest_monthly_total` (FR-009).
9. Minimum: if `p_site_id` is given **and** the caller may see that site, read
   its zone's `minimum_monthly_aed`, set `meets_minimum` and `shortfall`.
   Otherwise return the minimum as guidance with `site_applied = false`.

**Returned shape**:

```json
{
  "currency": "AED",
  "lines": [{
    "variant_id": "…", "species_name": "Snake plant", "size_tier": "desk",
    "unit_price_aed": 55.00, "requested_quantity": 4, "quantity": 4,
    "line_total_aed": 220.00, "status": "ok"
  }],
  "plants_subtotal_aed": 220.00,
  "service_fee_aed": 150.00,
  "subtotal_aed": 370.00,
  "term": {"id": "…", "months": 12, "label": "12 months", "multiplier": 1.0},
  "cadence": {"id": "…", "code": "fortnightly", "label": "Every 2 weeks",
              "visits_per_month": 2.17, "monthly_fee_aed": 150.00},
  "monthly_total_aed": 370.00,
  "cheapest_monthly_total_aed": 370.00,
  "flexibility_cost_aed": 0.00,
  "has_unavailable_lines": false,
  "site_applied": false,
  "minimum_monthly_aed": 400.00,
  "meets_minimum": false,
  "shortfall_aed": 30.00
}
```

**Invariant the tests assert**: the sum of `line_total_aed` equals
`plants_subtotal_aed`, and `round((plants_subtotal + service_fee) × multiplier)`
equals `monthly_total_aed`. This is SC-003.

## 6. `bundle_price()`

```
bundle_price(p_bundle_id uuid) returns jsonb
```

Builds the item array from `bundle_items` and delegates to `price_basket` with
the default term and cadence. A bundle therefore cannot advertise a price its
contents do not produce (FR-012). Returns `has_unavailable_lines` so the
interface can mark a bundle temporarily unavailable (FR-014).

---

## 7. Access

| Table | anon | authenticated | operator |
|---|---|---|---|
| `rental_terms` | select where `active` | select where `active` | all |
| `service_cadences` | select where `active` | select where `active` | all |
| `bundles` | select where `published` | select where `published` | all |
| `bundle_items` | select where parent published | same | all |
| `service_zones.minimum_monthly_aed` | via existing zone policies | same | all |

Only operators write any of these. Both functions are granted to `anon` and
`authenticated`.

---

## 8. Requirement coverage

| Requirement | Where satisfied |
|---|---|
| FR-001 … FR-004 | Client basket (R3) plus line classification in `price_basket` step 2 |
| FR-005 … FR-006 | `price_basket`, called by the client for the authoritative number |
| FR-007 | `rental_terms`, `service_cadences`, operator-writable |
| FR-008, FR-009 | Returned shape; `flexibility_cost_aed` |
| FR-010 | Basket stores no prices (R3); every load reprices |
| FR-011 … FR-014 | `bundles`, `bundle_items`, `bundle_price()` |
| FR-015 … FR-018 | `service_zones.minimum_monthly_aed`, step 9 |
| SC-002 | Shared fixtures asserted against both implementations |
| SC-003 | Per-line rounding, single multiplier rounding |
