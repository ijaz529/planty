# Quickstart: Visit Engine

**Feature**: `004-visit-engine` · **Date**: 2026-09-10

```bash
supabase db reset && npm run seed:images && npm run dev
```

The seed activates one subscription for the Northwind office and generates its
visits, so there is a route to work on day one.

## Verifying by hand

1. As operator `050 000 0003`, open `/ops/visits`. Pick the next served day and
   assign technician Tariq to the stop, position 1.
2. Sign in as `050 000 0004` (Tariq) and open `/today`. The stop is listed with
   the building, the access notes and the plants expected.
3. Open the stop. Mark each plant's condition, add a photo, complete it. Try
   completing before adding a photo: it is refused and says why.
4. As Nadia (`050 000 0002`), open the subscription. The visit appears with its
   date, conditions and photo, and the next visit's date is shown.
5. As Tariq again, open `/sites` — the site is no longer visible now the visit
   is finished. That is the narrowed access from feature 001's recorded debt.

## Tests

```bash
npm run test         # cadence stride and route helpers
supabase test db     # generation, completion guard, narrowed technician access
```
