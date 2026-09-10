# Planty — Unit Economics & Pricing (raw research notes)

Lens: unit economics & pricing. Compiled 2026-09-10.
Convention: every number carries a source URL + year. Figures labelled **[EST]** are my own
modelled estimates, not sourced. Figures labelled **[LOW-QUALITY]** come from pages that look
auto-generated and should not be leaned on.

FX assumption used throughout: **1 EUR ≈ 4.26 AED** **[EST]**. The AED is hard-pegged to the USD
at 3.6725 (long-standing peg); the EUR leg is the variable part. Treat all EUR↔AED conversions
below as ±5%.

---

## 1. Revenue benchmarks — what the market actually charges

### 1.1 Germany / DACH — B2B office plant rental (the only real market here)

This is the most important pricing finding: **published German prices are per-planter per-month,
in a tight band of roughly €7–€23, with a hard monthly minimum of €75–€199 and 12–24 month terms.**

| Provider | Price | Term / minimum | Service cadence | Source (year) |
|---|---|---|---|---|
| Gärtner Gregg (Münster/Dortmund) | **€6.90/mo** (Pflanzschale Ø40cm), €10.50–12.50 (standing planters), €13.50–22.90 (sideboards/room dividers), all net | 12 months standard | "Professioneller Pflegeservice **alle 4 Wochen**" | [gaertner-gregg.de](https://www.gaertner-gregg.de/mietpflanzen-muenster-dortmund/) (2026) |
| Reiffer / objektbepflanzung.de (Stuttgart) | **"9€ pro Pflanze (pro Monat)"** from | **€75/month minimum**, **2 Jahre** minimum term | **"alle drei Wochen"** | [objektbepflanzung.de](https://objektbepflanzung.de/pflanzen-vermietung) (2026) |
| AS Hydroplant (Düsseldorf) | **€13.90/month per unit** for a ~120cm Ficus Nitida incl. "Virgin Island" planter; same €13.90 for a 75cm×43cm "Sansibar" planter | not stated | incl. gardener service + exchange guarantee | [as-hydroplant.de](https://www.as-hydroplant.de/mieten-leasen/) (2026) |
| Kinnula Hydrokulturen (Köln) | **"Schon ab 6 Euro pro Monat"** | not stated | **"alle zwei bis vier Wochen"** | [hydro-kulturen.de](https://hydro-kulturen.de/pflanzen-mieten/) (2026) |
| WELO Green | **Basic €199/mo** (≤200 m², "ca. 5–10 Pflanzenkonzepte mit Gefäßen"), **Comfort €299/mo** (≤400 m², "ca. 15-20 Pflanzenkonzeptionen"), **Plus €649/mo** (≤1,000 m², incl. ≥1 plant wall) | **12 Monate Laufzeit, danach monatlich kündbar** | **"Alle 3 Wochen Pflege inklusive"** | [welo-green.de](https://welo-green.de/pages/mietpflanzen) (2026) |
| Plantclub (Berlin/HH/Köln/München/Wien) | **Greenhouse €200/mo** (≤150 m²), **Woodland €400/mo** (≤500 m²), **Jungle €600/mo** (≤1,000 m²), Rainforest custom — all billed annually, excl. VAT | **12 months** | not published | [plantclub.io/de/preise](https://plantclub.io/de/preise) (2026) |

Derived per-plant price from the package tiers: WELO Comfort €299 ÷ 15–20 units = **€15–20/plant/mo**;
WELO Basic €199 ÷ 5–10 = **€20–40/plant/mo** (small packages carry the fixed visit cost) **[EST]**.
This is consistent with the à-la-carte €9–€23 band once you load the minimum-visit overhead.

**Key structural observation:** *not one* German provider found sells weekly maintenance. The
published cadences are **every 3 weeks (Reiffer, WELO), every 4 weeks (Gärtner Gregg), every 2–4
weeks (Kinnula)**. That is the market-clearing service level at €9–20/plant/month.

**B2C in Germany: essentially does not exist.** Searching for private-customer plant rental returns
only B2B providers whose entry point is €199/month (WELO). Miet24 lists event/trade-fair plant
rental "from €10 per day", i.e. short-term event hire, not a home subscription
([marktplatz.miet24.de](https://marktplatz.miet24.de/mieten/events-und-messen/pflanzen), 2026).
Read either as a greenfield opportunity or as evidence that nobody has made the unit economics work.

### 1.2 Dubai / UAE

**No UAE provider publishes a per-plant-per-month rental rate.** Every rental page found gates
pricing behind a site visit. What *is* published is maintenance-only pricing and plant purchase prices.

Royal Plantscape published maintenance tiers ([royalplantscape.com](https://www.royalplantscape.com/pages/indoor-plant-maintenance-service), 2026):

| Plan | Price | Frequency |
|---|---|---|
| Basic Indoor Plant Care | from **AED 120/month** | 1 visit/month |
| Regular Indoor Plant Care | from **AED 299/month** | 2 visits/month |
| Weekly Plant Maintenance | from **AED 499/month** | 1 visit/week |
| Premium Indoor Plant Care | from **AED 799/month** | 2 visits/week |
| Office Plant Maintenance | from **AED 499/month** | n/s |
| One-time indoor plant care | from **AED 120** | per visit |
| Plant watering / fertilizing / pest / pruning | from **AED 199/visit** each | per visit |

Note the shape of that ladder: **1 visit/mo = AED 120, 4 visits/mo = AED 499** → the marginal
priced cost of an extra visit is ~**AED 126** (≈€30). That is a directly observable market price
for one technician site visit in Dubai, and it is the single most useful UAE number found.

800petals ([800petals.com](https://800petals.com/office-plant-rental-dubai/), 2026) describes the
model but not the price: *"Most plans are quoted per plant per month, all-inclusive"*, with
**"Weekly maintenance visits by trained plant care staff"**, **"Free replacement of declining
plants"**, "Seasonal rotation options", "a single monthly invoice", and
**"Most clients choose 12-month agreements for the best monthly rate."** They state renting
"suits most offices with 10+ plants". So the Dubai norm *is* weekly, unlike Germany — which is
only affordable because Dubai labour is ~4× cheaper (§2.1).

**Correction to a common mis-read:** search snippets claim Plantsworld.ae rents plants at
"AED 244–478 per month". Fetching the actual collection page shows these are **purchase prices**,
not rentals — e.g. Amstel King Fig from AED 244, Fiddle Leaf Fig AED 425, Areca Palm AED 499,
Monstera Deliciosa AED 629, Ficus Bonsai S-shape AED 789
([plantsworld.ae](https://plantsworld.ae/collections/office-plant-rental), 2026). Do not use these
as rental benchmarks. They are, however, an excellent **retail plant capex** benchmark for Dubai.

### 1.3 US benchmarks (useful for calibrating the shape of the model)

- Per plant per month, Northern California: **$20–$35** small (Sansevieria, ZZ), **$40–$75** medium
  (Mass Cane, Janet Craig), **$90–$150** large (Ficus lyrata, Bird of Paradise)
  ([officeplants.com](https://officeplants.com/2026/08/03/office-plant-rental-pricing/), 2026).
- Program level: *"Most businesses invest between $200 and $1,200 monthly for a complete program"*;
  typical **minimum monthly fee $100–$200**; *"Most commercial lease agreements establish a
  12-month minimum term with rolling renewals"*; cadence *"watering every 2 weeks"* (same source, 2026).
- Plant Solutions (Phoenix) lease programs "begin at $175 monthly" (2026, via same search).
- Residential US: one-time $50–$100/visit; **monthly $50–$150/mo; bi-weekly $100–$250/mo; weekly
  $200–$400/mo** ([redsquareflowers.com](https://redsquareflowers.com/how-much-do-interior-plant-maintenance-services-cost/), 2026).
  Note how steeply price rises with cadence — the customer is buying labour, not plants.
- Plants Y'all publishes a **"$75/hour maintenance rate"** with a one-hour minimum, and explicitly
  says they do **not** charge per plant: *"no one-size monthly package"*; installs "commonly start
  around $1,500" with a "$300–$750 design proposal" and 50% deposit
  ([plantsyall.com](https://plantsyall.com/journal/office-plant-service-cost-monthly/), 2026).

The US residential ladder ($50–150 monthly vs $200–400 weekly) is the clearest public evidence that
**a weekly-visit consumer product has to be priced 3–4× a monthly-visit one.**

---

## 2. Cost side

### 2.1 Technician labour — the decisive Germany-vs-Dubai variable

**Germany.** The GaLaBau (Garten-, Landschafts- und Sportbau) collective agreement Ecklohn for
Lohngruppe 4.2a rose **from €19.61 to €20.24/hour from 1 July 2025 (+3.2%), and to €20.91/hour
from 1 July 2026 (+3.3%)** ([bau.bi GaLaBau Tarif 2025/2026](https://bau.bi/galabau/nachrichten/tarifvertrag-so-hoch-sind-die-loehne-und-gehaelter-im-galabau-g19996), 2025;
[IG BAU](https://igbau.de/Garten-und-Landschaftsbau-Tarifabschluss-mehr-Geld-fuer-alle.html), 2025).
StepStone reports an average gardener (GaLaBau) salary of **€34,000/year, ~€2,833/month**
([stepstone.de](https://www.stepstone.de/gehalt/Gaertner-in-Garten-und-Landschaftsbau.html), 2026).

Fully-loaded employer cost **[EST]**: €20.24 × ~1.21 employer social contributions ≈ €24.5/hour
paid; divide by ~85% productive utilisation → **≈€28–30 per productive technician hour in Berlin, 2026.**

**Dubai.** Indeed reports the average **gardener salary in Dubai at AED 2,352/month** (37 salaries,
updated Sept 2025) and **AED 2,320/month UAE-wide**
([ae.indeed.com](https://ae.indeed.com/career/gardener/salaries/Dubai), 2025). A more skilled
**Landscape Technician averages AED 5,164/month** (109 salaries, May 2026)
([ae.indeed.com](https://ae.indeed.com/career/landscape-technician/salaries), 2026).

Fully-loaded **[EST]**: take AED 3,000–5,500/month base, add ~35% for visa, medical, accommodation
and transport allowances typical of UAE blue-collar employment → **AED 4,000–7,400/month**.
At 22 days × 8h = 176 hours → **AED 23–42/hour ≈ €5.4–9.9/hour.**

> **This is the headline unit-economics fact: a productive technician hour costs roughly
> €28–30 in Berlin and €5–10 in Dubai — a 3–5× gap.** Everything about the service design
> (visit cadence, minimum basket size, whether B2C is viable at all) follows from it.

Sanity check against Dubai's own published prices: Royal Plantscape's marginal visit price of
~AED 126 (§1.2) against an estimated AED 30–60 of technician time + travel for a short visit
implies a healthy service gross margin, which is consistent.

### 2.2 Vehicle / route cost

Germany: ADAC full-cost figures for vans are **€0.50–0.80/km** including depreciation, insurance,
maintenance and fuel; specific models: Ford Transit 2.0 EcoBlue ~**€0.30/km**, VW Crafter 2.0 TDI
**43.8 ct/km**, Mercedes Sprinter **50.8 ct/km**. Tradesman practice: "Bei einem Transporter mit
25.000 Kilometern im Jahr und 8.000 Euro Fixkosten sind das 32 Cent pro Kilometer" plus fuel →
"schnell auf 50 Cent oder mehr pro Kilometer"; customer-facing Kilometerpauschale is typically
**€0.50–1.00/km** ([fuhrpark.de](https://fuhrpark.de/betriebskosten-transporter-0);
[bosch-officeon.com](https://bosch-officeon.com/de/de/wissen/blog/fahrtkosten-im-handwerk/);
[my-hammer.de](https://www.my-hammer.de/handwerks-montageleistungen/preisradar/anfahrtskosten-handwerker), 2025/2026).
I use **€0.50/km** as van full cost **[EST]**.

Route density benchmark (US, **[LOW-QUALITY]** — auto-generated financial-model content, treat as
folk wisdom not data): "aiming for **4 stops per route hour**", technicians "service 40+ clients per
month", "technician time per client visit averages **45 minutes** of billable work", and technician
travel modelled at a startling 60% of Year-1 revenue falling to 50% by Year 5
([financialmodelslab.com](https://financialmodelslab.com/blogs/operating-costs/indoor-plant-care-services), 2026).
The same page gives $18,900/month baseline fixed costs, technicians at $45,000/year, a founder at
$90,000/year, a **29-month break-even** and a **$499,000 working-capital buffer**. I would not cite
these numbers to an investor, but the *direction* — that route density and travel dominate — matches
everything else found.

### 2.3 Plant capex

**Germany (retail, incl. VAT)** — 123zimmerpflanzen, large indoor plants
([123zimmerpflanzen.de](https://www.123zimmerpflanzen.de/zimmerpflanzen/grosse), 2026):
Strelitzia Nicolai 110cm/Ø21 **€29.99**; Dracaena Janet Lind 120cm/Ø21 **€37.99**; Strelitzia
140cm/Ø24 **€44.99**; Pachira aquatica 150cm/Ø27 **€53.99**; Polyscias Ming 120cm/Ø27 **€53.99**;
Strelitzia 150cm/Ø27 **€61.99**; Monstera Pertusum 115cm/Ø24 **€63.99**; Kentia 160cm/Ø24 **€69.99**;
Rhapis Excelsa 140cm/Ø27 **€103.99**; Kentia extra full 180cm/Ø27 **€106.99**.

So a **1.2–1.8m floor plant retails in Germany at €30–107 incl. VAT**. Wholesale: I could not find a
public B2B price list — Plantcentraal, B2B Flowers, Roobos and Growhub all gate prices behind
account/quote. **[EST]** Standard horticulture trade practice is roughly 40–55% of retail net, so
assume **€12–€45 net per floor plant** and **€1.50–€3.50 for a 12cm desktop plant** at wholesale.
*This is the weakest quantitative assumption in the whole model.*

Context: the Netherlands exported **€7.2bn** of flowers and plants last year, of which **€2.8bn was
plants** ([DutchNews](https://www.dutchnews.nl/2026/01/flower-and-plant-exports-top-e7-billion-tariffs-hit-us-market/), 2026)
— Berlin sits inside the world's cheapest sourcing radius. Royal FloraHolland notes potted moth
orchid revenue fell **6.4%** on flat unit volumes with pricing "under clear pressure", and green
houseplant volumes declining "with the sharpest fall in smaller pot sizes" but pricing showing
"a cautious recovery in 2026" (RFH market update, 2026) — i.e. a soft, buyer-friendly supply market.

**Dubai (retail)** — Plantsworld.ae, 2026: floor plants **AED 244–789** (Amstel King from AED 244;
Dracaena Marginata AED 360; Phoenix Roebelenii 120–150cm AED 399; Fiddle Leaf Fig AED 425;
Weeping Fig AED 449; Areca Palm AED 499; Dracaena Massangeana AED 499; Pachira 120–150cm AED 549;
Peace Lily AED 589; Monstera AED 629; Ficus Bonsai S-shape AED 789). At 4.26 AED/EUR that is
**€57–€185 retail per floor plant — roughly 1.7–2× the German retail level.**

Why: UAE imports most indoor stock, and **Dubai Customs applies 5% duty on CIF value** plus 5% VAT
([traddal.com](https://traddal.com/resources/calculate-duties-taxes-imports-united-arab-emirates), 2026);
general guidance is that freight, insurance, duty, VAT and brokerage add **15–40% to product cost**
(same source, 2026). Cheaper local sourcing exists — the **Al Warsan** nursery market is described
as the wholesale/retail hub "known for the lowest prices"
([royalplants.ae](https://royalplants.ae/budget-friendly-plants-dubai-nurseries-markets-tips/), 2025).
**[EST]** Warsan wholesale for a mid-size floor plant: **AED 100–350 (€24–82)**.

> **Second headline fact: the two markets have *opposite* cost structures.**
> Berlin = cheap plants, expensive labour. Dubai = expensive plants, cheap labour.
> A rental business is a labour business wearing a plant costume, so Dubai wins — but Dubai's
> higher capex means slower payback and more working capital per customer.

### 2.4 Planters / pots

No public trade price list found. German retail comparators: a Euro3plast Tuit 40×75cm planter at
**€56.90 incl. VAT** (eBay listing, 2026); large plastic planters at OBI/OTTO/blumentopf24 in the
same range. Hydroculture adds a water-level indicator and expanded clay (Blähton) and is explicitly
"in der Anschaffung teurer"
([blauarbeit.de Hydrokultur guide](https://ratgeber.blauarbeit.de/garten/hydrokultur), 2026).
**[EST]** I assume **€8–15** for a desktop cachepot and **€25–60** for a floor-size hydro/sub-irrigation
planter incl. indicator and clay. Weak assumption; needs a supplier quote.

Crucially, planters are the part of the asset base that **does not die** — they survive customer
churn and plant replacement, so they amortise over 5–7 years rather than 2–3.

### 2.5 Plant lifespan, replacement rate and loss

The best benchmark found, and it is light-dependent:

> "accounts with low light levels may require replacing **50–60% of the inventory within two years
> or less**", "replacement rates of **30–40% for medium-light** locations", and "high-light locations
> may require replacing only **10–20%** over the same period"
> ([NewPro Containers blog](https://blog.newprocontainers.com/blog/strategic-planning-plant-replacements/), 2026)

That is **5–10% p.a. (high light), 15–20% p.a. (medium), 25–30% p.a. (low light)** — and offices are
mostly medium-to-low light. Same source: "When a replacement is necessary, we typically handle it
within 8 to 24 hours."

Industry marketing claims **"a 95%+ plant survival rate — DIY averages just 40% to 60%"**
([mrplantsocal.com](https://www.mrplantsocal.com/interior-plant-design-vs-diy-office-plants-roi-analysis/), 2026)
— anecdotal/promotional, but note the survival claim is annual-ish while the NewPro figure is
2-year cumulative, so they are not actually contradictory.

**[EST] Model assumption: 20%/year replacement of installed plant value for indoor B2B/B2C in
Berlin; 25%/year for Dubai indoor (AC desiccation, dust); 40%/year for Dubai outdoor/villa
(summer heat).** Effective plant life ≈ 30–40 months indoor.

### 2.6 The cadence lever — hydroculture / sub-irrigation

This is the most actionable operational finding and it directly contradicts the brief's
"weekly technician visit" assumption.

- Hydrokultur watering interval is **2–4 weeks**, vs **2–3 days** for soil; fertilising intervals
  are also 2–4 weeks, typically dosed into the watering; one supplier claims **"60% weniger
  Pflegeaufwand"** vs soil ([blauarbeit.de](https://ratgeber.blauarbeit.de/garten/hydrokultur), 2026;
  [hydroflora.de](https://www.hydroflora.de/produkte/hydrokultur/), 2026).
- Sub-irrigation planters (SIPs) "can reduce the frequency of watering by up to six weeks", commonly
  turning "watering every two or three days" into "check and refill the reservoir once every couple
  of weeks", with the explicit rationale that this "can help control labor costs"
  ([newprocontainers.com](https://www.newprocontainers.com/blog/sub-irrigation-system-plantscape-project/), 2026;
  [goodearthplants.com](https://goodearthplants.com/go-underground-how-to-water-your-plants-using-sub-irrigation/), 2026).

Every German competitor's published cadence (3–4 weeks) is explained by this. **Weekly visits in
Germany multiply the dominant cost line by 3–4× for no revenue increase.**

### 2.7 Industry margin benchmarks

- **Rentokil Initial, Hygiene & Wellbeing segment (contains Ambius), FY2025:** revenue **$1,205m**
  (FY24: $1,136m), +6.1% reported / +4.3% constant currency, **Organic Revenue Growth 2.3%**;
  Adjusted Operating Profit **$224m** (FY24: $205m), **Adjusted Operating Margin 18.6% (FY24: 18.0%)**.
  Segment is 17% of group revenue and 18% of group adjusted operating profit. Group adjusted
  operating margin was 15.5%. Verified by extracting the text of the official PDF
  ([2025 Preliminary Results](https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/2025-prelims-statement.pdf), 2026).
  FY24 comparison: H&W revenue £931m, +8.4%, adj. op profit £169m, margin 18.1%
  ([2024 Preliminary Results](https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/2024-preliminary-results.pdf), 2025).
  **Caveat: this segment is dominated by washroom hygiene, not plants. Use ~18% EBIT as a
  best-in-class *route-based recurring services* ceiling, not as an interior-landscaping figure.**
- Landscaping services generally: average profit margin **~7.9%**; gross margin typically **45–55%**;
  net margin **5–12%** ([realgreen.com](https://www.realgreen.com/blog/guide-to-landscaping-profit-margins), 2026;
  [sideways8.com](https://www.sideways8.com/insights/landscaping-business-financials-explained-income-cogs-and-net-profit-a-practical-guide/), 2026).
  IBISWorld puts US landscaping services industry revenue at **$176.7bn** with a 3.0% CAGR through 2026
  ([ibisworld.com](https://www.ibisworld.com/united-states/industry/landscaping-services/1497/), 2026).
  I could not obtain a dedicated IBISWorld *interior plantscaping* profit margin — it sits behind a paywall.

**Read-through: a 45–55% gross margin and a high-single-digit to mid-teens EBIT is the realistic
target. Any model that shows 70%+ contribution margin at low route density is wrong.**

---

## 3. Three modelled scenarios

All scenarios are **[EST]** built from the sourced inputs above. Prices are net of VAT.
Contribution margin = price − direct COGS (technician time, travel, plant amortisation,
replacement provision, payment fees). It excludes CAC, depot/warehouse, software and G&A.

Shared cost inputs:

| Input | Berlin | Dubai |
|---|---|---|
| Loaded technician hour | €29 | AED 32 (≈€7.5) |
| Van full cost | €0.50/km | AED 2.0/km |
| Km between stops (dense route) | 6 km | 10 km |
| Desktop plant + cachepot, capex | €14 | AED 110 |
| Floor plant + hydro planter, capex | €65 | AED 380 |
| Plant amortisation life | 36 months | 36 months |
| Replacement provision (indoor) | 20%/yr of plant value | 25%/yr |
| Payment processing | 2.0% | 2.0% |

### Scenario A — B2C small flat, 3 plants

| | Berlin, monthly visit | Berlin, **weekly** visit | Dubai, weekly visit |
|---|---|---|---|
| Price (customer pays) | €35 | €35 | AED 249 (€58) |
| Visits/month | 1.0 | 4.33 | 4.33 |
| On-site time/visit | 12 min | 12 min | 12 min |
| Travel time/visit (dense cluster) | 10 min | 10 min | 12 min |
| Labour €/visit | €10.6 | €10.6 | AED 12.8 |
| Van €/visit | €3.0 | €3.0 | AED 20 |
| **Service cost/month** | **€13.6** | **€59.0** | **AED 142 (€33)** |
| Plant amortisation (3 × €14/36) | €1.2 | €1.2 | AED 9.2 |
| Replacement provision | €0.7 | €0.7 | AED 6.9 |
| Payment fees | €0.7 | €0.7 | AED 5.0 |
| **Total COGS** | **€16.2** | **€61.6** | **AED 163 (€38)** |
| **Contribution margin** | **€18.8 (54%)** | **−€26.6 (−76%)** | **AED 86 (35%)** |
| Capex at install (plants+pots+install labour) | €57 | €57 | AED 430 |
| **Payback on capex** | **3.0 months** | never | **5.0 months** |

**Reading:** B2C is only viable at monthly (or at best 3-weekly) cadence, and *only* once routes are
dense. Redo Berlin monthly with a realistic launch-phase 25 min travel per stop and the contribution
falls to **€11 (31%)** — and at that point one no-show or one €65 floor-plant replacement wipes out
several months of margin. **Weekly B2C in Berlin is structurally impossible at any price a consumer
will pay** (US data agrees: weekly residential is $200–400/mo, i.e. €180–360).

### Scenario B — B2B office, 25 plants

Composition assumed: 15 desktop + 10 floor plants. Plant+planter capex Berlin
15×€14 + 10×€65 = **€860**; Dubai 15×AED 110 + 10×AED 380 = **AED 5,450**.

| | Berlin, 3-weekly (market norm) | Berlin, **weekly** | Dubai, weekly (market norm) |
|---|---|---|---|
| Price | €275 (25 × €11, matches Reiffer/AS Hydroplant) | €275 | AED 1,250 (25 × AED 50) (€293) |
| Visits/month | 1.44 | 4.33 | 4.33 |
| On-site time/visit | 55 min | 45 min | 55 min |
| Travel time/visit | 25 min | 25 min | 25 min |
| Labour €/visit | €38.7 | €33.8 | AED 42.7 |
| Van €/visit | €6.0 | €6.0 | AED 30 |
| **Service cost/month** | **€64.4** | **€172.3** | **AED 315 (€74)** |
| Plant amortisation | €23.9 | €23.9 | AED 151 |
| Replacement provision | €14.3 | €14.3 | AED 114 |
| Payment fees | €5.5 | €5.5 | AED 25 |
| **Total COGS** | **€108** | **€216** | **AED 605 (€142)** |
| **Contribution margin** | **€167 (61%)** | **€59 (21%)** | **AED 645 (52%)** |
| Capex incl. 2-person install | €975 | €975 | AED 5,900 |
| **Payback on capex** | **5.8 months** | 16.5 months | **9.1 months** |

**Reading:** the office scenario works in both markets *at the local market's own cadence*. Note
that a Berlin office at 3-weekly cadence is the single best cell in this entire model — 61%
contribution and sub-6-month payback inside a 12-month minimum term. Forcing weekly cadence in
Berlin cuts contribution by ~2/3 and pushes payback past the contract minimum, i.e. a customer who
churns at month 12 has barely repaid their own plants.

### Scenario C — Villa, 15 indoor plants + outdoor

| | Dubai villa (weekly + outdoor) | Berlin large home (2-weekly) |
|---|---|---|
| Price | AED 1,500 (€352) | €235 |
| Visits/month | 4.33 (weekly, longer) | 2.17 |
| Time/visit incl. outdoor | 95 min | 60 min |
| Travel time/visit | 25 min | 25 min |
| Labour /visit | AED 64 | €41.1 |
| Van /visit | AED 30 | €6.0 |
| **Service cost/month** | **AED 407 (€96)** | **€102** |
| Indoor plant amortisation (15 units) | AED 104 | €13.5 |
| Outdoor stock amortisation + replacement @40%/yr | AED 240 | €14 (@20%/yr) |
| Indoor replacement provision @25%/yr | AED 78 | €8.1 |
| Payment fees | AED 30 | €4.7 |
| **Total COGS** | **AED 859 (€202)** | **€142** |
| **Contribution margin** | **AED 641 (43%)** | **€93 (40%)** |
| **Payback on capex** | ~11 months | ~8 months |

**Reading:** the villa tier is the *worst* margin profile in both markets, because outdoor work is
labour-heavy and, in Dubai, plant-mortality-heavy. Royal Plantscape's AED 799 premium tier (2 visits/week)
suggests the market will not comfortably bear AED 1,500 for a villa unless a lot of visible design
value is bundled. Villas look attractive (high ticket, "villa" language in the brief) but they are
the tier most likely to be sold at a loss by an inexperienced operator.

---

## 4. Costs the per-unit model above deliberately excludes — and why they matter

1. **Depot / nursery / holding greenhouse.** The brief promises *seasonal rotation* and *replacement
   when plants decline*. Both require holding buffer inventory and reconditioning returned plants.
   That means warehouse or greenhouse space, heated in Berlin. This is a fixed cost of easily
   €1,500–4,000/month **[EST]** before a single customer, and it is the item most likely to sink
   the model. No competitor page found discloses it.
2. **Seasonal rotation doubles effective plant capex.** If a customer's set is swapped 2–4×/year and
   the removed plants sit in a depot, you own roughly 1.3–1.8× the installed plant count **[EST]**.
   Rotation is a marketing promise with a balance-sheet cost. Plantclub, WELO and 800petals all
   mention rotation/exchange but as an *option*, not a default — that is telling.
3. **Working capital.** Every new B2B office consumes ~€975 (Berlin) / ~AED 5,900 (Dubai) of cash
   before month 1 revenue. 50 offices = **€49k / AED 295k** locked in inventory. This is the classic
   rental-business cash trap and it is why the (low-quality) US model quoted a **$499k working
   capital buffer** and **29-month break-even**.
4. **CAC and churn.** Not researched under this lens, but note the payback figures above are payback
   on *plant capex only*. Add even a modest €150 CAC to the Berlin B2C case and payback moves from
   3.0 to ~11 months, which is longer than plausible B2C subscription life.
5. **Install/de-install labour on churn.** Removing plants from a churned customer costs a van trip
   and two people; the recovered plants may need reconditioning.

---

## 5. Which assumptions are weakest (ranked)

1. **Wholesale plant prices (§2.3).** Entirely estimated from retail. No public trade price list was
   obtainable — Plantcentraal, B2B Flowers, Roobos and Growhub all returned 403s or gated pricing.
   *A single afternoon at Al Warsan (Dubai) or one Dutch wholesaler account (Berlin) would replace
   this estimate with fact, and it moves plant amortisation ±40%.*
2. **Planter costs (§2.4).** Estimated from consumer retail listings; trade prices for hydro planters
   with indicators are unknown. Planters may be 40–60% of installed asset value for desktop units.
3. **Dubai per-plant rental price (§1.2).** Nobody publishes one. The AED 50/plant/month used in
   Scenario B is my inference from the AED 499 weekly-maintenance tier plus plant capex recovery.
   This is the biggest revenue-side unknown for the Dubai case.
4. **Fully-loaded UAE labour cost (§2.1).** The +35% loading for visa/accommodation/transport is an
   estimate; actual practice varies enormously by employer and nationality of hire.
5. **On-site minutes per plant.** I used ~2 min/plant plus 10–15 min site overhead. The only sourced
   figure is a 45-minute average visit from a low-quality auto-generated page.
6. **Route density.** The models assume dense clusters (6–10 km between stops). At launch, with 5
   customers spread across a city, real travel is 25–40 min per stop and every contribution margin
   above drops by 15–25 percentage points.
7. **Replacement rates.** The NewPro light-level figures are the best available but are US commercial
   interiors; Dubai outdoor mortality in a 45°C summer is genuinely unknown to me.

---

## 6. Implications I would carry into the MVP decision

- **Dubai is the better unit-economics market**, primarily because a technician hour costs €5–10
  instead of €28–30, which is what makes the brief's *weekly visit* promise affordable at all.
  Berlin can only support 3–4 weekly cadence at market prices.
- **If Berlin is chosen for founder-proximity reasons, the product must change**: hydroculture /
  sub-irrigation planters as standard, a 3–4 week cadence, and B2B-first. That is what every
  incumbent does, and their cadences are the fingerprint of the labour cost.
- **B2B office is the only tier that is comfortably profitable in both markets.** B2C flats work only
  at monthly cadence and dense routes; villas are the weakest margin in both markets.
- **Price per plant per month, with a monthly minimum**, is the market-standard packaging in Germany
  (€9–20/plant, €75–199 minimum, 12–24 month term). Copy it rather than inventing a new one.
- **The 12-month minimum term is not a sales tactic, it is a financing requirement** — it is roughly
  2× the plant-capex payback period, which is exactly the cover an operator needs.
- **Seasonal rotation and instant replacement are the two promises that quietly require a depot.**
  Consider launching without rotation (offer it as a paid add-on) until route density and inventory
  turns justify the fixed cost.

---

## Sources

1. Gärtner Gregg — Mietpflanzen prices (2026): https://www.gaertner-gregg.de/mietpflanzen-muenster-dortmund/
2. Reiffer / Objektbepflanzung — Pflanzen-Vermietung, €9/plant, €75 min, 2yr (2026): https://objektbepflanzung.de/pflanzen-vermietung
3. AS Hydroplant — Mieten & Leasen, €13.90/unit examples (2026): https://www.as-hydroplant.de/mieten-leasen/
4. Kinnula Hydrokulturen — ab €6/Monat, 2–4 week service (2026): https://hydro-kulturen.de/pflanzen-mieten/
5. WELO Green — Mietpflanzen packages €199/€299/€649, 3-weekly care (2026): https://welo-green.de/pages/mietpflanzen
6. WELO Green — Pflanzen mieten Kosten (2026): https://welo-green.de/blogs/journal/pflanzen-mieten-kosten
7. Plantclub — Preise €200/€400/€600, 12-month term (2026): https://plantclub.io/de/preise
8. Miet24 — event plant rental from €10/day (2026): https://marktplatz.miet24.de/mieten/events-und-messen/pflanzen
9. Royal Plantscape Dubai — maintenance tiers AED 120–799 (2026): https://www.royalplantscape.com/pages/indoor-plant-maintenance-service
10. 800petals — Dubai office plant rental model, weekly visits, 12-month agreements (2026): https://800petals.com/office-plant-rental-dubai/
11. Plantsworld.ae — plant purchase prices AED 244–789 (2026): https://plantsworld.ae/collections/office-plant-rental
12. Adplants — Abu Dhabi/Dubai rental, no published prices (2026): https://adplants.com/pages/plant-rentals
13. Desert Blooms — Dubai office plant rental, no published prices (2026): https://www.desertblooms.me/blogs/plant-care-guides/office-plant-rental-dubai-professional-green-solutions-for-modern-workspaces-desertblooms
14. OfficePlants.com — US per-plant $20–150/mo, program $200–1,200, 12-month terms (2026): https://officeplants.com/2026/08/03/office-plant-rental-pricing/
15. Red Square Flowers — US residential/commercial plant maintenance pricing (2026): https://redsquareflowers.com/how-much-do-interior-plant-maintenance-services-cost/
16. Plants Y'all — $75/hr maintenance rate, install ~$1,500 (2026): https://plantsyall.com/journal/office-plant-service-cost-monthly/
17. NewPro Containers — replacement rates by light level (2026): https://blog.newprocontainers.com/blog/strategic-planning-plant-replacements/
18. NewPro Containers — sub-irrigation systems for plantscape (2026): https://www.newprocontainers.com/blog/sub-irrigation-system-plantscape-project/
19. Good Earth Plants — sub-irrigation watering (2026): https://goodearthplants.com/go-underground-how-to-water-your-plants-using-sub-irrigation/
20. Blauarbeit — Hydrokultur, 2–4 week watering intervals, 60% less care effort (2026): https://ratgeber.blauarbeit.de/garten/hydrokultur
21. Hydroflora — Hydrokultur products (2026): https://www.hydroflora.de/produkte/hydrokultur/
22. bau.bi — GaLaBau Tarif 2025/2026, Ecklohn €20.24 → €20.91 (2025): https://bau.bi/galabau/nachrichten/tarifvertrag-so-hoch-sind-die-loehne-und-gehaelter-im-galabau-g19996
23. IG BAU — GaLaBau Tarifabschluss (2025): https://igbau.de/Garten-und-Landschaftsbau-Tarifabschluss-mehr-Geld-fuer-alle.html
24. StepStone — Gärtner GaLaBau salary €34,000/yr (2026): https://www.stepstone.de/gehalt/Gaertner-in-Garten-und-Landschaftsbau.html
25. Indeed AE — Gardener salary Dubai AED 2,352/month (2025): https://ae.indeed.com/career/gardener/salaries/Dubai
26. Indeed AE — Landscape Technician salary UAE AED 5,164/month (2026): https://ae.indeed.com/career/landscape-technician/salaries
27. Fuhrpark.de — Betriebskosten Transporter, Sprinter 50.8 ct/km (2025): https://fuhrpark.de/betriebskosten-transporter-0
28. Bosch OfficeOn — Fahrtkosten im Handwerk, €0.30–0.50/km (2025): https://bosch-officeon.com/de/de/wissen/blog/fahrtkosten-im-handwerk/
29. MyHammer — Anfahrtskosten Handwerker 2026: https://www.my-hammer.de/handwerks-montageleistungen/preisradar/anfahrtskosten-handwerker
30. 123zimmerpflanzen — large indoor plant retail prices €29.99–106.99 (2026): https://www.123zimmerpflanzen.de/zimmerpflanzen/grosse
31. Traddal — UAE 5% customs duty on CIF, VAT, 15–40% landed cost uplift (2026): https://traddal.com/resources/calculate-duties-taxes-imports-united-arab-emirates
32. Royal Plants AE — Al Warsan nursery market, budget plant buying (2025): https://royalplants.ae/budget-friendly-plants-dubai-nurseries-markets-tips/
33. DutchNews — NL flower & plant exports €7.2bn, plants €2.8bn (2026): https://www.dutchnews.nl/2026/01/flower-and-plant-exports-top-e7-billion-tariffs-hit-us-market/
34. Rentokil Initial — 2025 Preliminary Results, H&W $1,205m rev / 18.6% margin (2026): https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/2025-prelims-statement.pdf
35. Rentokil Initial — 2024 Preliminary Results, H&W £931m / 18.1% margin (2025): https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/2024-preliminary-results.pdf
36. RealGreen — landscaping profit margins 45–55% gross, 5–12% net (2026): https://www.realgreen.com/blog/guide-to-landscaping-profit-margins
37. Sideways8 — landscaping income, COGS, net profit (2026): https://www.sideways8.com/insights/landscaping-business-financials-explained-income-cogs-and-net-profit-a-practical-guide/
38. IBISWorld — US Landscaping Services $176.7bn, 3.0% CAGR (2026): https://www.ibisworld.com/united-states/industry/landscaping-services/1497/
39. FinancialModelsLab — indoor plant care operating costs [LOW-QUALITY, auto-generated] (2026): https://financialmodelslab.com/blogs/operating-costs/indoor-plant-care-services
40. Mr Plant SoCal — 95% survival claim [promotional] (2026): https://www.mrplantsocal.com/interior-plant-design-vs-diy-office-plants-roi-analysis/
