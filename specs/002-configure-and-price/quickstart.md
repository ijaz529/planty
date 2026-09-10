# Quickstart: Configure & Price

**Feature**: `002-configure-and-price` · **Date**: 2026-09-10

Assumes feature 001 is set up (see `specs/001-foundation-accounts-catalog/quickstart.md`).

```bash
supabase db reset       # applies 0005_pricing.sql and the extended seed
npm run seed:images     # storage is cleared by a reset
npm run dev             # http://localhost:3020
```

## What the seed adds

- Three rental terms: 3 months (×1.15), 6 months (×1.07), 12 months (×1.00, default).
- Two cadences: weekly (AED 250/month), fortnightly (AED 150/month, default).
- A minimum of AED 400/month on both service zones.
- Three published bundles — Desk Starter, Small Office, Studio Floor — plus one
  bundle containing the zero-stock Areca so the unavailable state is visible.

## Verifying by hand

1. **Anonymous pricing.** Signed out, open `/`, add plants, open `/basket`. A
   monthly total appears with no account and no form.
2. **Live totals.** Change a quantity. The total moves immediately, and the
   line totals still sum to it exactly.
3. **Term ladder.** Switch from 12 months to 3 months. The total rises and the
   page states the cost of the shorter term in dirhams.
4. **Cadence.** Switch to weekly. The service fee rises, plant prices do not.
5. **Reload.** Refresh the page. The basket is still there.
6. **Unavailable.** Add the Areca palm (seeded with zero stock). Its line shows
   as unavailable, is excluded from the total, and says why.
7. **Bundles.** Open `/bundles`, choose Small Office, and land on a basket whose
   total matches the price the bundle advertised.
8. **Zone minimum.** Sign in as `050 000 0002`, choose the Northwind office
   site, and empty the basket down to one desk plant. The shortfall against
   AED 400 is stated in money and the basket cannot proceed.
9. **Operator control.** As `050 000 0003`, change a term multiplier at
   `/ops/pricing` and reload the basket. The customer-facing total changes with
   no deploy.

## Checking the two implementations agree

The shared fixtures drive both suites:

```bash
npm run test         # Vitest runs contracts/pricing-cases.json against priceBasket()
supabase test db     # pgTAP runs the same file against price_basket()
```

If one passes and the other fails, the implementations have drifted, which is
exactly what the shared fixture file exists to catch.
