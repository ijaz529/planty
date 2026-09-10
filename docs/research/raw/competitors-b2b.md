# Lens: B2B Competitors — Office Plant Rental & Maintenance

Research date: 2026-09-10. All figures carry the year of the source. Currency as published.
"Reported" = taken from the cited page. "My estimate" = my own derivation, labelled inline.

---

## 0. Executive orientation

The B2B office-plant-rental industry is old, profitable, fragmented, and almost entirely
offline in its go-to-market. Across **four markets I checked (US, UK/AU, Germany, UAE) I could
not find a single incumbent that lets a business customer configure a plant scheme and check
out online.** Every one of them gates price behind a site survey, a phone call, or a WhatsApp
message. That is the clearest white space for Planty.

The second structural finding: **service cadence differs by market.** Weekly visits are the
advertised norm in Dubai; every-2-to-4-weeks is the norm in Germany and the UK. This is a
first-order unit-economics fact for Planty's "weekly technician visit" assumption.

---

## 1. The global incumbent: Ambius (Rentokil Initial)

### Scale and financials
- Ambius sits inside Rentokil Initial's **Hygiene & Wellbeing** segment. That segment's
  **revenue rose 8.4% to £931m in 2024**, with organic growth of 3.1%; **Adjusted Operating
  Profit £169m, Adjusted Operating Margin 18.1%** (down 30bps).
  Source: Rentokil Initial 2024 Preliminary Results (2024/2025)
  https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/2024-preliminary-results.pdf
- The same results note Q4 organic growth was held back ~190bps by "strong prior year
  comparatives from **large projects in Ambius North America**", and that Wellbeing grew
  revenue 5.9% driven by the UK with "continued strong performance in the **Plants
  businesses**". So: interior plants is a real, growing line inside a FTSE-100 services group,
  and it is **project-led** (lumpy large installs) as well as recurring.
- Note the margin: ~18% adjusted operating margin at the segment level. This is a services
  business with route density economics, not a software business. Any Planty model should
  assume a similar structural ceiling unless software genuinely removes labour.
- Ambius North America: **more than 36 service centres**, HQ Wyomissing, PA; "over 60 years"
  in interior landscaping. https://www.ambius.com/about (2026)

### Geographic footprint (matters a lot for market choice)
- **Germany: Ambius is present and substantial.** Ambius Deutschland runs branches including
  Hamburg/Bremen/Hannover and Köln/Bonn; Rentokil Initial Germany operates roughly **25 branch
  locations** alongside the Ambius brand.
  https://www.ambius.de/ , https://www.ambius.de/uber-ambius/filialen/hamburg ,
  https://www.ambius.de/uber-ambius/filialen/bonn , https://www.rentokil-initial.de/ (2026)
- Rentokil Initial has also **acquired German plant business Baumhaus GmbH** — evidence of
  active consolidation in the German Raumbegrünung market.
  https://www.rentokil-initial.de/dam/jcr:6e2fb31f-c1f6-4efa-bf76-f6868ea9ce22/rentokil-initial-uebernimmt-baumhaus.pdf
- **Saudi Arabia: yes** — a dedicated Ambius KSA site, "transforming the indoors of Saudi
  Arabian business for over 35 years". https://www.ambius.com.sa/ (2026)
- **UAE: no dedicated Ambius UAE site found.** Rentokil Initial's UAE presence surfaces as
  **Rentokil Boecker (pest control)**, not Ambius plants.
  https://www.rentokil-boecker.com/ae/ (2026). Rentokil's corporate history notes acquisitions
  in "Abu Dhabi and Dubai" but not an Ambius plants operation there.
  https://www.rentokil-initial.com/about-us/our-story-so-far.aspx
  **Caveat: absence of a website is not proof of absence of operations.** Flagging as
  "no public UAE Ambius presence found", not "Ambius is not in the UAE".

