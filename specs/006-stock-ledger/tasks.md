---
description: "Task list for feature 006 — Stock Ledger & Depot"
---

# Tasks: Stock Ledger & Depot

**Input**: Design documents from `/specs/006-stock-ledger/`
**Tests**: Included — stock is the asset the business owns.

## Phase 1: Foundational

- [X] T001 Migration `supabase/migrations/0009_stock_ledger.sql`: `stock_reason` enum, `stock_recovering` column, redefined `stock_available` generated column, the replacement table CHECK, `stock_movements` with its index and select-only RLS
- [X] T002 Same migration: `record_stock_movement()` as the single writer, with the impossible-position guard
- [X] T003 Same migration: `receive_stock`, `write_off_stock`, `recover_stock`, `replacement_rate`, `depot_positions`
- [X] T004 Same migration: rewrite `create_subscription`, `cancel_subscription` and `fulfil_plant_change` to move stock only through the ledger; a replacement writes off a unit and refuses when none is ready to send
- [X] T005 Same migration: backfill movements for stock the seed already allocated, so the ledger reconciles from the first day
- [X] T006 [P] `src/lib/depot.ts`: count arithmetic, rate formatting against the target; `tests/unit/depot.test.ts`
- [X] T007 pgTAP `supabase/tests/0009_stock_ledger.sql`: every plant reconciles against its movements; each flow writes its movement; a replacement reduces owned and leaves allocated alone; a replacement with nothing ready is refused and writes nothing; a swap moves plants into recovering; over-write-off refused; movements cannot be updated or deleted; the rate is null on an empty fleet

## Phase 2: US1 — Seeing the burn rate

- [X] T008 [US1] `/ops/depot`: every plant with its four counts, the replacement rate against target, and a recent-movements ledger
- [X] T009 [US1] Receive, write off and recover actions with the database refusals shown verbatim

## Phase 3: Polish

- [X] T010 Full gate and the six quickstart checks; README status
