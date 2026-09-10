# Implementation Plan: Checkout & Subscription

**Branch**: `003-checkout-subscription` | **Date**: 2026-09-10 | **Spec**: [spec.md](spec.md)

## Summary

Turn a priced basket into a commitment. A single database function re-prices
the basket, checks the zone minimum, validates the installation day against the
zone's service days, reserves stock under row locks, and snapshots everything
the customer agreed to. Payment is by invoice — the launch customer is an
office — and an operator records it, which is also the seam a card processor
will use later. Customers see and can cancel pending subscriptions; operators
run the lifecycle.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+
**Primary Dependencies**: unchanged — Next.js 16, React 19, Supabase, Tailwind v4, Zod
**Storage**: one migration `0006_subscriptions.sql`
**Testing**: pgTAP for the lifecycle, stock and RLS; Vitest for the installation-day mirror
**Constraints**: no payment processor (R1); no recurring billing; no visits
**Scale/Scope**: three customer screens, one operator screen, three functions

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Route Density | ✅ | The order is refused below the zone minimum and on days the zone is not served — both enforced in `create_subscription` |
| II. B2B-First | ✅ | Invoice payment is the office's method and the only one shipped; organization-owned subscriptions use the organization's billing email |
| III. Transparent Pricing | ✅ | Re-priced by the authority at ordering; a changed price is surfaced and confirmed, never silently charged (FR-004) |
| IV. Proof of Service | ✅ N/A-forward | Active subscriptions are what 004 generates visits from |
| V. Honest Promises | ✅ | Unavailable lines are disclosed before confirmation; stock is reserved atomically so an order cannot promise a plant that is not there |
| VI. Supabase-Native | ✅ | All writes through three security-definer functions; no direct table writes; RLS on all tables |
| VII. Simplicity | ✅ | No processor, no recurring billing, no renewal, no visits, one-row settings table for bank details |
| VIII. Spec-Driven | ✅ | Coverage table in data-model.md |
| IX. Test What Matters | ✅ | Subscription state transitions and stock allocation are named trust-critical; both are pgTAP-asserted including the over-allocation rollback |

**Post-Phase-1 re-check**: ✅ No departures. Complexity Tracking empty.

## Project Structure

```text
src/app/(customer)/checkout/page.tsx + checkout-form.tsx     # confirm, day picker, place order
src/app/(customer)/subscriptions/page.tsx                    # list
src/app/(customer)/subscriptions/[id]/page.tsx + actions.tsx # detail, cancel
src/app/(ops)/ops/subscriptions/page.tsx + manager.tsx       # mark paid, cancel, bank details
src/lib/installation.ts                                      # candidate days mirror
tests/unit/installation.test.ts
supabase/migrations/0006_subscriptions.sql
supabase/tests/0006_subscriptions.sql
```

Basket "Continue" routes to `/checkout`; the header gains "Subscriptions".

## Phase 0 → [research.md](research.md) · Phase 1 → [data-model.md](data-model.md), [contracts/subscription-lifecycle.md](contracts/subscription-lifecycle.md), [quickstart.md](quickstart.md)

## Complexity Tracking

None.
