# Planty — Market Research Findings

**Compiled**: 2026-09-10 · **Method**: 14 parallel research lenses, ~350 web
searches and page reads, September 2026
**Detail**: every claim below traces to [`raw/`](raw/), where each figure
carries its source URL and year.

A note on confidence. Figures are labelled by where they come from. **Observed**
means a published price or statistic with a URL. **Estimate** means arithmetic
built on observed inputs, and the weakest of those are called out. The single
biggest gap is that **no plant-rental company in Dubai publishes a price**, so
every Dubai rental rate in this report is derived, not seen.

---

## 1. Executive summary

**The opportunity.** Renting plants with maintenance included is a real,
established business — but everywhere it exists it is sold by quotation, over
the phone, after a site visit. Across Germany, the UAE, the UK, the US and the
Netherlands, not one operator lets a customer configure a basket and subscribe
online. That is the gap.

**Recommended launch market: Dubai.** Four findings drive it. Dubai competitors
are uniformly quote-only, so transparent pricing is a genuine wedge; a paid
recurring plant-care habit already exists there at AED 120–799 per month, which
Berlin has no consumer equivalent of; technician labour is roughly four to five
times cheaper, which is what makes the weekly visit the founder described
affordable at all; and weekly visits are the local norm rather than an
expensive promise. Berlin is the harder market: an established, well-funded
direct analogue already serves 150+ offices there, the cadence norm is two to
four weeks because labour is expensive, and per-capita consumer spend on green
houseplants is under six euros a year.

**Recommended MVP.** B2B-first. A published catalogue with real monthly prices,
a basket, a self-serve subscription, and a weekly visit that produces a photo
and a condition note the customer can see. Nothing else.

**Pricing hypothesis.** A base service fee per site plus a per-plant monthly
rate by size. Roughly AED 45–65 for a desk plant, AED 85–110 for a floor plant,
AED 145–185 for a statement plant, on top of an AED 250 monthly service fee for
weekly visits. Every number here needs three real competitor quotes before it
is trusted.

**The five risks that matter**, in order: route density below break-even; the
weekly-visit promise costing more than it earns; plant mortality above the
replacement allowance; inventory bought ahead of demand; and a solo founder
becoming the field operation. Each is discussed in §9.

**Validate first**: whether a founder resident in Germany can license and
operate a field-service business in Dubai. Everything else in this report is
downstream of that answer.

---

## 2. What the idea actually is

Two different businesses share one operation.

**For offices**, greenery is an employee-experience purchase with no owner.
Someone buys plants, a volunteer waters them, they die within a quarter. The
job to be done is *make the office feel cared-for without making it my
problem*. The buyer is an office or people manager, the decision is fast, and
the contract value is a few thousand dirhams a year. Evidence for the wellbeing
case is real but old and thin: the widely-cited productivity uplift comes from
2014 field experiments in two commercial offices, and the 2015 Human Spaces
survey of 7,600 workers found 58% had no live plants at their workspace. Treat
these as sales collateral, not as proof of demand.

**For homes**, the job is *have a green home without becoming a plant person*.
This is where the evidence divides sharply by market, and it is the crux of the
launch decision — see §4.

The value Planty adds over buying plants is not the plants. It is that nobody
has to notice them.

---

## 3. Competitive landscape

### Germany — transparent, crowded, and priced against you

| Operator | Price (net of VAT) | Cadence | Minimum term |
|---|---|---|---|
| plantclub (Berlin) | From €200/month, ≤150 m²; €400 ≤500 m²; €600 ≤1,000 m² | 2 weeks | 12 months, billed yearly |
| WELO Green | From €199/month ≤200 m²; €299 ≤400 m² | 3 weeks | 12 months, then monthly |
| Gärtner Gregg | €6.90–22.90 per plant/month, plus travel | ~4 weeks | 12 months |
| Kremkau | €14.90 per plant/month | Monthly | 36 months |
| P2 Objekt Grün (Berlin) | Quote; min. €2,000 asset value, min. 5 plants | — | 36 months |
| Büropflanzen Pflege Berlin (care only) | €299/month for ≤30 plants | 2 weeks | — |

plantclub is the direct analogue: founded 2020 by ex-N26 and ex-Rocket
Internet operators, now in seven cities, naming Figma, Netflix, N26 and Babbel
as clients, and claiming 150+ Berlin members. It moved from per-plant monthly
pricing to square-metre yearly tiers, which reads as a retreat from the exact
model Planty proposes.

### Dubai — opaque, WhatsApp-first, no published rental price anywhere

