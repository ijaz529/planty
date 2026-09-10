# Implementation Plan: Configure & Price

**Branch**: `002-configure-and-price` | **Date**: 2026-09-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-configure-and-price/spec.md`

## Summary

Turn feature 001's published price list into an answer to "what would this cost
me?" A visitor with no account builds a basket, picks a term and a cadence, and
watches an exact monthly total. Starter bundles get someone who has never bought
office plants to a number in one click. A signed-in customer attaches the basket
to one of their sites, and the zone minimum refuses a basket that would not pay
for the visit.

The pricing rule lives in Postgres and is the authority. A TypeScript mirror
keeps the basket responsive while someone drags quantities around, and a single
shared fixture file is run against **both** implementations so they cannot drift.
Nothing here takes money.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+
**Primary Dependencies**: Next.js 16 (App Router), React 19, `@supabase/supabase-js` v2, `@supabase/ssr`, Tailwind CSS v4, Zod v4
**Storage**: Supabase Postgres; one migration `supabase/migrations/0005_pricing.sql`; the basket itself lives in `localStorage`
**Testing**: Vitest over the pricing mirror and basket helpers; pgTAP over the pricing function, its access rules and the new policies; one shared fixture file drives both
**Target Platform**: Mobile-first responsive web, evergreen browsers
**Project Type**: Web application — the existing single Next.js codebase
**Performance Goals**: A quantity change repaints the total with no perceptible wait (mirror computes locally); the authoritative price settles within one round trip
**Constraints**: No payment, order or stock allocation. No price level encoded in code — every price, fee and multiplier is operator-editable data, per the constitution's live obligation that Planty's prices are still a hypothesis
**Scale/Scope**: Tens of catalogue variants, a handful of bundles, baskets of at most a few dozen lines; 4 new screens plus one operator screen

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Route Density Is the Business | ✅ | The zone minimum is the point of US3. A basket that would not pay for a visit is refused by the pricing authority, with the shortfall named. `minimum_monthly_aed` lands on the zone, so density is enforced per area rather than globally |
| II. B2B-First, B2C Only On An Existing Route | ✅ | Bundles are sized and described for offices; the seeded minimum is an office-scale number. A consumer basket is possible but has to clear the same minimum, which is the intended filter |
| III. Transparent Self-Serve Pricing | ✅ | The whole feature. Anonymous pricing with no form (SC-001), and FR-006 makes "shown equals charged" structural rather than aspirational |
| IV. Proof of Service | ✅ N/A-forward | No visits yet. The cadence chosen here is what feature 004 will generate visits from |
| V. Honest Plant Promises | ✅ | An out-of-stock plant is priced as unavailable and excluded rather than quietly sold (FR-004, FR-014). A bundle has no stored price, so it cannot advertise a number its contents do not produce |
| VI. Supabase-Native Backend | ✅ | `price_basket()` in Postgres is the authority; the TypeScript copy is explicitly a display convenience with tests binding it to the database |
| VII. Simplicity First | ✅ | No basket table, no saved baskets, no discounts, no VAT handling, no price book. The basket is ids and quantities in `localStorage` |
| VIII. Spec-Driven Development | ✅ | Traces to FR-001 … FR-018; coverage table in `data-model.md` |
| IX. Test What Matters | ✅ | The constitution names pricing computation explicitly. Both implementations run the same fixtures; the rounding invariant (SC-003) is asserted, not assumed |

**Post-Phase-1 re-check**: ✅ No violations introduced. One deliberate departure
— two implementations of one rule — is recorded in Complexity Tracking with the
mechanism that keeps them honest.

## Project Structure

### Documentation (this feature)

```text
specs/002-configure-and-price/
├── plan.md              # This file
├── spec.md
├── research.md          # Phase 0 — R1..R6
├── data-model.md        # Phase 1 — tables, the pricing function, coverage
├── quickstart.md        # Phase 1 — setup and a nine-step manual walk
├── contracts/
│   ├── pricing-contract.md    # The rule both implementations obey
│   └── pricing-cases.json     # Shared fixtures, run by both test suites
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (customer)/
│   │   ├── page.tsx              # catalog — gains add-to-basket
│   │   ├── plants/[id]/page.tsx  # species — gains add-to-basket per size
│   │   ├── bundles/page.tsx      # NEW — starter bundles with computed prices
│   │   └── basket/page.tsx       # NEW — lines, term, cadence, site, total
│   └── (ops)/ops/pricing/page.tsx # NEW — terms, cadences, zone minimums, bundles
├── components/
│   ├── basket/
│   │   ├── basket-provider.tsx   # NEW — client basket state over localStorage
│   │   ├── add-to-basket.tsx     # NEW
│   │   └── basket-badge.tsx      # NEW — count in the header
│   └── site-header.tsx           # gains the basket badge
└── lib/
    ├── basket.ts                 # NEW — storage, add/remove/setQuantity, guards
    └── pricing.ts                # NEW — priceBasket(), the mirror of the DB rule

supabase/
├── migrations/0005_pricing.sql   # terms, cadences, zone minimum, bundles, price_basket
├── tests/0005_pricing.sql        # pgTAP: the shared fixtures, access, invariants
└── seed.sql                      # extended with terms, cadences, minimums, bundles

tests/unit/
├── pricing.test.ts               # NEW — the shared fixtures against priceBasket()
└── basket.test.ts                # NEW — storage guards, quantity rules
```

**Structure Decision**: No new route group and no new surface audience. This
feature adds two customer screens and one operator screen to the structure
feature 001 established, and the basket is a client-side provider rather than a
backend concern.

## Phase 0: Research → [research.md](research.md)

Six decisions: where the price is computed and how the two implementations are
kept honest (R1), integer-fils money with per-line rounding so displayed parts
sum to the displayed total (R2), a `localStorage` basket holding ids but never
prices so a stale total is impossible (R3), terms and cadences as operator data
rather than code (R4), bundles with no stored price (R5), and anonymous pricing
that cannot be used to probe someone else's site (R6).

## Phase 1: Design → [data-model.md](data-model.md), [contracts/pricing-contract.md](contracts/pricing-contract.md), [quickstart.md](quickstart.md)

- **Data model**: four new tables, one new column on `service_zones`, the
  `price_basket()` algorithm step by step with its returned shape, and a table
  mapping every requirement to where it is satisfied.
- **Contract**: the pricing rule in five lines of arithmetic, the line
  classification table, the resolution rules for stale baskets, and the six
  invariants the tests assert — including that both implementations agree.
- **Quickstart**: what the seed adds and a nine-step manual walk that ends by
  changing a multiplier as an operator and watching a customer price move.

## Complexity Tracking

> Filled only where the design knowingly departs from the simplest thing.

| Departure | Why needed now | How it is kept safe |
|---|---|---|
| The pricing rule is implemented twice — once in Postgres, once in TypeScript | The database must be the authority (principle VI, FR-006) or "shown equals charged" is unverifiable; but a network round trip per quantity tap makes the basket feel broken, and SC-001 wants a complete price in two minutes | One shared fixture file, `contracts/pricing-cases.json`, is executed by both the Vitest suite and the pgTAP suite. Drift fails a test rather than reaching a customer. Adding a pricing rule without adding a fixture is the thing review must catch |

No constitutional violations.
