# Phase 0 Research: Configure & Price

**Feature**: `002-configure-and-price` · **Date**: 2026-09-10

Six decisions. Market research lives in `docs/research/`; this covers only what
this feature has to settle.

---

## R1 — Where the price is computed

**Decision**: A Postgres function `price_basket(...)` is the authority. A pure
TypeScript function `priceBasket(...)` mirrors it for instant feedback while
someone is dragging a quantity around. A shared fixture file drives both test
suites, so the two implementations are asserted to produce identical numbers.

**Rationale**: FR-006 and constitution principle VI put trusted logic in the
database, and principle III turns "the price you see is the price you pay" into
a promise rather than an aspiration. But a round trip on every keystroke makes a
basket feel broken, and SC-001 asks for a complete price in under two minutes.
The mirror-with-shared-fixtures pattern already worked in feature 001 for
publish gaps: one definition of the rule in the database, a client copy for
responsiveness, and tests that fail loudly if they drift.

**Alternatives considered**:
- *Database only, called on every change*: correct and unusable; every quantity
  tap waits on a network round trip.
- *Client only*: fast, and it makes the central product promise unverifiable.
  A basket total computed in a browser is a number the customer typed, not a
  number Planty stands behind.
- *Client only until checkout, then reprice server-side*: this is how most carts
  work, and it is exactly the "price changed at the last step" experience the
  spec's edge cases exist to prevent.

**The trap**: two implementations of one rule drift silently. The mitigation is
not discipline, it is `specs/002-configure-and-price/contracts/pricing-cases.json`
— one fixture set, loaded by both the Vitest suite and the pgTAP suite. Adding a
pricing rule without adding a fixture is what review should catch.

---

## R2 — How money is represented and rounded

**Decision**: Money is `numeric(10,2)` in Postgres and is handled as integer
**fils** (hundredths of a dirham) inside both pricing implementations. Every
line total is rounded to the fil before summing; the monthly total is the sum of
already-rounded parts, never a rounding of the unrounded sum.

**Rationale**: SC-003 requires that displayed parts sum to the displayed total.
That only holds if rounding happens once per line, before addition. Rounding at
the end instead produces the classic penny that appears from nowhere. Working in
integers avoids binary floating point entirely, which is where fractional-cent
errors come from in JavaScript.

**Where the term multiplier lands**: applied to the subtotal (plants plus
service fee) and rounded once, not applied per line. Applying it per line and
summing would round eight times and drift from the advertised term price.

**Alternatives considered**:
- *`float8` throughout*: never for money.
- *Rounding only for display*: the displayed total then disagrees with the sum
  of displayed lines, which SC-003 forbids.

---

## R3 — Where the basket lives

**Decision**: `localStorage`, keyed by a single version-stamped key. The basket
holds variant ids, quantities, the chosen term and cadence codes, and optionally
a site id. It holds **no prices**.

**Rationale**: FR-002 wants the basket to survive a reload, and FR-005 wants no
account required. Storing only ids and quantities means a price change while a
basket is open cannot produce a stale total — the basket is repriced from
current data on every load, which is exactly what the spec's first edge case
demands. The version stamp lets a future shape change discard old baskets
instead of crashing on them.

**Alternatives considered**:
- *A `baskets` table*: needed for cross-device carry-over and abandoned-basket
  recovery, neither of which this feature claims. Deferred under principle VII.
- *A cookie*: sent on every request for no reason, and size-limited.
- *Storing prices alongside quantities*: the direct cause of stale totals.

**The trap**: `localStorage` throws in some contexts rather than returning null.
Every read and write is wrapped, and an unreadable basket degrades to an empty
one instead of a blank page.

---

## R4 — Terms and cadences as data

**Decision**: Two small operator-owned tables, `rental_terms` (months, label,
multiplier) and `service_cadences` (code, label, visits per month, monthly fee).
Exactly one row in each is flagged as the default. The zone minimum becomes a
column on `service_zones`.

**Rationale**: FR-007 and the constitution both require that no price level is
encoded in code. Planty's prices are the first observable rental prices in this
market and are explicitly a hypothesis, so the founder has to be able to move a
multiplier or a fee on a Tuesday and see it in the customer-facing price without
a deploy — which is SC-006.

**Why the term is a multiplier rather than a price list**: a multiplier composes
with any catalogue size without an operator maintaining a price per plant per
term. The published market pattern is the same shape — a longer commitment
lowers the monthly rate — so a multiplier of 1.0 at the longest term and above
1.0 at shorter ones reads correctly to a customer as the cost of flexibility.

**Alternatives considered**:
- *Terms and cadences as enums in code*: fastest to write, and it makes SC-006
  impossible.
- *A full price-book table keyed by variant, term and cadence*: general, and
  wrong for a catalogue of tens of items maintained by one person.

---

## R5 — What a bundle is

**Decision**: A bundle is a named, published set of `(variant, quantity)` rows.
It has **no price column**. Its price is computed from its contents at the
default term and cadence, through the same function everything else uses.

**Rationale**: FR-012 says a bundle must never advertise a price its contents do
not produce. A stored bundle price is a second source of truth that goes stale
the moment a plant price changes, and the failure is invisible until a customer
notices. Computing it means a bundle cannot lie.

**Alternatives considered**:
- *A stored headline price*: allows deliberate bundle discounts, and guarantees
  drift. If discounting is wanted later it belongs as an explicit discount on
  the priced result, not as an unexplained difference.

---

## R6 — Anonymous pricing without leaking anything

**Decision**: `price_basket` is `security definer` and readable by `anon`. It
reads only published variants and active terms, cadences and zones. When given a
site id it verifies the caller may see that site before using its zone, and
otherwise treats the basket as having no site.

**Rationale**: SC-001 requires a full price with no account, and FR-018 says the
minimum is guidance until a site is chosen. Making the function `security
definer` lets it read pricing configuration without exposing those tables
directly, while the site check keeps FR-016's ownership rule intact — a stranger
must not be able to discover a zone minimum for someone else's site, nor confirm
that a site id exists.

**The trap**: a `security definer` function that takes an id and reads a row is
an authorisation bypass unless it checks first. The site branch checks
ownership explicitly and falls back to no-site rather than raising, so a probe
cannot distinguish "not yours" from "does not exist".
