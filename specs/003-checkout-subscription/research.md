# Phase 0 Research: Checkout & Subscription

**Feature**: `003-checkout-subscription` · **Date**: 2026-09-10

## R1 — Invoice first, no payment processor

**Decision**: The only payment method in this feature is invoice (bank
transfer). A subscription is created `pending` with a unique reference and the
amount due; an operator records the payment and it becomes `active`.

**Rationale**: The launch customer is an office (constitution II), and offices
pay against an invoice. A Stripe UAE account requires a trade licence that does
not yet exist, so a card integration written now could not be run, let alone
verified — and shipping unverified payment code is the wrong risk. Invoice
payment makes the whole checkout real and testable today.

**Seam for later**: `payment_method` is an enum with one value, and
`mark_subscription_paid()` is the single transition a processor's webhook will
call. Nothing else changes when cards arrive.

**Alternatives considered**: Stripe Checkout behind an env flag — untestable
here; a "fake pay" button — teaches the UI a lie.

## R2 — Re-price at the moment of ordering; the client passes what it showed

**Decision**: `create_subscription()` calls `price_basket()` itself and uses
that result. The client passes the monthly total it last displayed; if it
differs from the fresh price, the function refuses with the new total and the
client asks the customer to confirm.

**Rationale**: FR-002 and FR-004. The basket's number is a display; the
authority is the database at the instant of commitment. Passing the expected
total is how "the price changed, are you sure?" is detected without trusting
the client for anything.

## R3 — Stock reservation and the race

**Decision**: Inside `create_subscription()`, lock the ordered variants with
`select … for update` in a fixed id order, check availability, then increment
`stock_allocated`. The existing `CHECK (stock_allocated <= stock_total)` is the
backstop. Any failure raises, and the whole function — subscription, lines,
allocation — rolls back together.

**Rationale**: FR-005. Row locks in a consistent order prevent deadlock; the
check-then-update inside the lock prevents two orders both seeing "one left".
Under contention, exactly one commits and the other gets a named refusal.

**Release**: cancellation decrements the same counters exactly once, guarded by
a `stock_released` flag on the subscription.

## R4 — Installation day validation lives in the database

**Decision**: A `min_installation_date()` function steps forward two Monday–
Friday days from today; `create_subscription()` refuses a date earlier than
that or whose weekday is not in the site's zone `service_weekdays`. The client
mirrors the rule to offer only valid days, in `src/lib/installation.ts`.

**Rationale**: FR-006, and constitution I — a visit on a day the zone is not
driven is a density leak. The mirror is for the picker; the function is the
rule.

## R5 — Snapshot everything the customer agreed to

**Decision**: The subscription stores the full `price_basket()` result as
`quote` JSON **and** denormalised columns (lines, term, cadence, totals).

**Rationale**: FR-003. Columns are what screens and tests read; the JSON is the
audit trail explaining any column to a human later. A price change after
ordering touches neither.

## R6 — Bank details are operator text

**Decision**: An `operator_settings` key/value table with a `bank_details`
entry that customers can read and only operators can write.

**Rationale**: It is one string an operator must be able to change without a
deploy. A table with one row is the simplest thing that is not a constant.