| Operator | What is published | Cadence |
|---|---|---|
| 800petals (since 1992) | Nothing. "Quoted per plant per month, all-inclusive"; most clients take 12 months | Weekly |
| Plantscapes (Desert Group) | Nothing. 12–24 month agreements | Weekly |
| Plantsworld | Purchase prices only, AED 244–789 per office plant with pot; rental via WhatsApp | — |
| Royal Plantscape (care only) | AED 120 monthly visit · 299 fortnightly · 499 weekly · 799 twice weekly | Chosen |
| Green Beetle (care only) | AED 400/month ≤15 plants; AED 700 for 15–40 | Weekly or fortnightly |
| Plants Xpert (care only) | From AED 149/month | Weekly or fortnightly |
| Greenly (care only, app) | AED 179 per care visit, AED 99 watering; **books in an app with upfront prices** | On demand |

Two things stand out. First, the rental companies publish nothing, while the
maintenance-only companies publish everything — which means the *price-visible*
part of the Dubai market is the part that does not supply plants. Second,
Greenly proves Dubai residents will book plant care in an app at listed prices.
That is the closest thing to direct evidence that Planty's self-serve model can
work in this market.

### Consumer plant subscriptions have a poor survival record

Horti (US, bootstrapped, a Wirecutter pick) closed in May 2025 after seven
years — the founders chose closure over sale, which says something about the
enterprise value of a small subscription plant business. Leaf Envy (UK) was
dissolved in April 2026. The Plant Box (Cologne, backed after a Dragon's Den
appearance, roughly €1M revenue) filed for insolvency in July 2023 when margins
fell below 50%. Horticure, a Berlin rent-to-own houseplant service from 2020 at
€20/month, no longer exists.

Adjacent rental categories tell the same story. Feather and Fernish, both US
consumer furniture rental, sold in distress in November 2023; Feather has since
stopped renting entirely. Grover, the Berlin tech-rental company, went through
a StaRUG restructuring. Swapfiets is ten years in and still lossmaking.

The common thread is not demand. It is cost per stop and capex against churn.

---

## 4. The launch-market decision

| | Dubai | Berlin |
|---|---|---|
| Direct analogue | None self-serve | plantclub, funded, 150+ offices |
| Price transparency | Nobody publishes | Everyone publishes |
| Weekly visits | The marketed norm | Nobody offers it |
| Consumer recurring plant spend | AED 120–799/month, observed | No published tariff found |
| Technician cost (estimate) | AED 19–23/hour loaded | €22–25/hour loaded |
| Office market | 92% occupancy, 95% Grade A, 2.3m sq ft new supply 2026 | Contested across brokers |
| Regulatory load on a consumer subscription | Lighter | Heavy: withdrawal right, cancellation button, term limits |
| Founder presence | **Not resident** | Resident |

**Recommendation: Dubai**, with one condition.

The case is strongest on the two things that decide this business. Labour is
the dominant cost of a visit, and Dubai's is a fraction of Berlin's — which is
why weekly service is normal there and unavailable here. And the market's
opacity is a standing invitation: a customer who wants to know what office
plants cost in Dubai currently cannot find out without a phone call.

Berlin's disadvantages are not fixable by execution. Competing against
plantclub means matching a €200 floor with 2-weekly visits, in a market where
the average person spends under €6 a year on green houseplants, under German
consumer-subscription law that caps terms and mandates a cancellation button.

**The condition.** The founder lives in Germany. A Dubai field-service business
needs a trade licence with the right activity, a local entity for payment
processing, and someone physically driving a route every week. The research
could not resolve whether a non-resident founder can hold that licence and open
the bank account payment onboarding requires. A plausible path is to
subcontract visits to an existing Dubai maintenance operator while Planty owns
the customer, the product and the plants — several such operators already sell
per-visit maintenance at published rates. **Until this is answered, Dubai is an
assumption, not a decision.**

What would change the recommendation: if the licensing path proves closed, or
if three mystery-shopped Dubai quotes come back far below the modelled rates,
Berlin B2B becomes the fallback — but as a care-and-rental business at
fortnightly cadence, not the weekly model described in the brief.

---

## 5. Customers

**Office and people managers at 20–100 person companies** are the primary
buyer. In startups this person is often among the first hires and owns the
office as one of many responsibilities. They decide quickly, sometimes alone,
and the purchase is small enough to avoid procurement. They object to lock-in
before they object to price: 12 months is the industry norm, 36 at the older
German firms, and only a few operators advertise no minimum term.

