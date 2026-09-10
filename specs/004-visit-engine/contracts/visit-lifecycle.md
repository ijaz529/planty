# Contract: Visit Lifecycle

**Feature**: `004-visit-engine` · **Date**: 2026-09-10

## States

```
planned ──complete (guarded)──▶ done
        └─miss (with reason)──▶ missed
```

`done` and `missed` are terminal in this release. Generation only ever creates
`planned`, and only ever deletes `planned` visits with no records.

## `generate_visits(horizon_days = 28) → integer`

Operator or cron. For each **active** subscription:

- Start at `max(installation_date, today)`, stop at `min(ends_on, today + horizon)`.
- Keep days whose weekday is in the site's zone `service_weekdays`.
- Take every *n*th kept day: *n* = 1 when `visits_per_month >= 4`, else 2.
- `insert … on conflict (subscription_id, scheduled_date) do nothing`.

Then delete `planned` visits with no plant records and no photos whose
subscription is no longer active. Returns the number of visits created.

## `assign_visit(visit_id, technician_id, sequence_no)`

Operator only. `technician_id` must hold the technician role, or be null to
unassign. Refuses on a finished visit.

## `complete_visit(visit_id, note) `

Assigned technician or operator. Refuses unless:

1. Status is `planned` — else `this visit is already finished`.
2. At least one photo — else `add at least one photo before completing`.
3. A condition row for every `subscription_lines` row — else
   `record a condition for every plant first`.

Sets `done`, `completed_at`, `completed_by`.

## `miss_visit(visit_id, reason)`

Assigned technician or operator. Requires a non-empty reason. Sets `missed`.

## Invariants the tests assert

1. No `done` visit without a photo and a full set of conditions (SC-001).
2. Every generated visit falls on a served weekday, within the term, at the
   cadence stride (SC-002).
3. Generating twice creates nothing the second time (SC-003).
4. A technician sees a site while assigned an unfinished visit and not after.
5. No visit is visible across customer or organization boundaries (SC-005).
