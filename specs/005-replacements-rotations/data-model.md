# Phase 1 Data Model: Replacements & Rotations

**Feature**: `005-replacements-rotations` · **Date**: 2026-09-10

One migration, `0008_change_requests.sql`.

## Enumerated types

| Type | Values |
|---|---|
| `change_kind` | `replacement`, `rotation` |
| `change_status` | `requested`, `approved`, `declined`, `fulfilled`, `withdrawn` |

## `subscriptions` — added column

| Column | Type | Notes |
|---|---|---|
| `rotation_allowance` | `smallint` not null default 2, `CHECK (between 0 and 12)` | Rotations per 90-day window; operator-editable (FR-009) |

## `plant_change_requests`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `subscription_id` | FK subscriptions cascade | |
| `subscription_line_id` | FK subscription_lines restrict | the plant being changed |
| `kind` | `change_kind` not null | |
| `requested_variant_id` | FK plant_variants, nullable | what they want instead; rotations only |
| `reason` | `text` | |
| `status` | `change_status` not null default `requested` | |
| `visit_id` | FK visits set null | set on approval (FR-011) |
| `decided_by` / `decided_at` / `decision_note` | | operator's answer |
| `fulfilled_at` / `fulfilled_by` | | technician's action |
| `requested_by` / `created_at` / `updated_at` | | |

Partial unique index: at most one **open** request per line —
`unique (subscription_line_id) where status in ('requested','approved')` (FR-003).

`CHECK`: a `rotation` must name a `requested_variant_id`; a `replacement` must not.

## Functions

| Function | Who | Purpose |
|---|---|---|
| `rotation_period_start(p_subscription_id)` | any | Start of the current 90-day window from installation |
| `rotations_remaining(p_subscription_id)` | any | Allowance minus non-returned rotations in the window (R3) |
| `request_plant_change(p_line_id, p_kind, p_requested_variant_id, p_reason)` | customer | Creates a request; refuses a rotation with none left, naming the renewal date |
| `decide_plant_change(p_request_id, p_approve, p_note)` | operator | Approves onto the next planned visit, or declines |
| `withdraw_plant_change(p_request_id)` | customer | While unfulfilled; returns the credit by state alone |
| `fulfil_plant_change(p_request_id)` | assigned technician, operator | Marks carried out and moves stock (R4) |

**Named errors**: `no rotations left until <date>`, `that plant already has an
open request`, `choose a plant that is in stock`, `this subscription is not
active`, `only an operator can decide a request`, `not enough <plant> in stock`.

## Access

| Table | customer | technician | operator |
|---|---|---|---|
| `plant_change_requests` | own subscriptions' | those on a visit assigned to them | all |

Writes go through the four functions.

## Requirement coverage

FR-001…004 → `request_plant_change` with `kind='replacement'`, the declining-
plant hint from `visit_plant_records`, the partial unique index, and the
`replacement_exclusions` setting. FR-005…009 → `rotation_allowance`,
`rotations_remaining`, refusal message, derived credits, operator edit.
FR-010…014 → `decide_plant_change`, `visit_id`, `fulfil_plant_change`, the
decided/fulfilled columns, and RLS.
