# Pricing Contract: Configure & Price

**Feature**: `002-configure-and-price` · **Date**: 2026-09-10

Two implementations compute Planty's prices: `price_basket()` in Postgres, which
is the authority, and `priceBasket()` in TypeScript, which keeps the basket
responsive. This document is the rule they both implement. The shared fixtures in
[`pricing-cases.json`](pricing-cases.json) are its executable form — the Vitest
suite and the pgTAP suite both run them and must agree.

## The rule

```
line_total     = round_to_fil(unit_price × effective_quantity)      per line
plants_subtotal= Σ line_total  over priceable lines
service_fee    = cadence.monthly_fee   (zero if no line is priceable)
subtotal       = plants_subtotal + service_fee
monthly_total  = round_to_fil(subtotal × term.price_multiplier)
```

Rounding happens twice and only twice: once per line, once on the multiplier.
Half rounds up. Everything in between is integer arithmetic on fils.

## Line classification

| Condition | Status | Counted |
|---|---|---|
| Published, `stock_available >= quantity` | `ok` | Yes, at the requested quantity |
| Published, `0 < stock_available < quantity` | `capped` | Yes, at `stock_available`; the request is reported |
| Not published, or `stock_available = 0` | `unavailable` | No |
| `variant_id` not found | `unavailable` | No |

An unavailable line still appears in the response, so the interface can explain
it rather than silently dropping a plant someone chose (FR-004).

## Resolution rules

- A null, unknown or inactive term or cadence id resolves to the active default.
  A stale basket reprices; it never errors.
- A quantity below 1 removes the line before pricing. Quantities are whole
  numbers.
- The minimum applies only when a site id is given **and** the caller may see
  that site. Otherwise `site_applied` is false and the minimum is guidance.

## Invariants the tests assert

1. `Σ line_total_aed == plants_subtotal_aed`
2. `round((plants_subtotal_aed + service_fee_aed) × multiplier) == monthly_total_aed`
3. `flexibility_cost_aed == monthly_total_aed − cheapest_monthly_total_aed`, and
   is never negative
4. No line contributes to a total while its status is `unavailable`
5. An all-unavailable basket has `monthly_total_aed == 0`, not a bare service fee
6. Both implementations return identical numbers for every shared fixture

## What this contract does not cover

Discounts, promotional codes, negotiated rates, VAT, proration, deposits and
setup fees. None exist in this feature, and adding any of them means changing
this document and both implementations together.
