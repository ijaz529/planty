# Phase 1 Data Model: Visit Engine

**Feature**: `004-visit-engine` · **Date**: 2026-09-10

One migration, `0007_visits.sql`.

## Enumerated types

| Type | Values |
|---|---|
| `visit_status` | `planned`, `done`, `missed` |
| `plant_condition` | `healthy`, `needs_attention`, `declining`, `replaced` |

`planned` covers assigned and unassigned; a technician is either set or not.
Two statuses of "not yet happened" would be a distinction without a difference.

## `visits`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `subscription_id` | FK subscriptions cascade | |
| `site_id` | FK sites restrict | denormalised for the day list |
| `scheduled_date` | `date` not null | |
| `status` | `visit_status` not null default `planned` | |
| `technician_id` | FK profiles, nullable | |
| `sequence_no` | `smallint` nullable | route order within the day |
| `completed_at` | `timestamptz` nullable | |
| `completed_by` | FK profiles, nullable | |
| `note` | `text` | what was done, or why it was missed |
| `created_at` / `updated_at` | | |

Unique `(subscription_id, scheduled_date)` — the idempotency guarantee (FR-004).
Indexes on `(scheduled_date, sequence_no)` and `(technician_id, scheduled_date)`.

## `visit_plant_records`

| Column | Type |
|---|---|
| `id` | `uuid` PK |
| `visit_id` | FK visits cascade |
| `subscription_line_id` | FK subscription_lines restrict |
| `condition` | `plant_condition` not null |
| `note` | `text` |
| `recorded_at` | `timestamptz` |

Unique `(visit_id, subscription_line_id)` — one verdict per plant per visit.

## `visit_photos`

| Column | Type |
|---|---|
| `id` | `uuid` PK |
| `visit_id` | FK visits cascade |
| `storage_path` | `text` not null |
| `taken_by` | FK profiles |
| `taken_at` | `timestamptz` |

Bucket `visits`, private (research R4).

## Functions

| Function | Who | Purpose |
|---|---|---|
| `generate_visits(p_horizon_days int default 28)` | operator, cron | Idempotently materialise visits for active subscriptions |
| `assign_visit(p_visit_id, p_technician_id, p_sequence_no)` | operator | Set who goes and in what order |
| `complete_visit(p_visit_id, p_note)` | assigned technician, operator | Refuses without a photo and a condition per plant; stamps who and when |
| `miss_visit(p_visit_id, p_reason)` | assigned technician, operator | Records a visit that could not be done |
| `can_access_visit(p_visit_id)` | internal | Customer of the subscription, assigned technician, or operator |
| `technician_sees_site(p_site_id)` | internal | True while the caller has an unfinished visit at that site |

**Generation algorithm** per active subscription: start at the later of the
installation date and today; walk forward day by day to the horizon; keep a day
if its weekday is in the zone's `service_weekdays`; take every *n*th kept day
where *n* is 1 for a cadence of 4+ visits a month and 2 otherwise; stop at
`ends_on`; insert `on conflict do nothing`. Then delete `planned` visits with no
records belonging to subscriptions that are no longer active (FR-006).

**Named errors**: `add at least one photo before completing`,
`record a condition for every plant first`, `this visit is not yours`,
`this visit is already finished`.

## Changed from feature 001

`sites` select policy drops its blanket technician clause and gains
`public.technician_sees_site(id)` — the scheduled correction recorded in
feature 001's Complexity Tracking (research R2).

## Access

| Table | customer | technician | operator |
|---|---|---|---|
| `visits` | own subscriptions' | assigned only | all |
| `visit_plant_records` | via visit | via visit | all |
| `visit_photos` | via visit | via visit | all |
| `sites` | own / organization's | **only while assigned an unfinished visit** | all |

Writes go through the four functions.

## Requirement coverage

FR-001…007 → `generate_visits` + cron; FR-008…009 → day query, narrowed site
policy; FR-010…014 → records, photos, `complete_visit`, `miss_visit`;
FR-015…017 → customer feed and RLS; FR-018…019 → `assign_visit` and an
operator view of visits off their zone's served days.
