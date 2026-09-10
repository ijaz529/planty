---
description: "Task list for feature 005 — Replacements & Rotations"
---

# Tasks: Replacements & Rotations

**Input**: Design documents from `/specs/005-replacements-rotations/`
**Tests**: Included — the allowance arithmetic and stock movement are trust-critical.

## Phase 1: Foundational

- [X] T001 Migration `supabase/migrations/0008_change_requests.sql`: enums, `subscriptions.rotation_allowance`, `plant_change_requests` with the one-open-request-per-line partial unique index and the kind/target CHECK, RLS per data-model.md
- [X] T002 Same migration: `rotation_period_start`, `rotations_remaining` (derived, never stored), `request_plant_change`, `decide_plant_change`, `withdraw_plant_change`, `fulfil_plant_change` per the contract, with named errors
- [X] T003 Same migration: seed the `replacement_exclusions` operator setting
- [X] T004 [P] `src/lib/rotations.ts`: window arithmetic and labels; `tests/unit/rotations.test.ts`
- [X] T005 pgTAP `supabase/tests/0008_change_requests.sql`: remaining equals allowance minus open and fulfilled rotations in the window; declining and withdrawing restore it exactly; exhausting rotations never blocks a replacement; one open request per line; approval attaches to the next planned visit; fulfilment moves stock both ways; cross-customer isolation

## Phase 2: US1 — Ask for a replacement

- [X] T006 [US1] Care section on the subscription page: the guarantee, its exclusions from the operator setting, and plants flagged declining at the last visit offered for replacement
- [X] T007 [US1] Request form: pick a plant, give a reason, submit; the database refusal shown verbatim

## Phase 3: US2 — Spend a rotation

- [X] T008 [US2] Rotations remaining and renewal date on the same section
- [X] T009 [US2] Swap flow: pick the plant to change and an in-stock published plant to receive; refusal when none remain names the renewal date

## Phase 4: US3 — Planty acts

- [X] T010 [US3] `/ops/requests`: open requests oldest first with customer, site, plant, kind and reason; approve or decline with a note
- [X] T011 [US3] Technician stop shows approved work — what to bring, what to remove — and marks it carried out

## Phase 5: Polish

- [X] T012 Full gate and the six quickstart checks; README status
