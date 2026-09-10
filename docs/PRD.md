# Planty — Product Requirements Document

**Version**: 1.1 · **Date**: 2026-09-10 · **Status**: Draft for MVP
**Market**: OPEN — built for Dubai, research recommends Berlin. See
[the market decision](DECISION-market.md) and §3.
**Evidence base**: `docs/research/` (14 research lenses, Sept 2026)

---

## 1. Problem Statement

People and companies want plants in their space. Almost nobody wants to be
responsible for keeping them alive.

**For offices**, greenery is an employee-experience purchase that nobody owns.
It is bought once, watered by a volunteer, killed within a quarter, and
replaced by plastic. The buyer — usually an office manager — has no supplier
they can compare, because in Dubai **every plant-rental company sells by
quote only**. Not one publishes a price. Buying greenery means a WhatsApp
thread, a site visit, and a PDF, for a purchase worth a few thousand dirhams
a year.

**For homes**, the problem is sharper and already being paid for. Dubai
interiors run at 18–22 °C and 30–40% humidity against 45 °C outside; plants
bought at a nursery on Friday are struggling by the following month.
A visible market of paid plant-care services exists today at AED 120–799 per
month, and residents leave the country for weeks each summer with nobody to
water anything. The money is being spent. It is being spent on maintaining
plants the customer already bought and will eventually kill.

Nobody in the market connects the two halves: **supply the plants, own the
outcome, and let the customer buy it online in three minutes.**

## 2. Product Vision

*Greenery as a subscription, priced like software and delivered like a
service.*

Open Planty, pick a bundle or individual plants, choose how long, enter your
address, pay. Plants arrive installed. A technician comes every week, and
after every visit you get a photo of your plants and a note on their
condition. Plants that decline are replaced, not invoiced. Every quarter you
get a fresh seasonal set. When you no longer want them, they go away.

The customer never owns a plant, never buys a pot, never carries a watering
can, and never sees a dead plant on a windowsill.

## 3. Launch market — reopened, and now favouring Berlin

> **Status, 2026-09-10.** This section originally argued for Dubai, and
> feature 001 was built against it. The completed research programme then
> reversed the recommendation to **Berlin, B2B only**
> (`docs/research/RESEARCH.md` §5). Both cases are kept below, because the
> founder holds one fact that decides between them. The Dubai case is
> genuine on demand; it fails on two things that turned out to matter more.

### 3.1 Why the recommendation flipped

**You cannot observe a price in Dubai.** Eight competitor pages were fetched
directly and not one carried an AED rental rate. Modelling the same
25-display Dubai office at the two prices that circulate returns roughly 61%
contribution margin at one and roughly 7% at the other — a spread nobody in
the programme could close. Berlin, by contrast, has a published price
grammar: a €6.90–22.90 per-display rate card, a €199–200 monthly entry point
confirmed by three independent vendors, and a €299 care-only benchmark.
Launching into a market whose clearing price you cannot see is a different
category of risk from launching into a crowded one whose prices are printed
on four websites.

**The founder is in Germany and this is a route business.** A technician has
to stand in the room every two to three weeks. A Berlin incumbent trading for
25 years voluntarily restricts itself to two boroughs. No lens found a
costed way to run a Dubai route remotely on day one.

One correction to the earlier draft: it claimed Dubai labour is four to five
times cheaper and treated that as decisive. The underlying figures span 6x
within a single source set, and Dubai's published revenue per site is also
lower — roughly €119 for 4.33 weekly visits against €299 for 2.17 fortnightly
visits in Berlin. Cheap labour does not by itself mean better margin.

### 3.2 What would move it back to Dubai

Any one of these reopens the decision, and the first is the founder's alone:

1. The founder relocates, or secures a named local operating partner willing
   to run the route. This is the largest single weight in the scorecard.
2. Three mystery-shopped quotes from Dubai incumbents for a defined 20-plant
   Business Bay office come back at or above roughly AED 900 per month. Three
   WhatsApp messages, one week, and it closes the price-legibility gap.
3. A Berlin demand test fails — negligible search volume, or office managers
   who reach the cart and will not proceed without a survey.

