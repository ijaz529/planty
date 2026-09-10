# Implementation Plan: Monthly Refreshes & Entry Pricing

**Branch**: `007-monthly-refresh-entry-pricing` | **Spec**: `spec.md` |
**Economics**: `research.md`

## Summary

Two changes, neither of them structural. The swap window shortens from ninety
days to thirty, and every published price falls to a ladder starting at AED 5.
No new table, no new entity, no new screen.

The work is mostly in the tests, because the old prices were pinned in three
places on purpose: the shared fixture file that keeps the TypeScript and
Postgres pricing implementations honest, the pgTAP suites, and the mirrored
catalogue in the Vitest suite. That pinning did its job — every one of them
failed the moment the seed changed, which is what it is for.

## Approach

**The window.** Feature 005 spelled `90` into `rotation_period_start` and
`rotation_period_end` and relied on the two agreeing. Migration `0010` replaces
both with `rotation_window_days()`, an immutable function returning 30, so the
next move happens in one place. `rotation_allowance` is untouched: it still
means "swaps per window", and the default of 2 now means two a month.

**The prices.** Prices are operator-edited data, so they live in `seed.sql` and
nowhere else. The migration carries only the zone minimum, which is schema-level
configuration rather than catalogue data and had to fall from AED 400 to AED 150
or it would have overridden the advertised price on nearly every order.

**Rounding is untouched.** Integer fils, two roundings, one per line and one on
the term multiplier. Cheaper prices do not change the rule and the fixtures
prove it: `303 * 1.07` is still wrong in binary floating point, and the quote
still lands on AED 324.21.

**Copy.** "This quarter" becomes "this month" everywhere it appears, and the
"Seasonal swaps" heading becomes "Swapping a plant" — at two a month there is
nothing seasonal about it.

## Sequence

1. Spec and the economics behind the price. → `spec.md`, `research.md`
2. Migration `0010`: window function, both period functions, zone minimum.
3. Reprice `seed.sql`.
4. Re-derive the shared pricing fixtures from the implementation, then hand-check
   five of the twelve cases against the arithmetic before trusting them.
5. Update the Vitest mirrored catalogue and the three edge tests that pinned old
   amounts.
6. Update the pgTAP suites: 0002 (a published price), 0005 (every total and both
   minimum assertions), 0006 (the refusal and the expected total), 0008 (the
   window).
7. Copy.

## Decisions worth recording

**The fixtures were re-derived, not hand-written.** Twelve cases times six money
keys is seventy-two numbers, and hand-arithmetic would have introduced errors
the suites would then have enshrined. They were regenerated from the TypeScript
implementation and five were checked by hand. The pgTAP suite still verifies
them independently, so a drift between the two implementations still fails —
which is the only thing the fixture file exists to catch.

**Two tests now raise the minimum themselves.** At AED 150 no priceable basket
can fall below the minimum, so the assertions that the refusal works had nothing
left to assert. Rather than delete them, they raise the zone minimum inside
their own transaction, prove the refusal still fires, and put it back. The rule
keeps its test even though the seeded number no longer triggers it.

**The role matters when raising it.** The first attempt updated
`service_zones` while the session was still `authenticated` as a customer. RLS
denied it by matching no rows rather than raising, the minimum never moved, and
the tests failed in a way that looked like a pricing bug. The updates now
`reset role` first. This is the third time in this project that a silent
zero-row RLS denial has been mistaken for something else.

## Out of scope

- Re-pricing live subscriptions. They keep what they were sold at, as feature
  005 decided.
- The service fee, which pays the technician and is the only line that can.
- Route planning, which the price cut makes urgent and which is feature 008.
