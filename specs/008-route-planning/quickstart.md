# Quickstart: route planning

## Seeing it work

The seed gives every subscription a fortnightly visit, and with one customer
that is one stop a day — which demonstrates nothing. A route planner needs a
day worth routing.

```bash
supabase db reset && npm run seed:images && npm run dev
```

Then, to put six stops on one day, add sites inside the served polygons and give
each its own subscription. A subscription may hold only one visit per day
(`visits_one_per_day`), so five extra stops need five extra subscriptions.

The two served zones are rectangles:

| Zone | Longitude | Latitude |
| --- | --- | --- |
| Business Bay | 55.255 – 55.292 | 25.175 – 25.200 |
| Dubai Marina | 55.130 – 55.160 | 25.065 – 25.095 |

A point outside both is refused by `assign_site_zone()` with "we do not serve
this location yet", which is feature 001 doing its job rather than a bug.

Then sign in at `/auth` as `050 000 0003` with code `123456`, open
`/ops/visits?date=<the day>`, and press **Plan the route**.

## What you should see

A distance, a suggested order, and a saving if there is one to have. Nothing
changes until **Use this order** is pressed; **Keep mine** discards it.

The demo day used during development ran Business Bay from its far corner
inward, then out to Marina and home to Al Quoz: 42.1 km against 45.0 km for the
order it replaced.

## Things that are meant to happen

- **A stop with no pin** is named and left where it is, never dropped.
- **A finished stop** makes the whole day refuse to renumber, because it already
  happened.
- **Two days at once** is refused; a route is one day of driving.
- **Anyone but an operator** is refused by `apply_route`, not merely hidden from
  the button.
- **The distance always says "as the crow flies"**, because it is a straight
  line and not a road.

## Where the parts are

| Part | Where |
| --- | --- |
| The algorithm | `src/lib/route.ts` |
| Its tests, including 200 random days | `tests/unit/route.test.ts` |
| Depot, permissions, renumbering | `supabase/migrations/0011_route_planning.sql` |
| Their tests | `supabase/tests/0011_route_planning.sql` |
| The operator's screen | `src/app/(ops)/ops/visits/day-planner.tsx` |

## Moving the depot

It seeds to Al Quoz, where most Dubai nurseries and their warehouses are. There
is no screen for it yet — an operator with a real address changes the one row:

```sql
update public.depot
   set label = 'Planty depot',
       location = extensions.st_point(<lon>, <lat>)::extensions.geography;
```

PostGIS is (longitude, latitude). Reversed, Dubai lands in the sea and the
routes will be confidently wrong.
