# Quickstart: Stock Ledger & Depot

**Feature**: `006-stock-ledger` · **Date**: 2026-09-10

```bash
supabase db reset && npm run seed:images && npm run dev
```

## Verifying by hand

1. As operator `050 000 0003`, open `/ops/depot`. Every plant shows owned, with
   customers, recovering and ready to send, and the four add up. The seeded
   subscription's plants already show as with customers.
2. Receive ten Kentia palms. Owned and ready-to-send both rise by ten, and the
   ledger shows the delivery.
3. Write off two, giving a reason. Owned falls, and the replacement rate at the
   top of the page moves.
4. Try to write off a thousand: refused, naming what the depot holds.
5. As Nadia, ask for a replacement; approve it as the operator; as Tariq, mark
   it carried out. Back in the depot, owned has fallen by one and the customer
   still has the same number allocated — a plant died, nobody lost one.
6. Do the same with a swap: the outgoing plants land in recovering, not in
   ready-to-send. Return them to stock from the depot and watch them become
   sellable again.

## Tests

```bash
npm run test         # depot arithmetic and rate formatting
supabase test db     # ledger reconciliation, refusals, immutability
```