### 3.3 The original Dubai case, kept for the record

The decision below rested on four findings.

| Factor | Dubai | Berlin |
|---|---|---|
| **Competitor pricing** | Quote-only across every operator found. No public per-plant rental price exists. | Fully transparent: plantclub from €200/mo (≤150 m²), hydroculture firms €6.90–22.90/plant/mo, 12–36 month terms |
| **Direct analogue** | None doing self-serve online | plantclub, VC-style, 150+ Berlin teams incl. Figma, Netflix, N26 |
| **Weekly visits** | The market norm (800petals, Plantscapes) | Nobody offers weekly; hydroculture at 2–4 weeks is the standard, and labour cost makes weekly uneconomic |
| **B2C recurring demand** | Real and priced: AED 120–799/mo maintenance packages sold today; app-based on-demand plant care exists | No published consumer plant-rental or plant-care tariff found; per-capita spend on green houseplants is under €6/year |
| **Technician cost** | ≈ AED 19–23/hour fully loaded (est.) | ≈ €22–25/hour fully loaded (est.), roughly 4–5× higher |
| **Office demand** | 92% citywide occupancy, 95% Grade A, rents +22% YoY, 2.3m sq ft new supply in 2026 and 4.1m in 2027 | Contested inputs across brokers; a softer, more crowded market |

The founder's own product description — weekly maintenance visits, villas,
offices — describes the Dubai market's norms, not Berlin's. Berlin would
require competing on price against an established, better-capitalised direct
analogue, in a market where the weekly-visit promise cannot be afforded.

**This decision has one unresolved dependency**, recorded in §10: the founder
is currently resident in Germany, and a Dubai field-service business needs a
UAE trade licence, a local entity for payment processing, and someone
physically running routes. That question is a go/no-go on the market, not on
the product.

## 4. Personas

| Persona | Description | Primary need |
|---|---|---|
| **Nadia, 31, office manager** | Runs the office for a 40-person tech company in Business Bay; owns the space, the snacks, the vibe | Make the office feel alive without owning a plant-death problem; one invoice, no admin |
| **Karim, 38, coworking operator** | Runs two flex-office floors in JLT competing on amenities | Differentiate the space; predictable monthly cost; zero disruption to members |
| **Priya, 34, apartment renter** | Expat in Marina, travels often, has killed every plant she has bought | A green home that stays green while she is away |
| **Mrs. Al Suwaidi, 52, villa owner** | Large home in Jumeirah; already employs a gardener for outdoors | Indoor greenery handled to the same standard as her garden, by someone accountable |
| **Tariq, 29, Planty technician** | Runs a daily route of 8–12 sites in a van | Know exactly where to go, what to do at each stop, and log it in under a minute per plant |

## 5. MVP Scope (v1)

### In scope

1. **Accounts and organizations** — sign-in for individual customers and for
   business accounts with multiple members. Internal operator and technician
   roles.
2. **Service zones** — a bounded set of Dubai zones. Addresses are captured
   with a map pin (Dubai has no postal codes) and validated against zones.
   Out-of-zone addresses join a waitlist instead of checking out.
3. **Plant catalog** — a curated set of plants proven for Dubai interiors,
   each with size options, light requirement, pet-safety flag, photo, and a
   published monthly rental price.
4. **Configure and price** — browse the catalog or start from a bundle
   (Office S/M/L, Home, Villa), set quantities, pick a term and visit
   cadence, see the exact monthly total update live. No sales call.
5. **Checkout and subscription** — pay, book an installation slot on a day
   Planty already serves that zone, and get a subscription with a clear term,
   renewal behaviour and cancellation path.
6. **Visit engine** — recurring visits generated automatically per
   subscription; a technician view showing today's ordered stops, a per-stop
   checklist, per-plant condition capture and required photos; visits are not
   complete without their record.
7. **Proof-of-service feed** — the customer sees every past visit with photos,
   plant conditions and what was done.
8. **Rotation and replacement** — a counted seasonal-rotation entitlement per
   billing period that the customer can spend from the app, and a
   replacement request flow for a declining plant.
