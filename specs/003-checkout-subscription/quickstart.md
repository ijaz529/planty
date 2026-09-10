# Quickstart: Checkout & Subscription

**Feature**: `003-checkout-subscription` · **Date**: 2026-09-10

```bash
supabase db reset && npm run seed:images && npm run dev
```

## Verifying by hand

1. Sign in as `050 000 0002` (Nadia, Northwind owner). Open `/bundles`, use
   Small Office. In the basket choose the Northwind office site and press
   Continue.
2. `/checkout` shows the order, offers only Mondays and Wednesdays (Business
   Bay) at least two working days out, and prefills the organization's billing
   email. Place the order.
3. You land on `/subscriptions/<id>`: status pending, reference `PL-…`, amount
   due, bank details, installation day and term end. Open the catalog: Kentia
   stock has dropped by one.
4. Back in the basket, empty it, add one desk plant, choose the site, Continue:
   checkout refuses with the shortfall.
5. As operator `050 000 0003`, open `/ops/subscriptions`, mark the order paid.
   As Nadia, the subscription now reads active and cannot be cancelled by her.
6. As Nadia, place a second order and cancel it from its page: stock returns.
7. As operator, edit the bank details on `/ops/subscriptions`; a pending
   subscription shows the new text on reload.

## Tests

```bash
npm run test         # installation-day helper
supabase test db     # lifecycle, stock, RLS
```
