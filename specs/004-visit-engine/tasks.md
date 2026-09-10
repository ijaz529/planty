---
description: "Task list for feature 004 — Visit Engine"
---

# Tasks: Visit Engine

**Input**: Design documents from `/specs/004-visit-engine/`
**Tests**: Included — visit state transitions are constitution-named trust paths.

## Phase 1: Foundational

- [X] T001 Migration `supabase/migrations/0007_visits.sql`: enums, `visits`, `visit_plant_records`, `visit_photos`, the private `visits` bucket, indexes and the idempotency unique key
- [X] T002 Same migration: `can_access_visit`, `technician_sees_site`, `generate_visits`, `assign_visit`, `complete_visit`, `miss_visit` per the contract, with named errors
- [X] T003 Same migration: narrow the `sites` select policy — replace the blanket technician clause with `technician_sees_site(id)` (feature 001's recorded correction)
- [X] T004 Same migration: schedule `generate_visits()` nightly with `pg_cron`
- [X] T005 Extend `supabase/seed.sql`: activate a Northwind subscription and generate its visits so there is a route on day one
- [X] T006 [P] `src/lib/visits.ts`: cadence stride, condition labels, day formatting; `tests/unit/visits.test.ts`
- [X] T007 pgTAP `supabase/tests/0007_visits.sql`: generation lands only on served weekdays within the term at the right stride; re-running creates nothing; cancelling removes planned visits and keeps done ones; completion refused without a photo and without full conditions; a technician sees an assigned site and stops seeing it once done; cross-customer isolation

## Phase 2: US1 — The technician's day

- [X] T008 [US1] `(tech)` route group with a technician-role gate
- [X] T009 [US1] `/today`: the day's stops in route order with site, address, access notes and expected plants
- [X] T010 [US1] `/today/[visitId]`: per-plant condition control, photo upload to the private bucket, complete and miss actions with the database's refusal surfaced verbatim

## Phase 3: US2 — The customer's proof

- [X] T011 [US2] Visit feed on the subscription page: each visit with date, status, conditions, notes and signed photo URLs, newest first; next visit date for an active subscription

## Phase 4: US3 — Generation and planning

- [X] T012 [US3] `/ops/visits`: pick a day, see its stops, assign a technician, set order, run generation on demand, and list visits that no longer fall on a served day

## Phase 5: Polish

- [X] T013 Full gate and the five quickstart checks; README status
