# Phase 1 Data Model: Stock Ledger & Depot

**Feature**: `006-stock-ledger` · **Date**: 2026-09-10

One migration, `0009_stock_ledger.sql`.

## Enumerated type

`stock_reason`: `received`, `allocated`, `released`, `replaced`, `rotated_out`,
`rotated_in`, `recovered`, `written_off`, `lost`, `adjusted`.

## `plant_variants` — changed

| Column | Change |
|---|---|
| `stock_recovering` | **new** `integer not null default 0 check (>= 0)` |
| `stock_available` | **redefined** as `stock_total − stock_allocated − stock_recovering` |

Table `CHECK` replaces the old one: `stock_allocated + stock_recovering <= stock_total`
(FR-006).

## `stock_movements`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `variant_id` | FK plant_variants restrict | |
| `reason` | `stock_reason` not null | |
| `delta_total` / `delta_allocated` / `delta_recovering` | `integer` not null default 0 | signed |
| `subscription_id` | FK subscriptions set null | where there is one |
| `request_id` | FK plant_change_requests set null | where there is one |
| `note` | `text` | |
| `created_by` | FK profiles | |
| `created_at` | `timestamptz` not null default now() | |

`CHECK`: at least one delta is non-zero. Index on `(variant_id, created_at desc)`.
Immutable: no update or delete policy exists for any role (FR-002, SC-006).

## Functions

| Function | Who | Purpose |
|---|---|---|
| `record_stock_movement(variant_id, reason, d_total, d_allocated, d_recovering, subscription_id, request_id, note)` | internal, operator | The only writer of counts. Applies the deltas and writes the row; raises when the result would be impossible |
| `receive_stock(variant_id, quantity, note)` | operator | A delivery arrives |
| `write_off_stock(variant_id, quantity, note)` | operator | A plant leaves the fleet |
| `recover_stock(variant_id, quantity, note)` | operator | Recovering plants become ready to send |
| `replacement_rate(p_days default 30)` | operator | Written-off units over the average fleet, or null |
| `depot_positions()` | operator | Every plant with its four counts and recent movement |

**Rewritten to use the ledger**: `create_subscription` (allocated),
`cancel_subscription` (released), `fulfil_plant_change` (rotated_in,
rotated_out, replaced).

**Named errors**: `only an operator can change stock`,
`not enough <plant> ready to send`, `cannot write off more than the depot holds`,
`quantity must be at least one`.

## Access

| Table | customer | technician | operator |
|---|---|---|---|
| `stock_movements` | ✗ | ✗ | select |

No insert, update or delete policy for anyone: the functions are the only path,
and nothing may rewrite history.

## Requirement coverage

FR-001…004 → `stock_movements`, `record_stock_movement`, no write policies.
FR-005…007 → the four counts, the table CHECK, the three operator functions.
FR-008…010 → the rewritten `fulfil_plant_change`.
FR-011…012 → `replacement_rate`.