**Coworking operators** are a natural beachhead. Dubai had 129 coworking spaces
as of April 2026. They compete on amenities, they buy many plants at one
address, and the address is the product — so they churn less than a tenant
would.

**Hotels, clinics and showrooms** pay more for statement plants and need
out-of-hours visits.

**Consumers** split by market. In Dubai the segment is visible and already
paying: expatriates who travel for weeks in summer, apartment renters who have
killed everything they bought, and villa households that already employ a
gardener for outdoors. In Berlin no equivalent paid behaviour surfaced at all.

One consumer-side number is worth holding on to: in surveys, over half of
houseplant owners report having killed several plants, with overwatering the
most-cited cause. The product is not selling plants. It is selling the removal
of a small recurring guilt.

---

## 6. Unit economics

The trade prices a rental contract as **replacement allowance plus labour**.
The standard formula from interiorscape practice is labour = visit hours ×
hourly rate × visits per month, and replacement allowance = retail plant price
× 1.3–1.5, divided over twelve months.

**Observed inputs.** Office-grade plants with pots retail at AED 244–789 in
Dubai; small nursery plants run AED 25–85. Dubai maintenance-only contracts
imply AED 17–27 per plant per month at 15–40 plants. A Berlin care-only
operator publishes €299 per month for up to 30 plants fortnightly and states
that about 40% of revenue survives VAT and employer contributions, with roughly
70 minutes of travel and setup per visit. US all-inclusive rental runs $20–35
for small plants, $40–75 medium, $90–150 large, typically with a $100–200
monthly minimum and fortnightly watering.

**Estimated inputs** (weakest first, all needing validation): Dubai wholesale
plant cost at 50–60% of retail; annual replacement at 25–40% of fleet cost;
loaded technician cost at AED 19–23 per hour; 2.5–3 minutes of care per plant
plus 10–15 minutes per site; and a delivery cost of AED 12–18 per stop.

**What the model says.** At 15 plants per office stop and weekly visits, the
maintenance labour alone lands near AED 25–30 per plant per month, and plant
capex amortised with a replacement allowance adds roughly AED 10–16. That
supports an all-inclusive rate in the AED 45–110 band by size, which is where
the pricing hypothesis in the PRD sits. It does **not** support weekly visits
to a four-plant apartment: the same site overhead spread over four plants is
the shape that kills these businesses.

The two numbers that decide viability are **plants per stop** and **stops per
technician-day**. Everything else is second order.

---

## 7. Operations

Professional operators do not visit weekly by default. German rental firms run
two to four week cadences, made possible by hydroculture and self-watering
planters with water-level indicators. Dubai operators market weekly visits.
Self-watering systems have a catch worth knowing: sub-irrigated planters need a
growing-in period of around twelve weeks before they reach their low-maintenance
state, which argues for pre-planting and holding stock rather than delivering
straight from a nursery.

A visit is: check moisture, water, remove spent leaves, trim, wipe foliage,
rotate toward the light, inspect for pests, top up substrate, and record what
was found. US technicians on published job ads cover between five and twenty
sites a day on routes of four to six hours. A Berlin operator confines itself to
a ten-kilometre radius and only accepts customers who fit an existing route.
That constraint is the whole business model in one sentence.

Climate cuts both ways. Foliage plants ship safely between 15 and 18 °C;
Berlin risks chilling injury from November to March, and Dubai risks cooking
plants in a closed van in summer. Dubai interiors run 18–22 °C at 30–40%
humidity against tropical plants evolved for 60–80%, and placing a plant within
a metre of an air-conditioning vent browns its tips within a week.

"Seasonal freshness" in the trade means something specific: a permanent foliage
backbone that is replaced only on decline, plus a small set of flowering plants
rotated every four to eight weeks. Orchids hold bloom for eight to twelve weeks
in Dubai; bromeliads two to four months. Nobody rotates the foliage — acclimating
a specimen takes three to eighteen months. Planty's marketing promise should be
mapped onto that structure rather than implying everything changes.

---

## 8. Product and technology

The product gap is unambiguous: **no plant-rental provider in any researched
market sells online**. The patterns worth copying come from adjacent
categories — a duration selector that reprices the whole basket, with the
longest term as the anchor and short terms visibly more expensive; delivery
days limited to days the operator already drives; access details collected
after payment rather than in checkout; and a rotation entitlement modelled as
counted swap credits that unlock per billing period and do not carry over.

Two warnings from the benchmarks. Every surviving rental business has moved
toward minimum terms and away from pause features. And consumer furniture
rental, the closest structural analogue, collapsed into business-to-business.