9. **Ops console (minimal)** — internal screens to manage the catalog, stock,
   physical plant assets, zones, technicians, and to assign and order each
   day's route.

### Out of scope (v1) — explicitly deferred

- Arabic / RTL localisation *(a launch-blocker for commercial trading in the
  UAE, tracked separately from MVP feature work)*
- Native mobile apps — the MVP is an installable PWA
- Automated route optimisation (manual ordering until 3+ technicians)
- Outdoor / villa garden landscaping — indoor plants only
- Event and short-term (under one month) rental — different logistics business
- Green walls, moss walls, planters as a design product
- Multi-city, multi-currency, multi-language architecture
- Self-serve B2B procurement flows (POs, tenders, e-invoicing) — corporates
  are onboarded with a normal invoice until volume demands more
- Marketplace of third-party gardeners; Planty employs or contracts its own
- IoT soil sensors, plant-health ML, AR placement previews

## 6. The Rental Model (core mechanics)

**Pricing shape.** A subscription is a base service fee per site plus a
per-plant monthly rate by size tier. This structure is proven in mature
interiorscape markets and it prices the two real costs separately: the visit
(per site) and the plant (per unit).

```
monthly total = base service fee (by cadence and zone)
              + Σ (plant tier rate × quantity)
              × term multiplier
```

Longer terms lower the monthly rate. Shorter terms are visibly more
expensive, never unavailable.

**Term and renewal.** Business subscriptions default to 12 months, then
continue month to month. Consumer subscriptions have a 3-month minimum, then
continue month to month with a one-month notice, cancellable from the app
without contacting anyone.

**Cadence.** Weekly is the default and the Dubai norm. Fortnightly is a
cheaper tier. Cadence is a priced choice, never a silent downgrade.

**What a visit includes.** Check moisture, water, remove spent leaves, trim,
wipe foliage, rotate toward light, inspect for pests, top up substrate,
record per-plant condition, photograph. Chemical plant-protection products
are not used; control is mechanical, biological, or by swapping the plant out.

**Replacement.** A plant that declines through normal service is replaced at
no charge. The customer's own contract view states the exclusions plainly:
damage by others, blocked access on a scheduled visit, plants moved without
telling us, and conditions outside the agreed light and climate range.

**Seasonal rotation.** The permanent foliage set stays and is replaced only
on decline. Seasonal variety is delivered as a **counted rotation
entitlement** — a number of plants per billing period the customer can swap
for a fresh seasonal selection, spent from the app and collected on the next
scheduled visit. Entitlements do not accumulate.

**Assets.** Every physical plant is a tracked asset with a label, a location,
a condition history and an allocation. One plant cannot be at two customers.

## 7. Pricing Hypothesis

These are **hypotheses to validate, not decisions**. Prices live in the
database as data, so testing them costs nothing in engineering time.

| Tier | Example | Hypothesis (AED/plant/month) |
|---|---|---|
| Desk / small | Sansevieria, ZZ, pothos in a 17 cm planter | 45–65 |
| Floor / medium | Aglaonema, Dracaena, Schefflera, 1.0–1.4 m | 85–110 |
| Statement / large | Kentia, Areca, Ficus, Strelitzia, 1.6–1.8 m | 145–185 |

Base service fee hypothesis: AED 250/month weekly, AED 150/month fortnightly,
per site. Minimum subscription AED 400/month for business, AED 300/month for
consumer.

**Anchors this must beat or match.** Dubai maintenance-only packages run
AED 400/month for up to 15 plants and AED 700 for 15–40, but the customer
owns and replaces the plants. Office-grade plants with pots retail at
AED 244–789 each. US all-inclusive rental runs roughly AED 73–128 for small
and AED 147–275 for medium plants per month.

**Highest-priority validation**: obtain three real quotes from Dubai
incumbents. No public per-plant rental price exists anywhere in the market,
so every number above is derived from adjacent prices, not observed.

## 8. Success Metrics (first 90 days after launch)

