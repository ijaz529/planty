# Phase 1 Data Model: Checkout & Subscription

**Feature**: `003-checkout-subscription` · **Date**: 2026-09-10

One migration, `0006_subscriptions.sql`. All new tables have RLS enabled. Money
is `numeric(10,2)` AED.

## Enumerated types

| Type | Values |
|---|---|
| `subscription_status` | `pending`, `active`, `cancelled` |
| `payment_method` | `invoice` (seam for `card` later) |

## `subscriptions`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK |
| `owner_account_id` | `uuid` | FK profiles, nullable |
| `organization_id` | `uuid` | FK organizations, nullable |
| `site_id` | `uuid` | FK sites on delete restrict, not null |
| `status` | `subscription_status` | not null, default `pending` |
| `payment_method` | `payment_method` | not null |
| `payment_reference` | `text` | not null, unique — `PL-000123` from a sequence |
| `billing_email` | `text` | not null, email `CHECK` |
| `term_months` / `term_label` / `term_multiplier` | snapshot | not null |
| `cadence_code` / `cadence_label` / `cadence_fee_aed` | snapshot | not null |
| `plants_subtotal_aed` / `service_fee_aed` / `monthly_total_aed` | `numeric(10,2)` | not null |
| `quote` | `jsonb` | not null — the full `price_basket()` result |
| `installation_date` | `date` | not null |
| `ends_on` | `date` | not null — installation + term months |
| `reserved_until` | `timestamptz` | not null — creation + 7 days |
| `stock_released` | `boolean` | not null default false |
| `created_by` | `uuid` | FK profiles |
| `created_at` / `updated_at` | `timestamptz` | |

`CHECK`: exactly one of `owner_account_id`, `organization_id`.

## `subscription_lines`

| Column | Type |
|---|---|
| `id` | `uuid` PK |
| `subscription_id` | FK subscriptions on delete cascade |
| `variant_id` | FK plant_variants on delete restrict |
| `species_name`, `size_tier` | snapshot text |
| `unit_price_aed`, `quantity`, `line_total_aed` | snapshot |

## `subscription_status_events`

| Column | Type |
|---|---|
| `id` | `uuid` PK |
| `subscription_id` | FK cascade |
| `from_status` | nullable enum |
| `to_status` | enum |
| `changed_by` | FK profiles, nullable |
| `note` | text |
| `changed_at` | timestamptz |

Append-only. Satisfies FR-011.

## `operator_settings`

`key text PK`, `value text`, `updated_at`. Seeded key: `bank_details`.

## Functions

| Function | Who | Purpose |
|---|---|---|
| `min_installation_date()` | any | Today plus two Mon–Fri days |
| `create_subscription(p_items, p_term_id, p_cadence_id, p_site_id, p_installation_date, p_billing_email, p_expected_total)` | authenticated | The order. Re-prices, checks minimum, site ownership, zone active, date validity, billing email; locks and reserves stock; snapshots; returns id |
| `mark_subscription_paid(p_id)` | operator | `pending → active`, idempotent on `active` |
| `cancel_subscription(p_id, p_note)` | owner/member if pending; operator any | `→ cancelled`, releases stock once; idempotent |

**Errors named for the interface**: `price changed: now AED X`,
`below minimum: short by AED X`, `not enough <plant> in stock`,
`installation must be on a day we serve <zone>`, `earliest installation is <date>`,
`a billing email is required`, `we no longer serve this site's area`.

## State machine

```
(create) ──▶ pending ──mark paid (operator)──▶ active ──cancel (operator)──▶ cancelled
                │                                                                ▲
                └──cancel (customer or operator; releases stock)─────────────────┘
```

## Access

| Table | customer | operator |
|---|---|---|
| `subscriptions` | select own + organizations' | select all |
| `subscription_lines` | via parent | all |
| `subscription_status_events` | via parent | all |
| `operator_settings` | select | select, update |

No direct insert/update/delete on subscriptions for anyone: the three functions
are the only write path.

## Requirement coverage

FR-001…007 → `create_subscription`; FR-008 → `payment_method`, reference,
`operator_settings`; FR-009 → `mark_subscription_paid`; FR-010 →
`reserved_until` + operator cancel; FR-011 → events; FR-012…014 → transition
guards in the two functions; FR-015 → columns; FR-016…017 → RLS.