### Service model
Ambius sells design → install → maintain, quote-only. Its service-options page
(https://www.ambius.com/about/service-options) returned HTTP 403 to my fetch, but the
long-term rental option including regular maintenance by plant-care specialists is described
across their regional sites, e.g. https://www.ambius.co.za/about-ambius/how-we-do-it/ (2026).
No published price anywhere on the Ambius estate that I could find.

**Read-across for Planty:** the category leader in Berlin's market is a FTSE-100 subsidiary
with 25 German branches. In Dubai, the category leader appears to be absent. That is a
meaningful asymmetry in favour of Dubai on competitive whitespace.

---

## 2. Germany / Berlin

### 2a. Plantclub (plantclub.io) — the single closest competitor to Planty
Berlin-headquartered, operating **since 2020**, claims **150+ members**. Cities: Berlin,
Hamburg, Cologne, Düsseldorf, Frankfurt, Munich, Vienna.
https://plantclub.io/de/pflanzen-mieten-berlin (2026)

**Published tier pricing** (https://plantclub.io/de/preise , 2026) — all **excl. VAT, billed
annually, 12-month minimum term**:

| Tier | Price/month | Office size |
|---|---|---|
| Greenhouse | €200 | up to 150 m² |
| Woodland | €400 | up to 500 m² |
| Jungle | €600 | up to 1,000 m² |
| Rainforest | custom | 1,000 m²+ |

Included: free plant design concept, delivery + install, full ongoing care, dedicated account
management, **free replacements**, workshop discounts (10% Woodland, 15% Jungle, 20%
Rainforest), free office moves (Woodland+).

Cadence: "Your dedicated plant expert visits **every two weeks** to water, fertilise, prune,
and replace." https://plantclub.io/de/pflanzen-mieten-berlin (2026)

Pricing is **per m² of office, not per plant.** Plant counts per tier are not published.

Sales motion: **still quote-gated.** "Schedule a call with one of our plant experts" / free
15-minute consultation / hello@plantclub.io / +49 1579 2527107. **No self-serve checkout**,
despite the tiers being published. This is important: even the most modern, startup-shaped
competitor in Berlin publishes prices but does not let you buy.

**Verbatim positioning:** "Plants are rented, cared for, and rehomed when you're done."
The "rehomed" framing is the circular-economy angle — worth noting for Planty's messaging.

### 2b. WELO Green
- Rental **from €199/month** ("Pflanzenvermietung ab 199,-€ pro Monat").
- **Mindestlaufzeit 12 Monate**, then monthly cancellable.
- Included: planning with site visit + visualisation, delivery and expert planting, regular
  care (watering, fertilising, cleaning, pruning), and **Pflanzengarantie — "bei Ausfällen
  wird kostenlos ersetzt"** (free replacement on failure).
- Also rents moss walls, artificial plants, acoustic modules.
- No per-plant rates published; cost drivers stated as plant count/size, planter type
  (standard / design / custom RAL), system (hydroculture vs moss wall), contract duration.
https://welo-green.de/blogs/journal/pflanzen-mieten-kosten (2026)
https://welo-green.de/pages/mietpflanzen (2026)

### 2c. Gärtner Gregg (Münster / Münsterland / Dortmund) — **the only fully published German price list I found**
All prices **net, excl. VAT and delivery**, per month:
https://www.gaertner-gregg.de/pflanzenmiete-oder-leasing/ (2026)

| Planter / display | €/month net |
|---|---|
| Planter Ø 40 cm, height ~40 cm | **6,90** |
| Planter with wheels Ø 37 cm, height ~140 cm | **10,50** |
| Planter with wheels 42×40×100 cm, height ~140 cm | **11,90** |
| Planter with wheels Ø 50 cm, height ~160 cm | **11,99** |
| Planter with wheels 30×30×56 cm, height ~150 cm | **12,50** |
| Sideboard planter 90×35×25 cm, height ~70 cm | **13,50** |
| Room divider with wheels 90×35×25 cm | **22,90** |

- Care interval: "**regelmäßig (etwa alle vier Wochen)**" — roughly every 4 weeks.
- Free replacement of unsightly/diseased plants.
- Planter included; many have concealed wheels. Delivery + professional placement included.
- Minimum term: "**In der Regel 12 Monate**" (typically 12 months), flexible by agreement.
- Targets: Unternehmen, Praxen, Hotels, Pflegeeinrichtungen, Behörden, Gastronomiebetriebe.
- Ordering: phone / email / **WhatsApp** / web enquiry form. No checkout.

**This is the best per-unit anchor for Germany: ~€7–€23 per display per month, net.**

### 2d. Kinnula Hydrokulturen
- "**Schon ab 6 Euro pro Monat**" (from €6/month).
- Care "**alle zwei bis vier Wochen**" (every 2–4 weeks): watering, fertilising, cleaning.
- Free delivery and arrangement. Plant exchange offered "after some time for variety" —
  i.e. rotation is already a standard incumbent feature, not a Planty differentiator.
- Also sells **ex-lease returns from €15 incl. VAT** while stocks last — a real hint that
  used rental stock has meaningful residual value. Relevant to Planty's asset model.
- Quote-based only; "Express Anfrage" form; consultation before decision.
https://hydro-kulturen.de/pflanzen-mieten/ (2026)

### 2e. airy.green (cost/tax explainer)
- Individual hydroculture plants **~€14.50/month**.
- Complete solutions **up to 150 m² from ~€200/month** including concept and care.
- **Tax:** "Monthly rental costs count as operating expenses and are tax-deductible"
  (Betriebsausgabe), noted as common practice. Caveat given for plants supplied to individual
  employees' home offices, which may be treated differently.
https://airy.green/en/blogs/air-up-your-life/mietpflanzen-buero-kosten-vorteile-steuer (2026)

### 2f. Other German players (all quote-only, no published prices)
- **Pflanzen-Kölle Gärtnerservice** — monthly rent includes care **every 4 weeks** plus
  delivery, setup and removal.
  https://www.pflanzen-koelle.de/filialen/gaertnerservice/innenraumbegruenung/pflanzen-mieten/
- **Plantyworks** (Essen) — B2B only, **minimum 3 plants**, "Laufzeiten sind flexibel" with
  monthly conditions, free replacement, free on-site consultation. Quote only.
  https://plantyworks.de/essen/ (2026)
- **Mohr Hydrokultur** — "Fester Monatspreis mit Pflanzengarantie – Austausch inklusive",
  10+ locations across DE/AT. Quote only. https://www.mohr-hydro.de/mietpflanzen (2026)
- **Ruof** (Stuttgart) — Pflanzenleasing, all service work by professional gardeners, "each
  paid installment is immediately tax-deductible". Quote only.
  https://ruof.eu/raumbegruenung/pflanzenleasing (2026)
- **AS Hydroplant** — hydroculture, artificial plants, moss pictures for rent or lease;
  provision, installation, care, replacement of defective plants.
  https://www.as-hydroplant.de/mieten-leasen/ (2025)
- **Rogel Raumbegrünung** https://hydrokultur.de/leistungen/mietpflanzen/ ;
  **akzente raumbegrünung** https://www.akzente-raumbegruenung.de/raumbegruenung-abc/mietpflanzen/ ;
  **p2objektgruen** (Berlin) https://p2objektgruen.de/pflanzen-kaufen-mieten/ ;
  **Kremkau** https://kremkau.de/innenraumbegruenung/ ; **Hydroflora**
  https://www.hydroflora.de/produkte/buerobegruenung/ — all quote-driven, none with checkout.
- **Miet24 marketplace** lists 150+ plants for event rental **from €10/day**.
  https://marktplatz.miet24.de/mieten/events-und-messen/pflanzen (2026)

### 2g. German contract norms
Reported minimum terms range **12 to 36 months**, then cancellable with **4 weeks' notice to
month end**. Care intervals cluster at **3–4 weeks** (some 2 weeks). Replacement guarantee
("Austauschgarantie" / "Pflanzengarantie") is universal and therefore **not** a
differentiator. Sources: welo-green.de, gaertner-gregg.de, pflanzen-koelle.de, ruof.eu (2025–2026).

Industry bodies: **Fachverband Raumbegrünung und Hydrokultur (FvRH)** within the
Zentralverband Gartenbau (https://zvg-fvrh.de/ueber-uns/) and **Bundesverband GebäudeGrün
(BuGG)**, which publishes the *BuGG-Marktreport Gebäudegrün* covering Innenraumbegrünung
(https://www.gebaeudegruen.info/wissen-und-ressourcen/gebaeudegruenung/innenraumbegruenung/).
I did **not** find a published € market-size figure for German Innenraumbegrünung — the 2020
Marktreport is the obvious place to look and should be checked directly.

---

## 3. UAE / Dubai

### 3a. 800petals — the clearest articulation of the Dubai B2B rental model
https://800petals.com/office-plant-rental-dubai/ (2026)
- Covers **Dubai, Abu Dhabi and Sharjah**.
- One monthly fee includes: plants selected for **"Dubai office conditions (AC, low light,
  dust)"**, commercial-grade pots/planters in chosen finish, **"Weekly maintenance visits by
  trained plant care staff"**, **"Free replacement of declining plants"**, single monthly invoice.
- "Most plans are quoted **per plant per month, all-inclusive**."
- Terms flexible but "**most clients choose 12-month agreements for the best monthly rate**";
  short-term event rentals also offered.
- Target: **"Renting suits most offices with 10+ plants: predictable monthly cost, zero
  responsibility."**
- Sales: **quote-only**, free site assessment with exact quote within 24 hours, WhatsApp
  (+971 50 559 7226). **No prices published, no checkout.**

**Note the cadence: weekly.** Combined with the AC/dust rationale, this looks like a genuine
climate-driven service requirement in the Gulf, not marketing.

### 3b. Royal Plantscape — **published AED price ladder (maintenance only, no rental)**
https://www.royalplantscape.com/pages/indoor-plant-maintenance-service (2026)

| Package | Frequency | Price |
|---|---|---|
| Basic Indoor Plant Care | 1 visit/month | from **AED 120/month** |
| Regular Indoor Plant Care | 2 visits/month | from **AED 299/month** |
| Weekly Plant Maintenance | 1 visit/week | from **AED 499/month** |
| Premium Indoor Plant Care | 2 visits/week | from **AED 799/month** |
| One-time service | single visit | from **AED 120** |
| Individual services (watering/fertilising/pest/pruning) | per visit | from **AED 199/visit** |
| Repotting | one-off | from **AED 150** |
| Indoor green wall maintenance | monthly | from **AED 499/month** |

Areas: Downtown Dubai, Dubai Marina, Jumeirah, Business Bay, Palm Jumeirah, Deira, Al Barsha,
JLT, Dubai Silicon Oasis, Arabian Ranches, Mirdif and others. Segments: corporate offices and
co-working, hotels/restaurants, retail/showrooms, **residential properties and apartments**,
healthcare. **No online booking system.** **No rental offering — maintenance only.**

**This is the most useful Dubai number I found: the market-clearing price for a weekly
technician visit to a site is roughly AED 499/month (~€120/month at ~4.0 AED/EUR — my
conversion), and a monthly visit is ~AED 120.** That effectively prices Planty's service leg
in Dubai before any plant rental margin.

### 3c. Greenly.ae — **the only app-based, upfront-priced player I found in either market**
https://greenly.ae/services-and-pricing/plant-maintenance-services-dubai/ (2026)
- **Mobile app (iOS + Android), online booking, all payment in-app, no cash.**
- Recurring services: "you only need to make one booking and are charged on a **monthly basis
  until you cancel**", customer picks frequency and timing, **same gardeners every time and a
  discounted rate**.
- Same-day booking availability, "upfront pricing with no hidden fees".
- Prices: Plant Care from **AED 179**; Plant Doctor from **AED 109**; Plant Advisor **AED 99**;
  Plant Sitting from **AED 99**; Repotting from **AED 99**; Pest Control **AED 199**;
  Watering from **AED 99**; Fertilising from **AED 79**; Trimming & Pruning from **AED 79**.
- Targets **apartment and villa residents throughout Dubai**, business properties, and
  travellers needing plant sitting.

**Strategic read: Greenly proves Dubai consumers will book and pay for recurring plant care
through an app with published prices. It does NOT rent plants.** That is precisely the gap
Planty targets — and it also means the "will people book plant services in an app" risk is
already substantially retired in Dubai, but not in Berlin.

### 3d. Other UAE players
- **Plantsworld.ae** — has an "Office Plant Rental UAE" collection but the page publishes
  **purchase** prices (~AED 269–789) and routes rental enquiries to a "Talk to us" **WhatsApp**
  button. A search snippet suggested rental of AED 288–478/month for specific plants
  (Dracaena Massangeana → Monstera Pertusum) but **I could not verify those figures on the
  page itself — treat as unverified.**
  https://plantsworld.ae/collections/office-plant-rental-uae (2026)
- **Plants Xpert** — "offices, **villas**, hotels, and commercial spaces" plus events;
  "Monthly, weekly, or event-based rental options"; regular maintenance and replacements
  included; **free consultation, no prices, no checkout**.
  https://plantsxpert.com/pages/plants-rental-in-dubai-plants-xpert (2026)
- **Adplants** (Abu Dhabi) — delivery, installation and plant care across Abu Dhabi;
  watering, pruning, pest control, fertilising; tailored pots and planters; five-step process
  starting with a **free site visit**. Quote only (phone/email/WhatsApp).
  https://adplants.com/pages/plant-rentals (2026)
- **Dubai Nursery** — short-term/event plant rentals for corporate events, weddings,
  exhibitions across the UAE. **Enquiry form only**, +971 4 320 2004.
  https://www.dubainursery.ae/plant-rentals/ (2026)
- **Desert Blooms** — publishes SEO content on corporate plant rental Dubai but **no prices,
  no contract terms, no cadence**. https://www.desertblooms.me/ (2026)
- **Desert Group** — the enterprise incumbent. Founded **1988**, Dubai HQ, **1,000–5,000
  employees**, 8 trading companies including **Interior Landscape**; supplies indoor plants,
  pots, green walls and maintenance to palaces, government organisations, offices,
  universities, restaurants, banks and hotels; portfolio includes Burj Al Arab, Burj Khalifa,
  Atlantis The Palm, Museum of the Future.
  https://desertgroup.ae/plantscapes/ , https://desertgroup.ae/ ,
  https://www.zoominfo.com/c/desert-group/372399540 (employee band: ZoomInfo, 2026 — third-party
  estimate, treat as approximate)

**UAE market structure summary:** one very large project-led landscaping group (Desert Group),
a long tail of small quote-only rental/maintenance SMEs, one app-native maintenance-only
player (Greenly), and **no visible Ambius**. Nobody rents plants with online checkout.

---

## 4. UK — most price-transparent market, useful for benchmarking

- **Plant Drop** (https://plantdrop.co.uk/pages/office-plant-costs-uk , 2026)
  - States typical **UK trade hire pricing**: large 180cm **£3.70–£5.50/plant/week**;
    medium **£3.15–£4.15/week**; desk plants **£1–£1.30/week**.
  - Own Care Plan: large specimens **£4.50/plant/week**, **minimum scheme 10 plants**,
    **from £195/month for 10 plants**, includes decorative planters, care visits and free
    replacements.
  - **Contract:** "Twelve-month minimum, then rolling monthly: **no auto-renewal, no 3-month
    notice period**" — explicitly positioned against the industry norm they describe as
    "**3–5 year terms with auto-renewal and 3-month notice**".
  - Outright purchase collections sold online: 5-piece **£1,495**, 10-piece **£2,995**;
    individual statement plants £295 (Kentia palm 180–200cm) to £595 (fiddle-leaf fig).
  - Optional Plant Protection plan ≈ **20% of plant value annually**.

  **This is the most actionable competitive-terms finding in the whole lens: long,
  auto-renewing contracts with 3-month notice are the incumbent norm, and a challenger is
  already winning on "12 months then rolling monthly".**

- **Plant Plan** (https://www.plantplan.co.uk/blog/indoor-planting-scheme-costs-explained-uk-pricing-guide-for-offices , 2026)
  - Small office (15–20 plants): rental **£60–£90/week**; purchase + maintenance from ~**£3,000**.
  - Medium office (20–50 plants): rental **£100–£200/week**; purchase + maintenance
    **£5,000–£10,000+**.
  - Large corporate (5,000+ sq ft): fully bespoke.
  - My derivation: £60–90/week for 15–20 plants ≈ **£3–6 per plant per week** — consistent
    with Plant Drop's trade ranges.

- **Inleaf** (https://inleaf.co.uk/office-plants/office-plant-prices/ — page returned 403 to my
  fetch; figures below from search result summaries, 2026)
  - Packages **from £5/week** per display; includes delivery, expert installation, regular
    visits for watering/feeding/maintenance, **free replacement of plants that suffer natural
    failure**.
  - **"Most clients select a two or three year contract to get their best prices and free
    installation."**
  - Has an **online quote tool: enter postcode + number of plant displays to see pricing** —
    the closest thing to self-serve I found anywhere. Still stops short of checkout.
  - **Flag: 403 on direct fetch, so treat the £5/week and 2–3 year figures as
    second-hand until re-verified.**

- **Plant Designs** (London) — plant rental **from £250/month** including design,
  installation, plants, planters and ongoing maintenance.
  https://plantdesigns.co.uk/services/office-plant-rental-london/ (2026)
- **Planteria Group** — quote-only, on-site visit → bespoke design → quote; dedicated
  technician per account; "If any plant shows signs of damage or decline, we replace it
  promptly at no extra cost." Sells to direct clients **and to facilities-management firms,
  cleaning companies, architects and fit-out firms** — i.e. a B2B2B channel worth noting.
  https://www.planteriagroup.com/office-plants-for-hire/ (2026)
- **phs Greenleaf** — large UK office plant hire operator.
  https://www.phsgreenleaf.co.uk/indoor/office-plants/ (2026)

---

## 5. US and Australia benchmarks

**US** (https://officeplants.com/2026/08/03/office-plant-rental-pricing/ , published 2026-08):
- Small low-light plants (Sansevieria, ZZ): **$20–$35/month**.
- Medium (Mass Cane, Janet Craig Dracaena): **$40–$75/month**.
- Large (mature Ficus lyrata, Bird of Paradise): **$90–$150/month**.
- Complete programme: **$200–$1,200/month**. Small office (5–10 plants) **$100–$350/month**;
  large corporate floor (20–40 plants) **$500–$1,500/month**; annual **$4,000–$14,400**.
- **12-month minimum term with rolling renewals**; **minimum monthly fee $100–$200**
  depending on service distance (route density is explicitly priced in).
- Service biweekly or monthly. **Guaranteed plant replacement at no additional charge.**
- Buy-instead comparison: **$4,500–$7,500 initial capital** for plants and containers.

**Australia — Tropical Plant Rentals**
(https://tropicalplantrentals.com.au/blog/plant-pricing-guide-what-it-really-cost/ , 2026):
- Individual plants **AUD $2–$3/week**; medium installations **$5–$7/week**; premium
  architectural systems **$16–$18/week**.
- Hire starts **from $25/week + GST**. Events from **$600/event + GST**.
- Small office (10–15 plants) **$150–$300/month**; medium (20–30) **$300–$600/month**;
  large (40+) **$600–$1,200/month**.
- Includes: plant selection, professional installation, scheduled maintenance, ongoing health
  management, replacements, dedicated account manager, **"no installation or removal fees"**
  and **"no automatic annual price increases"** — both framed as differentiators, which
  implies competitors *do* charge those and *do* escalate prices annually.
- Buy comparison: 20–30 plants exceeds **$8,000** initial, plus **$3,000–$5,000/year**
  maintenance.
- National coverage: Sydney, Melbourne, Brisbane, Gold Coast, Sunshine Coast, Canberra, with
  affiliates in Adelaide and Perth.

**US others:** Planterra (founded 1973, Detroit; Fortune 500 corporate campuses, medical,
hospitality, retail — https://planterra.com/), Phillips Interior Plants (division of Phillip's
Flowers, family-owned since 1923, Chicago — https://www.phillipsinteriorplants.com/), Plant
Solutions (Phoenix — https://plantsolutions.com/), Plantman (month-to-month leasing, orchid
arrangements "as little as $75 per month", ceramics included, **no online pricing or
ordering** — https://www.plantman.com/). None publish rate cards; none sell online.

---

## 6. Cross-market synthesis

### 6a. Price convergence (all 2026 sources)
| Market | Per plant/display per month | Entry programme per month |
|---|---|---|
| Germany | **€6.90–€22.90** net (Gärtner Gregg); ~€14.50 (airy.green); "ab €6" (Kinnula) | **€199–€200** (WELO, plantclub Greenhouse, airy.green) |
| UK | £13–£24 (£3–£5.50/wk, my conversion ×4.33) | £195–£250 (Plant Drop 10 plants; Plant Designs) |
| US | $20–$150 by size | $100–$350 (5–10 plants) |
| Australia | AUD $8.7–$78 (my conversion from $2–$18/wk) | AUD $150–$300 (10–15 plants) |
| UAE | **not published by anyone** | maintenance-only ladder AED 120 → 799 (Royal Plantscape) |

The **€199/€200 entry point in Germany appears three times independently** and is effectively
the market's anchor price for "greening a small office, all-in".

### 6b. What every incumbent includes (so none of it is a differentiator)
Delivery, installation, decorative planter, scheduled maintenance visits, free replacement of
declining plants, seasonal/periodic swap-outs, dedicated technician or account manager.
**Planty's stated value prop is table stakes in this category.** Plant rotation for variety is
already offered by Kinnula and plantclub.

### 6c. What NONE of them do
1. **Self-serve online checkout.** Zero of ~30 companies checked. Inleaf's postcode + display
   count quote tool is the high-water mark and still hands off to sales.
2. **Genuinely short terms.** 12 months is the floor almost everywhere; UK norm is 2–5 years
   with auto-renewal and 3-month notice. Planty's 2-week / 1-month options are unprecedented
   in B2B.
3. **B2C.** No rental player of any size serves private homes as a primary segment.
   Plants Xpert and Royal Plantscape mention villas/apartments only for maintenance.
4. **Transparent per-plant pricing in the UAE.** Not one UAE provider publishes a rental rate.
5. **Live account visibility** (which plants you have, when the next visit is, visit history,
   swap requests). Not offered by anyone I saw.

### 6d. Cadence and cost structure
- **Dubai: weekly is the advertised standard** (800petals) with the explicit rationale of AC,
  low light and dust. Royal Plantscape prices weekly at ~**AED 499/month**.
- **Germany: 2–4 weeks is standard** (plantclub 2 weeks; Gärtner Gregg, Pflanzen-Kölle 4
  weeks; Kinnula 2–4 weeks).
- **US: biweekly or monthly.**
- **Implication:** Planty's "weekly visit" plan is 2–4× the European service frequency.
  In Berlin that is a cost disadvantage against plantclub's identical €200 tier unless Planty
  matches at bi-weekly. In Dubai weekly is simply the price of entry.

### 6e. Minimum viable scheme size
800petals: renting "suits most offices with **10+ plants**". Plant Drop: **minimum 10 plants**,
£195/month. US: **minimum monthly fee $100–$200**. Plantyworks: from **3 plants**.
Convergent floor: roughly **10 displays / €150–200 per site per month** for a B2B route stop
to be worth making. Anything smaller must be solved by **route density**, not by pricing.

---

## 7. Implications for Planty (my analysis, clearly labelled)

1. **Self-serve checkout is the wedge, and it is unoccupied.** A solo technical founder's
   comparative advantage lines up exactly with the category's one universal weakness. The MVP
   should be: browse a fixed catalogue → pick a package or plant count → enter address → pay →
   scheduled install. No site survey in the funnel.
2. **But interrogate why the site survey exists.** Every incumbent does one. It sets light
   levels, access, planter finish and expectations. Planty's counter should be a
   constrained catalogue of light-tolerant plants (the same handful everyone uses:
   Sansevieria, ZZ, Dracaena, Kentia, Ficus) plus a photo-upload step, not the removal of
   assessment entirely.
3. **Price the German B2B entry tier at €199–€249/month excl. VAT.** Undercutting plantclub's
   €200 is pointless; matching it with instant checkout and no annual prepay is the play
   (plantclub bills **annually** — offering true monthly billing is a concrete differentiator).
4. **Per-plant pricing for Germany should sit in €7–€15/display/month net**, with large
   specimens up to €23. That is grounded in a published German rate card.
5. **Cadence must be a market variable, not a product constant.** Bi-weekly in Berlin, weekly
   in Dubai. Build the schedule as configurable from day one, but do not ship weekly-everywhere.
6. **Berlin is contested; Dubai is open.** Berlin has plantclub (same model, 7 cities, since
   2020, published tiers) *plus* Ambius/Rentokil with ~25 German branches and an
   acquisition strategy. Dubai has no visible Ambius, a project-led incumbent (Desert Group)
   that does not chase small offices, and a fragmented long tail with zero published rental
   pricing. On competitive whitespace, Dubai wins.
7. **Dubai also has better B2C evidence.** Greenly already sells app-booked, upfront-priced,
   recurring plant care to villa and apartment residents. That retires the "will consumers book
   plant services in an app" risk in Dubai specifically. Berlin has no equivalent proof point.
8. **Counterweight: Berlin has better pricing intelligence and a tax tailwind.** German B2B
   buyers are sold on rental partly because it is an immediately deductible operating expense
   (airy.green, ruof.eu). Berlin also has published competitor price lists, which de-risks
   pricing. Dubai's opacity cuts both ways — harder to price, easier to be the transparent one.
9. **Short terms are the second wedge, and the most dangerous.** Nobody offers 2 weeks. The
   reason is almost certainly plant capex payback: at €10/month rent and a €40–60 plant+planter
   cost, a 2-week rental recovers ~€5 against an asset that has just absorbed two van
   movements. Planty should treat sub-3-month rentals as an **events/short-term SKU with
   separate pricing** (cf. Tropical Plant Rentals at AUD $600/event, Miet24 at €10/day), not as
   the default subscription option.
10. **Residual value is real.** Kinnula sells ex-lease plants from €15 incl. VAT. Build a
    resale/rehome flow into the asset model rather than assuming write-off.
11. **Do not build "replacement guarantee" as a headline feature.** It is universal. Build
    *visibility* — a customer-facing account showing plants, visit history, next visit,
    one-tap swap request. No incumbent has this.
12. **Consider the FM channel.** Planteria sells through facilities-management firms, cleaning
    companies, architects and fit-out firms. In both candidate markets this is a faster B2B
    route than direct SME sales, and it is compatible with a self-serve product used by the
    partner.

---

## 8. Confidence and gaps

**High confidence:** no incumbent has self-serve checkout; 12-month minimum is the norm;
replacement guarantees are universal; German entry price is ~€199–200/month; German per-display
rates are €6.90–€22.90 net; UK trade rates are £3–£5.50/plant/week; Dubai advertises weekly
visits; Royal Plantscape's AED ladder; Greenly is app-native in Dubai.

**Medium confidence:** Inleaf's £5/week and 2–3 year contract norm (page 403'd, second-hand);
Desert Group employee band (ZoomInfo third-party estimate); "3–5 year auto-renewing contracts"
as UK norm (asserted by a competitor, Plant Drop, who benefits from the claim).

**Low confidence / unresolved:** Ambius's actual UAE presence; Plantsworld.ae's AED 288–478
rental figures; any UAE per-plant-per-month rental rate at all; plant counts per plantclub
tier; German Innenraumbegrünung market size in €.

**Open items I could not close** (WebSearch budget for the session was exhausted at 200 calls
before I could run these): Ambius UAE branch check via ambius.com locations; BuGG Marktreport
PDF for German market size; plantclub funding/headcount via Crunchbase or LinkedIn;
mystery-shop quotes from 800petals / Plantsworld for real AED rental rates; Reddit/LinkedIn
anecdotes on churn and technician productivity.

---

## 9. Sources

1. Rentokil Initial 2024 Preliminary Results — https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/2024-preliminary-results.pdf (2024/2025)
2. Rentokil Initial Annual Report 2024 — https://www.rentokil-initial.com/~/media/Files/R/Rentokil/documents/annual-reports/250317_RIAR24_FINAL.pdf (2025)
3. Ambius About — https://www.ambius.com/about (2026)
4. Ambius service options — https://www.ambius.com/about/service-options (2026, HTTP 403)
5. Ambius South Africa "How we do it" — https://www.ambius.co.za/about-ambius/how-we-do-it/ (2026)
6. Ambius Deutschland — https://www.ambius.de/ (2026)
7. Ambius Deutschland branches (Hamburg) — https://www.ambius.de/uber-ambius/filialen/hamburg (2026)
8. Ambius Deutschland branches (Bonn) — https://www.ambius.de/uber-ambius/filialen/bonn (2026)
9. Rentokil Initial Deutschland — https://www.rentokil-initial.de/ (2026)
10. Rentokil Initial acquires Baumhaus GmbH — https://www.rentokil-initial.de/dam/jcr:6e2fb31f-c1f6-4efa-bf76-f6868ea9ce22/rentokil-initial-uebernimmt-baumhaus.pdf
11. Ambius Saudi Arabia — https://www.ambius.com.sa/ (2026)
12. Rentokil Boecker UAE — https://www.rentokil-boecker.com/ae/ (2026)
13. Rentokil Initial "Our story so far" — https://www.rentokil-initial.com/about-us/our-story-so-far.aspx
14. Plantclub Berlin — https://plantclub.io/de/pflanzen-mieten-berlin (2026)
15. Plantclub prices — https://plantclub.io/de/preise (2026)
16. Plantclub FAQ — https://plantclub.io/de/faq (2026)
17. WELO Green costs — https://welo-green.de/blogs/journal/pflanzen-mieten-kosten (2026)
18. WELO Green Mietpflanzen — https://welo-green.de/pages/mietpflanzen (2026)
19. Gärtner Gregg price list — https://www.gaertner-gregg.de/pflanzenmiete-oder-leasing/ (2026)
20. Kinnula Hydrokulturen — https://hydro-kulturen.de/pflanzen-mieten/ (2026)
21. airy.green Mietpflanzen costs & tax — https://airy.green/en/blogs/air-up-your-life/mietpflanzen-buero-kosten-vorteile-steuer (2026)
22. Pflanzen-Kölle — https://www.pflanzen-koelle.de/filialen/gaertnerservice/innenraumbegruenung/pflanzen-mieten/ (2026)
23. Plantyworks Essen — https://plantyworks.de/essen/ (2026)
24. Mohr Hydrokultur — https://www.mohr-hydro.de/mietpflanzen (2026)
25. Ruof Pflanzenleasing — https://ruof.eu/raumbegruenung/pflanzenleasing (2026)
26. AS Hydroplant — https://www.as-hydroplant.de/mieten-leasen/ (2025)
27. Rogel Raumbegrünung — https://hydrokultur.de/leistungen/mietpflanzen/ (2026)
28. akzente raumbegrünung — https://www.akzente-raumbegruenung.de/raumbegruenung-abc/mietpflanzen/ (2026)
29. p2objektgruen Berlin — https://p2objektgruen.de/pflanzen-kaufen-mieten/ (2026)
30. Miet24 plant rental marketplace — https://marktplatz.miet24.de/mieten/events-und-messen/pflanzen (2026)
31. ZVG Fachverband Raumbegrünung und Hydrokultur — https://zvg-fvrh.de/ueber-uns/ (2026)
32. BuGG Innenraumbegrünung — https://www.gebaeudegruen.info/wissen-und-ressourcen/gebaeudegruenung/innenraumbegruenung/ (2026)
33. 800petals office plant rental Dubai — https://800petals.com/office-plant-rental-dubai/ (2026)
34. 800petals indoor plant maintenance — https://800petals.com/indoor-plants-maintenance/ (2026)
35. Royal Plantscape indoor plant maintenance — https://www.royalplantscape.com/pages/indoor-plant-maintenance-service (2026)
36. Greenly.ae services and pricing — https://greenly.ae/services-and-pricing/plant-maintenance-services-dubai/ (2026)
37. Plantsworld.ae office plant rental UAE — https://plantsworld.ae/collections/office-plant-rental-uae (2026)
38. Plants Xpert Dubai — https://plantsxpert.com/pages/plants-rental-in-dubai-plants-xpert (2026)
39. Adplants plant rentals — https://adplants.com/pages/plant-rentals (2026)
40. Dubai Nursery plant rentals — https://www.dubainursery.ae/plant-rentals/ (2026)
41. Desert Blooms corporate plant rental Dubai — https://www.desertblooms.me/blogs/plant-care-guides/corporate-plant-rental-dubai-premium-green-solutions-for-modern-workspaces (2026)
42. Desert Group Plantscapes — https://desertgroup.ae/plantscapes/ (2026)
43. Desert Group ZoomInfo profile — https://www.zoominfo.com/c/desert-group/372399540 (2026)
44. Plant Drop office plant costs UK — https://plantdrop.co.uk/pages/office-plant-costs-uk (2026)
45. Plant Plan indoor planting scheme costs — https://www.plantplan.co.uk/blog/indoor-planting-scheme-costs-explained-uk-pricing-guide-for-offices (2026)
46. Inleaf office plant prices — https://inleaf.co.uk/office-plants/office-plant-prices/ (2026, HTTP 403)
47. Plant Designs office plant rental London — https://plantdesigns.co.uk/services/office-plant-rental-london/ (2026)
48. Planteria office plants for hire — https://www.planteriagroup.com/office-plants-for-hire/ (2026)
49. phs Greenleaf office plants — https://www.phsgreenleaf.co.uk/indoor/office-plants/ (2026)
50. officeplants.com office plant rental pricing guide — https://officeplants.com/2026/08/03/office-plant-rental-pricing/ (2026-08)
51. Tropical Plant Rentals pricing guide — https://tropicalplantrentals.com.au/blog/plant-pricing-guide-what-it-really-cost/ (2026)
52. Tropical Plant Rentals indoor plant hire — https://tropicalplantrentals.com.au/indoor-plant-hire/ (2026)
53. Planterra — https://planterra.com/ (2026)
54. Phillips Interior Plants — https://www.phillipsinteriorplants.com/ (2026)
55. Plant Solutions Phoenix — https://plantsolutions.com/ (2026)
56. Plantman — https://www.plantman.com/ (2026)
57. Urban Planters plant displays — https://www.urbanplanters.co.uk/services/plant-displays/ (2026)
