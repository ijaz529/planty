# Implementation Plan: Replacements & Rotations

**Branch**: `005-replacements-rotations` | **Date**: 2026-09-10 | **Spec**: [spec.md](spec.md)

## Summary

Give the customer the two things the front page promises: a plant that is
struggling gets replaced free, and a set number of swaps each quarter keeps the
planting seasonal. Both travel the same path — request, an operator's decision,
a technician carrying it out at the next visit — but they are opposite promises
and the product keeps them visibly apart. This feature also states the
guarantee's exclusions on the customer's own page, which the constitution has
required since feature 001 and no feature had yet delivered.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+
**Primary Dependencies**: unchanged
**Storage**: migration `0008_change_requests.sql`
**Testing**: pgTAP for the allowance arithmetic, refusals, approval routing and stock movement; Vitest for the rotation window helper
**Constraints**: no quantity changes, no re-pricing a live subscription, no notifications
**Scale/Scope**: one new table, six functions, two customer sections, one operator screen, one technician section

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Route Density | ✅ | Requests ride an existing visit rather than creating a special trip; approval attaches to the next planned stop |
| II. B2B-First | ✅ | The office manager is the requester; nothing here is consumer-specific |
| III. Transparent Pricing | ✅ | Replacement is free and says so; rotations are counted and the count is shown with its renewal date. The monthly price does not move, and the assumption says so plainly |
| IV. Proof of Service | ✅ | Fulfilment is recorded against the visit that did it, with who and when |
| V. Honest Plant Promises | ✅ | **This feature is principle V.** Rotation is a counted entitlement shown in the product and consumed when used; replacement is on decline; and the guarantee's exclusions finally appear in the customer's contract view |
| VI. Supabase-Native | ✅ | Six functions are the write path; RLS on the table; remaining rotations derived in the database |
| VII. Simplicity | ✅ | One table for both kinds, no stored counter, no notifications, no re-pricing |
| VIII. Spec-Driven | ✅ | Coverage table in data-model.md |
| IX. Test What Matters | ✅ | The allowance arithmetic and the stock movement are both money-adjacent state; both are pgTAP-asserted, including that a returned credit is exact |

**Post-Phase-1 re-check**: ✅ No departures. Complexity Tracking empty.

## Project Structure

```text
src/app/(customer)/subscriptions/[id]/care.tsx        # guarantee, exclusions, rotations, requests
src/app/(customer)/subscriptions/[id]/request-form.tsx
src/app/(ops)/ops/requests/page.tsx + triage.tsx
src/app/(tech)/today/[visitId]/jobs.tsx               # approved work at this stop
src/lib/rotations.ts + tests/unit/rotations.test.ts
supabase/migrations/0008_change_requests.sql
supabase/tests/0008_change_requests.sql
```

## Phase 0 → [research.md](research.md) · Phase 1 → [data-model.md](data-model.md), [contracts/change-request-lifecycle.md](contracts/change-request-lifecycle.md), [quickstart.md](quickstart.md)

## Complexity Tracking

None.
