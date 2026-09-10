# Implementation Plan: Stock Ledger & Depot

**Branch**: `006-stock-ledger` | **Date**: 2026-09-10 | **Spec**: [spec.md](spec.md)

## Summary

Make plant consumption visible. Every change to stock becomes an immutable
movement with a reason, the three existing flows that mutate stock are rewritten
to go through it, a returned plant lands in recovery instead of straight back on
the shelf, and a replacement finally costs Planty the plant it costs in
reality. That last change is what makes the replacement rate — a number the PRD
calls a reason to change the palette or the pricing — computable at all.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+
**Primary Dependencies**: unchanged
**Storage**: migration `0009_stock_ledger.sql`; redefines the `stock_available` generated column
**Testing**: pgTAP for ledger reconciliation, the refusals and immutability; Vitest for depot arithmetic and rate presentation
**Constraints**: no per-plant identity, no suppliers, no costs, no stocktake
**Scale/Scope**: one table, six functions, three rewritten functions, one operator screen

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Route Density | ✅ N/A | No scheduling surface |
| II. B2B-First | ✅ N/A | Internal |
| III. Transparent Pricing | ✅ | Ready-to-send now excludes recovering plants, so the catalogue cannot offer a plant nobody would actually ship |
| IV. Proof of Service | ✅ | Fulfilment already records the visit; this adds what it cost |
| V. Honest Plant Promises | ✅ | **The point of the feature.** The guarantee has been free to the customer and invisible to the business; now every replaced plant leaves the fleet on the record |
| VI. Supabase-Native | ✅ | One function writes every count; movements are immutable by having no write policy; the metric is derived in the database |
| VII. Simplicity | ✅ | Per-plant identity is deferred with an argued reason and a stated trigger, rather than built because feature 001 once pointed here |
| VIII. Spec-Driven | ✅ | Coverage table in data-model.md |
| IX. Test What Matters | ✅ | Stock is the asset the business owns. Reconciliation of every count against its movements is asserted, as are the refusals and immutability |

**Post-Phase-1 re-check**: ✅ No departures. Complexity Tracking empty.

## Project Structure

```text
src/app/(ops)/ops/depot/page.tsx + depot-manager.tsx
src/lib/depot.ts + tests/unit/depot.test.ts
supabase/migrations/0009_stock_ledger.sql
supabase/tests/0009_stock_ledger.sql
```

## Phase 0 → [research.md](research.md) · Phase 1 → [data-model.md](data-model.md), [contracts/stock-ledger.md](contracts/stock-ledger.md), [quickstart.md](quickstart.md)

## Complexity Tracking

None. This plan closes the gap feature 005 recorded when it left a replacement
with no stock effect.
