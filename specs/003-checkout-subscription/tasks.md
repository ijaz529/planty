---
description: "Task list for feature 003 — Checkout & Subscription"
---

# Tasks: Checkout & Subscription

**Input**: Design documents from `/specs/003-checkout-subscription/`
**Tests**: Included — state transitions and stock allocation are constitution-named trust paths.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Foundational

- [X] T001 Migration `supabase/migrations/0006_subscriptions.sql`: enums, `subscriptions`, `subscription_lines`, `subscription_status_events`, `operator_settings`, payment-reference sequence, RLS per data-model.md
- [X] T002 Same migration: `min_installation_date()`, `create_subscription(...)`, `mark_subscription_paid()`, `cancel_subscription()` per contracts/subscription-lifecycle.md, with named errors and row-locked reservation
- [X] T003 Extend `supabase/seed.sql` with the `bank_details` setting
- [X] T004 [P] `src/lib/installation.ts`: `minInstallationDate(from)` (two Mon–Fri days ahead) and `installationCandidates(serviceWeekdays, from, count)`; `tests/unit/installation.test.ts`
- [X] T005 pgTAP `supabase/tests/0006_subscriptions.sql`: snapshot equals `price_basket`; stock reserved and released once; over-allocation rolls back cleanly; below-minimum, off-day, too-early and price-changed refusals; customer cannot cancel active; operator transitions; cross-organization isolation

## Phase 2: US1 — Place an order

- [X] T006 [US1] `src/app/(customer)/checkout/page.tsx` + `checkout-form.tsx`: summary from the basket, site confirmation, installation-day picker from the mirror, billing email prefilled, place order via `create_subscription` passing the displayed total; on `price changed` show the new total and a confirm step; on success clear the basket and go to the subscription
- [X] T007 [US1] Basket "Continue" navigates to `/checkout`; disabled without a site

## Phase 3: US2 — Invoice payment

- [X] T008 [US2] `src/app/(customer)/subscriptions/[id]/page.tsx`: lines, totals, status, installation and end dates, and for pending: reference, amount due, bank details
- [X] T009 [US2] `src/app/(ops)/ops/subscriptions/page.tsx` + `manager.tsx`: list all, mark paid, cancel or release with a note, edit bank details

## Phase 4: US3 — See and cancel

- [X] T010 [US3] `src/app/(customer)/subscriptions/page.tsx` list; header link
- [X] T011 [US3] Cancel action on the detail page for pending subscriptions; active ones explain the operator path

## Phase 5: Polish

- [X] T012 Full gate and the seven quickstart checks; README status
