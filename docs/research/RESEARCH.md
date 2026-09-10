# Planty — Definitive Research Report

**Rent-a-plant, with delivery, installation and recurring maintenance.
Launch-market decision, MVP scope, pricing and operating model.**

Compiled 2026-09-10 from fourteen research lenses. Full notes and every source URL
live in [`raw/`](raw/).

**Conventions used throughout this document**

- Every quantitative claim carries a **year** and a **source**. Where the year is the
  access date of an undated live page, it is written "(2026)".
- **[R]** = reported by the cited source. **[E]** = my own estimate or arithmetic,
  built on cited inputs. **[LOW-CONF]** = the source itself is thin, auto-generated,
  or contested by another source in this programme.
- The recommended market is Berlin, so **EUR is the primary currency**. AED equivalents
  are given in parentheses at **1 EUR ≈ 4.2 AED** [E]. The AED is hard-pegged to the
  USD at 3.6725; the EUR leg is the variable part, so treat conversions as ±5%.
- German B2B prices are quoted **net of VAT** unless stated, because that is how the
  entire German trade publishes them.

---

## 1. Executive summary

**The opportunity is real but much narrower than the brief assumes.** Office plant
rental is a decades-old, fragmented, quietly profitable trade in both candidate
markets. What does not exist anywhere — across roughly thirty companies checked in
Germany, the UAE, the UK, the US and Australia — is a plant rental you can actually
buy online without talking to a salesperson. Every incumbent ends its funnel at a
form, a phone number, or a WhatsApp thread. Ambius, the global category leader inside
Rentokil Initial, states plainly why on its London page: it has to account for "plant
species, number of plants, container size, quantity, location, installation time and
access" (ambius.co.uk, 2026). That gap between a published price and a completed
purchase is the whole of Planty's differentiation, and it maps precisely onto a solo
technical founder's comparative advantage.

**Recommended launch market: Berlin, B2B only, one or two districts.** This is not
because Berlin is the more attractive market — on demand signals alone Dubai wins
clearly, and several lenses said so. It is because the three inputs that would make
Dubai the answer are all unmeasured, while the three that make Berlin executable are
all settled. Dubai has no published plant-rental price anywhere in the market: eight
competitor pages were fetched directly and not one carried an AED rental rate
(800petals, Plantsworld, Plants Xpert, Adplants, Desert Blooms, Dubai Nursery,
Plantscapes, Hope Plants, all 2026). A modelled Dubai office swings from roughly 61%
contribution margin to roughly 7% depending on which unpublished price you assume
(§7). Berlin, by contrast, has a legible price grammar — €6.90 to €22.90 per display
per month net from a published German rate card (Gärtner Gregg, 2026), a €199–200
monthly entry point confirmed by three independent vendors, and a care-only benchmark
of €299/month net for up to 30 plants at fortnightly cadence (bueropflanzen-pflege.de,
2026). Above all, this is a business whose unit of production is a technician standing
in a room every two to three weeks, and the founder is in Germany. No amount of
market attractiveness survives an operator who cannot reach the route.

**Recommended MVP: a self-serve B2B office plant rental for small offices in one
Berlin cluster.** Published per-display pricing, an instant cart, a 3-month minimum
term billed monthly, three-weekly maintenance visits on sub-irrigated planters, free
replacement as a contractual SLA, and a technician visit app that logs condition and
photos per individual plant. Explicitly out of scope for v1: all B2C and villa tiers,
weekly visits as a default, seasonal rotation, route optimisation, a native app, and a
general admin panel.

**Pricing hypothesis.** Per-display list prices of €12 (small), €16 (medium floor) and
€22 (large floor or room divider) per month net, all-inclusive of sub-irrigation
planter, delivery, installation, three-weekly care and free replacement — sitting
inside the published German band. A €149/month net site minimum. Three published
bundles for instant checkout: **Studio €149 (10 displays), Team €289 (20 displays),
Floor €519 (35 displays)**, plus paid add-ons for weekly visits (+€89/month) and
quarterly colour rotation (+€29/month). 3-month minimum, then monthly with one
month's notice. No deposit, no setup fee — neither appears anywhere in the market.
Planty's Team tier at €289 for 20 displays sits deliberately beside WELO Green's €299
for 15–20 plant concepts (2026): the wedge is the term, the billing and the checkout,
never the headline price.

**The top five risks.**

1. **Nobody buys a plant scheme self-serve.** Every incumbent runs a site survey, and
   the survey may be load-bearing for trust and for setting light expectations. No
   lens found evidence that comparable recurring on-site office services sell
   self-serve online in either city, so the entire MVP thesis rests on an untested
   inference from the absence of a behaviour.
2. **Route density never arrives.** Vesta's CEO on acquiring both Feather and Fernish:
   subscription furniture companies have "really high fixed costs… It's what I call a
   black hole of money" (Business of Home, 2023). Both only became profitable inside
   someone else's existing logistics network.
3. **Plantclub already occupies the position.** Berlin, since 2020, 150+ Berlin
   members, Netflix/Figma/Babbel/GetYourGuide logos, per-district SEO, published tiers
   of €200/€400/€600, fortnightly visits (plantclub.io, 2026). After six years its
   home city is ~150 accounts and its second city ~30 — which bounds the prize as much
   as it bounds the threat.
4. **Asset capex outruns cash.** Grover raised over €303m in Berlin on the same
   "rent a physical asset" model and had its equity wiped out under a StaRUG plan
   confirmed 25 April 2025. A stressed plant has a worse residual curve than a used
   iPhone.
5. **Contribution margin is eaten by cadence.** Forcing the brief's weekly-visit
   promise onto a Berlin 20-display office drops contribution from ~64% to ~26% and
   pushes plant-capex payback past 15 months (§7).

**The single most important thing to validate first: will a Berlin office manager
complete a purchase without a site survey?** Run a fake-door test — a real priced
landing page with a working cart that stops at "we'll confirm your slot" — against
€300 of exact-match Google Ads on "Büropflanzen mieten Berlin" and equivalents, plus
ten in-person conversations in one district. Everything else in this report is a cost
question the founder can resolve in a fortnight with three subcontractor quotes and a
stopwatch. This is the one question that can only be answered by the market, and it
is the question the entire product is built on.

---

## 2. The idea and value proposition

### 2.1 What Planty is actually selling

Planty is not a plant company. It is a **rental plus recurring field-service company**
that happens to carry plants as its asset. That reframing matters because it changes
which comparables are instructive. The relevant failures are not other plant shops;
they are Feather, Fernish, Grover and Swapfiets (§11). The relevant cost driver is not
the plant; it is minutes-per-stop and kilometres-between-stops.

The mechanical promise has four parts, and only one of them is differentiated:

| Element | Is it a differentiator? | Evidence |
|---|---|---|
| Delivery, installation, decorative planter | **No — table stakes** | Bundled into the monthly price by every modern package found in DE, UAE, UK, US, AU |
| Scheduled maintenance visits | **No — table stakes** | Universal; only the cadence varies by market |
| Free replacement of declining plants | **No — table stakes** | "Pflanzengarantie" / "free replacements" advertised by Plantclub, WELO, Gärtner Gregg, Hydro Lesser, 800petals, MyDubaiPlants (all 2026) |
| Seasonal rotation for variety | **No — already offered** | Kinnula and Plantclub offer plant exchange; 800petals lists "seasonal rotation options"; MyDubaiPlants reserves it for its Enterprise tier (2026) |
| **Buying it online, at a published price, in five minutes** | **Yes — universally absent** | Zero of ~30 companies checked across four markets have self-serve checkout. Inleaf's postcode + display-count quote tool is the high-water mark and still hands off to sales (inleaf.co.uk, 2026) |
| **A genuinely short minimum term** | **Yes — nearly absent** | 12 months is the floor almost everywhere; 24–48 months at German legacy incumbents; 2bloom is the one Berlin player advertising "keine Mindestlaufzeiten" (2bloom.de, 2026) |
| **An account showing your plants, visit history and next visit** | **Yes — absent** | No incumbent found offers it. Even FolioGreen, the one purpose-built interiorscape platform, does not advertise per-plant QR asset scanning (foliogreen.com, 2026) |

The strategic consequence is blunt: **Planty's stated value proposition in the brief is
almost entirely table stakes.** The defensible positions are checkout, contract terms
and account visibility — all software, all inside a solo technical founder's
competence, and none of them about plants.

### 2.2 Jobs to be done — B2B

**Primary job (office manager / ops lead, 15–150 person company):** *"Make the office
look and feel cared-for, without adding a recurring chore to my week or a line item I
have to defend."*

The demand pain is well evidenced. In the Human Spaces study (Interface with Prof. Cary
Cooper, n=7,600 office workers across 16 countries, 2015), **"Only 42% report having
live plants in the office"** — meaning 58% of offices have none. That is the best
TAM-shaped statistic in this entire programme. The same dataset reports 47% have no
natural light and 33% say office design would affect their decision to work at a
company.

**But the standard ROI pitch does not survive an informed buyer, and this matters for
both candidate markets.** The famous "15% more productive" figure comes from
Nieuwenhuis et al. at Exeter (*Journal of Experimental Psychology: Applied*, published
online 28 July 2014), run in UK and Netherlands offices. In the 7,600-person Human
Spaces dataset, live plants specifically predicted productivity in **Canada, the
Netherlands and the Philippines** — and the report states for the UAE that "Neither
office colour nor the presence of natural elements had a direct impact on
productivity," while for Germany the productivity predictors were "natural light and
elements of natural stone", not plants. Germany's plant-related finding was on
creativity: "Providing internal green space had a positive effect on creativity."
Also, only **23% of EMEA workers** (vs 33% globally) said office design affects where
they work.

**Delete the "15% more productive" claim from all marketing.** A facilities buyer who
opens the underlying report can dismantle it in a minute. The three defensible B2B
pitches are:

1. **Operational offload** — nobody internally has to remember to water anything. This
   is not a research claim at all, just a service promise, and it is the honest one.
2. **Wellbeing, creativity and employer brand** — supported for Germany specifically on
   creativity, and 23% of EMEA workers is still one in four.
3. **Opex treatment and tax deductibility** — the argument German vendors actually
   lead with: "Mietzahlungen sind in der Regel Betriebsausgaben und damit steuerlich
   absetzbar" (airy.green, 2026); WELO frames it as costs spread "planbar auf
   monatliche Raten" (2026); hydroflora markets leasing on immediate expensing (2026).

**The central B2B objection is on the record and must be answered head-on.** A US
industry source states that rental "often costs 30% to 50% more" than purchasing over
three years (officeplants.com, August 2026), and a Berlin competitor concedes in
public that buying "is almost always the more economical choice" over a three-year
horizon (business.plantcircle.com, 2026). The answer is never price. It is risk
transfer (guaranteed replacement), zero internal labour hours, opex treatment, and —
uniquely for Planty — the ability to leave after three months.

### 2.3 Jobs to be done — B2C, and why it is cut

**The consumer job is real and beautifully specific:** *"Give me the look of a
plant-filled home without the guilt, the research, or the dead-plant walk of shame."*
An OnePoll survey of 2,000 US millennials commissioned by Article (2020) found 67% say
plant care is "more of a challenge than they bargained for", the average plant parent
"has killed seven plants", 22% are apprehensive about owning one because they killed
one before, and the motivations are aesthetic rather than botanical — 50% chose plants
because it "complemented their aesthetic", 47% "because it's trendy". That is exactly
the shape a rental-plus-service model fits.

**And it still does not clear in Germany, on four independent grounds.**

1. **Category spend is an order of magnitude too small.** Per ZVG (published January
   2026 for full-year 2025), the average German resident spent **under €6 in the whole
   of 2025 on green houseplants** and about €11 on flowering ones; the houseplant
   market shrank 4.5% to €1.4bn and total per-capita flower and plant spend fell more
   than €2 to about €102. A €25–40/month rental asks that household to raise its
   green-plant spend by 50–80x. That is category creation, not pricing.
2. **The substitute is nearly free.** IKEA Deutschland sells large floor plants at
   €6.99–€49.99 (2026): Monstera 21cm €14.99, Ficus microcarpa 19cm €9.99, Kentia 24cm
   €49.99. At any plausible rental price, buying pays back in one to two months. And
   Berlin's plant-enthusiast segment — Planty's most obvious persona — has an active
   free plant-swap culture (Pflanzentauschbörsen, Kleinanzeigen swap categories).
3. **The visit cannot be paid for.** A 4-display flat at €69/month net produces about
   €27 of contribution per month at three-weekly cadence and mature route density, and
   goes sharply negative at weekly cadence (§7). Add a plausible €265 CAC and payback
   runs past 13 months against consumer-goods churn of 4.1% per month (Recurly, 2025),
   which implies roughly 40% of a cohort gone within twelve months.
4. **A Berlin B2C plant subscription already failed this way.** The Plant Box, founded
   2020 in Berlin, took €150,000 from Höhle der Löwen investors in April 2022, reached
   nearly €1m revenue in 2022, and filed for insolvency on **28 July 2023** because
   "profit margins fell below 50 percent" under logistics and energy costs
   (myhomebook.de, 2023). Botanicly GmbH (Berlin) had its assets determined by the
   Charlottenburg court on 21 March 2024 and entered liquidation on 6 June 2024
   (Northdata). Planty's model is *more* logistics-heavy than either.

**The honest counter-case, which belongs on the record:** every one of those four
objections inverts in Dubai. Recurring in-home service is the household default there
(part-time cleaning at AED 30–50/hour, weekly or biweekly plans AED 300–1,000/month,
2026); plants genuinely die faster because AC drives apartment humidity to 25–40%
against the 60–80% tropicals want (2026); the population is ~92% expat with 208,030
residents added in the twelve months to November 2025, a structurally rental-preferring
group; and Greenly.ae already proves Dubai consumers book and pay for recurring plant
care in an app at published prices (AED 79–199 per service, 2026). If B2C is
strategically essential to the founder, that is an argument for Dubai, not for a
German consumer launch. It is not an argument for putting B2C in the MVP of either.

---

## 3. Market size and trends

### 3.1 The honest headline: there is no credible market size for this category

No association or research vendor publishes a market size for interior plant rental —
globally, in Germany, or in the UAE. The category is always subsumed into interior
landscaping, facility-management soft services, or "plant care services". The German
trade body for the category, the **Fachverband Raumbegrünung und Hydrokultur** within
the Zentralverband Gartenbau, publishes no industry revenue figure at all.

**Do not put a TAM slide in a deck.** Build the market case bottom-up from verifiable
anchors — competitor price points, a counted set of target buildings, and published
occupancy statistics. Two specific traps to avoid:

- A widely-surfaced IBISWorld figure of **"USD 28.1bn, 238,000 businesses" for US
  Office Plant Services is almost certainly mis-scoped** and could not be verified
  (the pages block automated fetch). It mirrors IBISWorld's *Landscaping Services*
  aggregates (USD 188.8bn, 2025). For scale, all US foliage-plant grower output was
  **USD 931.6m in 2024**. A services industry thirty times its own plant supply is
  implausible. **Do not use this figure.**
- Data quality across the space is poor. Published 2024–2025 estimates of the *same*
  global green wall market range across an order of magnitude, from USD 2.26bn to USD
  23.38bn. Mordor Intelligence restated its own UAE facility-management figure by
  roughly 2.6x between page versions. Use CAGR bands, never absolute levels.

### 3.2 The closest category-specific figures

| Metric | Value | Year | Source |
|---|---|---|---|
| Global "Plant Care Services" market | USD 3,806.7m | 2025 | Future Market Insights [R, MR] |
| — forecast | USD 9,620.6m (9.7% CAGR) | 2035 | same |
| — on-site visits share of service mode | **65.1%** | 2025 | same |
| — commercial offices share of customer type | **39.8%** | 2025 | same |
| — Germany CAGR | 10.6% | 2025–2035 | same; **no UAE CAGR published** |
| Rentokil Initial Hygiene & Wellbeing segment revenue (contains Ambius) | USD 1,205m, +4.3% (organic +2.3%) | FY2025 | Rentokil Initial Preliminary Results [R, CORP] |
| — adjusted operating margin | **18.6%** (FY24: 18.0%) | FY2025 | same |
| Landscaping services generally | 45–55% gross margin, 5–12% net | 2026 | realgreen.com, sideways8.com [R] |

FMI's methodology is opaque and it mixes B2B interiorscapers (Ambius, Planterra) with
D2C plant retailers (The Sill, Bloomscape), which inflates and blurs the absolute
number. **The segment shares are the useful part**: on-site visits are 65% of service
mode, and commercial offices are 40% of customer type. Both point at B2B and both
confirm that the visit — not the plant — is the product.

Rentokil's ~18.6% adjusted operating margin is the honest **ceiling** reference for a
route-based recurring-services business at global scale, with the caveat that the
segment is dominated by washroom hygiene rather than plants. Any Planty model showing
70%+ operating margin at low route density is wrong.

### 3.3 Germany and Berlin — a contracting consumer market, a softening office market

**Consumer side (bad, and structurally so).** Per ZVG, published 26 January 2026 for
full-year 2025: the total flowers and ornamental plants market fell to **EUR 8.5bn**
(from ~EUR 8.8bn in 2024); per-capita spend fell more than €2 to **~EUR 102**, six euros
below 2019; the **Zimmerpflanzen market came to EUR 1.4bn, down 4.5%** year on year;
per-capita spend on flowering houseplants was ~€11 and on **green houseplants under
€6**. ZVG frames this as structural — weakened purchasing power, not a blip. German
indoor-plant *production* also fell "um gut ein Fünftel" versus the 2020/21 survey, to
86 million pot plants from 1,016 businesses (BMEL/Destatis, survey July 2024–June 2025).

**Office side (mixed, and the sources disagree on level).** Three different vacancy
figures appear across this programme and they are not reconcilable at face value:

| Reported vacancy | Space available | Period | Source |
|---|---|---|---|
| 10.4% | 2.24m m² | end-2025 | Cushman & Wakefield, published 2026-01-14 |
| 8.2% → 8.4% | 1.94m m² | Q4 2025 → Q1 2026 | JLL |
| 8.6% | 1.98m m² | Q2 2026 | JLL, published 2026-07-14 |

JLL's series is internally consistent and shows a steady rise: **8.0% (Q2 2025) → 8.2%
(Q4 2025) → 8.4% (Q1 2026) → 8.6% (Q2 2026)**. Cushman & Wakefield's 10.4% for
end-2025 sits two points above JLL for the same quarter, which is a definitional
difference (stock base and treatment of sublease/shadow space) rather than a factual
dispute [E]. **Use the JLL series and cite it as one provider's definition.** The
direction is agreed by all three: vacancy is rising.

Take-up tells the opposite story and must be reported alongside it. Cushman & Wakefield
put FY2025 take-up at 484,200 m², down 11% year on year and 40% below the ten-year
average; JLL put H1 2026 take-up at **386,100 m² against 238,000 m² in H1 2025, +62%**,
26% above the five-year average. Prime rent rose to €48.00/m²/month in Q2 2026. The
read [E]: leasing is recovering but concentrating into prime stock while secondary
space empties.

