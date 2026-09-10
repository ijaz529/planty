# Quickstart: route planning

## Seeing it work

```bash
supabase db reset && npm run seed:images && npm run dev
```

The seed leaves a round worth routing: six stops in Business Bay on its first
Monday, all assigned to Tariq, plus two Marina stops on the Tuesday. They are
numbered alphabetically by site, which is deliberately arbitrary — it is the
order the planner exists to improve on.

Sign in at `/auth` as `050 000 0003` with code `123456`, open the Monday from
`/ops/visits`, and press **Plan the route**.

## Adding more stops

Every site must sit inside a served polygon or `assign_site_zone()` refuses it
with "we do not serve this location yet", which is feature 001 doing its job.

| Zone | Longitude | Latitude | Served |
| --- | --- | --- | --- |
| Business Bay | 55.255 – 55.292 | 25.175 – 25.200 | Mon, Wed |
| Dubai Marina | 55.130 – 55.160 | 25.065 – 25.095 | Tue, Thu |

A subscription may hold only one visit a day (`visits_one_per_day`), so another
stop means another subscription. The seed's own loop near the bottom of
`seed.sql` is the pattern to copy: pin the site, price the basket with
`price_basket`, allocate the stock, and let `generate_visits()` place the days.

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

It seeds to Al Quoz, where most Dubai nurseries and their warehouses are.
Feature 009 put it on a map: an operator opens `/ops/depot`, presses **Move the
depot**, drags the pin and saves. The coordinates are shown beside the map so a
wrong pin is visible before it is saved rather than after.

Placing it by pin is also what stops longitude and latitude being transposed.
Reversed, Dubai lands in the sea and every route is confidently wrong.