| Metric | Target | Why it matters |
|---|---|---|
| Paying stops per technician-day | ≥ 8 | Principle I — the business dies below this |
| Visit labour as share of MRR | ≤ 30% | Contribution margin |
| Plant replacement rate | ≤ 4% of fleet per month | The replacement allowance in pricing |
| Business accounts with ≥ 10 plants | ≥ 10 | Proves the B2B basket |
| Subscriptions completed with no sales call | ≥ 40% | Proves the self-serve wedge |
| Visits with complete photo + condition record | 100% | Principle IV |
| Month-3 retention (business) | ≥ 80% | Term economics |
| Configure-to-checkout completion | ≥ 25% | Product funnel health |

## 9. Technical Direction

Details live in the per-feature plans; this is the shape.

- **Frontend**: one mobile-first Next.js (App Router) codebase serving
  customer, technician and operator surfaces. Installable PWA. No native app.
- **Backend**: Supabase — Postgres with RLS as the security boundary, Auth,
  Storage for visit photos, Edge Functions for trusted webhooks.
- **Pricing and subscription state**: computed and enforced in Postgres, not
  the client. Payment provider holds the money movement; Planty holds the
  truth about what a subscription contains.
- **Visit generation**: recurring visit rows materialised on a schedule by a
  database job over a short horizon, so pauses and cancellations cannot
  orphan future work. Route order is manual in the MVP.
- **Addresses**: map pin as the source of truth, with an optional Makani
  code. Zones are stored as polygons and validated at checkout.
- **Notifications**: WhatsApp is the dominant channel in the UAE and every
  competitor sells on it. One notification service, templates per event.
- **Asset tracking**: each physical plant is a row with a scannable label and
  an immutable event log.

## 10. Feature Roadmap (spec-kit units of work)

Each row becomes one `/speckit-specify` feature with its own spec → plan →
tasks → implement cycle.

| # | Feature | Depends on |
|---|---|---|
| 001 | Foundation: accounts, organizations, roles, service zones, addresses, plant catalog | — |
| 002 | Configure & price: catalog browsing, bundle builder, term/cadence selector, live pricing | 001 |
| 003 | Checkout & subscription: payment, installation booking, subscription lifecycle | 002 |
| 004 | Visit engine: visit generation, technician surface, checklists, photo proof of service | 001, 003 |
| 005 | Customer portal: proof-of-service feed, rotation entitlements, replacement requests, cancellation | 003, 004 |
| 006 | Ops console: stock and asset management, route assignment, replacement fulfilment | 004 |
| v2 | Arabic/RTL · route optimisation · B2B invoicing & e-invoicing · events · outdoor | MVP |

MVP is 001–006. The first demonstrable slice is 001–003: a customer can
configure a real basket at a real price and subscribe.

## 11. Open Questions

1. **Which market (the decision everything else waits on).** The research
   recommends Berlin B2B; feature 001 is built for Dubai. Only the founder
   knows whether relocation or a trusted Dubai operating partner is on the
   table, and that single fact decides it. If neither is, take Berlin. See §3
   for the reopening criteria and `docs/DECISION-market.md` for exactly what
   changes in the code either way.
2. **Real incumbent rental prices.** Nobody publishes them. Three
   mystery-shopped quotes would replace the entire pricing hypothesis with
   evidence.
3. **Replacement rate.** No published figure exists for professionally
   maintained interior plants. The pricing model carries an allowance that
   is currently an estimate; it must be measured from month one.
4. **Wholesale plant and planter costs in Dubai.** Only retail prices were
   obtainable. Plant capex and payback per subscription depend on this.
5. **Weekly vs fortnightly.** Weekly is the market's marketing norm, but
   self-watering planters may make fortnightly both cheaper and better for
   plant health. Which one Planty defaults to changes the unit economics
   materially.
6. **B2C viability.** Consumer plant *rental* is unproven everywhere
   researched, while consumer plant *care* clearly sells in Dubai. The MVP
   should be able to test both without betting on either.
7. **Arabic contract requirements.** UAE consumer law and its executive
   regulation may require Arabic for consumer-facing contract terms. Needs
   legal confirmation before commercial launch.
