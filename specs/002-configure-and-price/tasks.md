---
description: "Task list for feature 002 — Configure & Price"
---

# Tasks: Configure & Price

**Input**: Design documents from `/specs/002-configure-and-price/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. The constitution names pricing computation as trust-critical,
and this feature implements one rule twice. The shared fixtures in
`contracts/pricing-cases.json` are executed by both suites.

**Organization**: Grouped by user story. One migration, `0005_pricing.sql`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 … US3, matching the user stories in spec.md

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: The pricing rule and its data, which all three stories price against.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T001 Migration `supabase/migrations/0005_pricing.sql` part 1: `rental_terms` and `service_cadences` per data-model.md §1–§2, each with a partial unique index enforcing exactly one active default, plus `service_zones.minimum_monthly_aed`; RLS granting active rows to `anon` and write to operators only
- [ ] T002 Migration part 2: `bundles` and `bundle_items` per data-model.md §4, with RLS exposing published bundles to `anon` and writes to operators
- [ ] T003 Migration part 3: `price_basket(p_items, p_term_id, p_cadence_id, p_site_id)` per data-model.md §5 — integer-fils arithmetic, per-line rounding, line classification, one rounding on the term multiplier, site-ownership check before applying a zone minimum; `security definer`, granted to `anon` and `authenticated`
- [ ] T004 Migration part 4: `bundle_price(p_bundle_id)` delegating to `price_basket` with the active defaults, so a bundle cannot advertise a price its contents do not produce
- [ ] T005 Extend `supabase/seed.sql` with three rental terms, two cadences, an AED 400 minimum on both zones, and four bundles — three sellable plus one containing the zero-stock Areca so the unavailable state is demonstrable
- [ ] T006 [P] Implement the TypeScript mirror in `src/lib/pricing.ts`: `priceBasket(items, catalog, term, cadence)` following `contracts/pricing-contract.md` exactly, in integer fils, returning the same shape as the database function
- [ ] T007 [P] Implement basket storage in `src/lib/basket.ts`: read, write, add, remove, `setQuantity`, clear, over a version-stamped `localStorage` key holding ids and quantities but never prices; every access wrapped so a blocked or corrupt store degrades to an empty basket
- [ ] T008 Unit tests `tests/unit/pricing.test.ts` driving every case in `contracts/pricing-cases.json` through `priceBasket`, plus the six invariants in the pricing contract
- [ ] T009 [P] Unit tests `tests/unit/basket.test.ts`: quantity rules (whole numbers, minimum one, zero removes), storage failure degrading to empty, version mismatch discarding an old basket
- [ ] T010 pgTAP tests `supabase/tests/0005_pricing.sql` driving the same fixture file through `price_basket`, plus: anon may price, the site minimum applies only to a site the caller may see, a foreign site id falls back to guidance rather than leaking, and only operators may write terms, cadences or bundles

**Checkpoint**: `supabase db reset` clean; both suites green; the same fixtures pass on both sides.

---

## Phase 2: User Story 1 — Someone builds a basket and sees what it costs (Priority: P1) 🎯 MVP

**Goal**: An anonymous visitor builds a basket, changes term and cadence, and sees an exact live monthly total.

**Independent Test**: Signed out, add three plants, change a quantity, switch term and cadence, reload — total correct at every step and the basket survives (spec US1 scenarios 1–6).

- [ ] T011 [US1] Basket state in `src/components/basket/basket-provider.tsx`: a client provider over `src/lib/basket.ts` exposing lines, term, cadence and site, hydrating after mount so server and client markup agree
- [ ] T012 [US1] Add-to-basket control in `src/components/basket/add-to-basket.tsx`: adds a variant, shows the quantity once present, disabled with a reason when the variant is unavailable
- [ ] T013 [US1] Basket badge in `src/components/basket/basket-badge.tsx` and wire it into `src/components/site-header.tsx`
- [ ] T014 [US1] Add the control to the catalog card in `src/app/(customer)/page.tsx` and to each size row in `src/app/(customer)/plants/[id]/page.tsx`
- [ ] T015 [US1] Basket screen in `src/app/(customer)/basket/page.tsx`: lines with quantity controls and removal, term selector, cadence selector, the full breakdown, and unavailable lines explained rather than dropped
- [ ] T016 [US1] Authoritative pricing in the basket screen: show the mirror's total immediately, then reconcile against `price_basket` and render the database's numbers once they arrive, so what is displayed is always what would be charged
- [ ] T017 [US1] Term and cadence copy: state the cost of the chosen term against the cheapest in dirhams, and label a cadence change as changing the service fee, not the plant prices

**Checkpoint**: A stranger can price an office without an account.

---

## Phase 3: User Story 2 — A starter bundle gets someone to a number in one click (Priority: P2)

**Goal**: Published bundles with computed prices that populate the basket.

**Independent Test**: Signed out, open bundles, choose one, land on a basket whose total matches what the bundle advertised (spec US2 scenarios 1–4).

- [ ] T018 [US2] Bundles screen in `src/app/(customer)/bundles/page.tsx`: each bundle with its name, who it suits, its contents and its computed monthly price at the default term and cadence; a bundle containing an unavailable plant is marked temporarily unavailable
- [ ] T019 [US2] "Use this bundle" action replacing the basket with the bundle's contents and navigating to the basket, with a confirmation when it would discard an existing basket
- [ ] T020 [US2] Link bundles from the catalog for visitors who do not know how many plants they need

**Checkpoint**: Someone who has never bought office plants reaches a credible number in one click.

---

## Phase 4: User Story 3 — The basket is checked against where the plants will go (Priority: P3)

**Goal**: A signed-in customer attaches the basket to a site, and the zone minimum refuses a basket that would not pay for the visit.

**Independent Test**: Sign in, attach a below-minimum basket to a site, see the shortfall in money; add plants until it clears (spec US3 scenarios 1–5).

- [ ] T021 [US3] Site selector on the basket screen listing the signed-in customer's own and their organizations' sites, absent when signed out
- [ ] T022 [US3] Pass the chosen site to `price_basket` and render `meets_minimum`, the minimum and the shortfall; block proceeding while short, and say what would clear it rather than only refusing
- [ ] T023 [US3] Show the chosen site's zone and visit days on the basket, so the cadence choice connects to real days Planty already drives
- [ ] T024 [US3] Show the minimum as guidance when no site is chosen, per FR-018

**Checkpoint**: All three stories independently functional.

---

## Phase 5: Operator control & polish

- [ ] T025 Operator pricing screen `src/app/(ops)/ops/pricing/page.tsx`: edit term multipliers, cadence fees and per-zone minimums, with the active default enforced by the database surfaced as a readable error
- [ ] T026 Bundle management on the same screen: create a bundle, set its contents and quantities, publish and unpublish
- [ ] T027 [P] Extend `src/lib/validation.ts` with term, cadence, minimum and bundle schemas
- [ ] T028 Run the full gate — `npm run build`, `npm run test`, `supabase test db`, `npm run lint` — and walk the nine manual checks in quickstart.md, fixing anything red

---

## Dependencies & Execution Order

### Phase dependencies

- **Foundational (Phase 1)** blocks everything. The pricing rule and its fixtures come first because all three stories display its output.
- **US1 (Phase 2)** depends only on Foundational and is the MVP slice.
- **US2 (Phase 3)** depends on US1, because a bundle populates the basket US1 built.
- **US3 (Phase 4)** depends on US1 and on feature 001's sites.
- **Phase 5** depends on the stories being complete.

### Within Phase 1

- T001 → T002 → T003 → T004 are one migration file in order.
- T006 and T007 are independent of the migration and of each other.
- T008 requires T006; T009 requires T007; T010 requires T003 and T005.
- Write T008 and T010 against the fixture file **before** the implementations are finished, and watch them fail. A pricing test that never failed is not evidence.

### Parallel opportunities

- T006, T007 and T009 in Phase 1.
- T027 alongside Phase 5 screens.

---

## Implementation Strategy

Phase 1, then stop and confirm both suites run the same fixtures and agree.
That checkpoint is the whole point of the feature's design: after it, the
displayed price and the charged price cannot diverge without a test failing.

Then US1 alone is a demonstrable product — a stranger pricing an office with no
account, which is the thing no competitor in the market offers.

---

## Notes

- `[P]` means different files and no dependency on incomplete work.
- Mark a task `[X]` as it completes; commit after each logical group.
- Migrations are hand-numbered; never run `supabase migration new`.
- No price level belongs in code. If a number appears in a `.ts` or `.tsx` file
  that a customer would recognise as a price, it is a bug.
