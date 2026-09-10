# Implementation Plan: Visit Engine

**Branch**: `004-visit-engine` | **Date**: 2026-09-10 | **Spec**: [spec.md](spec.md)

## Summary

Materialise visits from active subscriptions on the days each zone is served,
give technicians a day list they can work from a phone, and refuse to call a
visit done until it carries a photo and a verdict on every plant. The customer
sees that record. This feature also narrows technicians' sight of sites to the
stops they are actually assigned — the correction feature 001's plan scheduled.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+
**Primary Dependencies**: unchanged
**Storage**: migration `0007_visits.sql`; a private `visits` storage bucket; `pg_cron` for nightly generation
**Testing**: pgTAP for generation, the completion guard and the narrowed access; Vitest for the cadence stride helper
**Constraints**: no route optimisation, no notifications, no replacement workflow
**Scale/Scope**: one technician, tens of stops a week; three new screens

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Route Density | ✅ | Visits only ever fall on days the zone is already driven; the operator's day view is the density instrument |
| II. B2B-First | ✅ | The day list is built for an office round; nothing here is consumer-specific |
| III. Transparent Pricing | ✅ N/A | No pricing surface |
| IV. Proof of Service | ✅ | The feature. FR-012 makes the record a precondition of completion, enforced in the database, and the customer sees it |
| V. Honest Plant Promises | ✅ | A declining plant is recorded as declining. A missed visit is shown as missed with its reason rather than vanishing |
| VI. Supabase-Native | ✅ | Generation, assignment, completion and misses are database functions; RLS on every table; private bucket with a policy |
| VII. Simplicity | ✅ | No route optimisation, no time-of-day scheduling, no per-plant photos, no notifications, four-week horizon |
| VIII. Spec-Driven | ✅ | Coverage table in data-model.md |
| IX. Test What Matters | ✅ | Visit state transitions are constitution-named; the completion guard, the generation rules and the narrowed access are all pgTAP-asserted |

**Post-Phase-1 re-check**: ✅ Feature 001's recorded correction is discharged
here. Complexity Tracking is empty.

## Project Structure

```text
src/app/(tech)/today/page.tsx + stop-list.tsx        # a technician's day
src/app/(tech)/today/[visitId]/page.tsx + visit-form.tsx
src/app/(ops)/ops/visits/page.tsx + day-planner.tsx  # assign and order
src/app/(customer)/subscriptions/[id]/visits.tsx     # the proof feed
src/lib/visits.ts + tests/unit/visits.test.ts        # cadence stride, labels
supabase/migrations/0007_visits.sql
supabase/tests/0007_visits.sql
```

A `(tech)` route group joins `(customer)` and `(ops)` — the third audience the
product has, gated by the technician role.

## Phase 0 → [research.md](research.md) · Phase 1 → [data-model.md](data-model.md), [contracts/visit-lifecycle.md](contracts/visit-lifecycle.md), [quickstart.md](quickstart.md)

## Complexity Tracking

None. This plan discharges the departure feature 001 recorded.