On technology, the stack the founder already uses fits. Stripe operates in the
UAE at 2.9% plus AED 1 and supports subscriptions and invoicing, but requires a
UAE trade licence — which ties the payment decision to the licensing question in
§4. There is no bank-debit method for the UAE on Stripe, so recurring consumer
billing is card-on-file and business customers pay against invoices. Recurring
visits are best generated as rows on a short horizon by a scheduled database
job, so a cancellation cannot orphan future work. Route optimisation is not
worth buying below three technicians. Dubai has no postal codes, so the address
is a map pin plus optionally a Makani building code. WhatsApp is the
notification channel: over 90% of UAE smartphone users open it daily and every
competitor already sells on it.

---

## 9. Risks

| Risk | Why it is serious | Mitigation | Watch |
|---|---|---|---|
| Route density below break-even | The failure mode of every comparable rental business | One district cluster; minimum basket per stop; B2B first | Paying stops per technician-day ≥ 8 |
| Weekly visits unaffordable | No German operator offers weekly; it only works on cheap labour | Price cadence as a tier; self-watering planters | Visit labour ≤ 30% of monthly revenue |
| Mortality above allowance | Dubai air conditioning at 30–40% humidity; no published rate exists anywhere | Hardy palette; pre-acclimated stock; measure from month one | Replacement ≤ 4% of fleet per month |
| Capex ahead of demand | Feather and Grover both bought inventory before revenue | Buy per signed contract; take first month upfront | Contracted revenue ≥ inventory spend |
| Founder becomes the operation | Horti closed partly on founder fatigue | Subcontract or hire a horticulturist early | Founder time on field work < 30% by day 90 |
| Short terms make delivery uneconomic | Two-week rentals cost the same to deliver as twelve-month ones | Minimum three months; sell short terms as events | Share of orders under three months |
| Consumer rental is unproven | It has never worked anywhere researched | Treat B2C as an experiment on an existing route | Month-3 consumer retention |

---

## 10. What to do in the first 90 days

1. **Answer the licensing question.** Everything else is contingent on it.
2. **Mystery-shop three Dubai quotes.** This replaces the entire pricing
   hypothesis with evidence, and it costs nothing but time.
3. **Get one wholesale plant and planter quote** from a Dubai nursery. Plant
   capex and payback depend on it and only retail prices were obtainable.
4. **Pick one district cluster** and do not leave it. Business Bay and the
   Marina were used as the seeded zones for a reason.
5. **Sign ten offices with at least eight plants each** before signing any
   consumer. Measure plants per stop from the first day.
6. **Instrument mortality and visit duration** from the first visit. Both are
   currently estimates, and both decide whether the model works.

---

## 11. Open questions the research could not close

- Whether a Germany-resident founder can license, bank and operate in Dubai,
  and whether an existing operator will subcontract routes.
- Real per-plant rental rates in Dubai. Nobody publishes them.
- Annual plant replacement rate under professional maintenance. No published
  figure exists in any market, in any trade source found.
- Wholesale plant and planter costs in Dubai.
- Whether weekly or fortnightly is the right default once self-watering
  planters are in use. This materially changes the unit economics.
- Whether UAE consumer law requires Arabic contract terms before commercial
  launch.

---

## 12. Where the detail lives

Each file below holds the full notes for one lens, with every source URL and
year.

| Lens | File |
|---|---|
| Market size and growth | [`raw/market-size.md`](raw/market-size.md) |
| B2B competitors | [`raw/competitors-b2b.md`](raw/competitors-b2b.md) |
| B2C subscriptions | [`raw/competitors-b2c.md`](raw/competitors-b2c.md) |
| Germany and Berlin | [`raw/market-germany.md`](raw/market-germany.md) |
| Dubai and the UAE | [`raw/market-uae.md`](raw/market-uae.md) |
| Unit economics | [`raw/unit-economics.md`](raw/unit-economics.md) |
| Operations | [`raw/operations.md`](raw/operations.md) |
| Customers | [`raw/customers.md`](raw/customers.md) |
| Product and UX | [`raw/product-ux.md`](raw/product-ux.md) |
| Legal and compliance | [`raw/legal.md`](raw/legal.md) |
| Technical architecture | [`raw/tech.md`](raw/tech.md) |
| Risks and failures | [`raw/risks.md`](raw/risks.md) |
| Go-to-market | [`raw/gtm.md`](raw/gtm.md) |
| Plant catalogue and rotation | [`raw/plant-catalog.md`](raw/plant-catalog.md) |
