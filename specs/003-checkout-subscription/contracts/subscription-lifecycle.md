# Contract: Subscription Lifecycle

**Feature**: `003-checkout-subscription` · **Date**: 2026-09-10

## Write path

There is exactly one way to create a subscription and two ways to change its
status. Every one is a `security definer` function that authorises first.

### `create_subscription(...) → uuid`

Preconditions, checked in this order, each with a named error:

1. Caller signed in.
2. Site visible to caller (owner, organization member, or operator).
3. Site's zone is active.
4. `price_basket(items, term, cadence, site)` → `site_applied` and
   `meets_minimum`; else `below minimum: short by AED X`.
5. If `p_expected_total` given and ≠ fresh `monthly_total_aed`:
   `price changed: now AED X`.
6. At least one priceable line.
7. `p_installation_date ≥ min_installation_date()` and its weekday ∈ zone
   `service_weekdays`.
8. Billing email: argument, else organization's, else profile's; else
   `a billing email is required`.
9. For each priced line, in variant id order: lock row, require
   `stock_available ≥ quantity`, else `not enough <plant> in stock`.

Effects, all-or-nothing: `stock_allocated` incremented; subscription, lines
and a `null → pending` event inserted; `reserved_until = now() + 7 days`;
`ends_on = installation + term months`.

### `mark_subscription_paid(id)`

Operator only. `pending → active` with an event. Already `active`: no-op,
returns. `cancelled`: error `cannot activate a cancelled subscription`.

### `cancel_subscription(id, note)`

- Customer (owner or organization member): only while `pending`; otherwise
  `active subscriptions are cancelled by Planty — contact us`.
- Operator: `pending` or `active`.
- Already `cancelled`: no-op.
- Releases stock exactly once (guarded by `stock_released`). Writes an event.

## Invariants the tests assert

1. Snapshot `monthly_total_aed` equals `price_basket()` at creation (SC-002).
2. `Σ stock_allocated` per variant equals Σ quantities over non-cancelled
   subscriptions (SC-003).
3. Cancel twice releases stock once.
4. The failing branch of an over-allocation leaves no subscription row.
5. Below-minimum and off-day orders are refused with the named error (SC-004).
6. A member of one organization cannot read another's subscriptions (SC-005).