**Two Berlin sub-signals matter more than the headline.** First, average transaction
size fell to **~600 m² in the first three quarters of 2025**, against just under
1,000 m² in the prior five comparable periods (CBRE, 2025) — more, smaller tenants,
which is exactly the segment legacy interiorscapers serve badly because manual quoting
does not pay at that size. Second, Berlin has **235 coworking spaces** listed for 2026
(betahaus) and **153 tracked flexible workspaces across seven districts** on a stricter
definition (One Coworking, 9 September 2026), with Mitte at 51 venues and Kreuzberg at
25 — the densest reachable B2B beachhead in the city.

**Demand-side context worth carrying into the sales deck:** Berlin flex pricing gives a
median dedicated desk at €299/month and a small private office at €490/desk/month (One
Coworking, 2026). A €289/month plant package is less than one dedicated desk.

**Return to office is weak in Germany.** Only **19% of employees** say their company
strictly requires more attendance and **just 8%** are back five days a week
(Universität Konstanz remote-work barometer, 2025). Empty desks do not buy plants.

### 3.4 Dubai and the UAE — every demand signal inverts

| Signal | Berlin | Dubai |
|---|---|---|
| Office vacancy | 8.6% and rising (JLL, Q2 2026) | prime **0.3%** (JLL via Real Asset Insight, Nov 2025); all-segment 7.7% → **6.1%** YoY (Q2 2026) [LOW-CONF, secondary] |
| Office rents | prime €48.00/m²/mo, +€2 YoY (Q2 2026) | **+20% YoY** to AED 191.9/sq ft (Cavendish Maxwell, Q1 2026) |
| Lease length | not reported | lengthening to **7–9 years** from 3–5 (CBRE, Q4 2025) |
| Five-day office week | 8% of employees (2025) | described as the norm and "inevitable" (The National, Aug 2025) |
| New company formation | not comparable | **71,830 new Dubai Chamber members in 2025**, 292,486 active at year end |
| Route density anchor | 153–235 coworking venues across the city | **DMCC/JLT alone exceeds 26,000 member companies** in a handful of towers (2025) |
| Category growth | houseplants −4.5% (2025) | UAE landscaping **USD 1.67bn (2024) → 2.84bn (2030), 9.07% CAGR** (TechSci, 2025) and **USD 1.8bn (2025) → 3.5bn (2032), 9.97%** (Vyansa, 2026) |
| Outsourcing norm | not measured | UAE FM growing 12.99% CAGR, soft services 12.33%, **64.88% already outsourced** (Mordor) |

Two independent vendors landing on ~USD 1.7–1.8bn and ~9–10% CAGR for UAE landscaping
is unusually good convergence for this space, though both are dominated by *outdoor*
work; interior plant rental is a slice of the softscape maintenance sub-segment. There
is also a fit-out-driven pipeline: **~8.2 million sq ft of prime office supply due
2025–2028, +86% versus the 4.4m sq ft delivered 2021–2024** (Knight Frank, published
2025), concentrated in DIFC, Sheikh Zayed Road, Expo City, JLT and Business Bay. Every
new Grade-A floor is an installation opportunity at move-in.

One genuinely useful correction to a common assumption: Dubai residents are **not**
especially transient. Average length of residency is **10.5 years**, and among tenants
it rose from **6.7 years (2024) to 9.9 years (2025)** (Betterhomes via Khaleej Times,
December 2025). The churn fear about a Dubai customer base is not supported.

### 3.5 Bottom-up sizing, and why both cities are small

These are **[E]** — my arithmetic on sourced inputs, shown so the vendor numbers can be
pressure-tested, not to be quoted as market sizes.

- **Berlin B2B:** 23.90m m² office stock (2025, sourced) × ~91.4% occupied at JLL's
  8.6% vacancy ≈ 21.8m m² occupied. At an assumed €0.30–0.60 per occupied m² per year
  of plant-rental spend (**unsourced assumption — the weak link**), Berlin's B2B
  interior plant rental market is on the order of **€7–13m/year**. Even at triple that
  assumption it is a low-tens-of-millions city market.
- **Dubai B2B:** UAE landscaping USD 1.67–1.8bn × ~60% softscape × Dubai ~36% ≈ USD
  360–390m Dubai softscape. Interior plantscaping is plausibly 3–8% of softscape
  (**unsourced assumption**) → **USD 11–31m/year**. Same order of magnitude as Berlin.
- **The scale reality check that needs no assumptions at all:** Plantclub, the
  category-defining Berlin startup, has ~150 Berlin members after six years and ~30 in
  Hamburg, its second city (plantclub.io, 2026). At its published €200–600 tiers that
  implies roughly **€0.5–1.4m ARR** across seven cities [E].

**This is a good small business, not a land grab.** Plan the company accordingly: it
should be capital-light, profitable early, and geographically tight. Any plan that
requires venture-scale outcomes from a single city is not supported by the evidence.

---

## 4. Competitive landscape

### 4.1 B2B — the office plant rental trade

All prices net of VAT where the source publishes net. "Quote only" means the page
carries no price and converts via form, phone or WhatsApp.

| Company | Market | Published price | Min. term | Cadence | Checkout? | Year |
|---|---|---|---|---|---|---|
| **Plantclub** | Berlin +6 cities | **€200** (≤150 m²) / **€400** (≤500 m²) / **€600** (≤1,000 m²), excl. VAT, **billed annually** | **12 mo** | every 2 weeks | No — "schedule a call" | 2026 |
| **WELO Green** | DE | **€199** (5–10 concepts, ≤200 m²) / **€299** (15–20, ≤400 m²) / **€649** (≤1,000 m²) | 12 mo, then monthly | every 3 weeks | No | 2026 |
| **Gärtner Gregg** | Münster/Dortmund | **€6.90** (Ø40 dish) → **€10.50–12.50** (wheeled floor) → **€13.50** (sideboard) → **€22.90** (room divider), per display/month net, plus travel | ~12 mo | ~every 4 weeks | No | 2026 |
| **Reiffer / objektbepflanzung** | Stuttgart | **from €9/plant/month**, **€75/month site minimum** | **2 years** | every 3 weeks | No | 2026 |
| **AS Hydroplant** | Düsseldorf | **€13.90/month** for a ~120cm Ficus Nitida incl. planter and service | n/s | incl. service | No | 2026 |
| **Kinnula Hydrokulturen** | Köln | **"Schon ab 6 Euro pro Monat"**; resells ex-lease plants from €15 incl. VAT | n/s | every 2–4 weeks | No | 2026 |
| **airy.green** | DE (care: Hamburg only) | single hydro plant **~€14.50/month**; ≤150 m² **from ~€200/month** | n/s | n/s | No | 2026 |
| **Büropflanzen Pflege Berlin** | Berlin (2 boroughs) | **care only: €299/month** ≤30 plants; **€349** ≤50 plants; ~70 min/visit incl. travel | n/s | 2.1666 visits/month | No | 2026 |
| **P2 Objekt Grün** | Berlin | **€2,000 net minimum asset value**, min. 5 plants | **36 months** | n/s | No | 2026 |
| **hydroflora** | DE | **€3,000 minimum contract value** (leasing from €10,000); arrangements €40 / €200+ / €450+ | **24/36/48 months** | n/s | No | 2026 |
| **2bloom** | Berlin | not published | **"keine Mindestlaufzeiten & keine Mindestmengen"** | n/s | No | 2026 |
| **Ambius (Rentokil Initial)** | Global; ~25 DE branches; **no UAE site found** | none published anywhere | n/s | n/s | No — callback form | 2026 |
| **800petals** | Dubai/AD/Sharjah | **none**; "most plans are quoted per plant per month, all-inclusive"; 10,000+ installations since 1992 | "most choose 12 mo" | **weekly** | No — WhatsApp | 2026 |
| **Royal Plantscape** | Dubai | **care only: AED 120** (1 visit/mo) / **299** (2) / **499** (weekly) / **799** (2×/wk); replacements billed separately | n/s | as priced | No | 2026 |
| **MyDubaiPlants** | Dubai | **AED 299** (≤10 plants) / **AED 549** (11–30); events from AED 85/day — **[LOW-CONF]**, thin site | **3 months** | monthly / bi-monthly | No — "Get Quote" | 2026 |
| **Desert Group / Plantscapes** | Dubai | none | 12–24 months | n/s | No | 2026 |
| **Plants Xpert, Adplants, Desert Blooms, Hope Plants, Dubai Nursery** | UAE | **none — all five fetched directly, zero rates on page** | n/s | n/s | No | 2026 |
| **Plant Drop** | UK | large **£4.50/plant/week**, min. 10 plants, **from £195/month**; trade hire £3.70–5.50/wk large | 12 mo then rolling | n/s | No | 2026 |
| **Inleaf** | UK | **from £5/week** per display **[LOW-CONF, page 403'd]** | "most take 2–3 years" | n/s | Quote tool, then sales | 2026 |
| **officeplants.com** | US (N. Cal) | **$20–35** small / **$40–75** medium / **$90–150** large per month; programme $200–1,200; **min. fee $100–200/month priced on service distance** | 12 mo rolling | biweekly or monthly | No | 2026 |
| **Tropical Plant Rentals** | AU | **AUD $2–3/plant/week**; hire from $25/week; events from $600 | n/s | n/s | No | 2026 |

**Five things nobody does.** (1) Self-serve checkout — zero of ~30 companies. (2)
Genuinely short terms — 12 months is the floor almost everywhere. (3) B2C homes as a
primary segment. (4) Any published rental rate in the UAE. (5) Live account visibility
of your own plants and visits.

**The German price grammar is settled and legible.** €199–200/month appears three times
independently as the entry point for greening a small office all-in (Plantclub, WELO,
airy.green). Per-display rates cluster at €7–€15 with large specimens to €23. A
care-only benchmark of €299/month for up to 30 plants at fortnightly cadence gives
~**€138 of revenue per visit** for ~70 minutes of technician time including travel [E]
— and note what produces that number: **30 plants serviced in one stop**. Density per
stop, not price, is the German business model.

**Cadence is a market convention, not botany, and the brief has it backwards for
Berlin.** Germany and Austria run **every 2–4 weeks** because the market runs on
hydroculture and sub-irrigation (Hydro Lesser and Kinnula: "alle zwei bis vier
Wochen"; Gärtner Gregg: "etwa alle vier Wochen"; hydro4office: "14-tägige oder
dreiwöchige Betreuungsintervalle"; all 2026). Dubai advertises **weekly** as standard
(800petals, 2026), explicitly rationalised by AC, low light and dust, and Royal
Plantscape prices the ladder AED 120 → 299 → 499 → 799 for monthly → bi-monthly →
weekly → twice-weekly. **Planty's weekly-visit promise is the Dubai norm and two to
four times the European norm.**

### 4.2 A necessary correction on Dubai pricing

Three Dubai "prices" circulate in this programme and each needs a caveat before it is
used again:

- **REFUTED — Plantsworld "AED 288–478 per month rental".** A search snippet claimed
  this. The page was fetched twice and confirmed: these are **one-time purchase
  prices** (Snake Plant AED 349, Areca Palm AED 499, Monstera AED 629; catalogue
  ~AED 244–789, 2026). The page is a normal buy-it e-commerce grid under an "Office
  Plant Rental" header. **Never cite as a rental rate.** It is, however, a good retail
  capex benchmark.
- **CONTESTED — Plntd "AED 690 / AED 1,790 per month".** These are **office
  maintenance package** tiers on plntd.ae/pages/office-maintenance (Starter, <1,000
  sq ft, 1–20 plants, monthly visits; Office, 1,000–5,000 sq ft, 20–50 plants, weekly
  visits), not plant rental. A separate direct fetch of plntd.ae reported that the
  company "does not offer rental or subscription" and sells plants outright at AED
  154–1,199. Both readings are consistent: **Plntd is a retailer that also sells
  maintenance plans.** The derived "AED 45–60 per plant per month" is therefore a
  derivation from a maintenance package, doubly indirect.
- **LOW-CONFIDENCE — MyDubaiPlants AED 299 / AED 549.** Published, but the site reads
  as thin/SEO-generated, and a separate systematic fetch of eight UAE competitors
  concluded that not one publishes an AED rental price. Treat as *the advertised shape
  of the offer*, not an audited rate card.

**Net finding: no UAE vendor publishes a plant rental price. The only solid published
Dubai figures are maintenance-only** (Royal Plantscape's ladder, independently fetched
by three lenses, with replacements and supplies billed separately — so it is not a
guarantee product). This is a serious obstacle to pricing a Dubai launch and is one of
the strongest arguments against it (§5, §7).

### 4.3 B2C — a graveyard, and one clean rental comparable

| Company | Market | Price | Status | Year |
|---|---|---|---|---|
| **Reflower** | NL | **€30/month (L), €45/month (XL)** rental; buy-out €300/€450; cancel monthly with 1 month notice; **delivers 3 provinces, Wednesdays only** | Trading — the only clean B2C home-rental price found anywhere | 2026 |
| **Horti** | US | $28/month | **Closed 31 May 2025.** Founders cited "young families and… more stability", not explicitly finances | 2025 |
| **The Plant Box** | Berlin | ~€1m revenue 2022; €150k from Höhle der Löwen investors | **Insolvent 28 July 2023** — "profit margins fell below 50 percent" | 2023 |
| **Botanicly GmbH** | Berlin | — | **Assets determined 21 Mar 2024; liquidation 6 Jun 2024** (Northdata) | 2024 |
| **Leaf Envy Ltd** | UK | DTC + subscriptions + office plants | **Creditors' voluntary liquidation 22 Aug 2024; dissolved 13 Apr 2026** (Companies House, 11734922) | 2026 |
| **Bloombox Club** | UK | — | Trustpilot **1.8/5 over 1,290 reviews**; subscription page offline; "new management" Nov 2025 | 2026 |
| **Bloomscape** | US | Raised ~$24M | Trustpilot **2.8/5, 45% 1-star**, 4 reviews in 12 months; Tracxn lists as "an acquired company" **[acquirer unverified]** | 2026 |
| **Colvin** | ES | — | Entered *concurso de acreedores*, cut ~half its staff; exited May 2025 only because creditor Claret Capital bought it | 2025 |
| **Patch Plants** | UK | — | Trustpilot **4.7/5 over 15,920 reviews**; acquired 100% by Arena Online Jan 2023; founder's directorship terminated 3 May 2024 | 2026 |
| **The Sill** | US | **$69/month** (up from a previously cited $55) | Trading; lost USD 6.9m (2021) and 6.7m (2022); closed all stores Oct 2024 | 2026 |
| **Lively Root** | US | **$42–49 quarterly** — abandoned monthly entirely | Trading; own copy says quarterly avoids "overwhelming recipients" | 2026 |
| **MyDubaiPlants subscription** | Dubai | **AED 99 / 175 / 289 per month** — a *keep-the-plant* box, not rental | Trading | 2026 |

**The cleanest natural experiment in the dataset is Bloomscape 2.8/5 versus Patch
4.7/5 over 15,920 reviews.** Both sell plants online. Bloomscape parcel-ships across
the US; Patch grew on dense local delivery in London. Patch's residual complaints are
courier complaints, not plant complaints. **The delta is logistics, not brand** — which
puts Planty's local van plus human install on the structurally right side of the line,
but only inside one dense city. **Never ship a plant by parcel.**

**The evidenced churn causes, in order:** saturation (Lively Root's quarterly pivot and
its own copy); price-anchoring against retail (a Horti reviewer comparing $28/month
against "$12 for two" at the grocery store); dead-on-arrival plants; refund friction;
and cancellation friction ("it's impossible to log into their website!"). Planty's
rotate-and-swap mechanic genuinely addresses the first of those — a swap keeps the
customer's plant count constant, where a box does not. That is worth saying in
marketing even though rotation is cut from the MVP build (§7, §8).

**No company-specific churn figure is public for any plant subscription or rental
business.** The two anchors available are Subbly's 2024 cross-industry median of
**7.44% monthly churn** (implying ~13.5 months of average customer life [E]) and
Recurly's 2025 benchmark of **4.1% monthly for consumer goods and retail** (2,200+
merchants, 67 million subscribers), of which ~0.8 points is involuntary. Use 4.1% as
the planning figure for B2C and treat B2B as materially stickier but unmeasured.

### 4.4 The positioning gaps Planty can own

Ranked by defensibility for a solo technical founder in Berlin:

1. **Instant published price plus a working cart.** Universally absent. In Berlin,
   Plantclub publishes prices but still routes you to a call; nobody lets you buy.
2. **A 3-month minimum term with true monthly billing.** Plantclub bills *annually* on
   a 12-month minimum; hydroflora and P2 Objekt Grün demand 24–48 months and €2,000–3,000
   minimums. 2bloom has taken the "no minimum term" flank but publishes no price. The
   unoccupied combination is **published price + short term + self-serve**.
3. **The small-account segment.** Plantclub's entry tier covers up to 150 m² at €200; a
   ten-person startup in 80 m² is buying a tier sized for someone else. Berlin's average
   lease fell to ~600 m² in 2025 and there are 153–235 flex venues. Manual quoting does
   not pay below a certain size — which is exactly why software wins there.
4. **Per-plant account visibility.** Which plants you have, their condition, visit
   history, next visit, one-tap swap request. Nobody offers it; even the one purpose-built
   interiorscape platform does not advertise per-asset scanning.
5. **The visit-complete message with photos.** Every field-service tool has checklists;
   nobody in this category sends the customer a per-plant photo record after each visit.
   It does triple duty as QA, proof of service, and a retention asset.

**Do not headline** the replacement guarantee, seasonal rotation, or included planters.
All three are table stakes offered by every incumbent — including the exact phrase in
Planty's own B2C pitch, "no dead plants".

---

## 5. The launch-market decision: Dubai versus Berlin

### 5.1 Scorecard

Weights are mine and stated openly so the reader can re-weight. Scores are 1–5, where 5
is better for Planty. Weighted score = weight × score.

| Criterion | Weight | Dubai | Berlin | Evidence |
|---|---|---|---|---|
| **B2B demand strength** | 15% | **5** | 2 | Dubai prime vacancy 0.3% (2025), rents +20% YoY (Q1 2026), 71,830 new Dubai Chamber members in 2025, 8.2m sq ft prime supply 2025–28. Berlin vacancy 8.6% and rising, only 8% of employees in office five days |
| **Competitive whitespace** | 15% | **4** | 2 | Dubai: no visible Ambius, no published rental price anywhere, project-led incumbent (Desert Group) ignoring small offices — but 8+ identifiable rental SMEs and 800petals since 1992. Berlin: Plantclub with the identical model since 2020, ~25 Ambius/Rentokil German branches, active acquisition (Baumhaus GmbH) |
| **Price legibility (can you price at all?)** | 12% | **1** | **5** | Dubai: zero published rental rates; the modelled office swings 61%→7% contribution on an unpublished number (§7). Berlin: €6.90–22.90 published rate card, €199–200 entry confirmed 3× independently, €299 care-only benchmark |
| **Ops cost structure** | 12% | **4** | 3 | Dubai technician ≈ €4–10/productive hour vs Berlin €20–30 [E] — but Dubai's weekly cadence norm is 2–4× the visits, and Berlin's published revenue per site is higher (€299 for 2.17 visits vs AED 499 ≈ €119 for 4.33) |
| **Founder fit / operability** | **20%** | **1** | **5** | This is a physical route business requiring a technician in the room every 2–3 weeks. The founder is resident in Germany (CEST). No lens found a way to run Dubai remotely; several said so explicitly |
| **Payments and billing** | 8% | 2 | **5** | Berlin: SEPA Direct Debit at a flat €0.35 → ~1.6% all-in with Stripe Billing. Dubai: card-only recurring (SEPA business-location list excludes AE), 2.9% + AED 1.00 → ~3.7–4.3% all-in, plus card-expiry churn |
| **Regulatory knowability** | 8% | 2 | **4** | Every German constraint was retrieved from a free public URL in one afternoon. Dubai's DET activity codes and fees could not be read at all from Europe (403s, DNS failures) — itself a signal about agent-mediated processes. Offsetting: no UAE cooling-off right, flat 5% VAT |
| **Climate and seasonality** | 5% | 3 | 3 | Dubai: 45°C+ transit risk Jun–Sep, AC humidity 25–40% vs the 60–80% tropicals want, narrow ~8–10 species palette, thin seasonal story. Berlin: Nov–Mar frost window on every pavement-to-door leg (tropicals damage below 4°C), December light constraint, but 18m poinsettias and 10m cyclamen produced domestically |
| **Supply chain** | 5% | 4 | **4** | Dubai: dense Al Warsan 3 wholesale cluster, Desert Group runs 10m+ sq ft of UAE nursery land; but imports are regulated (Federal Law 7/2025 agricultural quarantine, permits + phytosanitary certificates). Berlin: sits inside the world's cheapest sourcing radius — NL plant exports €2.8bn (2026), Royal FloraHolland €5.4bn clearing house (2025) |
| **Sum** | 100% | **2.82** | **3.63** | |

### 5.2 The recommendation, and the honest reasoning behind it

**Launch in Berlin, B2B only, in one or two adjacent districts.**

I want to be precise about *why*, because several lenses in this programme reached the
opposite conclusion and they were not wrong on their own evidence. On demand alone,
Dubai wins and it is not close. On competitive whitespace, Dubai wins. On raw labour
cost, Dubai wins.

**Berlin wins on the two things that are actually decidable today.**

**First, operability.** Twenty percent of the weight above sits on founder fit, and
that is deliberate. Every lens converged on the same operational fact: this business is
won or lost on route density, and route density means a person physically walking a
tight polygon on a schedule. A Berlin incumbent with 25 years of trading voluntarily
restricts itself to two boroughs and surcharges for travel distance
(bueropflanzen-pflege.de, 2026). A solo founder in CEST cannot service a Dubai route,
and no lens found a researched, costed way to buy that labour remotely on day one. The
version of the Dubai plan that works requires relocating or hiring a trusted local
operator before the first customer — which is a different, larger, later bet.

**Second, and less obviously: you cannot price Dubai.** This is the finding that
tipped it. Section 7 models the same 25-display Dubai office twice. At the AED 1,250
per month that one lens inferred, it returns ~61% contribution margin. At the AED 499
per month that Royal Plantscape actually *publishes* for weekly service of one site,
the same office returns roughly **7%** — a contribution that never repays the plants. The gap between those two numbers is an unknown
that nobody in this programme could close, because no UAE vendor publishes a rental
rate and the three figures that circulate are one refuted, one contested and one
low-confidence (§4.2). **Launching into a market whose clearing price you cannot
observe is a different category of risk from launching into a crowded market whose
clearing price is printed on four competitor websites.**

**What Berlin gives up, stated plainly.** A contracting consumer category (−4.5% in
2025) — but B2C is cut anyway. A rising-vacancy office market — but take-up was +62% in
H1 2026 and the tenant mix is shifting toward exactly the small accounts Planty
targets. And an incumbent, Plantclub, with six years, seven cities and the same
positioning — which is the most serious objection in this report, and the answer to it
is §4.4: Plantclub publishes prices but does not let you buy, bills annually on a
12-month minimum, and sizes its entry tier at 150 m². The unoccupied position is
**published price + 3-month term + self-serve checkout + small accounts**, and it is
unoccupied by all of them.

### 5.3 What would change this recommendation

Any one of these should reopen the decision:

1. **The founder relocates to Dubai, or secures a named, trusted local operating
   partner willing to run the route.** This single change flips the largest weight in
   the scorecard and Dubai becomes the better answer on the remaining criteria.
2. **Three written mystery-shopper quotes from Dubai incumbents** (800petals,
   Plantscapes, Plants Xpert) for a defined 20-plant Business Bay office come back at
   or above roughly AED 900/month. That closes the price-legibility gap and lifts
   Dubai's weakest score from 1 to 4. This costs three WhatsApp messages and a week.
3. **The Berlin fake-door test fails** — negligible search volume, or office managers
   who reach the cart and will not proceed without a survey. If the self-serve wedge
   does not exist, Berlin loses its only differentiation against Plantclub and the
   right move is either the Dubai test or a different idea, not a better Berlin site.
4. **Berlin labour comes in materially above €30 per productive hour** once real
   subcontractor quotes arrive. The sensitivity in §7 shows the Berlin B2B case
   survives €40/hour, so this is a margin question rather than a viability question —
   but combined with (3) it would matter.

### 5.4 One thing to carry forward regardless of market

Do not build a multi-city product. Encode the service area as a polygon on day one,
gate signup on it, and waitlist everything outside. Both the recommendation and every
fallback above are single-cluster plays.

---

## 6. Customer segments and personas

Five segments, ranked by strength of evidence. Willingness-to-pay figures are published
competitor prices unless marked [E].

### Persona 1 — Nina, Office Manager at a 40-person Berlin startup (PRIMARY)

**Company:** Series A software company, 600 m² in Kreuzberg, hybrid, ~25 people in on a
Tuesday.

**Job to be done:** *"Make the office look and feel cared-for, without adding a
recurring chore to my week or a line item I have to defend."*

**Triggers, in rough order of conversion likelihood:** moving into a new office; a
fit-out completing; a funding round or rebrand; the CEO saying the office looks grey;
an all-hands or investor visit; a return-to-office push that needs "a reason to come
in".

**Who decides:** Nina scopes and recommends; the budget holder is usually the COO, CFO
or a founder. Vendor sites name "facility managers" (officeplants.com, 2026) and
"office managers or facilities teams" (plantsyall.com, 2026). At €149–519/month the
deal sits below most CFO approval thresholds [E] — which is precisely why Plantclub
productised at €200 and why self-serve checkout is credible for this buyer.

**Objections, and the answers:**

| Objection | Evidence it is real | Answer |
|---|---|---|
| "Buying is 30–50% cheaper over three years" | officeplants.com (2026); a Berlin competitor concedes it publicly (business.plantcircle.com, 2026) | Risk transfer, zero internal hours, opex treatment, and you can leave in 3 months |
| "We might not exist in 12 months" | Every competitor demands 12–48 months | **This is the wedge.** 3-month minimum, then monthly |
| "Can't the cleaners water them?" | Common | They can, and they will kill them. DIY survival is quoted at 40–60% against a professional 95%+ [promotional source, treat as directional] |
| "I need to see it first" | Every incumbent runs a site survey | Photo upload plus a constrained low-light catalogue; free replacement if a position turns out wrong |

**Willingness to pay:** €200–600/month productised (Plantclub, 2026); €199–649 (WELO,
2026); $100–350/month for 5–10 plants in the US (2026). **Target Planty ARPU: €289.**

### Persona 2 — Coworking / flex-space operator, Berlin (DENSITY PLAY)

**Job:** *"Differentiate my space in photos and tours; keep it looking premium at all
times with zero staff time."*

Berlin has **153 tracked flexible workspaces across seven districts** (One Coworking, 9
September 2026) — Mitte 51, Kreuzberg 25, Friedrichshain 17 — or 235 on a looser
definition (betahaus, 2026). One contract can cover several locations, which is the
best route density a young operation can buy. Framing line for the deck: a €289 plant
package is **less than one dedicated desk** at the Berlin median of €299/month.

**Credit risk flag, and it is serious.** Berlin office vacancy is rising and Berlin
coworking operator **Unicorn has been insolvent since summer 2025** and is being wound
down (coworkingcapital.com). Attractive logos, poor credit. **Take a deposit or
prepayment from any multi-site coworking account**, and note that this is the one place
a deposit is justified despite no competitor advertising one.

### Persona 3 — Clinic, studio, showroom, agency, restaurant (SECONDARY, high WTP)

Guest-facing space with zero tolerance for a browning plant in the entrance. Both Dubai
incumbents explicitly target this set — "Small offices, Corporate headquarters, Hotels,
Clinics, Retail stores, Restaurants, Coworking spaces" (Desert Blooms, May 2026) — and
it exists in Berlin too. **Higher WTP, longer contracts, but slower procurement,
contractor access passes and insurance requirements.** Take these when they come
inbound; do not prospect them in the first 90 days.

### Persona 4 — Events, exhibitions, showrooms, real-estate staging (CASH SMOOTHER)

The yield is extraordinary and it is the one place short-term rental genuinely works.
Systemgrün's published 2025 Berlin event price list gives a **Kentia palm at €65–85 for
a hire of up to 10 days**, a fan palm at €85–245, bamboo €45–175, all excl. VAT with
pots included. Compare €14.50/month for the same Kentia on an office contract [E: that
is roughly 20–35× the daily yield]. Miet24 lists 150+ plants for event rental **from
€10/day** (2026).

**Treat sub-3-month rentals as a separately priced events SKU, never as the default
subscription tier.** Plant capex plus two van movements cannot be recovered from a
two-week rental at normal monthly rates. This also disposes of the brief's "2 weeks"
duration: it is a real product, but it is an events product with its own price list.

Real-estate staging surfaced **no pricing evidence and no vendor positioning** in this
programme. It remains a hypothesis with zero support — do not plan around it.

### Persona 5 — Mia, the "I kill every plant" Berlin renter (CUT FROM MVP)

**Job:** *"Give me the look of a plant-filled home without the guilt, the research, or
the dead-plant walk of shame."*

The pain is the best-evidenced in this report (§2.3). The economics are the worst.
Beyond the four-part case in §2.3, note two Berlin-specific frictions: **56.8% of
Berlin's 2,231,314 private households are one-person** (Amt für Statistik
Berlin-Brandenburg, 31 December 2025), and among one-person households in rented flats
**49% occupy two rooms and 26% only one**. A technician visiting scattered one-person
flats during working hours, where nobody is home, is the worst possible route. It also
kills the brief's "villas / large homes" tier for Berlin outright — that is Gulf
framing that does not map to this city.

