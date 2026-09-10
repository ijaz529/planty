# Open decision: which city does Planty launch in?

**Status**: open, blocking feature 002 · **Raised**: 2026-09-10

Feature 001 is built and merged against **Dubai**. The completed research
programme recommends **Berlin, B2B only**. This note exists so the decision is
made on facts rather than on which document someone read last.

## The one thing only the founder knows

> Is relocating to Dubai, or securing a named local operating partner to run
> the route, actually on the table?

If yes, Dubai is the better market and the current code is already pointed at
it. If no, take Berlin — because this business is a technician standing in a
room on a schedule, and nobody found a costed way to run that remotely on day
one.

## Why the research came out for Berlin

Two findings, in order of weight.

**Price legibility.** Eight Dubai competitor pages were fetched directly and
not one carried a rental rate. The same modelled 25-display office returns
roughly 61% contribution margin at one circulating price and roughly 7% at the
other. Nobody in the programme could close that gap. Berlin publishes a
per-display rate card, a monthly entry point confirmed by three vendors, and a
care-only benchmark. You can price against Berlin today.

**Operability.** The founder is resident in Germany. A Berlin incumbent trading
25 years confines itself to two boroughs and surcharges beyond them. Route
density is the whole business.

Dubai genuinely wins on demand, on competitive whitespace, and probably on raw
labour cost. It loses on the two criteria that can actually be settled now.

## What is NOT a reason to switch

The self-serve wedge is not Dubai-specific. Incumbents in **both** cities end
their funnel at a form or a phone number. Berlin publishes prices but still
does not let you buy. So "nobody sells online" argues for the product, not for
either city.

And the thesis has a hole worth naming: nobody checked whether comparable
recurring on-site office services — fruit, coffee, water, cleaning — sell
self-serve online in either city. The absence of a behaviour among thirty plant
incumbents is at least as consistent with *buyers do not buy this way* as with
*nobody tried*. Test that before scaling either market.

## What changes in the code, either way

The structure of feature 001 is market-agnostic: accounts, organizations,
polygon service zones and a priced catalogue work unchanged in both cities. The
research independently recommends exactly the zone design already built —
encode the service area as a polygon, gate signup on it, waitlist everything
outside.

Market assumptions are confined to these places, and the constitution now
forbids spreading them further:

| File | What is Dubai-specific | Berlin equivalent |
|---|---|---|
| `src/lib/phone.ts` | UAE mobile normalisation to `+9715…` | German mobile normalisation to `+49 15x/16x/17x`, or switch auth to email |
| `src/lib/catalog.ts` | `formatAed` | `formatEur`, and German number formatting (comma decimal) |
| `supabase/config.toml` | Four `+971` test sign-in numbers | Four `+49` numbers, or email sign-in via the local mail catcher |
| `supabase/seed.sql` | Business Bay and Marina polygons, AED prices | Two Berlin district polygons, EUR prices |
| `supabase/migrations/0001`, `0003` | `^\+9715\d{8}$` phone CHECK | German phone pattern |
| `supabase/tests/0001`, `0003`, `0004` | Fixture numbers and coordinates | Same fixtures, German values |
| Page copy | "across Dubai", "UAE mobile numbers only" | Berlin equivalents |

Roughly a day of work, and every one of those files has tests that will fail
loudly if a value is missed.

**Two things are not just find-and-replace**, and belong in a spec rather than
a patch:

- **Auth method.** Phone codes suit Dubai, where WhatsApp is the channel and
  every competitor sells on it. A German B2B office manager is more naturally
  reached by email, and email sign-in is simpler to run locally. This is a
  product decision, not a string change.
- **Consumer subscription law.** Germany requires a cancellation button
  reachable without logging in, caps initial terms, and grants a 14-day
  withdrawal right that needs explicit consent to start service early. None of
  that applies in the UAE. If Berlin B2C ever ships, it is a feature of its
  own.

Also worth noting: Berlin changes the cadence default. The German trade runs
two to four week visits on sub-irrigated planters because labour is expensive,
and the research favours that on cost grounds. Weekly becomes a paid tier
rather than the default.

## Recommendation

Take Berlin unless relocation or a local partner is real. Then, before writing
feature 002, spend the fortnight on the five Tier 1 questions in
`docs/research/RESEARCH.md` §12 — a demand test, real search volume, three
subcontractor quotes, one trade plant price list, and ten timed visits. Every
one of them replaces an estimate in the model with a fact, and four of them
cost almost nothing but time.