**If B2C is ever revisited, the proven shape is not rental.** It is either (a)
Reflower's model — €30/month (L) and €45/month (XL), monthly cancellable, delivered in
three provinces on Wednesdays only, with route density enforced at the product level —
or (b) a keep-the-plant box with optional care visits, which is what every surviving
consumer operator converged on (MyDubaiPlants AED 99/175/289; Lively Root's quarterly
$42–49). Impose a **minimum monthly spend, not a minimum plant count**: Reiffer uses
€75/month, US interiorscapers $100–200/month. A €69–99/month floor would be the
starting hypothesis.

### A gap in this research the founder should know about

**There is no first-hand customer voice in this programme.** Reddit is entirely blocked
to the crawler used, so no quotes were gathered from r/houseplants, r/officemanagers,
r/berlin or r/dubai. The substitutes were Hacker News comments (one of which is
directly on point — rental plants "are a staple of many offices in the Netherlands…
with someone passing by **once a month**") and a commissioned survey. Google Maps and
Trustpilot reviews of Plantclub, WELO and 800petals are reachable and were never mined.
**Ten customer interviews would be worth more than any further desk research**, and
they are in the 90-day plan (§11).

---

## 7. Business model, pricing and unit economics

### 7.1 Packaging recommendation

**Sell per display, publish bundles, enforce a site minimum.** Per-display pricing is
the mental anchor German office managers already carry (Gärtner Gregg's rate card,
airy.green's €14.50); m²-band bundles are what every modern winner puts on the pricing
page because they quote instantly from one question. Do both: bundles on the page,
per-display arithmetic underneath.

**List prices, net of VAT, all-inclusive of sub-irrigation planter, delivery,
installation, three-weekly care visits and free replacement:**

| Item | Price/month net | Positioning check |
|---|---|---|
| Small display (Ø13–17, tabletop) | **€12** | Gärtner Gregg Ø40 dish from €6.90; Planty's includes a sub-irrigation planter and Berlin labour |
| Medium floor display (90–140 cm) | **€16** | airy.green single hydro plant ~€14.50; AS Hydroplant €13.90 for a 120cm Ficus Nitida |
| Large floor display (150–180 cm) or room divider | **€22** | Gärtner Gregg room divider from €22.90 |
| **Site minimum** | **€149/month net** | Reiffer uses €75; US minimum monthly fee $100–200 priced on service distance |

**Published bundles for instant checkout:**

| Bundle | Composition | Price/month net | Nearest competitor |
|---|---|---|---|
| **Studio** | 10 displays (6 small, 3 medium, 1 large) | **€149** | WELO Basic €199 for "ca. 5–10 Pflanzenkonzepte" |
| **Team** | 20 displays (10 small, 8 medium, 2 large) | **€289** | WELO Comfort €299 for "ca. 15–20"; Plantclub Greenhouse €200 (≤150 m²) |
| **Floor** | 35 displays (16 small, 14 medium, 5 large) | **€519** | Plantclub Woodland €400 (≤500 m²); WELO Plus €649 |
| **Add-on: weekly visits** | upgrades 3-weekly → weekly | **+€89** | Royal Plantscape's Dubai ladder prices weekly at 4.2× monthly |
| **Add-on: quarterly colour rotation** | up to 6 seasonal pots, swapped at a scheduled visit | **+€29** | Rotation is a premium-tier feature everywhere it appears |

**The pricing posture is: match the market on level, win on terms.** Team at €289 for
20 displays sits deliberately beside WELO's €299. Do not undercut €199 as a general
strategy — three independent vendors sit there and Berlin labour does not support a
lower price at scattered density. **Studio at €149 is not a discount; it is a smaller
unit.** Per display it is €14.90, right in the market band. It exists to serve the
sub-150 m² accounts the €200 tier over-serves.

**Contract terms:**

- **Minimum term 3 months**, then indefinite, cancellable with **one month's notice**.
  This is both the competitive wedge and a legal requirement: § 309 Nr. 9 BGB voids
  binding terms over two years, permits tacit renewal only into an indefinite term, and
  caps the notice period at one month.
- **Billed monthly, in advance.** Plantclub bills annually; monthly billing is a
  concrete, advertisable differentiator. It costs working capital (§7.5) and that is
  the trade.
- **No deposit, no setup fee.** Neither appears on any of ~15 rental pages fetched
  across both markets. Introducing one would be off-market. The single exception:
  take prepayment or a deposit from multi-site coworking accounts (§6, Persona 2).
- **Replacement policy:** any plant Planty judges to be in decline is replaced free
  within **five working days**, stated in the contract as the customer's exclusive
  remedy for cosmetic decline. Do *not* attempt to exclude Mietminderung; § 536 BGB
  reduces rent automatically for defects and a blanket exclusion would likely fail AGB
  control (§9).
- **Early exit** is billed as the remaining minimum-term instalments, never as a
  penalty fee — § 309 Nr. 6 BGB voids contractual penalties in consumer AGB.
- **Annual prepay option at −10%**, offered at renewal only. This is how Plantclub
  finances its plant capital and it is the correct lever once the first cohort renews.

### 7.2 Assumptions behind every number below

| Input | Value | Basis |
|---|---|---|
| Loaded technician hour, Berlin (base) | **€30** | GaLaBau collective-agreement Ecklohn LG4.2a **€20.91/h from 1 July 2026** [R: bau.bi, IG BAU, 2025] × ~1.21 employer social contributions [E] ÷ ~0.80 productive utilisation [E; the trade's own worked example is 6 onsite hours ÷ 8 paid = 75%] |
| — low case | €20 | Minijob/subcontract at statutory minimum **€13.90/h from 1 Jan 2026** [R: BMAS] × 1.21 ÷ 0.85 |
| — high case | €40 | Stress test only |
| On-site time | **1.5 min/display + 12 min site overhead** | Calibrated to the one sourced Berlin figure: 30 plants in ~70 min including travel (bueropflanzen-pflege.de, 2026). 30 × 1.5 + 12 = 57 min on-site + 13 min travel = 70 min |
| Travel per stop — mature cluster | 12 min, 4 km | [E] |
| Travel per stop — launch density | 25 min, 9 km | [E] |
| Travel per stop — scattered | 40 min, 18 km | [E] |
| Van full cost | **€0.50/km** | ADAC/trade full-cost range €0.30–0.80/km incl. depreciation, insurance, maintenance, fuel [R, 2025] |
| Capex per display incl. sub-irrigation planter | small **€22**, medium **€70**, large **€130** | [E] built from FlorAccess trade prices (€40–95 for 120–160 cm floor specimens, 2026) plus the trade rule that "a Controlled Watering Insert may cost as much as the plant" (NewPro, 2026) |
| Plant amortisation life | 36 months | [E]; NewPro's light-level replacement rates imply 30–40 months indoor |
| Replacement provision | **20%/yr of installed plant value** | Derived from NewPro (2026): 30–40% of inventory replaced within two years at medium light, 50–60% at low light, 10–20% at high light |
| Payment cost | **1.6%** | SEPA Direct Debit €0.35 flat + Stripe Billing 0.7% [R: stripe.com/de/pricing, 2026] |
| Visits per month at 3-weekly cadence | 1.44 | 52 ÷ 3 ÷ 12 |

**Two of these are the weakest inputs in the entire programme and the critic was right
to say so.** Neither wholesale plant prices nor loaded technician cost was obtained
first-hand in either market: every B2B plant price list checked (Plantcentraal, B2B
Flowers, Roobos, Growhub, Nieuwkoop Europe, Royal FloraHolland's index) is gated or
returned 403. §7.4 therefore stress-tests both rather than asserting them.

**On the labour number specifically, one correction is needed.** A figure of
**€52.50/hour plus €42.50 travel per visit** (Berliner Pflanzendoktor, 2026) circulates
in this programme and one lens reasoned from it as a cost base. **It is a retail price
charged to a consumer, not an employer's cost** — it includes the firm's overhead and
profit. It is useful evidence of what Berlin plant labour *sells* for, and therefore of
the ceiling on what Planty can charge for ad-hoc work. It must not be used as a COGS
input. The defensible Berlin cost range is **€20–30 per productive hour**, which
reconciles the €17–18/h and €24.50–30/h figures produced by two different lenses: they
differ only because one derives from the statutory minimum and the other from the
GaLaBau tariff.

### 7.3 Table 1 — Berlin Studio (10 displays, €149/month net, 3-weekly), by route density

On-site time 27 min (10 × 1.5 + 12). Plant/planter capex €472 (6×€22 + 3×€70 + 1×€130).

| Line | Mature cluster | Launch density | Scattered |
|---|---|---|---|
| Travel per stop | 12 min / 4 km | 25 min / 9 km | 40 min / 18 km |
| Total time per visit | 39 min | 52 min | 67 min |
| Labour per month (1.44 visits @ €30/h) | €28.08 | €37.44 | €48.24 |
| Van per month | €2.88 | €6.48 | €12.96 |
| Plant amortisation (€472 ÷ 36) | €13.11 | €13.11 | €13.11 |
| Replacement provision (20%/yr) | €7.87 | €7.87 | €7.87 |
| Payment fees (1.6%) | €2.38 | €2.38 | €2.38 |
| **Total COGS** | **€54.32** | **€67.28** | **€84.56** |
| **Contribution margin** | **€94.68 (63.5%)** | **€81.72 (54.8%)** | **€64.44 (43.2%)** |
| Capex incl. install labour + delivery | €542 | €542 | €542 |
| **Plant-capex payback** | **5.7 months** | **6.6 months** | **8.4 months** |

**Reading.** The smallest tier works at every plausible density, which is what makes the
small-account wedge viable. But note the honest tension with the 3-month term: a
customer who leaves at month three has repaid roughly half their plant capex. The
mitigation is asset recovery — Kinnula resells ex-lease plants from €15 incl. VAT
(2026), evidencing real residual value — but recovery requires a holding space (§8).
**Model churned assets as recoverable at ~50% of book value after reconditioning [E],
not as a write-off, and do not promise rotation until that space exists.**

### 7.4 Table 2 — Berlin Team (20 displays, €289/month net, 3-weekly) with sensitivity

The target account. On-site 42 min. Plant/planter capex €1,040 (10×€22 + 8×€70 +
2×€130). All cases below use **launch density** (25 min / 9 km per stop) — the
pessimistic assumption — so the numbers are what the first thirty accounts should
actually look like.

| Case | Labour | Van | Amort. | Replace | Fees | COGS | **CM** | **Payback** |
|---|---|---|---|---|---|---|---|---|
| **Base** (€30/h, capex €1,040) | €48.24 | €6.48 | €28.89 | €17.33 | €4.62 | €105.56 | **€183.44 (63.5%)** | **6.2 mo** |
| Mature density (12 min/stop) | €38.88 | €2.88 | €28.89 | €17.33 | €4.62 | €92.60 | €196.40 (68.0%) | 5.8 mo |
| Labour €20/h (Minijob/subcontract) | €32.17 | €6.48 | €28.89 | €17.33 | €4.62 | €89.49 | €199.51 (69.0%) | 5.7 mo |
| Labour €40/h (stress) | €64.34 | €6.48 | €28.89 | €17.33 | €4.62 | €121.66 | €167.34 (57.9%) | 6.8 mo |
| Plant capex +40% (€1,456) | €48.24 | €6.48 | €40.44 | €24.27 | €4.62 | €124.05 | €164.95 (57.1%) | 9.4 mo |
| Plant capex −40% (€624) | €48.24 | €6.48 | €17.33 | €10.40 | €4.62 | €87.07 | €201.93 (69.9%) | 3.6 mo |
| **Worst combination** (€40/h **and** capex +40%) | €64.34 | €6.48 | €40.44 | €24.27 | €4.62 | €140.15 | **€148.85 (51.5%)** | **10.5 mo** |

**This table is the answer to the most serious methodological objection against this
programme.** The two unsourced inputs — plant cost and loaded labour — genuinely cannot
be pinned from desk research. But **the Berlin B2B case does not depend on resolving
them.** Under the worst simultaneous combination of both, a 20-display office at €289
on a three-weekly cadence still returns **~52% contribution margin** and pays back plant
capex in **~10.5 months**. The recommendation is robust to the uncertainty.

**What is *not* robust to it is everything the brief originally proposed** — which is
the point of the next table.

### 7.5 Table 3 — the three configurations being cut, and why

All at launch density, Berlin unless stated.

| Configuration | Revenue | COGS | **CM** | **Payback** | Verdict |
|---|---|---|---|---|---|
| **(a) B2C flat**, 4 displays, 3-weekly | €69 | €44.59 | **€24.41 (35.4%)** | 7.2 mo on capex — but **~18 mo including a €265 CAC** [E] | **Cut.** Against 4.1%/month consumer churn (Recurly, 2025), ~40% of a cohort is gone within 12 months. Before the 14-day Widerrufsrecht (two van trips) and the unresolved 7%/19% VAT question |
| **(a′) B2C flat at weekly cadence** | €69 | €119.74 | **−€50.74 (−74%)** | never | **Structurally impossible.** Corroborated independently: US residential weekly care runs $200–400/month against $50–150 monthly |
| **(b) B2B Team at weekly cadence** | €289 | €215.39 | **€73.61 (25.5%)** | **15.5 mo** | **Cut as a default.** Payback exceeds any plausible term. Sell weekly at +€89/month as an add-on, which restores ~43% CM [E] |
| **(c) Dubai office**, 25 displays, weekly, at the **inferred** AED 1,250/month | AED 1,250 | AED 490 | **AED 760 (61%)** | 7.5 mo | Attractive — **but the revenue figure is unpublished by anyone** |
| **(c′) Same Dubai office at the only *published* weekly price**, AED 499/month | AED 499 | AED 462 | **AED 37 (7.4%)** | 154 mo | **This is why Dubai is not the recommendation.** Royal Plantscape's AED 499 is maintenance-only with replacements billed separately; Planty would be adding plant capex on top of it |

Dubai inputs [E]: technician AED 30/productive hour (midpoint of AED 18–40 derived from
Indeed's AED 2,352/month Dubai gardener, September 2025, and AED 5,164/month UAE
landscape technician, May 2026, each loaded ~35% for visa, medical, accommodation and
transport); van AED 2/km; plant + planter capex ~AED 5,500 for 25 displays; replacement
provision 25%/yr for AC desiccation and dust; payment 3.7% card-only.

**The Dubai labour advantage is real and robust in direction** — even the top of the
Dubai range sits below the bottom of the Berlin range. What is not robust is the
revenue side, and revenue uncertainty of that magnitude cannot be designed around.

### 7.6 The costs this per-unit model deliberately excludes

1. **Depot / holding space.** The replacement guarantee and any rotation programme both
   require buffer inventory, reconditioning of returned stock, and an off-site place to
   treat pests (spraying in an occupied office is not viable; few pesticides are
   registered for indoor use). Berlin *Lagerhalle* averages €6.00/m²/month (2026) but a
   plain warehouse is **not** a plant-holding asset — tropicals need heat and light
   through a Berlin winter. **No lens found a Berlin heated-greenhouse rental price.
   This is an unpriced fixed cost and it is the item most likely to sink the model.**
   §8 recommends launching without one.
2. **Rotation multiplies inventory.** A set swapped 2–4× per year with removed plants
   sitting in a depot means owning roughly **1.3–1.8× the installed plant count** [E].
   Note that Plantclub, WELO and 800petals all offer rotation as an *option*, never as
   a default. That is telling.
3. **Working capital.** Each Team account consumes ~€1,140 of cash before month-1
   revenue. Fifty accounts locks up ~€57,000 in inventory. This is the classic
   rental-business cash trap and it is exactly what killed the furniture-rental cohort.
   **Do not buy inventory ahead of demand.** Buy per signed account; negotiate 30-day
   terms with one nursery; consider the annual-prepay renewal offer specifically as
   inventory financing.
4. **CAC.** LocaliQ's 2026 benchmarks put Business Services at **CPC $5.87 and CPL
   $93.69**; at a 25–35% lead-to-customer rate on a high-intent local query that implies
   a paid CAC of roughly **$270–375 (≈€230–325)** [E]. Against €2,400–3,468 of annual
   contract value that is a comfortable 7:1 to 15:1 ratio — but only on paid search, and
   only if the search volume exists, which is unmeasured (§12).
5. **Install and de-install labour on churn**, and the reconditioning of recovered stock.

---

## 8. Operations playbook — the first 90 days

### 8.1 Who physically does the visits

This is the question the research programme left most exposed, so it gets answered
first and concretely.

**Days 1–90: the founder does every visit.** The arithmetic works and it is the only
option that generates the data everything else depends on. At the target book of
**10–15 accounts on a three-weekly cadence at ~55 minutes per stop including travel**,
that is roughly **14–22 hours per month** — about one founder-day per week. It is
entirely doable solo, and it produces the three things no amount of desk research
could: real minutes-per-stop, real plant mortality by species and position, and the
SOPs and photo library that make a hire trainable.

**Month 4 onward: buy visit labour rather than employ it, at first.** Three options, in
the order they should be tested. **None of these was costed by any lens** — obtaining
three real quotes is the single highest-value ops task in the first fortnight.

| Option | Shape | What to verify |
|---|---|---|
| **Subcontracted Gärtner / Hausmeisterservice** | Per-visit fee, their insurance, their vehicle | Per-visit price for a defined 20-display route; whether they will follow a checklist; whether Planty's Betriebshaftpflicht or theirs covers Tätigkeitsschäden |
| **Minijob** | Up to **€603/month in 2026** (~43 h at statutory minimum) | Fits ~15–20 fortnightly stops; cheapest formal route; requires Planty to supply van and insurance |
| **Part-time employee under GaLaBau terms** | Ecklohn €20.91/h from 1 July 2026 + ~21% | Only at ~40+ accounts; check Berufsgenossenschaft allocation (SVLFG vs a commercial BG) — unresolved (§9) |

**The hiring trigger is a number, not a feeling:** hire when the founder's own route
exceeds ~25 hours/month, or when accounts exceed ~18, whichever comes first.

### 8.2 Sourcing

- **Buy per signed account, not ahead of demand.** This is the single most important
  ops rule in the playbook and it is the direct lesson of the furniture-rental cohort.
- Berlin sits inside the world's cheapest sourcing radius: **NL plant exports of €2.8bn**
  (2026) and Royal FloraHolland's **€5.4bn** clearing house (2025), with a soft,
  buyer-friendly market — RFH reports green houseplant volumes declining with pricing
  showing "a cautious recovery in 2026".
- **Open one trade account and one backup.** Trade prices are gated everywhere online,
  so this is a phone-and-visit task, not a research task. Check Blumengroßmarkt Berlin
  access rules and minimum order quantities, and whether a Gewerbeschein alone unlocks
  trade pricing — **unknown, and it is the input that moves plant amortisation by ±40%.**
- Sourcing has got harder post-COVID: the trade reports it now "requires contacting 5-6
  nurseries and consuming most of a day" where it previously took one to three
  nurseries and an hour (NALP, 2026). Budget for that.

### 8.3 The catalogue — ship 24 SKUs in three tiers

Give the schema a `tier` field, because Tier C is a **consumable expensed per rotation**
while Tiers A and B are **depreciated rental assets**. One flat catalogue table will not
model the business.

- **Tier A, 14 foliage staples (the asset base):** Sansevieria, ZZ, Kentia palm, Areca
  palm, Aglaonema, Dracaena fragrans, Dracaena marginata, Pothos, Spathiphyllum, Ficus
  elastica, Ficus binnendijkii 'Alii'/'Amstel King', Schefflera arboricola, Chamaedorea
  elegans / Rhapis excelsa, Zamioculcas 'Raven' / Aspidistra.
- **Tier B, 4 statement plants:** Strelitzia nicolai, Monstera deliciosa, Pachira
  aquatica, Ficus lyrata. **Price Ficus lyrata as a premium SKU gated behind a
  bright-light check** — it has the worst ratio of asset cost (€70–81 trade) to survival
  odds in the catalogue.
- **Tier C, 6 seasonal consumables:** Phalaenopsis, Bromeliad (Guzmania), Anthurium,
  Poinsettia, Cyclamen, Kalanchoe.

**Hard exclusions, each for a structural reason:**

| Excluded | Why |
|---|---|
| **Ficus benjamina** | "Weeping figs shed heavily when relocated" (2026). A rental business relocates plants **by definition**. Also a spider-mite/scale vector. Substitute *Ficus binnendijkii* 'Alii' for the same look |
| **Dieffenbachia, Sago palm (Cycas revoluta)** | Toxicity. Severe oral irritation and severe liver toxicity respectively |
| **Azalea, Hydrangea** | RHS rates indoor azaleas "Difficult", needing "a cool, humid atmosphere" and deteriorating "if they suffer long periods in hot, dry conditions". Both wilt within days of a missed visit — the exact failure the product exists to eliminate |
| **Croton, Alocasia, most Calathea/Maranta, most ferns** | Fail under a 2–3 week interval in dry heated air; pest magnets |
| **Anything above ~180 cm** | Cannot be carried through a normal stairwell or lift by one technician. Kills the solo-founder model |

**Ship `pet_safe` and `child_safe` booleans backed by per-species ASPCA URLs, and verify
each species individually.** A bulk extraction of the ASPCA list returned at least one
wrong answer in this programme (it claimed Peace Lily was non-toxic; the dedicated ASPCA
page confirms it is toxic — "Insoluble calcium oxalates"). Verified so far: **Kentia
palm and Areca palm non-toxic; Peace Lily toxic.** Expect the pet-safe tier to be short
and palm-dominated. It is a near-zero-cost filter that converts a documented fear into a
reason to choose a curated service over IKEA — an NC State survey found participants
correctly identified only 13 of 25 listed items as toxic to a dog or cat (52% accuracy).

### 8.4 Sub-irrigation is not optional

**Every rented plant ships in a sub-irrigated or hydroculture planter from day one.**
This is the mechanism that converts a weekly-visit business into a three-weekly one, and
without it the entire German cost model collapses.

- Lechuza reservoirs need refilling "every 2–4 weeks, and up to 12 weeks depending on
  plant size and environment" (2026), after a 12-week growing-in phase.
- The trade states sub-irrigation lets plants "go 14 days or more between waterings,
  therefore reducing labor costs" (NewPro, 2026).
- German hydroculture is designed around it: the water level "sollte innerhalb von 2-3
  Wochen auf Minimum absinken" (p2objektgruen care sheet, 2020); vendors claim "60%
  weniger Pflegeaufwand" versus soil [vendor claim, directional only].
- **Budget the insert at roughly the cost of the plant** — "a Controlled Watering Insert
  may cost as much as the plant that you install in it" (NewPro, 2026). That capex is
  exactly what a rental business can amortise and a retail buyer cannot, and unlike
  plants, planters survive churn and replacement, so amortise them over 5–7 years rather
  than 3.
- **Do not plumb automated irrigation indoors.** Planterra warns it is rarely advisable
  because of breakdown and water-damage risk; reservoirs still get checked every visit.
- **Open risk:** whether German buyers accept hydroculture aesthetics. It is the economic
  prerequisite for the model but changes the look versus soil-potted plants. Test it in
  the first ten installs.

### 8.5 The route

- **Launch in one polygon of roughly 6–10 km, not a city.** The strongest available
  evidence is revealed preference: a 25-year-old Berlin operator voluntarily restricts
  service to Charlottenburg-Wilmersdorf and Spandau and surcharges for travel distance
  (2026). Recommended first cluster: **Kreuzberg plus Friedrichshain**, or **Mitte** —
  42 of Berlin's 153 tracked flex venues sit in the first pair, 51 in Mitte.
- **Gate signup by service-area polygon in the product.** Refuse or waitlist everything
  outside it, and name the district in the waitlist confirmation.
- **Target ~5 B2B sites per day per technician** on a 4–6 hour route [E, from trade job
  ads describing routes as "preset and typically 4-6 hrs" and a 45-minute per-visit
  pricing example]. At three-weekly cadence that is ~75 sites per technician.
- **Track stops per technician-hour as the number-one internal metric from day one.**
  The closest measurable analogue: pool-service operators at 8–12 stops per tech per day
  hit 22–28% EBITDA, while those under 6 stops "struggle to break 15%". Route density is
  worth a 15–20% labour cost advantage over scattered competitors.
- **Fixed weekday per zone.** Reflower delivers on Wednesdays only in three provinces —
  route density enforced at the product level. Copy it.

### 8.6 Delivery, install and the seasonal window

- **Light survey before every install.** A €30 light meter plus the trade heuristic —
  "If you have enough light to read a piece of paper without squinting you could probably
  have a plant". Refuse dark corners or place a low-light SKU there. **This is the single
  cheapest lever on replacement rate**; overwatering and insufficient light are the two
  named failure causes in the trade press.
- **Acclimatise incoming stock** for 3–6 weeks in a shaded, reduced-water,
  reduced-fertiliser space. The research precedent is a 47-day acclimatisation window in
  a 2024 peer-reviewed study; three weeks beats zero.
- **Never treat pests on site.** Swap the plant, quarantine and treat off-site. Few
  pesticides are registered for indoor use and biological control is the trade norm. This
  is both IPM best practice and a customer-facing feature — you take the problem away.
- **Winter is a hard constraint.** Tropicals suffer damage below **4 °C**; Berlin's
  January mean is +1.0 °C with regular frost nights of −5 to −10 °C and first frosts from
  mid-November. Roughly **November–March** every pavement-to-door leg carries frost risk.
  Spec a **heated van and sleeve-on-load discipline**, and **do not schedule rotations in
  January**. Avoid launching in Nov–Mar: it collides with both the frost window and the
  seasonal demand trough.

### 8.7 Rotation — cut from the MVP, and here is what it becomes later

**The trade does not do what the brief implies.** Seasonal rotation means **2–4 colour
changes per year on small consumable pots**, not re-installing the customer's set.
Botanical Designs offers "a bimonthly or quarterly rhythm"; German municipal *Wechselflor*
guidance defines replanting "zwei- bis dreimal jährlich"; a US field guide says two to
four times a year. **Nobody rotates monthly.**

**Launch without it.** It requires a depot, buffer inventory, and a second logistics
event per customer per season. Re-introduce as the **+€29/month quarterly colour
add-on** once route density is proven, built on three all-weather species —
**Phalaenopsis, Bromeliad (Guzmania), Anthurium** — that work year-round, plus two
Berlin-only seasonal spikes: **poinsettia in Nov–Dec** and **cyclamen/spring bulbs in
Sep–Jan / Feb–Apr**. Germany produced **18 million poinsettias and 10 million cyclamen**
in the July 2024–June 2025 survey year, so the supply for a genuinely seasonal story
exists in Berlin in a way it does not in Dubai.

**Marketing copy should say "seasonal colour refresh", never "fresh plants every
month".**

### 8.8 Holding stock — how to launch without a greenhouse

The replacement guarantee at 10–15 accounts does **not** require buffer inventory: buy
the replacement when it is needed. What it does require is somewhere to put a pest-hit
plant for two weeks. For the first 90 days:

1. Negotiate **holding space with the nursery you buy from** — a few square metres of
   shaded bench, paid or bartered. This is the cheapest path and nobody in this
   programme priced the alternative.
2. Fall back to a small heated unit only when returns exceed what a bench can hold.
   Berlin *Lagerhalle* is €6.00/m²/month (2026) but **a plain warehouse will kill
   tropical stock over a Berlin winter** — this figure understates the real requirement
   and no heated-greenhouse price was obtainable.
3. **Defer the depot decision until rotation ships.** That is the honest sequencing:
   rotation and buffer inventory are the same decision.

### 8.9 Asset tracking — build this before the storefront

Build the per-plant-asset table before the booking UI. This is the defensible artefact
and it is what makes the replacement guarantee costable:

```
plant_asset(id, species_sku, size_band, planter_type, acquisition_date,
            acquisition_cost, status, current_site_id, position_note,
            install_date, last_service_at, condition_score 1-5,
            photo_url, next_rotation_due, replacement_of, retired_at)
plant_asset_event(id, plant_asset_id, event_type, at, by, notes, photo_url)
```

Status lifecycle: `in_nursery → reserved → deployed → in_recovery → retired`, plus
`lost` and `damaged`. Every technician visit writes one row per plant. Give each asset a
QR sticker resolving to a short opaque URL.

**Why this specifically:** the entire rental thesis is asset reuse. If you cannot
measure how many rotations a plant survives and what it cost to keep alive, you cannot
price the product. Even FolioGreen — the one purpose-built interior-plant-maintenance
platform found — models sites, displays, plant assets and rotations but does **not**
advertise QR asset scanning. This is a genuine gap, not table stakes.

### 8.10 Tooling for the first 90 days

| Need | First 90 days | Later |
|---|---|---|
| Checkout and billing | Stripe Checkout + Subscription Schedules | unchanged |
| Visit scheduling | `pg_cron` nightly job materialising visits on a rolling 14-day horizon | unchanged |
| Route ordering | Sort by postcode + PostGIS distance, drag to reorder by hand | Mapbox Optimization above ~8–10 stops/tech/day |
| Admin | **Supabase Studio** (or Retool Free, 5 users) | Two custom screens only: today's visit list, and the plant asset register |
| Field checklist | The two custom screens above | Jobber Connect at $99/month if the fleet grows past ~5 |
| Notifications | Email via Resend (**note the 100/day free-tier cap**, which a nightly reminder batch breaks at ~50 customers) + SMS | unchanged; skip WhatsApp entirely for Berlin |

**Building a general-purpose admin panel is the single most common way a solo founder
burns two months on software a spreadsheet would have covered.**

---

## 9. Legal and compliance — Germany (with UAE notes)

### 9.1 Classification, which drives everything else

Renting a potted plant in Germany is a **Mietvertrag über bewegliche Sachen** (§§ 535 ff.
BGB) bundled with a maintenance service — a *typengemischter Vertrag* whose dominant
element is the rental. Ownership stays with Planty by operation of law; say so in the
contract anyway, for insolvency and third-party situations. Critically, **§ 312 BGB
excludes only residential-space letting from the consumer regime**, so the full 14-day
distance-selling withdrawal right applies to any B2C plant rental signed online.

### 9.2 Checklist — must be true at launch

| # | Requirement | Source | Why it bites |
|---|---|---|---|
| 1 | **Kündigungsbutton**: a permanently visible, no-login button reading only **"Verträge hier kündigen"** → a bare confirmation page capturing termination type, identification, contract, effective date and how to receive confirmation → a button reading only **"jetzt kündigen"** → immediate confirmation in Textform | § 312k BGB | If missing or defective the consumer "kann… **jederzeit und ohne Einhaltung einer Kündigungsfrist kündigen**". Active *Abmahnwelle* |
| 2 | Order button reads **"zahlungspflichtig bestellen"** with price, term and key terms immediately above it | § 312j BGB | Without it, **no contract forms at all** |
| 3 | Minimum term ≤ 2 years; tacit renewal **only into an indefinite term**; notice period ≤ 1 month | § 309 Nr. 9 BGB | A 12-month auto-renewal is void. "3 months, then monthly, 1 month's notice" is the compliant default |
| 4 | Early exit billed as remaining minimum-term instalments, **never as a penalty** | § 309 Nr. 6 BGB | Vertragsstrafen in consumer AGB are void |
| 5 | No liability cap for personal injury or gross negligence; any lump-sum damages clause must be evidence-based and rebuttable | § 309 Nr. 7, Nr. 5 BGB | Caps that overreach are struck entirely |
| 6 | At checkout: a **separately-ticked** early-performance request plus the § 357a Wertersatz acknowledgment | §§ 312g, 356, 357a BGB | Otherwise a customer enjoys 13 days of installed plants and pays nothing. **Do not rely on the "schnell verderbliche Waren" exception** — a ficus is not perishable in that sense and is being rented, not sold |
| 7 | Budget the withdrawal cost: **two van trips per withdrawn order**. § 357 BGB obliges the trader to collect at its own cost where goods brought to the home cannot be sent by post | § 357 BGB | A 1.8 m potted plant is exactly that |
| 8 | Replacement handled as a **contractual SLA**, not an exclusion of Mietminderung | § 536 BGB | Rent reduces automatically for defects; an exclusion clause would likely fail AGB control |
| 9 | Raise any customer damage claim **within 6 months of collecting the plant**; photograph and timestamp every collection | § 548 BGB | Hard limitation period |
| 10 | **Betriebshaftpflicht with the Tätigkeitsschäden and Schlüsselverlust riders**, explicitly — neither is in a base policy | — | The real risk is a technician with water inside someone's office, and a lost fob can mean re-keying a building. **No price figure could be retrieved; get quotes before the first install** |
| 11 | Pesticide policy: **consumer-grade (Haus- und Kleingarten authorised) or non-chemical only** | § 9 PflSchG | Professional PSM triggers a Sachkundenachweis with 3-yearly Fortbildung |
| 12 | Gewerbeanmeldung (Berlin, ~€15 online / €26 in person, 2025/26). **No Meisterpflicht** — Handwerksordnung Anlagen A and B contain no garden/plant trade | HwO Anlage B | A solo non-horticulturist founder can legally start |
| 13 | **Opt out of Kleinunternehmer status (§ 19 UStG) from day one** | § 19 UStG | Exemption below €25,000 prior year forfeits input-VAT recovery on plant capex, which is the biggest cost line in an inventory-heavy model |
| 14 | Impressum (§ 5 DDG), GDPR notice, Art. 28 DPAs with Supabase and Stripe, Verzeichnis von Verarbeitungstätigkeiten | GDPR Art. 6, 28 | Art. 6(1)(b) covers address, access notes and scheduling. **Photograph the plant, cropped, never people**; encrypt access-code fields; retain photos 12 months |

### 9.3 The VAT question — worth roughly 10 points of gross margin

**§ 12 Abs. 2 Nr. 2 UStG** applies the reduced **7%** rate to "die Vermietung der in
Anlage 2 bezeichneten Gegenstände", and **Anlage 2 Nr. 7** covers "Andere lebende
Pflanzen" (customs position 0602). On a plain reading, **renting live plants in Germany
is 7% VAT, not 19%.**

**The catch:** if invoiced as one inseparable *Raumbegrünungs-Dienstleistung* the tax
office may treat the whole supply as a single 19% service (*einheitliche Leistung*). The
direct analogue is landscaping, where plant delivery alone is 7%, construction work is
19%, and a unified complex service is 19% throughout. **No decided German case on plant
rental bundled with care was found.**

**Recommended structure:** separate the rental line (7%) from the care line (19%) on
both contract and invoice, with the rental economically dominant, and **get a
Steuerberater sign-off or a binding Auskunft before setting any consumer price**. For
B2B this is largely neutral — business customers reclaim it — which is another reason
B2B-first de-risks the launch. For B2C it is a direct 12-point swing.

### 9.4 Unresolved German items (do not launch B2C without closing these)

- **EU plant passport** obligations under Regulation (EU) 2016/2031 for a business
  repeatedly moving plants for planting between a warehouse and customer sites. EUR-Lex
  and Commission pages were unreachable. **Confirm with the Berlin Pflanzenschutzdienst
  before scaling B2B rotation.**
- **Berufsgenossenschaft allocation** — SVLFG (horticulture) or a commercial BG (VBG/BG
  BAU) — and the contribution rate. Unconfirmed.
- **Verpackungsgesetz / LUCID** registration for pots and delivery packaging. Page 404'd.
- **Art. 246a EGBGB** itemised pre-contractual information list. Page 404'd.
- **The name.** **plantyworks.de already sells "Büropflanzen mieten oder Leasing"** in
  Essen, serving the Ruhr, Düsseldorf and Cologne (2026). Run a DPMA and EUIPO search
  before spending anything on the brand.

### 9.5 UAE notes, if Dubai is ever revisited

- **Licensing is the biggest structural gotcha.** A plain free-zone licence does **not**
  permit on-site mainland work. **Dubai Executive Council Resolution No. 11 of 2025** (3
  March 2025) opened a route: a branch licence at **AED 10,000/year** or a temporary
  permit at **AED 5,000** for up to six months, requiring separate financial records and
  possibly forfeiting the 0% free-zone rate on mainland income. Whether landscaping
  appears on DET's list of permitted activities is **unknown**. A mainland DED
  landscaping licence runs roughly **AED 8,000 + 5% of annual rent** with Agricultural
  approval, and permits 100% foreign ownership (Federal Decree-Law 26/2020, effective
  early 2021). **DET fee pages could not be read from Europe at all.**
- **Arabic is a build item, not a translation task.** Federal Law 15/2020 requires dated
  invoices in Arabic and Arabic product/contract information for distance sellers, and
  **bars using consumer data for promotional and marketing purposes outright** — stricter
  than GDPR's soft opt-in. Penalties reach 2 years' imprisonment and AED 2 million.
- **Advantages:** VAT flat at 5% (mandatory registration at AED 375,000 turnover), **no
  EU-style cooling-off right**, and PDPL (Federal Decree-Law 45/2021) is consent-led and
  lighter than GDPR with enforcement still nascent.
- **Scope pesticides out.** Dubai Municipality operates a pest-control company
  classification regime (guidelines dated 04/06/2026); staff need DM Pest Control ID
  cards and a ≥70% competency exam, and 167 pesticides are banned.
- **Plant imports** are regulated under **Federal Law No. 7 of 2025** on Agricultural
  Quarantine (permits plus phytosanitary certificates). Source domestically from UAE
  nurseries; never build a plan that requires importing.

### 9.6 Terms of service — outline

1. **Parties, scope, definitions** — Planty (Vermieter), customer (Mieter),
   "Pflanzenset", "Serviceplan", "Standort".
2. **Contract formation** — order via website; § 312j-compliant "zahlungspflichtig
   bestellen"; contract concluded on Planty's order confirmation email.
3. **Ownership** — plants, planters and substrate remain Planty's property throughout;
   no sale, pledge, sublet or relocation to another address without notice; customer
   notifies Planty of any third-party claim (seizure, insolvency).
4. **Term and termination** — 3-month minimum; renews **into an indefinite term**;
   either party terminates on one month's notice; § 312k button flow described and
   linked; extraordinary termination for cause preserved.
5. **Widerrufsbelehrung** — full statutory 14-day notice; separate express
   early-performance consent with the § 357a acknowledgment; Planty collects at its own
   cost.
6. **Service scope and SLA** — visit cadence, what a visit includes, and the
   **replacement promise as the contractual remedy for decline** (replaced within 5
   working days), with a stated exception for customer-caused damage.
7. **Customer duties** — reasonable access at agreed times; do not relocate plants away
   from the specified light conditions; do not water, fertilise or treat without
   instruction; notify Planty of pests, leaks or damage promptly.
8. **Liability** — unlimited for injury, gross negligence and intent; limited to
   foreseeable, contract-typical damage for ordinary negligence in cardinal duties;
   customer liable for loss or destruction at **documented replacement value, expressly
   excluding natural decline and normal wear**; no Vertragsstrafe.
9. **Prices, VAT and payment** — gross prices for consumers; **rental and service lines
   separated** for the 7%/19% split; SEPA mandate wording and pre-notification;
   price-change clause limited to renewal periods with a right to terminate.
10. **Return** — condition on return; Planty collects; damage claims raised inside the
    § 548 six-month window.
11. **Insurance and keys** — Betriebshaftpflicht incl. Tätigkeitsschäden and
    Schlüsselverlust; named key-handling procedure (numbered, name-free fobs;
    immediate-notification duty on loss).
12. **Data protection** — link to a separate GDPR notice covering address, access data
    and site photography.
13. **Miscellaneous** — governing law, ODR/Verbraucherschlichtung notice, severability,
    Impressum by reference.

For a UAE launch the same skeleton needs Arabic versions of the terms and every invoice,
removal of the withdrawal-right machinery, a marketing-consent regime tightened to Law
15/2020, and UAE law with Dubai Courts (or DIFC) jurisdiction.

---

## 10. Product recommendation and technical architecture

### 10.1 MVP scope

| In | Out of v1 |
|---|---|
| Service-area gate (PostGIS polygon) before anything else | B2C consumer flow of any kind |
| Catalogue of ~24 SKUs with "from €X/month" cards, light and pet-safe filters | Villa / large-home tier |
| Three published bundles + a per-display builder | Seasonal rotation scheduling automation |
| Term selector: 3 / 6 / 12 months, live price, −X% badge, **upgrade-only switch** | Route optimisation API |
| Structured address **and access** capture | Native app (mobile web + PWA is enough) |
| Install slot + recurring visit slot, capacity-aware | A full CPQ or 3D visualiser for B2B |
| Stripe Checkout → Subscription Schedule; SEPA on renewal | A general admin panel |
| B2B invoice option (`send_invoice`, net 30, PO and VAT custom fields) | Plant health sensors / IoT |
| Customer account: my plants, visit timeline, reschedule, skip, report a problem, swap request | In-app chat, loyalty tiers, buy-out / rent-to-own |
| **§ 312k cancellation flow and § 312j order button** | BNPL, multi-currency, Stripe Tax |
| Technician view: today's ordered stops with access details; per-plant checklist with photo | Multi-technician dispatch, skills matching, timesheets |
| Plant asset register with status lifecycle and event log | Per-plant allocation at checkout |

### 10.2 Screens and flows

**Purchase flow (7 screens).** (1) Landing plus **coverage gate** — postcode first,
Swapfiets-style; out of area captures an email against a named district. (2) Catalogue /
"build your set", with 3–4 curated bundles because bundle-first collapses the hardest
decision. (3) **Duration selector — the money screen.** Term chips with a live monthly
total, a percentage-off badge on longer terms, and a **one-way upgrade-only ratchet**
(Grover's rule: you may extend to a cheaper term at any time, never shorten). Inside the
price box, the reassurance stack: care visits included, free replacement, no deposit,
delivery and install included. Grover's live ladder is the proof this shape works — its
1-month price is **2.07× its 24-month price**, and it puts "14 Tage anfängliche
Widerrufsfrist" *in the price box* rather than in the terms. (4) **Address plus access
details** — floor, lift yes/no, door or gate code, building name, who lets us in,
parking notes. Swapfiets, the best operator in the analogous category, still pushes this
to a support call "at least 4 hours before" the appointment. Capturing it once,
structurally, and making it editable forever is a free win. (5) Schedule: install date
with a 3-hour window, then a recurring care slot. Grey out full days. (6) Checkout: card
first, then SEPA on renewal; **"zahlungspflichtig bestellen"**. German payment mix
matters — PayPal is 28.7% and Kauf auf Rechnung 26.1% of German online retail revenue
(EHI, 2025), so a DE B2B flow without invoice will bleed conversion. (7) Confirmation →
account.

**Account (4 screens).** My plants, one card per **plant instance** with photo, species,
position and condition. Visits timeline with the technician's checklist and photos.
Manage subscription — pause with a resume date, swap a plant, add plants, change term
(upgrade only), change address, change payment; cut-off copy "changes at least 3 days
before your next visit". Cancel — the § 312k flow, with any retention offer placed on
the screen *before* the cancel button, never on the confirmation page.

**B2B (3 screens, deliberately thin).** An instant estimator taking exactly the two
questions every competitor asks — office size or headcount, and location — returning a
**ranged** monthly price plus a plant count. A shareable quote page with an Accept
button, which replaces a PDF and is about a day of work. An invoice option.

**Technician (3 screens).** Today's ordered stop list with access details. Per-plant
checklist — watered / fed / pruned / cleaned, condition rating, photo, "needs
replacement" flag — where completion fires the customer notification. The asset
register. **The visit-complete message carrying per-plant photos is the highest-value
notification in the product and nobody in this category sends it.**

**Notification cadence, copied from Swapfiets:** day-before message with a **3-hour
window**, day-of message with a **1-hour window**, then visit-complete with photos.
Email plus SMS for Berlin. **Skip WhatsApp entirely for a Berlin launch** — Meta
Business verification and template approval is a multi-day tax on a solo founder, and
email plus SMS is culturally sufficient. It becomes mandatory only for Dubai.

### 10.3 Architecture

**Stack: Next.js App Router + Supabase (Postgres, Auth, RLS, Storage, Edge Functions) +
Stripe + Resend, on Vercel.** Total realistic infra cost **~$45–65/month** (Supabase Pro
$25 + Vercel Pro $20 + Resend $20 past the 100/day free cap). Infrastructure is roughly
1% of COGS here — vans, plants and technician hours are the business. **Optimise
ops-hours, not software spend.** Two step-functions to know about: Supabase Free pauses
after a week of inactivity (disqualifying), and the SOC2/ISO tier jumps **$25 → $599/
month** if a corporate customer demands it in procurement.

**Billing.** Model fixed terms as **Stripe Subscription Schedules** with
`phases[0].iterations = N` and `end_behavior=cancel` — Stripe's own installment pattern
(max 10 phases). "Ongoing" is a plain subscription with no schedule. **Keep money in
Stripe and plants in Postgres**; do not model individual plants as Stripe subscription
items. Two documented footguns: with `charge_automatically` the first schedule invoice
starts as `draft` and finalises about an hour later, which breaks a naive "paid, now
book a slot" flow — use Checkout for the first charge; and once a schedule is attached,
modify via the Schedule API, not the Subscriptions API. For B2B use
`collection_method=send_invoice` with `days_until_due=30` and `custom_fields` for PO
number and VAT ID (Stripe's own examples). **Listen to `invoice.paid`, not
`invoice.payment_succeeded`** — it also fires for `paid_out_of_band`, which corporates
will use.

**Payment rails.** SEPA Direct Debit is **€0.35 flat** in Germany versus 1.5% + €0.25 on
EEA standard cards and **2.8% + €0.25 on EEA premium (corporate) cards** — the ones B2B
customers carry. All-in with Stripe Billing that is roughly **1.6% for Berlin-on-SEPA
against 3.7–4.3% for Dubai-on-cards**. But SEPA settles **T+6 business days**, caps at
€10,000 per transaction, and allows a **no-questions dispute for eight weeks with no
appeal process**. **Card for the first order, SEPA on renewal**, and never gate an
expensive physical delivery on "subscription created".

**Scheduling.** Supabase Cron (`pg_cron`) runs from every second to once a year and logs
to `cron.job_run_details` for free auditability (limits: ~8 concurrent jobs, 10 minutes
each). **Materialise `visits` rows on a rolling 14-day horizon** with an idempotent
`INSERT … ON CONFLICT DO NOTHING` — do not compute cadence on the fly, because a visit
needs assignment, notification, photos and rescheduling, all of which need a stable
primary key.

**Geography.** PostGIS from day one: `geography(POINT)` with a GIST index for addresses,
`geography(POLYGON)` for service zones, and `ST_Contains` to answer "do we serve this
address". One query, zero marginal cost, survives expansion. **Watch the geocoding
licence trap:** Mapbox Temporary geocoding is 100,000 free/month but you may not persist
results; **Permanent** (which Planty needs, because it stores lat/lon) has no free tier
at $5.00/1,000 — trivial at this volume but a real trap.

**Route optimisation: cut from v1.** At ~800 visits/month both Google and Mapbox are
free, so the API is not the cost — the integration time is. Sort by postcode plus
PostGIS distance and let a human drag to reorder. An optimizer cannot model "15 minutes
to find parking in Kreuzberg" anyway. Revisit above ~8–10 stops per technician per day.

**One non-obvious Postgres feature worth reaching for:** `EXCLUDE USING GIST
(plant_asset_id WITH =, during WITH &&)` with `btree_gist`, which makes double-allocating
a physical plant structurally impossible regardless of app-layer races. **Apply it at
fulfilment, not checkout** — in v1 customers buy SKU-level ("3 medium floor plants") and
which specimen ships is a depot decision.

**Auth and RLS.** Use the Custom Access Token Auth Hook to put `org_ids` in the JWT for
B2B multi-tenancy, but **check membership against the table for destructive
operations** — claims are stale until token refresh, and an office manager who left the
company should lose access immediately. Follow Supabase's stated RLS rules: wrap helpers
as `(select auth.uid())`, index every policy filter column, always specify `TO
authenticated`, and use `security definer` helpers to break the recursive-policy cycle
that `organization_members` policies otherwise hit. In Next.js, **never trust
`supabase.auth.getSession()` in server code — use `getClaims()`**, which validates the
JWT signature; anything copied from a 2024 tutorial is out of date.

**Background work.** Stripe webhooks → a Next.js Route Handler (signature verification
and business logic in one codebase). Outbound notifications → **pgmq plus a `pg_cron`
drainer**, not Database Webhooks — the webhook docs themselves say to use them only when
"the receiving endpoint can tolerate occasional failures", and a missed "technician
coming tomorrow" costs a wasted van visit.

**Testing.** Spend the budget on **pgTAP allow-and-deny cases per table, per role, per
operation**, not on component tests. RLS bugs are silent data leaks.

**One thing that costs nothing now and avoids a migration later:** make invoice line
items, tax rate, buyer tax ID and PO number **first-class Postgres columns**, not just
Stripe fields. Both markets are moving toward structured e-invoicing and Stripe's PDF is
not an EN 16931 or UAE-XML e-invoice. (Exact German B2B E-Rechnung dates and UAE rollout
thresholds are **unverified** — the BMF pages 404'd or were bot-blocked and the UAE
timeline table did not render. Pin these down before any B2B invoicing commitment.)

**Alternatives considered and rejected:** Jobber or Workiz off the shelf at $29–99/month
— rejected because no generic field-service tool models individual plant instances, which
is what makes rotation, swap and replacement operable, and that table is the whole moat.
Twilio for WhatsApp — rejected on cost ($0.005/message is roughly a 150% markup on a
$0.0034 utility template); use Meta's Cloud API directly if a UAE launch ever happens.
Web push for customer notifications — rejected because iOS Safari Push API support is
still only partial as of iOS 26.6.

---

## 11. Risk register and the 90-day validation plan

### 11.1 Risk register

Likelihood and impact are L / M / H. Every kill-metric is instrumented from customer one.

| # | Risk | Evidence anchor | L | I | Mitigation | **Kill metric** |
|---|---|---|---|---|---|---|
| **R1** | **Nobody buys self-serve.** The site survey is load-bearing for trust and for setting light expectations, and the whole MVP thesis is an inference from its absence | Every one of ~30 incumbents runs a survey. Ambius London states why: species, count, container, location, install time and access (2026). **No analogue-category evidence was gathered** for whether comparable recurring on-site office services sell self-serve | **H** | **H** | Fake-door test **before writing the app** (§11.2). Keep a "book a free plant concept" path alongside the cart and measure which converts. Substitute a photo-upload step plus a constrained low-light catalogue for the survey | <3 cart completions per 100 qualified sessions after 300 sessions → the wedge is not real; stop and reconsider |
| **R2** | **Route density never arrives** | Vesta CEO on Feather and Fernish: "a black hole of money"; both only profitable inside an existing logistics network (2023). Pool-service operators under 6 stops/day "struggle to break 15%" EBITDA | **H** | **H** | Launch one 6–10 km polygon; gate signup on it; waitlist everything outside; fixed weekday per zone | **Stops per technician-hour ≥ 2.0 by day 90**; <1.0 → the geography is wrong. **≥70% of accounts inside one contiguous cluster** |
| **R3** | **Plantclub defends the position** — same model, six years, 150+ Berlin accounts, Netflix/Figma logos, per-district SEO | plantclub.io (2026) | **H** | M | Do not contest on price or on "modern plant subscription with an app". Contest on **term (3 vs 12 months), billing (monthly vs annual), checkout, and account size (sub-150 m²)** | If ≥5 of the first 10 losses cite Plantclub on price rather than term, the differentiation is not landing |
| **R4** | **Cadence destroys margin** if the brief's weekly promise ships | §7: weekly cuts a Team account from 63.5% to 25.5% CM and pushes payback to 15.5 months. Every German incumbent runs 2–4 weeks | M | **H** | Ship 3-weekly as the default on sub-irrigated planters; sell weekly at +€89/month | Any tier where CM <40% at target density |
| **R5** | **Plant capex outruns cash** | Grover: €303m raised, equity wiped out under a StaRUG plan confirmed 25 Apr 2025 | M | **H** | **Buy per signed account, never ahead of demand.** Cap capex per customer at ≤1 month of revenue until 30 accounts. Negotiate 30-day nursery terms | Cash tied in inventory >€10,000 before 20 paying accounts |
| **R6** | **Mortality exceeds the replacement provision** | NewPro (2026): 30–40% of inventory replaced within two years at medium light, 50–60% at low light. A US buy-vs-lease reference implies ~27% replaced within six months | M | **H** | Light survey before every install; ~24-SKU hardened catalogue; acclimatise 3–6 weeks; swap-and-treat-off-site | **90-day cohort mortality ≤10%.** >20% → wrong species list or wrong positions, fix before growing |
| **R7** | **Short terms mean capex never pays back** | §7.3: a Studio customer leaving at month 3 has repaid ~half its plant capex. Recurly 2025: 4.1%/month consumer-goods churn | M | M | Recover and recondition rather than write off (Kinnula resells ex-lease from €15). Price the 3-month term at list, discount only the 12-month annual prepay | **Plant-capex payback ≤9 months**; month-1→month-2 retention ≥85% |
| **R8** | **The depot becomes necessary sooner than planned** | Rotation and buffer inventory are the same decision. **No Berlin heated-greenhouse price was obtainable** | M | M | Launch without rotation; bench space at the nursery; defer the depot until rotation ships | Returns exceeding bench capacity before 25 accounts |
| **R9** | **Brand collision** — plantyworks.de already sells "Büropflanzen mieten oder Leasing" in Germany | plantyworks.de (2026) | **H** | M | DPMA and EUIPO search before any brand spend. Accept SEO cannibalisation or rename | A DPMA hit in class 31/44 → rename before launch |
| **R10** | **VAT lands at 19%, not 7%** | § 12(2) Nr. 2 + Anlage 2 Nr. 7 UStG vs *einheitliche Leistung* doctrine; no decided case found | M | M (B2C only) | Separate rental and service lines; get written advice. **B2B-first makes this largely neutral** | — |
| **R11** | **Liability event at a customer site** — water damage, a lost fob | Industry practice requires $1m minimum general liability | M | M | Betriebshaftpflicht with Tätigkeitsschäden and Schlüsselverlust riders **before the first install**; sub-irrigation with saucers reduces the main claim vector | Uninsured install = do not proceed |
| **R12** | **Quality collapses at the first hire** | Professional survival is quoted at 95%+ against DIY 40–60% — the survival rate *is* the value proposition | M | M | Fixed species list, fixed planter system, checklist plus photo per visit enforced in the app before the visit can be closed | Post-hire mortality rising above the founder-era baseline |

**The four H×H or H-impact risks — R1, R2, R4, R5 — are the same failure the
furniture-rental cohort died of. All four are addressable at the design stage and almost
none of them is addressable after launch.**

### 11.2 The 90-day validation plan

**Days 1–14 — prove the price and the wedge before writing the app.**
Ship a one-page site with **published tiered pricing**, a working cart that stops at "we
will confirm your install slot", and a parallel "book a free plant concept" path.
Instrument both. Run **€30–50/day of exact-match Google Ads** on "Büropflanzen mieten
Berlin", "Pflanzen mieten Büro", "Raumbegrünung Berlin". In parallel, walk three
buildings in the target district and book ten in-person conversations.
*Metrics:* qualified sessions, cart-completion rate, concept-request rate, and the
first real read on **search volume — which this entire programme has zero evidence on**
(Google Trends was unfetchable and keyword volume unavailable; do not let anyone turn
that into a number before this test runs).
*Benchmark to beat:* LocaliQ Business Services CPL of $93.69 (2026).

**Days 1–14, in parallel — close the two unsourced cost inputs.**
Three subcontractor quotes (Gärtner / Hausmeisterservice) for a defined 20-display route.
One trade account opened at a Berlin or Dutch wholesaler with real per-SKU prices for the
24-SKU catalogue. One Betriebshaftpflicht quote with both riders named. **This is a
fortnight of phone calls and it replaces the weakest estimates in this report with
facts.**

**Days 15–30 — concierge, no software.**
Deliver 15 free plant concepts as a one-page PDF with photos of *their* space, a plant
list and a fixed monthly price, turned around in 24 hours. Fulfil with a rented van and
the nursery account. Manual invoicing, spreadsheet checkout.
*Target:* **first 5 paying offices.** Track enquiry→visit rate, visit→close rate, and
days-to-close (expect 14–30 days at this ACV).
*Also:* time ten real installs and services with a stopwatch. That single exercise
replaces the shakiest operational assumption in §7.

**Days 31–45 — land one channel partner.**
One Berlin coworking operator with several locations, or one interior-architecture or
fit-out firm. One partner with 40 units beats months of outbound — the LinkedIn maths is
brutal (26% connection acceptance, 7.2% reply, 1.3% meetings from connected prospects
implies roughly **300 connection requests per meeting** and ~1,500 per customer [E]).
*Target:* 1 signed partner, 5 introductions. **Underwrite the credit risk** — take
prepayment from coworking accounts.

**Days 46–60 — build only the software already needed.**
In order: plant asset register → technician visit list and per-plant checklist with
photos → customer account → self-serve checkout → § 312k cancellation flow. **Build the
technician app before the storefront.** Every company in the failure set had a beautiful
storefront.

**Days 61–75 — reach 12–15 accounts and turn on referrals.**
Ask every live account for one introduction. Publish three district landing pages
(Plantclub's own proven playbook) and post before/after photos. **Do not discount the
first ten accounts** — discounting poisons the reference price and makes the pilots
worthless. Give an extra plant instead.

**Days 76–90 — decide.**
With 12–15 accounts you will know real visit duration, mortality and route density.
Reconcile the model in §7 against actuals and reprice if needed.

### 11.3 The day-90 gate

| Metric | Target | Consequence of failure |
|---|---|---|
| Paying B2B accounts on ≥3-month terms | **≥8** | <5 → the wedge is not real in Berlin; run the same test in Dubai with a landing page before writing more code |
| Contribution margin per account | **positive by day 60**, ≥50% by day 90 | Negative at 10 accounts means more negative at 100 |
| Stops per technician-hour | **≥2.0** | <1.0 → shrink the service area or abandon the field-service component |
| Plant-capex payback | **≤9 months** | >12 → the term structure or the price is wrong |
| 90-day cohort plant mortality | **≤10%** | >20% → wrong species or wrong positions |
| Accounts inside one contiguous cluster | **≥70%** | Scattered at day 90 means R2 has already materialised |
| Blended CAC | **<2 months of MRR** | Otherwise no paid channel at all |
| Cart completion vs concept-request | cart ≥ 30% of total conversions | If every buyer still wants a survey, the differentiation is the term, not the checkout — reprice the pitch accordingly |

---

## 12. Open questions the founder must answer

Ordered by how much they change the decision. The first five are answerable in a
fortnight and every one of them replaces an estimate in this report with a fact.

**Tier 1 — answer before writing code**

1. **Will a Berlin office manager complete a purchase without a site survey?** The
   entire MVP thesis. No incumbent has tried, and **no analogue-category check was done**
   — nobody in this programme verified whether comparable recurring on-site office
   services (fruit, coffee, water, cleaning) sell self-serve online in either city.
   Absence of a behaviour among thirty incumbents is at least as consistent with "buyers
   do not buy this way" as with "nobody tried". *Method: the §11.2 fake-door test plus ten
   customer interviews.*
2. **What is the actual search volume and CPC for "Büropflanzen mieten Berlin" and its
   variants?** **This programme has zero search-demand evidence** — Google Trends was
   unfetchable and keyword volume unavailable. Do not let anyone turn this into a number
   before it is measured. *Method: a €300 live Google Ads test.*
3. **What does a Berlin subcontracted visit actually cost?** No lens researched buying
   visit labour as a service. The defensible cost range is €20–30 per productive hour but
   nothing in that band was quoted first-hand. *Method: three quotes from Gärtner and
   Hausmeisterservice firms for a defined 20-display route.*
4. **What do the 24 catalogue SKUs cost at trade in Berlin?** Every B2B price list is
   gated (Plantcentraal, B2B Flowers, Roobos, Growhub, Nieuwkoop, Royal FloraHolland's
   index). This moves plant amortisation by ±40%. Also unknown: Blumengroßmarkt Berlin
   access rules, minimum order quantities, and whether a Gewerbeschein alone unlocks trade
   pricing. *Method: one trade account, one afternoon.*
5. **What is a real visit's duration and a real technician's stop count?** No public
   "plants serviced per technician-hour" benchmark exists; the trade publishes formulas,
   not productivity norms. Everything in §7 rests on one Berlin data point (~70 minutes
   for up to 30 plants including travel) and a 45-minute trade example. *Method: time ten
   real installs and services.*

**Tier 2 — answer before pricing or scaling**

6. **The 7% versus 19% VAT question.** Worth roughly 10 points of gross margin and it may
   be resolvable from UStAE or BFH case law rather than an expensive Steuerberater
   opinion — but no decided case on plant rental bundled with care was found.
7. **Betriebshaftpflicht premium** with Tätigkeitsschäden and Schlüsselverlust riders. **No
   price figure could be retrieved from any insurer or official page**, so none is asserted
   anywhere in this report.
8. **Berlin heated holding-space cost.** Only generic Lagerhalle rates (€6.00/m²/month,
   2026) were obtainable, and a plain warehouse will kill tropical stock over a Berlin
   winter. This is the fixed cost most likely to sink the model and it is unpriced.
9. **Will German buyers accept hydroculture aesthetics?** It is the economic prerequisite
   for the three-weekly cadence but it changes the look versus soil-potted plants.
10. **Does the "Planty" name survive?** plantyworks.de already trades in the category in
    Germany. Run DPMA and EUIPO searches.
11. **Actual replacement rate under a rental guarantee.** The 20%/year provision is a
    derivation from US light-level data, not an observed loss rate. Without it the
    guarantee's true cost is unmodellable.
12. **EU plant passport obligations** for repeatedly moving plants for planting between a
    warehouse and customer sites. Confirm with the Berlin Pflanzenschutzdienst before
    scaling rotation.
13. **Berufsgenossenschaft allocation** (SVLFG vs VBG/BG BAU) and contribution rate.

**Tier 3 — answer only if Dubai is reopened**

14. **What does Dubai actually charge per plant per month?** The single biggest gap in the
    entire programme. No UAE vendor publishes a rental rate; the three figures in
    circulation are one refuted, one contested and one low-confidence (§4.2). *Method:
    three written WhatsApp quotes for a defined 20-plant Business Bay office.*
15. **Does Ambius operate a UAE entity?** Only a KSA site was confirmable. If it does, the
    competitive picture worsens materially.
16. **Fully loaded Dubai technician cost.** Sources differ by roughly 6× within a single
    lens; also unresolved is whether a small startup can employ a technician directly or
    must go through a manpower supplier, and what that intermediary margin is.
17. **Is landscaping on DET's list of activities free-zone companies may perform on the
    mainland** under Resolution 11/2025? This determines whether the AED 10,000 branch
    route is even available.
18. **Ramadan's quantified effect** on B2B facilities procurement. No source found.
19. **Gated-community access rules** for recurring maintenance visitors, if B2C is ever
    revisited.

**Tier 4 — nice to have, none decision-changing**

20. The **BuGG Marktreport Gebäudegrün** Innenraumbegrünung section (PDF would not parse)
    and the paywalled **AIPH / Union Fleurs** yearbook (€195, compiled by the University of
    Hohenheim) — the two most rigorous primary sources in this space, both unread.
21. **Plantclub's funding, headcount, churn and per-tier plant counts.** Their /about and
    /careers pages 404'd; the "200+ members in 2025" figure came from a search snippet whose
    source URL now 404s. Only "150+ Berlin members" sits on a live page.
22. **First-hand customer voice.** Reddit is blocked to the crawler used; Google Maps and
    Trustpilot reviews of Plantclub, WELO and 800petals are reachable and were never mined.
23. **Whether Bloombox Club's "new management" (Nov 2025)** is an acquisition, a rescue or
    a wind-down; and **who actually acquired Bloomscape** — Tracxn lists it as acquired but
    no filing-grade source names the acquirer or price.
24. **A note against a false negative:** searches surfaced two unrelated small French
    companies named Bergamotte/Bergamote in judicial liquidation. **No distress was
    established at the e-commerce Bergamotte, which still trades. It must not be reported
    as a failure.**

---

## 13. Sources

Grouped by theme. Year is the year of the figure, or the access year for undated live
pages. Full context for each sits in the corresponding file under [`raw/`](raw/).

**Market size, statistics and associations**

1. ZVG, "Blumen und Zierpflanzen: Anhaltende Kaufzurückhaltung belastet den Markt" — German market €8.5bn, houseplants €1.4bn −4.5%, per-capita <€6 green houseplants (2026, data 2025) — https://www.derdeutschegartenbau.de/2026/01/26/blumen-und-zierpflanzen-anhaltende-kaufzurueckhaltung-belastet-den-markt/
2. Lebensmittelpraxis / ZVG — per-capita indoor plant spend, €8.7bn market (2024) — https://lebensmittelpraxis.de/handel-aktuell/44094-zierpflanzenbranche-2024-blumenmarkt-trotzt-wirtschaftlichen-herausforderungen.html
3. BMEL-Statistik, Anbau von Zierpflanzen — 86m pot plants, 18m poinsettias, 10m cyclamen (survey Jul 2024–Jun 2025) — https://www.bmel-statistik.de/landwirtschaft/gartenbau/zierpflanzen
4. Destatis, ornamental horticulture businesses 2025 — https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/11/PD25_417_41213.html
5. Future Market Insights, Plant Care Services Market — USD 3,806.7m (2025), on-site 65.1%, offices 39.8% — https://www.futuremarketinsights.com/reports/plant-care-services-market
6. Rentokil Initial 2025 Preliminary Results — H&W USD 1,205m, 18.6% adj. op margin (2026) — https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/2025-prelims-statement.pdf
7. Rentokil Initial 2024 Preliminary Results — H&W £931m, 18.1% margin (2025) — https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/2024-preliminary-results.pdf
8. Fachverband Raumbegrünung und Hydrokultur (ZVG) — no published market size (2026) — https://zvg-fvrh.de/ueber-uns/
9. IBISWorld Office Plant Services US — **UNVERIFIED, likely mis-scoped, do not use** — https://www.ibisworld.com/united-states/industry/office-plant-services/6523/
10. TechSci, UAE landscaping USD 1.67bn (2024) → 2.84bn (2030), 9.07% CAGR (2025) — https://www.techsciresearch.com/news/7453-uae-landscaping-market.html
11. Vyansa Intelligence via PRNewswire, UAE landscaping USD 1.8bn (2025) → 3.5bn (2032), 9.97% (2026) — https://www.prnewswire.co.uk/news-releases/uae-landscaping-market-set-to-expand-at-a-cagr-of-9-97-amid-growing-construction-activity-and-demand-for-eco-friendly-outdoor-spaces--vyansa-intelligence-302719130.html
12. Mordor Intelligence, UAE facility management — 12.99% CAGR, soft services 12.33%, 64.88% outsourced — https://www.mordorintelligence.com/industry-reports/uae-facility-management-market
13. Royal FloraHolland 2025 results — €5.4bn product turnover (2026) — https://www.royalfloraholland.com/en/news-2026/week-13/royal-floraholland-succesvol-2025-productomzet-groeit-naar-5-4-miljard-euro
14. DutchNews, NL flower and plant exports €7.2bn of which €2.8bn plants (2026) — https://www.dutchnews.nl/2026/01/flower-and-plant-exports-top-e7-billion-tariffs-hit-us-market/
15. AIPH / Union Fleurs, International Statistics Flowers & Plants 2025 (paywalled, unread) — https://aiph.org/latest-news/crucial-global-data-released-international-statistics-flowers-and-plants-2025/

**Office real estate and occupancy**

16. JLL Berlin office market — vacancy 8.4% Q1 2026, 1.94m m² available — https://www.jll.com/de-de/insights/market-dynamics/berlin-office
17. JLL Berlin office market — vacancy 8.6% Q2 2026, take-up +62% H1 2026, prime €48.00/m²/month (2026-07-14) — https://www.jll.com/en-de/insights/market-dynamics/berlin-office
18. Cushman & Wakefield Berlin office leasing FY2025 — take-up 484,200 m² −11%, vacancy 10.4%, 2.24m m² (2026-01-14) — https://www.cushmanwakefield.com/en/germany/news/2026/01/office-leasing-berlin
19. CBRE Berlin Office Market Q3 2025 — average transaction size ~600 m² — https://www.cbre.de/en-gb/insights/figures/berlin-office-market-q3-2025
20. Berlin Business Location Center — Berlin office stock ~23.90m m² (2025) — https://www.businesslocationcenter.de/wirtschaftsstandort/gewerbeimmobilien/bueroflaechen
21. JLL via Real Asset Insight — Dubai prime office vacancy 0.3% (2025-11-21) — https://realassetinsight.com/2025/11/21/jll-dubai-office-squeeze-intensifies-as-vacancy-drops-to-0-3/
22. CBRE UAE Real Estate Market Review Q4 2025 — leases lengthening to 7–9 years — https://www.cbre.ae/press-releases/uae-real-estate-market-review-q4-2025
23. Cavendish Maxwell — Dubai office rents +20% YoY to AED 191.9/sq ft (Q1 2026) — https://cavendishmaxwell.com
24. Knight Frank Dubai office market review — 95–99% occupancy, 8.2m sq ft prime pipeline 2025–28 (2025, data H2 2024) — https://www.knightfrank.ae/newsroom/article/2025/3/dubai-office-market-review---h2-2024
25. Universität Konstanz remote-work barometer — 8% of German employees in office five days (2025) — https://www.uni-konstanz.de/en/university/news-and-media/current-announcements/news-in-detail/remote-work-remains-popular-mandatory-office-attendance-declines/
26. The National — UAE five-day office return (2025-08-01) — https://www.thenationalnews.com/news/uae/2025/08/01/uae-return-to-work-in-office-hybrid-remote-hours/
27. One Coworking Berlin flex market report — 153 venues, district counts, desk prices (2026-09-09) — https://www.onecoworking.com/berlin-flex-market-report
28. betahaus — 235 Berlin coworking spaces (2026) — https://www.betahaus.com/magazine/the-complete-guide-to-coworking-spaces-in-berlin-2026-edition
29. Coworking Capital — Berlin operator Unicorn insolvent since summer 2025 — https://www.coworkingcapital.com/en/blog/breaking-news-berliner-coworking-betreiber-schliesst
30. Amt für Statistik Berlin-Brandenburg — 2,231,314 households, 56.8% one-person (31 Dec 2025) — https://www.statistik-berlin-brandenburg.de/186-2025/
31. Dubai Chamber — 71,830 new companies 2025, 292,486 active — https://khaleejbusinessinsight.com/dubai-chamber-new-firms/
32. DMCC — 26,000+ member companies (2025) — https://www.dmcc.ae/about-us
33. Gulf News — Dubai population +208,030 in 12 months to Nov 2025 — https://gulfnews.com/uae/dubais-population-jumps-by-17669-in-one-month-1.500345887
34. Global Media Insight — Dubai population 3.93m, ~92% expat (May 2025) — https://www.globalmediainsight.com/blog/dubai-population-statistics/
35. Khaleej Times / Betterhomes — average residency 10.5 years; tenants 6.7 (2024) → 9.9 (2025) — https://www.khaleejtimes.com
36. Royal Estays citing Dubai DET — 22,000+ licensed holiday homes end-2024 (2025) — https://royalestays.com/how-many-holiday-homes-are-there-in-dubai/

**B2B competitors and pricing**

37. Plantclub pricing — €200/€400/€600, 12-month minimum, billed annually (2026) — https://plantclub.io/de/preise
38. Plantclub Berlin — 150+ Berlin members, 2-week cadence, client logos, 8 districts (2026) — https://plantclub.io/de/pflanzen-mieten-berlin
39. Plantclub Hamburg — 30+ members (2026) — https://plantclub.io/de/pflanzen-mieten-hamburg
40. Plantclub FAQ — cities served, offices only (2026) — https://plantclub.io/de/faq
41. WELO Green Mietpflanzen — €199/€299/€649, 3-week cadence, 12-month minimum (2026) — https://welo-green.de/pages/mietpflanzen
42. WELO Green, Pflanzen mieten Kosten (2025-09-30) — https://welo-green.de/blogs/journal/pflanzen-mieten-kosten
43. Gärtner Gregg rate card — €6.90–€22.90 per display/month net, ~4-week care, 12-month term (2026) — https://www.gaertner-gregg.de/pflanzenmiete-oder-leasing/
44. Reiffer / objektbepflanzung — €9/plant/month, €75/month minimum, 2-year term, 3-week care (2026) — https://objektbepflanzung.de/pflanzen-vermietung
45. AS Hydroplant — €13.90/month per unit incl. planter and service (2026) — https://www.as-hydroplant.de/mieten-leasen/
46. Kinnula Hydrokulturen — "ab 6 Euro pro Monat", care every 2–4 weeks, ex-lease resale from €15 (2026) — https://hydro-kulturen.de/pflanzen-mieten/
47. airy.green — ~€14.50/plant/month, ~€200/month to 150 m², Betriebsausgabe framing (2025/2026) — https://airy.green/en/blogs/air-up-your-life/mietpflanzen-buero-kosten-vorteile-steuer
48. Büropflanzen Pflege Berlin — €299/€349 care-only, 2.1666 visits/month, ~70 min/visit, 2-borough territory (2026) — https://bueropflanzen-pflege.de/preise/
49. P2 Objekt Grün Berlin — 36-month minimum, €2,000 net minimum asset value (2026) — https://p2objektgruen.de/pflanzen-kaufen-mieten/
50. hydroflora — €3,000 minimum contract value, 24/36/48-month terms, BGV A1 framing (2026) — https://www.hydroflora.de/produkte/buerobegruenung/
51. 2bloom — "keine Mindestlaufzeiten & keine Mindestmengen" (2026) — https://www.2bloom.de/
52. Plant Circle — 6-month minimum; concedes buying is usually cheaper over 3 years (2026) — https://business.plantcircle.com/blog/office-plant-rental-vs-buying-which-is-right-for-your-berlin-workspace
53. Hydro Lesser — "alle zwei bis vier Wochen", 24-month minimum, Pflanzenersatzgarantie (2026) — https://www.hydro-lesser.de/mietservice.html
54. hydro4office (AT) — "14-tägige oder dreiwöchige Betreuungsintervalle", hydro visit tasks (2026) — https://www.hydro4office.at/pflanzenbetreuung/
55. gruen-im-buero — "alle 2–3 Wochen" standard interval (2026) — https://gruen-im-buero.de/leistungen/pflanzenservice
56. Pflanzen-Kölle Gärtnerservice — 4-week care (2026) — https://www.pflanzen-koelle.de/filialen/gaertnerservice/innenraumbegruenung/pflanzen-mieten/
57. Plantyworks Essen/Berlin — **name collision** (2026) — https://plantyworks.de/essen/ · https://plantyworks.de/berlin/
58. Mr. Monstera Berlin (2026) — https://mr-monstera.de/
59. Ambius US "Get a quote" form fields (2026) — https://www.ambius.com/us-ambius/get-a-quote
60. Ambius UK London branch — why they will not price online (2026) — https://www.ambius.co.uk/branches/london/
61. Ambius Deutschland (2026) — https://www.ambius.de/
62. Rentokil Initial acquires Baumhaus GmbH — https://www.rentokil-initial.de/dam/jcr:6e2fb31f-c1f6-4efa-bf76-f6868ea9ce22/rentokil-initial-uebernimmt-baumhaus.pdf
63. Ambius Saudi Arabia — the only confirmable Gulf entity (2026) — https://www.ambius.com.sa/
64. Plant Drop UK — £3.70–5.50/plant/week trade, £4.50 own plan, min. 10 plants, from £195/month (2026) — https://plantdrop.co.uk/pages/office-plant-costs-uk
65. Plant Plan UK — £60–90/week for 15–20 plants (2026) — https://www.plantplan.co.uk/blog/indoor-planting-scheme-costs-explained-uk-pricing-guide-for-offices
66. Inleaf UK — from £5/week, 2–3 year contracts **[page 403'd, second-hand]** (2026) — https://inleaf.co.uk/office-plants/office-plant-prices/
67. officeplants.com — US $20–150/plant/month, $100–200 minimum fee, 12-month terms, rental costs 30–50% more than buying (2026-08) — https://officeplants.com/2026/08/03/office-plant-rental-pricing/
68. Tropical Plant Rentals AU — AUD $2–3/plant/week, events from $600 (2026) — https://tropicalplantrentals.com.au/blog/plant-pricing-guide-what-it-really-cost/
69. Systemgrün event price list — Kentia €65–85 for up to 10 days (2025) — https://www.eventbegruenung.com/mietpflanzen-fuer-events/preisliste/
70. Miet24 — 150+ plants for event rental from €10/day (2026) — https://marktplatz.miet24.de/mieten/events-und-messen/pflanzen
71. Planteria Group — FM, cleaning, architect and fit-out channel (2026) — https://www.planteriagroup.com/office-plants-for-hire/

**UAE competitors and pricing**

72. 800petals — weekly visits, per-plant-per-month all-inclusive quoting, 12-month agreements, **no price** (2026) — https://800petals.com/office-plant-rental-dubai/
73. 800petals maintenance — priced per visit billed monthly (2026) — https://800petals.com/indoor-plants-maintenance/
74. Royal Plantscape — AED 120 / 299 / 499 / 799 by visit frequency; **replacements billed separately** (2026) — https://www.royalplantscape.com/pages/indoor-plant-maintenance-service
75. Plantsworld.ae — **purchase** prices AED 244–789; the "AED 288–478 rental" snippet is **REFUTED** (2026) — https://plantsworld.ae/collections/office-plant-rental
76. MyDubaiPlants plant rental — AED 299 / 549, 3-month minimum, events from AED 85/day **[LOW-CONF site]** (2026) — https://mydubaiplants.com/plant-rental
77. MyDubaiPlants subscription — AED 99/175/289 keep-the-plant boxes (2026) — https://mydubaiplants.com/plant-subscription
78. Plntd.ae office maintenance — AED 690 / 1,790 **maintenance** tiers, not rental (2026) — https://plntd.ae/pages/office-maintenance
79. Greenly.ae — app-native, upfront-priced recurring plant care, AED 79–199 per service (2026) — https://greenly.ae/services-and-pricing/plant-maintenance-services-dubai/
80. Plants Xpert (2026) — https://plantsxpert.com/pages/plants-rental-in-dubai-plants-xpert
81. Adplants (2026) — https://adplants.com/pages/plant-rentals
82. Desert Blooms (2026) — https://www.desertblooms.me/
83. Hope Plants (2026) — https://hopeplantsdubai.com/indoor-plant-hire
84. Dubai Nursery (2026) — https://www.dubainursery.ae/plant-rentals/
85. Desert Group Plantscapes and nursery — 10m+ sq ft UAE nursery land (2026) — https://desertgroup.ae/plantscapes/ · https://desertgroup.ae/plant-nursery/
86. The Foliage Co Dubai — projects start at $10,000 (2026) — https://www.thefoliageco.com/cities/dubai/office-plant-rental
87. Flowery D UAE — villa garden AMCs AED 300–900/month at 3 visits/week (2026) — https://floweryduae.com/garden-maintenance-cost-dubai/
88. Emirates247 — Dubai Municipality Warsan Nursery, indoor plants AED 2–60 (2026-05-13) — https://www.emirates247.com/uae/dubai-municipalitys-warsan-nursery-sells-plants-from-50-fils-heres-what-you-can-buy/1573
89. AllWorks — a real buyer brief: 12 large display plants, 12-month contract, AED 2,500–5,000/month (2026) — https://allworks.ae/services/plant-rental-service

**B2C competitors, failures and churn**

90. Reflower NL — €30 (L) / €45 (XL) per month, monthly cancellable, 3 provinces, Wednesdays only (2026) — https://www.reflower.nl/collections/planten
91. Horti — closed 31 May 2025 — https://heyhorti.com/pages/help-center-faqs
92. The Plant Box — insolvency 28 July 2023, margins below 50% — https://www.myhomebook.de/news/the-plant-box-insolvent
93. Botanicly GmbH — assets determined 21 Mar 2024, liquidation 6 Jun 2024 (Northdata) — https://www.northdata.com/Botanicly%20GmbH,%20Berlin/Amtsgericht%20Charlottenburg%20(Berlin)%20HRB%20258722%20B
94. Leaf Envy Ltd — CVL 22 Aug 2024, dissolved 13 Apr 2026 (Companies House 11734922) — https://find-and-update.company-information.service.gov.uk/company/11734922
95. Patch Gardens Ltd — Arena Online PSC 12 Jan 2023, founder exit 3 May 2024 — https://find-and-update.company-information.service.gov.uk/company/09897155/filing-history
96. Patch Plants Trustpilot — 4.7/5 over 15,920 reviews (2026) — https://uk.trustpilot.com/review/patchplants.com
97. Bloomscape Trustpilot — 2.8/5, 45% 1-star (2026) — https://www.trustpilot.com/review/bloomscape.com
98. Bloombox Club Trustpilot — 1.8/5 over 1,290 reviews (2026) — https://uk.trustpilot.com/review/bloomboxclub.com
99. The Sill — $69/month Plant of the Month Club (2026) — https://www.thesill.com/products/plant-of-the-month-club
100. Fortune — The Sill losses and store closures (2025-07-02) — https://fortune.com/2025/07/02/the-sill-houseplants-millennials-outdoors-gardening-new-ceo/
101. Lively Root — quarterly $42–49, "without overwhelming recipients" (2026) — https://www.livelyroot.com/pages/lively-root-subscriptions
102. Colvin — exited insolvency via creditor Claret Capital (2025) — https://emprendedores.es/startups/colvin-concurso
103. Subbly subscription churn report — median 7.44%/month (2024) — https://www.subbly.co/blog/subscription-churn-data-report/
104. UpCounting citing Recurly 2025 — consumer goods and retail 4.1% monthly churn — https://www.upcounting.com/blog/average-churn-rate-ecommerce
105. LifeVerde — German plant rental and swap round-up, no prices (2021/2022) — https://www.lifeverde.de/nachhaltigkeitsmagazin/news-tipps/pflanzen-mieten-und-tauschen-statt-kaufen-von-berlin-bis-muenchen

**Adjacent rental and subscription businesses**

106. Business of Home — Vesta acquires Fernish and Feather; "a black hole of money" (2023-11-09) — https://businessofhome.com/articles/vesta-fernish-feather-subscription-furniture
107. Modern Retail — Feather $76m, Fernish $30m seed + $15m Series A (2023-11-09) — https://www.modernretail.co/operations/luxury-design-studio-vesta-acquires-furniture-rental-companies-fernish-feather/
108. WirtschaftsWoche — Grover becomes a restructuring case (2024-12-20) — https://www.wiwo.de/unternehmen/it/elektrogeraete-zur-miete-berliner-tech-star-grover-wird-zum-sanierungsfall/30141782.html
109. Hengeler — Grover StaRUG plan confirmed by AG Charlottenburg, shareholders wiped out (2025-04-30) — https://hengeler-news.com/en/articles
110. Bike Europe — Swapfiets net loss cut to €7.0m (2026-09-01) — https://www.bike-eu.com/53075/pon-owned-swapfiets-cuts-losses-to-e7m
111. Micromobility.io — Swapfiets €91.1m revenue 2024, €14.3m net loss (2025-09-11) — https://micromobility.io/news
112. Grover live term ladder — 1-month price 2.07× the 24-month price (2026) — https://www.grover.com/de-de/products/apple-smartphone-iphone-15-6gb-256gb
113. COMPUTER BILD — Grover term switch is upgrade-only (2022-09-16) — https://www.computerbild.de/artikel/cb-Tipps-Internet-Grover-Welche-Mietdauer-ist-moeglich-31601173.html
114. Swapfiets Germany — €16.90/month Deluxe 7, cancel anytime (2026) — https://swapfiets.de/en-DE
115. Swapfiets help — appointment triage flow; 3-hour then 1-hour windows; access details by phone 4 hours ahead (2026) — https://help.swapfiets.com/how-do-i-get-an-appointment-for-my-bike
116. Swapfiets help — service-area gating, no mobile service within 500 m of a store (2026) — https://help.swapfiets.com/service-area

**Operations, horticulture and productivity**

117. NewPro Containers — replacement rates by light level, 30–40% over two years at medium light (2026) — https://blog.newprocontainers.com/blog/strategic-planning-plant-replacements/
118. NewPro Containers — interiorscape pricing formulas, lease = retail × 1.5 ÷ 12 (2026) — https://www.newprocontainers.com/blog/quick-guide-pricing-interiorscape-jobs/
119. NewPro Containers — technician productivity, 6 onsite of 8 paid hours = 75% (2026) — https://www.newprocontainers.com/blog/measuring-your-plant-techs-productivity-efficiency-quality-of-work/
120. NewPro Containers — sub-irrigation, 14+ days between waterings (2026) — https://www.newprocontainers.com/blog/sub-irrigation-system-plantscape-project/
121. NewPro Containers — "a Controlled Watering Insert may cost as much as the plant" (2026) — https://www.newprocontainers.com/blog/subirrigation-best-interiorscape-investment/
122. Lechuza — reservoir refill every 2–4 weeks, up to 12 (2026) — https://www.lechuza.world/the-lechuza-sub-irrigation-system/sp_selfwatering.html
123. Planterra — sub-irrigation recommended; plumbed indoor irrigation discouraged (2026) — https://planterra.com/blogposts/what-are-the-best-irrigation-methods-for-interior-plants/
124. NALP — light heuristic, overwatering as primary killer, post-COVID sourcing, the self-insurance logic of rental (2026) — https://blog.landscapeprofessionals.org/the-ins-and-outs-of-interior-plantscaping/
125. Scientific Reports — 47-day acclimatisation, shade-tolerant species under 6.8 µmol m⁻² s⁻¹ (2024) — https://www.nature.com/articles/s41598-024-67877-y
126. UF/IFAS MREC — 75/150/225/300 ft-c interiorscape screening thresholds — https://mrec.ifas.ufl.edu/Foliage/Resrpts/rh_96_3.htm
127. University of Kentucky PSEP — interiorscape pests; few pesticides registered for indoor use — https://www.uky.edu/Ag/Entomology/PSEP/cat19insects.html
128. Lowe's — tropicals damaged below 4 °C, ideal transport 15–29 °C (2026) — https://www.lowes.com/n/how-to/transport-plants-in-cold-weather
129. Berlin Umweltatlas — January mean +1.0 °C (1991–2020 reference) — https://www.berlin.de/umweltatlas/klima/entwicklung-von-klimaparametern/2022/ergebnisse-der-historischen-auswertung/
130. Pulse RevOps — pool service 8–12 stops/day → 22–28% EBITDA, <6 → sub-15% (2026) — https://pulserevops.com/industry-kpis/ik0435
131. Sealey B&B — route density worth a 15–20% labour cost advantage (2026) — https://www.sealeybb.com/pool-route-valuation-secrets-revealed-why-density-matters-more-than-account-count/
132. Career.com job ad — interiorscape routes "preset and typically 4-6 hrs" (2023) — https://www.career.com/job/plant-designs-inc/plant-care-horticulture-interiorscape-technician/j202307261319141244742
133. FolioGreen — the one purpose-built interiorscape platform; no QR asset scanning advertised (2026) — https://foliogreen.com/
134. Botanical Designs — colour rotations "bimonthly or quarterly" (2026) — https://botanicaldesigns.com/color-rotations/
135. Merkblatt Wechselflor — replanting "zwei- bis dreimal jährlich" (2023) — https://oeffentlichebeschaffung.kompass-nachhaltigkeit.ch/fileadmin/kundendaten/produkte-labels/Gruenraum/Merkblatt_Wechselflor.pdf
136. Acacia Garden Center — Dubai office watering intervals; AC desiccation; humidity 25–40% (2026) — https://acaciagardencenter.com/blogs/care-library/indoor-plants-dubai-offices
137. RHS — indoor azaleas rated "Difficult" — https://www.rhs.org.uk/plants/rhododendron/indoor-azaleas
138. LeafyPixels — "weeping figs shed heavily when relocated" (2026-06-16) — https://leafypixels.com/plants/ficus-benjamina/spider-mites/
139. ASPCA — Peace Lily **toxic** (2026) — https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/peace-lily
140. ASPCA — Kentia Palm **non-toxic** (2026) — https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/kentia-palm
141. ASPCA — Areca Palm **non-toxic** (2026) — https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/areca-palm
142. NC State — pet toxin knowledge survey, 52% accuracy — https://news.cvm.ncsu.edu/pet-toxins-study
143. FlorAccess — European trade prices, Ficus €40–216 (2026) — https://www.floraccess.com/en/category/900/ficus/
144. 123zimmerpflanzen — German retail, floor plants €29.99–106.99 (2026) — https://www.123zimmerpflanzen.de/zimmerpflanzen/grosse
145. IKEA Deutschland Bodenpflanzen — €6.99–49.99 (2026) — https://www.ikea.com/de/de/cat/bodenpflanzen-700524/

**Labour, costs and CAC**

146. bau.bi — GaLaBau Tarif, Ecklohn LG4.2a €20.24/h (Jul 2025) → €20.91/h (Jul 2026) — https://bau.bi/galabau/nachrichten/tarifvertrag-so-hoch-sind-die-loehne-und-gehaelter-im-galabau-g19996
147. IG BAU — GaLaBau Tarifabschluss (2025) — https://igbau.de/Garten-und-Landschaftsbau-Tarifabschluss-mehr-Geld-fuer-alle.html
148. BMAS — statutory minimum wage €13.90/h from 1 Jan 2026 — https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html
149. Deutsche Rentenversicherung — Minijob ceiling €603/month (2026) — https://www.deutsche-rentenversicherung.de/BadenWuerttemberg/DE/Presse/Pressemitteilungen/2025/251222_Minijob.html
150. Indeed DE — average Gärtner pay Berlin €17.15/hour (2025/26) — https://de.indeed.com/career/g%C3%A4rtner/salaries/Berlin
151. Berliner Pflanzendoktor — **retail** rates: gardener €52.50/h + VAT, travel €42.50/visit (2026). **A price, not a cost** — https://www.berlinerpflanzendoktor.de/preise
152. Indeed AE — gardener Dubai AED 2,352/month, 37 salaries (Sept 2025) — https://ae.indeed.com/career/gardener/salaries/Dubai
153. Indeed AE — landscape technician UAE AED 5,164/month, 109 salaries (May 2026) — https://ae.indeed.com/career/landscape-technician/salaries
154. Fuhrpark.de — van running costs, Sprinter 50.8 ct/km (2025) — https://fuhrpark.de/betriebskosten-transporter-0
155. miete-aktuell — Berlin Lagerhalle €6.00/m²/month (2026) — https://www.miete-aktuell.de/gewerbepreise/Berlin/Berlin/
156. LocaliQ search advertising benchmarks — Business Services CPC $5.87, CPL $93.69 (2026) — https://localiq.com/blog/search-advertising-benchmarks/
157. Belkins LinkedIn outreach study — 26% acceptance, 7.2% reply, 1.3% meetings (2026, data 2025) — https://belkins.io/blog/linkedin-outreach-study
158. Belkins cold email study — 0.45% reply across 7.5m emails (2026, data 2025) — https://belkins.io/blog/cold-email-response-rates
159. Gradient Works — B2B sales cycle by ACV; SMB <$15k closes in 14–30 days (2025) — https://www.gradient.works/blog/2025-b2b-sales-performance-benchmarks

**Customer research**

160. Interface / Cary Cooper, Human Spaces Global Report, n=7,600, 16 countries — "Only 42% report having live plants in the office"; UAE and Germany country findings (2015) — https://www.interface.com/content/dam/interfaceinc/interface/global-campaigns/human-spaces/report/global-human-spaces-report/Human%20Spaces%20report%202015%20EN.pdf
161. University of Exeter / Nieuwenhuis et al., J. Exp. Psych: Applied — the "15% more productive" study (2014) — https://news-archive.exeter.ac.uk/2014/september/title_409094_en.html
162. Fox News reporting OnePoll/Article survey, 2,000 US millennials — 67% found plant care harder than expected; average plant parent killed seven (2020) — https://www.foxnews.com/lifestyle/millennials-intimidated-by-plants-survey.print
163. LiveInGermany citing Destatis — ~4.1m German households with paid domestic help; nine in ten informal (2026) — https://liveingermany.de/maids-in-germany/
164. MaidCorner — Dubai part-time cleaning AED 30–50/hour, AED 300–1,000/month plans (2026) — https://maidcorner.com/maid-service-cost-in-dubai/
165. Hacker News via Algolia — "rental plants are a staple of many offices in the Netherlands… someone passing by once a month" **[anecdotal]** — https://hn.algolia.com/api/v1/search?query=plant%20rental%20office&tags=comment

**Legal, tax and regulation**

166. § 312 BGB (scope of consumer contract rules) — https://www.gesetze-im-internet.de/bgb/__312.html
167. § 312g BGB (withdrawal right and exceptions) — https://www.gesetze-im-internet.de/bgb/__312g.html
168. § 312j BGB (order button) — https://www.gesetze-im-internet.de/bgb/__312j.html
169. § 312k BGB (Kündigungsbutton) — https://www.gesetze-im-internet.de/bgb/__312k.html
170. § 309 BGB (prohibited AGB clauses, Nr. 5, 6, 7, 9) — https://www.gesetze-im-internet.de/bgb/__309.html
171. § 356 BGB (expiry of withdrawal right) — https://www.gesetze-im-internet.de/bgb/__356.html
172. § 357 BGB (consequences of withdrawal, collection at trader's cost) — https://www.gesetze-im-internet.de/bgb/__357.html
173. § 357a BGB (Wertersatz) — https://www.gesetze-im-internet.de/bgb/__357a.html
174. § 536 BGB (Mietminderung) — https://www.gesetze-im-internet.de/bgb/__536.html
175. § 548 BGB (6-month limitation) — https://www.gesetze-im-internet.de/bgb/__548.html
176. § 12 UStG (reduced rate incl. rental of Anlage 2 goods) — https://www.gesetze-im-internet.de/ustg_1980/__12.html
177. Anlage 2 UStG Nr. 7 (live plants, customs position 0602) — https://www.gesetze-im-internet.de/ustg_1980/anlage_2.html
178. § 19 UStG (Kleinunternehmer thresholds) — https://www.gesetze-im-internet.de/ustg_1980/__19.html
179. § 9 PflSchG (Sachkundenachweis) — https://www.gesetze-im-internet.de/pflschg_2012/__9.html
180. Handwerksordnung Anlage B — no garden or plant trade listed, therefore no Meisterpflicht — https://www.gesetze-im-internet.de/hwo/anlage_b.html
181. Ecovis — 7% vs 19% on plant delivery bundled with garden works — https://de.ecovis.com/agrar/steuersatz-pflanzenlieferungen-gartenanlage/
182. e-recht24 — when the Kündigungsbutton is mandatory; Abmahnwelle — https://www.e-recht24.de/ecommerce/13090-wann-der-kuendigungsbutton-pflicht-ist.html
183. nexvyra — § 312k reference incl. **BGH I ZR 200/25 of 16 July 2026 [single secondary source, verify against BGH-PM Nr. 128/2026 before build]** — https://nexvyra.de/fakten/kuendigungsbutton-312k-bgb.html
184. GDPR Art. 6 — https://gdpr-info.eu/art-6-gdpr/
185. KPMG — Dubai Executive Council Resolution No. 11 of 2025, AED 10,000 branch licence / AED 5,000 temporary permit (2025) — https://kpmg.com/ae/en/insights/tax-insights/dubai-issues-resolution-enabling-free-zone-companies-to-operate-on-mainland.html
186. u.ae — UAE Consumer Protection Law 15/2020: Arabic invoices, marketing-data prohibition, penalties to AED 2m (2026) — https://u.ae/en/information-and-services/justice-safety-and-the-law/consumer-protection
187. u.ae — PDPL (Federal Decree-Law 45/2021) and DIFC Law 5/2020 (2026) — https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws
188. u.ae — 100% foreign ownership of mainland companies (2026) — https://u.ae/en/information-and-services/business/Doing-business/doing-business-on-the-mainland/full-foreign-ownership-of-commercial-companies
189. Dubai Municipality — Pest Control Companies Classification Guidelines, dated 04/06/2026 — https://www.dm.gov.ae/business/pest-control/
190. UAE Legislation — Federal Law No. 7 of 2025 on Agricultural Quarantine — https://uaelegislation.gov.ae/en/legislations
191. UAE FTA — VAT registration thresholds (2026) — https://tax.gov.ae/en/taxes/Vat/vat.topics/registration.for.vat.aspx

**Technology and payments**

192. Stripe global availability — DE and AE both fully launched (2026) — https://stripe.com/global
193. Stripe Germany pricing — SEPA €0.35 flat; EEA standard 1.5% + €0.25; **EEA premium 2.8% + €0.25**; Billing 0.7% (2026) — https://stripe.com/de/pricing
194. Stripe UAE pricing — 2.9% + AED 1.00 domestic (2026) — https://stripe.com/ae/pricing
195. Stripe SEPA Direct Debit — T+6 settlement, €10,000 cap, 8-week no-questions dispute window, no appeal (2026) — https://docs.stripe.com/payments/sepa-debit
196. Stripe payment-method support matrix — **AE absent from the SEPA business-location list** (2026) — https://docs.stripe.com/payments/payment-methods/payment-method-support
197. Stripe Subscription Schedules — `iterations` + `end_behavior=cancel`; draft-invoice-for-1-hour behaviour (2026) — https://docs.stripe.com/billing/subscriptions/subscription-schedules
198. Stripe Invoicing — `send_invoice`, `days_until_due`, `custom_fields` for PO and VAT; listen to `invoice.paid` (2026) — https://docs.stripe.com/invoicing/integration
199. Supabase Cron / pg_cron — every second to once a year; ~8 concurrent jobs, 10-minute cap (2026) — https://supabase.com/docs/guides/cron
200. Supabase PostGIS — geography POINT, GIST index (2026) — https://supabase.com/docs/guides/database/extensions/postgis
201. Supabase RLS best practices — `(select auth.uid())`, index policy columns, `TO authenticated`, security-definer helpers (2026) — https://supabase.com/docs/guides/database/postgres/row-level-security
202. Supabase custom claims and RBAC — Custom Access Token Auth Hook (2026) — https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
203. Supabase Next.js server-side auth — **use `getClaims()`, never trust `getSession()` server-side** (2026) — https://supabase.com/docs/guides/auth/server-side/nextjs
204. Supabase Queues (pgmq) — guaranteed delivery (2026) — https://supabase.com/docs/guides/queues
205. Supabase Database Webhooks — use only where the endpoint tolerates occasional failures (2026) — https://supabase.com/docs/guides/database/webhooks
206. Supabase pricing — Free pauses after a week; Pro $25; **Team $599 for SOC2/ISO** (2026) — https://supabase.com/pricing
207. PostgreSQL 17 range types — `EXCLUDE USING GIST` exclusion constraints — https://www.postgresql.org/docs/17/rangetypes.html
208. Mapbox pricing — Optimization 100,000 free/month; **Permanent geocoding has no free tier at $5.00/1,000** (2026) — https://www.mapbox.com/pricing
209. Google Maps Platform pricing — Route Optimization 5,000 free, $10/1,000 (2026) — https://developers.google.com/maps/billing-and-pricing/pricing
210. Resend pricing — Free 3,000/month with a **100/day hard cap**; Pro from $20 (2026) — https://resend.com/pricing
211. Vercel pricing (2026) — https://vercel.com/pricing
212. Retool pricing — Free for up to 5 users (2026) — https://retool.com/pricing
213. Jobber pricing and job checklists — Core $29, Connect $99 (2026) — https://www.getjobber.com/pricing/ · https://www.getjobber.com/features/job-forms/
214. WhatsApp Business Platform pricing — per-message from 1 July 2025 (2026) — https://developers.facebook.com/docs/whatsapp/pricing
215. caniuse — Push API on iOS Safari still partial through 26.6 (2026) — https://caniuse.com/push-api
216. handelsdaten.de / EHI Online-Payment 2025 — PayPal 28.7%, Kauf auf Rechnung 26.1% of German online retail revenue — https://www.handelsdaten.de/deutschsprachiger-einzelhandel/anteile-zahlungsarten-online-handel-zeitreihe
217. UAE Ministry of Finance — eInvoicing DCTCE 5-corner model (2026) — https://mof.gov.ae/en/about-ministry/mof-initiatives/einvoicing/

---

## Appendix — where the detail lives

| Lens | File |
|---|---|
| Market size and growth | [`raw/market-size.md`](raw/market-size.md) |
| B2B competitors | [`raw/competitors-b2b.md`](raw/competitors-b2b.md) |
| B2C subscriptions and rental | [`raw/competitors-b2c.md`](raw/competitors-b2c.md) |
| Germany and Berlin deep-dive | [`raw/market-germany.md`](raw/market-germany.md) |
| Dubai and the UAE deep-dive | [`raw/market-uae.md`](raw/market-uae.md) |
| Unit economics and pricing | [`raw/unit-economics.md`](raw/unit-economics.md) |
| Operations | [`raw/operations.md`](raw/operations.md) |
| Customers, personas and WTP | [`raw/customers.md`](raw/customers.md) |
| Product and UX benchmarks | [`raw/product-ux.md`](raw/product-ux.md) |
| Legal and compliance | [`raw/legal.md`](raw/legal.md) |
| Technical architecture | [`raw/tech.md`](raw/tech.md) |
| Risks and failure cases | [`raw/risks.md`](raw/risks.md) |
| Go-to-market and packaging | [`raw/gtm.md`](raw/gtm.md) |
| Plant catalogue and rotation | [`raw/plant-catalog.md`](raw/plant-catalog.md) |
