# Planty research — Lens: Seasonal rotation & MVP plant catalog

Researcher note, 2026-09-10. Every number below carries a source URL and a year. Where a figure is my own
estimate or inference it is explicitly labelled **[ESTIMATE]**. Where a source could not be found, that is stated.

**Research-hygiene caveat:** the session's WebSearch quota was exhausted before this lens started, so all
discovery was done through a browser driving DuckDuckGo HTML search plus direct page fetches. That worked, but
it means fewer "10 distinct queries" style breadth passes than the brief asked for; the gaps are flagged in
Open Questions. Two upstream trade sources I wanted and could **not** get numbers from: Royal FloraHolland's
per-species price index (login/members only) and Nieuwkoop Europe's catalogue prices (login-gated — confirmed:
"Prices are not publicly displayed", https://www.nieuwkoop-europe.com/en/plants, 2026). The BuGG
Innenraumbegrünung PDF fetched as unparseable binary.

---

## 1. What "seasonal rotation" actually means in the trade

### 1.1 The trade splits the catalog into two very different products

Every interior landscaper I looked at runs a **two-tier catalog**, and this is the single most important
structural insight for Planty:

1. **Foliage staples ("green plants")** — installed once, kept for months to years, serviced on a cycle.
   These are the asset base. They are rented, depreciated, and refurbished.
2. **Seasonal colour ("colour rotation" / German *Wechselflor*)** — flowering plants swapped out on a
   schedule, treated as a consumable. These are effectively a *service line item*, not an asset.

Botanical Designs (US interior plantscaper) describes exactly this: seasonal colour uses
"long-lasting tropicals such as bromeliads and kalanchoes", and the company offers
"a bimonthly or quarterly rhythm to refresh your look", handling "design, delivery, installation, and each
scheduled rotation". No pricing published.
Source: https://botanicaldesigns.com/color-rotations/ (accessed 2026)

The German municipal-greenery guidance defines *Wechselflor* the same way — planted
"zwei- bis dreimal jährlich" (two to three times a year) to keep continuous bloom, and explicitly notes it is
resource-intensive ("Entsprechend intensiv ist der Ressourceneinsatz").
Source: https://oeffentlichebeschaffung.kompass-nachhaltigkeit.ch/fileadmin/kundendaten/produkte-labels/Gruenraum/Merkblatt_Wechselflor.pdf (2023)

A US landscape field guide gives the same cadence for exterior colour and the reason it varies:
seasonal colour is rotated "two to four times a year", and "The region, the climate zone, and the frost dates
govern the rotation and the plant list."
Source: https://anvilfield.com/field-guides/landscaping/seasonal-color-annual-rotation/ (2026)

**Implication:** "seasonal rotation" in the trade is **2–4 changes per year**, not monthly. Planty's marketing
promise of "a fresh, seasonal set" should be scoped to a **quarterly colour swap** (4×/yr) as the premium tier
and a **2×/yr swap** as the standard tier. Monthly rotation of the whole set is not a thing anyone does and
would destroy unit economics.

### 1.2 Cadence of maintenance visits — the biggest cost lever, and it differs by market

This is where Berlin and Dubai diverge sharply.

**Germany — every 2–3 weeks is the professional norm, not weekly.**
A German office-plant service states its standard interval as "alle 2–3 Wochen", with the offered range
"Von 2–4 Wochen bis zu größeren Abständen", and per-visit tasks "Gießen, Düngen, Rückschnitt" plus pest check,
leaf cleaning and "Dokumentation des Besuchs".
Source: https://gruen-im-buero.de/leistungen/pflanzenservice (accessed 2026)

The physical reason is **hydroculture / sub-irrigation with a water-level gauge**, which is the German
interior-landscaping default. A German care sheet: the water level "sollte innerhalb von 2-3 Wochen auf Minimum
absinken" (should fall to minimum within 2–3 weeks), i.e. the watering interval is designed to be 2–3 weeks.
Source: https://p2objektgruen.de/wp-content/uploads/2020/03/Pflegeanleitung-Hydropflanzen.pdf (2020)

A typical German provider's offer is framed as "Solitärpflanzen in Hydrokultur oder Erdkultur mit
Langzeitbewässerung" — i.e. hydroculture *or* soil with long-term irrigation — for exactly this reason.
Source: https://idealpflanzenservice.de (accessed 2026)

**UAE — weekly is what vendors advertise.**
800petals (Dubai/Abu Dhabi/Sharjah, "more than 10,000 installations since 1992"): rental includes weekly visits
covering "watering, leaf cleaning, pruning, fertilizing and pest checks, scheduled around your office hours",
and "If a plant declines, we swap it at no cost". The page also confirms "Seasonal rotation options and a
single monthly invoice".
Source: https://800petals.com/office-plant-rental-dubai/ (accessed 2026)

Plantsworld.ae markets on the same weekly promise: "Weekly care. Monthly flat rate."
Source: https://plantsworld.ae/pages/plant-maintanence (accessed 2026)

Plntd.ae explicitly tiers it: **monthly** visits on the small plan, **weekly** on the mid and enterprise plans.
Source: https://plntd.ae/pages/office-maintenance (accessed 2026)

**Why the divergence is real, not just marketing:** Dubai interiors run heavy central AC, which drives ambient
humidity down. A Dubai garden centre's office guide: the AC "desiccates foliage and lowers ambient humidity",
and warns never to "Place any plant directly under a ceiling AC vent — the cold blast desiccates foliage faster
than drought." It also names the dominant failure mode: "Root rot from overwatering is the number-one office
plant killer."
Source: https://acaciagardencenter.com/blogs/care-library/indoor-plants-dubai-offices (2026-06-01)

**Implication:** the founder's "every week a technician visits" assumption is **correct for Dubai and wrong for
Berlin**. In Berlin, hydroculture + a 2–3 week cycle is the industry-standard, cheaper, and better-understood
model. Planty should make visit cadence a market-level configuration, not a product constant. **[ESTIMATE]**
Moving from weekly to fortnightly halves the largest variable cost in the business (technician time + travel).

### 1.3 Light is the hard constraint, and it is a Berlin problem specifically

"Most indoor plants require a minimum of 500–1,000 lux for healthy growth."
Source: https://mobilane.com/en/news/the-importance-of-light-for-interior-planting/ (accessed 2026)

For reference, EN 12464-1 sets office task lighting at 500–1000 lux
(https://ricoman.com/news/office-lighting-lux-levels/, 2025-06-30). So a typical lit office floor is *just* at
the bottom of the plant-viable band from artificial light alone — which is why low-light-tolerant foliage
dominates every professional catalog.

Berlin adds a seasonal penalty: at ~52.5°N, December daylight is short and overcast, so window-adjacent
positions that work in June are marginal in December. I could not find a Berlin-specific indoor lux measurement
series — **gap**. But the practical consequence is well established in the trade catalogs: winter is when
foliage plants stall and when flowering colour (which is bought already in bud and treated as consumable) does
the aesthetic work.

Dubai has the opposite problem: abundant light, but glazing is often heavily tinted/filmed for solar control,
and the AC blast is the killer rather than the light. The Acacia guide's whole recommended list is
"Low–Medium" light species — same shortlist as Berlin's, for a different reason.

---

## 2. Supply side — can you actually get these plants, and what do they cost?

### 2.1 Germany / EU

**Macro.** Royal FloraHolland (the clearing house that effectively sets EU pot-plant pricing) closed 2025 with
product turnover of **€5.4bn** (2024: €5.3bn), driven by higher average unit prices — flowers +3%, plants +1% —
against a 2% volume decline.
Sources: https://www.royalfloraholland.com/en/news-2026/week-13/royal-floraholland-succesvol-2025-productomzet-groeit-naar-5-4-miljard-euro (2026-03-27);
https://www.theia.global/article/royal-floraholland-achieves-54-billion-revenue-in-2025-amid-cost-control-measures-ff7dc78a (2026-04-01)

In 2025 "almost 5 billion flowers and plants" traded via the clock; flowers were "over 82% in turnover and 94%
in units", i.e. **plants are ~18% of auction turnover but only ~6% of units** — plants are the high-unit-value
side.
Source: https://www.royalfloraholland.com/en/news-2026/week-3/auction-developments-2025-2026 (2026-01-12)

I could **not** obtain the per-species RFH price index (members only). This is the biggest missing number in
this lens.

**German seasonal supply depth (this is what makes a rotation calendar feasible).** BMEL / Destatis, survey
period **July 2024 – June 2025**: 86 million pot plants (Zimmerpflanzen) produced by 1,016 ornamental
businesses. By species:
- Poinsettia (Weihnachtsstern): **18 million** units — the single largest category, down 14% vs four years earlier
- Cacti + green/foliage plants: **13 million**
- Cyclamen (Alpenveilchen): **10 million**
Overall indoor-plant production fell "um gut ein Fünftel" (a good fifth) vs the 2020/21 survey.
Sources: https://www.bmel-statistik.de/landwirtschaft/gartenbau/zierpflanzen (2024/25 survey);
https://www.destatis.de/DE/Themen/Querschnitt/Weihnachten/Advent/_inhalt.html (2025)

Structural context: 2,821 German ornamental horticulture businesses on ~5,760 ha in 2025 — down 9.7% in
business count and 8.1% in area vs 2021.
Source: https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/11/PD25_417_41213.html (2025-11-24)

**Read-through:** Germany has enormous, cheap, domestic seasonal-colour supply (18M poinsettia + 10M cyclamen a
year) but a *shrinking* production base. A quarterly rotation program in Berlin is very well supplied for
Nov–Dec (poinsettia) and Sep–Dec (cyclamen); other quarters lean on Dutch imports.

**European trade-webshop prices** (FlorAccess, a pan-European plant wholesaler; prices shown in **GBP** because
of geolocation — convert at ~1.17 EUR/GBP for a rough EUR figure; these are trade-shop prices and sit *above*
raw Dutch auction cost, so treat as an **upper bound** on Planty's landed cost):

| Product | Pot | Height | Price (GBP) | ≈ EUR **[ESTIMATE]** |
|---|---|---|---|---|
| Ficus binnendijkii 'Alii' | 27 cm | 140–160 cm | £34.01 | ~€40 |
| Ficus elastica 'Robusta' | 27 cm | 90–110 cm | £35.20 | ~€41 |
| Ficus 'Safrana' | 27 cm | 100–120 cm | £35.03 | ~€41 |
| Ficus natalensis 'Trinova' | 27 cm | 150–170 cm | £44.10 | ~€52 |
| Ficus binnendijkii 'Amstel King' | 27 cm | 110–130 cm | £50.69 | ~€59 |
| Ficus lyrata | 30 cm | 120–140 cm | £59.62 | ~€70 |
| Ficus cyathistipula | 34 cm | 130–150 cm | £69.01 | ~€81 |
| Ficus lyrata | 34 cm | 140–160 cm | £69.01 | ~€81 |
| Ficus benjamina 'Exotica' | 34 cm | 140–160 cm | £78.03 | ~€91 |
| Ficus benghalensis 'Audrey' | 30 cm | 120–140 cm | £81.11 | ~€95 |
| Ficus elastica 'Abidjan' | 40 cm | 160–180 cm | £184.39 | ~€216 |
| Ficus nitida | 40 cm | 170–190 cm | £185.17 | ~€217 |
Source: https://www.floraccess.com/en/category/900/ficus/ and .../?page=2 (accessed 2026)

**German retail comparison** (123zimmerpflanzen.de, incl. VAT, 2026) for the same species, to show the
retail/trade spread:
Ficus lyrata 70 cm / Ø17 = €21.99; 100 cm / Ø27 = €67.99; 120 cm / Ø27 = €126.99; 140 cm / Ø34 = €153.99;
150 cm / Ø27 = €154.99.
Source: https://www.123zimmerpflanzen.de/ficus-lyrata.html (accessed 2026)

**[ESTIMATE]** Rough rule from the above: a floor-standing specimen (120–160 cm) costs Planty roughly
**€40–95 landed** in Europe if bought at trade, versus €127–155 at German consumer retail. A tabletop/desk
plant (Ø12–17, 30–50 cm) is **€3–10** at trade **[ESTIMATE — not directly sourced]**.

### 2.2 UAE / Dubai

**Sourcing cluster.** Dubai has a dense, single-location wholesale plant district in **Al Warsan 3** ("Plant
Street"), including Dutch import houses. Confirmed operators there: Green Glades (Warsan nursery,
https://greenglades.ae/plant-nursery-dubai.html), Gover Garden Centre (Al Warsan,
https://www.govergardencentre.com), The Dutch Plants Trading LLC (Warsan 3,
https://dutchplantsuae.com/?page_id=307), Greencore Flowers & Ornamental Plants (Warsan 3), Intraflora Nursery
(Al Warsan 3, https://intrafloranursery.ae), plus Hadiqat Group as a B2B wholesaler
(https://www.hadiqatgroup.ae) and Gardenya as a distributor/importer (https://gardenya.ae/plants-wholesale/).
All accessed 2026.

**Prices are dramatically lower than Europe.** Dubai Municipality's Warsan Nursery (May 2026):
- Indoor plants: **AED 2 – AED 60** depending on size
- One shrub: AED 5; one tree: AED 8
- 100 flowering plants: AED 50; tray of 18 plants: AED 9
- Outdoor plants from **50 fils**; +5% VAT
Named indoor stock: "From snake plants and African violets, to Codiaeums, calatheas and kalanchoes".
Source: https://www.emirates247.com/uae/dubai-municipalitys-warsan-nursery-sells-plants-from-50-fils-heres-what-you-can-buy/1573 (2026-05-13)

**UAE consumer retail prices** (Plantsworld.ae, accessed 2026) — a useful mid-point benchmark:
Snake Plant 50–60 cm from AED 26 (reg. 39) · Bamboo Palm 30–40 cm from AED 39 · Peace Lily 30–40 cm from
AED 49 · ZZ Plant 30–40 cm from AED 49 · Ficus elastica 30–40 cm from AED 49 · Calathea 20–30 cm from AED 49 ·
Areca Palm **100–120 cm** from AED 219 · Pachira twisted **120–150 cm** from AED 319 · Phalaenopsis orchid
60–80 cm from AED 179 · Kalanchoe 20–30 cm from AED 25 · Aglaonema Red 30–40 cm from AED 49 · Boston Fern from
AED 41 · Fittonia 5–10 cm from AED 19.
Source: https://plantsworld.ae/collections/indoor-plants (accessed 2026)

**Premium UAE retail** (Plntd.ae, accessed 2026): Peace Lily AED 154 · Snake Plant AED 449 · ZZ Plant AED 469 ·
Fiddle Leaf Fig AED 919 · Bird of Paradise AED 1,199 · Areca Palm AED 999.
Source: https://plntd.ae/pages/office-maintenance

The spread between AED 2–60 wholesale (Warsan) and AED 449–1,199 premium retail (Plntd) for the same species is
the arbitrage a rental business monetises. **[ESTIMATE]** Dubai landed cost per plant looks like roughly
**1/3 to 1/5** of Berlin's for equivalent species, driven by proximity to Asian/African production and a
lower-cost import lane, which materially improves rotation and replacement economics.

### 2.3 What competitors charge for rental (for calibrating the catalog's price bands)

**Germany:**
- Single hydroculture specimen: **≈ €14.50 / month**. "Einzelpflanzen: ca. 14,50 €/Monat (Hydrokultur-Solitäre)";
  complete solutions "ab ca. 200 €/Monat für Räume bis 150 m²".
  Source: https://airy.green/blogs/air-up-your-life/mietpflanzen-buero-kosten-vorteile-steuer (2025-04-23)
- Plantclub (Berlin): Greenhouse **from €200/mo** (≤150 m²), Woodland **from €400/mo** (≤500 m²), Jungle
  **from €600/mo** (≤1,000 m²), all "excl. VAT · billed annually", "Minimum term 12 months". Includes free
  design concept, free replacements, dedicated expert, delivery & install, "circular care system".
  Source: https://plantclub.io/de/preise (accessed 2026)
- WELO Green: "ab 199,-€ pro Monat", "12 Monaten Mindestlaufzeit", then monthly cancellable; free replacement
  ("Kostenlosem Austausch bei Pflanzenausfall im Abo"). **No seasonal rotation offered.**
  Source: https://welo-green.de/blogs/journal/bueropflanzen-mieten-flexible-raumbegruenung-mit-service-und-garantie (2025-09-24)

**UK (per-plant anchor, advertising copy):** phs Greenleaf advertises office plants "for Less Than £3.50 per
Week" — i.e. ~£15/month ≈ €17.5/month per plant, corroborating the German €14.50 figure.
Source: phsgreenleaf.co.uk ad copy captured via DuckDuckGo results, accessed 2026 — **anecdotal / ad copy**

**UAE:**
- Plntd.ae: Starter **AED 690/mo** (<1,000 sqft, 1–20 plants, *monthly* visits) · Office **AED 1,790/mo**
  (1,000–5,000 sqft, 20–50 plants, *weekly* visits, "Seasonal plant refresh included") · Enterprise custom.
  Terms: "No lock-in · 30-day notice". Free proactive replacement.
  Source: https://plntd.ae/pages/office-maintenance (accessed 2026)
- MyDubaiPlants: office rental "From AED 299/month", 3–12 month contracts, monthly maintenance visits.
  Source: https://mydubaiplants.com/plant-rental (accessed 2026)
- Plantscapes.ae: "12-24 month long-term renting agreements".
  Source: https://plantscapes.ae/rentals/ (accessed 2026)
- 800petals: "most plans are quoted per plant per month, all-inclusive"; "most clients choose 12-month
  agreements for the best monthly rate".
  Source: https://800petals.com/office-plant-rental-dubai/ (accessed 2026)

**Derived per-plant rate, UAE [ESTIMATE]:** Plntd Starter AED 690 for 1–20 plants → AED 34.50–690/plant/month
depending on count; Office AED 1,790 for 20–50 → AED 35.80–89.50/plant/month. Midpoint ≈ **AED 45–60
(≈ €11–15) per plant per month**, i.e. roughly the same per-plant economics as Germany at ~1/3 the plant cost.
That is a strong argument for Dubai on gross margin.

---

## 3. Recommended MVP catalog — 24 plants

Legend: **Neglect** = how long it survives a missed visit (my rating, informed by the Dubai office guide's
watering intervals and general horticultural practice — **[ESTIMATE]** unless a watering interval is cited).
**Tox** = ASPCA cat/dog classification. Prices are per-unit acquisition bands; EUR = European trade **[ESTIMATE
based on the FlorAccess/123zimmerpflanzen data above]**, AED = observed UAE retail from plantsworld.ae/plntd.ae
(actual, cited) — Warsan wholesale is far lower (AED 2–60).

**Toxicity sources:** ASPCA main list https://www.aspca.org/pet-care/animal-poison-control/cats-plant-list ;
individually verified pages cited inline. ⚠️ I verified three species individually because a bulk extraction of
the ASPCA list returned at least one wrong answer (it claimed Peace Lily was non-toxic; the dedicated ASPCA
page says otherwise). **Treat any toxicity row not individually verified below as needing a second check before
it ships in the product.**

Individually verified:
- **Peace Lily (Spathiphyllum): TOXIC to cats and dogs.** Toxic principle "Insoluble calcium oxalates";
  signs "Oral irritation, intense burning and irritation of mouth, tongue and lips, excessive drooling,
  vomiting, difficulty swallowing."
  Source: https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/peace-lily (accessed 2026)
- **Kentia Palm (Howea forsteriana): NON-TOXIC to dogs and cats.**
  Source: https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/kentia-palm (accessed 2026)
- **Areca Palm (Dypsis lutescens): "Non-Toxic to Dogs, Non-Toxic to Cats, Non-Toxic to Horses".**
  Source: https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/areca-palm (accessed 2026)

### 3.1 Tier A — Foliage staples (the rentable asset base). 14 SKUs.

| # | Common / Botanical | Sizes | Light | Water | Neglect | Tox (ASPCA) | € band | AED band | Office / Home | Berlin | Dubai |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Snake Plant / *Dracaena trifasciata* (Sansevieria) | Ø12 30cm · Ø17 60cm · Ø21 90cm | Low–Med | every 3–4 wks¹ | ★★★★★ | Toxic | €4–25 | 26–449 | Both | ✔ | ✔✔ |
| 2 | ZZ Plant / *Zamioculcas zamiifolia* | Ø14 45cm · Ø19 70cm · Ø24 90cm | Low–Med | every 2–4 wks¹ | ★★★★★ | Not on ASPCA list; widely reported toxic (calcium oxalates) — **VERIFY** | €6–30 | 49–469 | Both | ✔ | ✔✔ |
| 3 | Kentia Palm / *Howea forsteriana* | 100 · 140 · 180cm | Med | every 1–2 wks¹ | ★★★★ | **Non-toxic (verified)** | €35–120 | 250–900 | Both (hero) | ✔✔ | ✔ |
| 4 | Areca Palm / *Dypsis lutescens* | 100–120 · 150cm | Med–Bright | 1–2 wks | ★★★ | **Non-toxic (verified)** | €20–60 | 219–999 | Both | ✔ | ✔✔ |
| 5 | Aglaonema (Chinese Evergreen), incl. 'Red' | Ø14 40cm · Ø19 60cm | Low–Med | every 2–3 wks¹ | ★★★★ | Toxic | €6–25 | 49–150 | Both (colour w/o flowers) | ✔ | ✔✔ |
| 6 | Dracaena fragrans 'Janet Craig' / 'Massangeana' (Corn Plant) | 90 · 120 · 160cm | Low–Med | every 2–3 wks¹ | ★★★★ | Toxic | €20–70 | 150–500 | Office | ✔ | ✔✔ |
| 7 | Dracaena marginata | 90 · 140 · 180cm | Low–Med | 2–3 wks | ★★★★ | Toxic | €20–70 | 150–500 | Office | ✔ | ✔✔ |
| 8 | Golden Pothos / *Epipremnum aureum* | Ø12 hanging · Ø17 · moss pole 100cm | Low–Med | every 1–2 wks¹ | ★★★★ | Toxic | €4–20 | 38–120 | Both (shelves) | ✔ | ✔✔ |
| 9 | Peace Lily / *Spathiphyllum* | Ø13 40cm · Ø17 60cm · Ø21 80cm | Low–Med | every 1–2 wks¹ | ★★ (wilts visibly, recovers) | **Toxic (verified)** | €5–25 | 49–154 | Office | ✔ | ✔ |
| 10 | Rubber Plant / *Ficus elastica* 'Robusta'/'Abidjan' | 90–110 · 120–140 · 160–180cm | Med–Bright | 1–2 wks | ★★★ | Toxic | €41–216 (cited) | 49–600 | Both | ✔ | ✔ |
| 11 | Ficus binnendijkii 'Alii' / 'Amstel King' | 110–130 · 130–150 · 140–160cm | Med | 1–2 wks | ★★★ (far less leaf-drop than *benjamina*) | Toxic (Ficus) | €40–80 (cited) | — | Office | ✔✔ | ✔ |
| 12 | Schefflera arboricola (Umbrella) | Ø17 60cm · Ø21 100cm | Med | 1–2 wks | ★★★ | Toxic | €8–35 | 60–250 | Both | ✔ | ✔✔ |
| 13 | Chamaedorea elegans (Parlor Palm) / *Rhapis excelsa* (Lady Palm) | 30–40cm · 90cm | **Lowest light tolerance in list** | 1–2 wks | ★★★★ | Chamaedorea non-toxic | €5–60 | 39–400 | Both (dark corners) | ✔✔ | ✔ |
| 14 | Zamioculcas 'Raven' / Aspidistra elatior (Cast Iron) | Ø17–21 | Low | 3–4 wks | ★★★★★ | Aspidistra not on ASPCA list — VERIFY | €10–35 | — | Office | ✔✔ | ✔ |

¹ watering intervals cited from https://acaciagardencenter.com/blogs/care-library/indoor-plants-dubai-offices (2026)
for ZZ, Snake, Pothos, Peace Lily, Aglaonema, Dracaena, Kentia.

Note on #3, #4, #13: the pet-safe palms are the *only* verified non-toxic large-format options in the list. If
Planty markets a "pet-safe home set", it is essentially **Kentia + Areca + Parlor Palm + Boston Fern +
Calathea + Peperomia + Phalaenopsis + Spider Plant**, and nothing else at floor-plant scale.

### 3.2 Tier B — Structural / statement plants (B2B lobbies, villas). 4 SKUs.

| # | Plant | Sizes | Light | Neglect | Tox | € band | AED band | Notes |
|---|---|---|---|---|---|---|---|---|
| 15 | Strelitzia nicolai / reginae (Bird of Paradise) | 120 · 160 · 200cm | Bright | ★★★ | Toxic (Strelitzia) | €60–150 | 1,199 (Plntd, cited) | Dubai-native aesthetic; loves UAE light |
| 16 | Monstera deliciosa (pole) | 90 · 120 · 150cm | Med–Bright | ★★★ | Toxic | €25–90 | 150–600 | High demand, but Dubai office guide **warns against it** |
| 17 | Pachira aquatica (Money Tree, braided) | 100 · 120–150cm | Med | ★★★ | Not on ASPCA list — VERIFY | €25–80 | 319 (cited) | Strong B2B/UAE cultural fit |
| 18 | Ficus lyrata (Fiddle Leaf Fig) | 120–140 · 140–160cm | Bright | ★★ | Toxic | €70–81 (cited) | 919 (Plntd, cited) | Instagram hero, **highest failure risk** |

### 3.3 Tier C — Seasonal colour / rotation consumables. 6 SKUs.

These are **not depreciated assets**. Model them as cost-of-service per rotation.

| # | Plant | Season (Berlin) | Season (Dubai) | Sizes | Life indoors | Tox | € band | AED band |
|---|---|---|---|---|---|---|---|---|
| 19 | Phalaenopsis orchid | year-round | year-round | Ø12 2-stem · Ø15 3-stem | 8–14 wks in bloom | Non-toxic | €4–12 | 179 (cited) |
| 20 | Bromeliad (Guzmania / Vriesea) | year-round | year-round | Ø12 · Ø17 | 8–12 wks | Non-toxic (bromeliad) | €3–9 | ~40–90 |
| 21 | Anthurium andraeanum | year-round | year-round | Ø12 · Ø17 | 10–16 wks | Toxic | €4–12 | ~50–120 |
| 22 | Poinsettia / *Euphorbia pulcherrima* | **Nov–Dec only** | Nov–Jan (imported) | Ø10.5 · Ø13 | 4–8 wks | Toxic | €1.50–5 | ~15–40 |
| 23 | Cyclamen persicum | **Sep–Jan** | Nov–Feb only (heat-limited) | Ø10.5 · Ø13 | 6–10 wks | Toxic | €1.50–4 | ~15–35 |
| 24 | Kalanchoe blossfeldiana | year-round | year-round | Ø10.5 · Ø12 | 6–10 wks | Toxic | €1.50–4 | 25 (cited, plantsworld) |

Poinsettia and cyclamen price bands are **[ESTIMATE]** — I did not find published wholesale prices; the German
production volumes (18M poinsettia, 10M cyclamen, BMEL 2024/25) imply commodity pricing but I have no per-unit
figure. **Gap.**

---

## 4. The 12-month rotation calendar (viable in BOTH Berlin and Dubai)

Design principle: **the foliage base never changes**; only the Tier C colour pots rotate, 4× per year, at
the regular service visit. That keeps logistics to "swap N small pots" rather than "re-install the office".

| Quarter | Months | Berlin colour | Dubai colour | Shared fallback | Notes |
|---|---|---|---|---|---|
| Q4 "Festive" | Nov–Jan | **Poinsettia** (Ø13) + Phalaenopsis white | Poinsettia (imported, Nov–Dec) + Phalaenopsis | Anthurium red | Germany produces 18M poinsettias/yr (BMEL 2024/25) — cheapest, most abundant swap of the year. Dubai's *outdoor* season is also Nov–Mar, so demand for greenery peaks here too. |
| Q1 "Fresh start" | Feb–Apr | Cyclamen tail-end → **spring bulbs** (hyacinth, tulip, Muscari in pots) → Kalanchoe | **Kalanchoe + Bromeliad** (bulbs unreliable in AC/heat) | Kalanchoe | Bulbs are the classic Berlin Q1 answer and completely non-viable in Dubai. |
| Q2 "Bright" | May–Jul | **Bromeliad (Guzmania)** + Anthurium | **Bromeliad + Anthurium** (the only genuinely heat-proof pair) | Anthurium | Dubai May–Sep is the survival quarter: 45°C outside, hard AC inside. Bromeliads tolerate the transport shock best. |
| Q3 "Warm" | Aug–Oct | **Cyclamen** (from Sep) + Chrysanthemum + Anthurium | **Phalaenopsis + Anthurium** | Phalaenopsis | Germany produces 10M cyclamen/yr; it is the autumn workhorse. Cyclamen wants cool (RHS-style guidance) so it is a poor Dubai pick outside Dec–Feb. |

**Species deliberately excluded from the rotation, with reasons:**
- **Azalea / Rhododendron simsii.** RHS rates indoor azaleas "Difficult"; they need "a cool, humid atmosphere",
  13–16 °C after flowering, must "Never allow the compost to dry out completely", and "Plants will deteriorate
  if they suffer long periods in hot, dry conditions". Also toxic (ASPCA). Source:
  https://www.rhs.org.uk/plants/rhododendron/indoor-azaleas (accessed 2026). **Non-viable in a heated Berlin
  office and catastrophic in Dubai AC.**
- **Hydrangea.** Same cool/wet requirement, very high water demand, toxic (ASPCA). Wilts within days of a
  missed visit — the exact failure the product promises to eliminate.
- **Chrysanthemum.** Toxic, and a classic thrips/aphid vector. Usable in Berlin Q3 only if pest-screened;
  excluded from Dubai entirely.

**The rotation calendar therefore reduces to a robust three-species core** — Phalaenopsis, Bromeliad,
Anthurium — that works all year in both cities, **plus two seasonal spikes that only Berlin can do properly**
(poinsettia in Q4, cyclamen/bulbs in Q3/Q1). This is a real, if narrow, product advantage for Berlin: the
seasonal story is genuinely richer there because the domestic supply exists.

---

## 5. Plants to AVOID for rental

Grouped by the reason they break a rental/service model.

**A. Fails fast under a 2–3 week service interval**
- *Ficus benjamina* (Weeping Fig). The classic office plant and the classic office disaster. It sheds heavily
  on any relocation or draught change: "weeping figs shed heavily when relocated"
  (https://leafypixels.com/plants/ficus-benjamina/spider-mites/, 2026-06-16). Its documented problem list is
  "Leaf Drop, Yellow Leaves, Spider Mites, Brown Tips, Root Rot, Overwatering, Underwatering, Mealybugs,
  Aphids, Leggy Growth" (https://leafypixels.com/plants/ficus-benjamina/problems/, 2026-06-16). Since a rental
  business *by definition* relocates plants, this species is a structural liability. Use *Ficus binnendijkii*
  'Alii'/'Amstel King' instead (same look, far less drop).
- Calathea / Maranta / Ctenanthe. Brown-tip instantly in dry air. The Dubai AC problem is precisely
  low humidity — the AC "desiccates foliage and lowers ambient humidity"
  (https://acaciagardencenter.com/blogs/care-library/indoor-plants-dubai-offices, 2026). Berlin winter heating
  does the same. Sell as a small home SKU at most; never in offices.
- Ferns (except tough Nephrolepis 'Green Lady'): same humidity failure, faster.
- Azalea, Hydrangea, Gardenia, Cyclamen outside its season — see §4.

**B. Pest-prone (a rental fleet shares pests across customers)**
- Ficus benjamina — spider mites, scale, thrips, mealybugs, aphids (sources above; also
  https://introgreen.eu/plant-advice/ficus/pests, accessed 2026).
- Chrysanthemum, Gerbera — thrips/aphids.
- Croton (*Codiaeum*) — spider-mite magnet plus heavy leaf drop on move. (Note: Warsan Nursery stocks
  Codiaeums cheaply, which will tempt a Dubai buyer — resist.)
- Alocasia — spider mites, plus dormancy that looks like death to a customer.

**C. Toxicity / liability, especially for the B2C home segment**
Toxic to cats and dogs per ASPCA and therefore excluded from any "pet-safe" tier: Dieffenbachia (severe),
Monstera, Philodendron, Epipremnum/Pothos, Aglaonema, Sansevieria, Dracaena, Spathiphyllum (verified),
Schefflera, Ficus spp., Anthurium, Kalanchoe, Poinsettia, Cyclamen, Azalea, Hydrangea, Chrysanthemum.
Source: https://www.aspca.org/pet-care/animal-poison-control/cats-plant-list (accessed 2026)
- **Dieffenbachia specifically should be dropped entirely** for a consumer rental product: severe oral
  irritation, and it is a child-in-the-home risk, not just a pet risk. Note that Dubai vendors *do* stock it
  (Plantsworld lists "Dumb Cane - Dieffenbachia" from AED 39).
- Sago palm (*Cycas revoluta*) — severe liver toxicity, sold widely in UAE nurseries. Hard exclude.

**D. Economically wrong for rental**
- *Ficus lyrata* at large sizes: €70–81 trade / AED 919 retail (cited) with a high failure rate under low light
  — the worst ratio of asset cost to survival odds in the catalog. Keep it, but price it as a premium SKU with
  a bright-light site check, not as a default.
- Anything above ~180 cm: cannot be moved through a normal stairwell/lift by one technician; kills the
  solo-founder ops model.

---

## 6. Berlin vs Dubai — what this lens says

**Dubai advantages (catalog/ops):** plant acquisition cost is a fraction of Europe's (AED 2–60 indoor at Warsan
Nursery, 2026, vs €40–95 trade for a comparable floor specimen in Europe); a single dense sourcing cluster
(Al Warsan 3) reduces procurement to one trip; year-round consistent indoor conditions mean one plant list
works in every month; a mature competitor set proves willingness to pay (800petals since 1992, 10,000+
installations).

**Dubai disadvantages:** weekly service is the market expectation (Plntd, 800petals, Plantsworld all advertise
weekly), which is ~2× the labour cost per plant vs Berlin's 2–3 week norm; AC is a harsher environment than
Berlin's; the seasonal-colour story is genuinely thinner (no poinsettia/cyclamen/bulb season of any depth);
and the market is crowded, with at least eight identifiable incumbents found in one search.

**Berlin advantages:** the fortnightly hydroculture model is standard and halves the biggest variable cost; the
world's deepest seasonal-colour supply chain sits next door (18M poinsettias + 10M cyclamen produced in
Germany, BMEL 2024/25, plus Royal FloraHolland's €5.4bn 2025 clearing house one truck away); B2B willingness to
pay is proven and legible (Plantclub €200–600/mo, WELO €199/mo, ~€14.50/plant/mo).

**Berlin disadvantages:** plant acquisition is 3–5× costlier; December light is a real constraint on the
foliage base; and — notably for the founder's B2C thesis — **I found no German consumer plant-rental offer at
all.** Plantclub, WELO, Airy, Plantyworks, Oxygen at Work are all B2B, all ≥€199/month, all 12-month minimum.
That is either a large unserved gap or evidence the B2C unit economics don't work. This lens cannot resolve
which; see Open Questions.

---

## 7. Concrete MVP recommendations from this lens

1. **Ship 24 SKUs, in three tiers** (14 foliage staples / 4 statement / 6 seasonal), not one flat catalog. The
   data model needs `tier` because Tier C is a consumable with a different depreciation and pricing treatment.
2. **Make visit cadence a market/plan attribute, not a constant.** Berlin: 2–3 weeks. Dubai: weekly (mid/large)
   or monthly (small), matching Plntd's own tiering.
3. **Sell rotation as quarterly (4×/yr), max.** Bimonthly is the upper bound anyone in the trade offers
   (Botanical Designs). Do not promise monthly.
4. **Build the rotation around three all-weather species** (Phalaenopsis, Bromeliad, Anthurium) so one calendar
   ships in both markets, and treat poinsettia/cyclamen/bulbs as Berlin-only seasonal upgrades.
5. **Ship a `pet_safe` boolean and a `child_safe` flag on day one**, backed by per-species ASPCA URLs, and
   verify each one individually — the bulk list is not reliable enough to ship from.
6. **Hard-exclude Ficus benjamina, Dieffenbachia, Sago palm, Azalea, Hydrangea, Croton, Alocasia** from the MVP
   catalog. Add Calathea/ferns as small home-only SKUs with an explicit humidity warning, or not at all.
7. **Adopt hydroculture / sub-irrigated planters for the foliage base in Berlin.** It is what makes the 2–3
   week interval work and is what German buyers already expect.

---

## 8. Open questions this lens could not close

1. Per-species Royal FloraHolland / Floradania price index — members-only; no per-unit wholesale price for
   poinsettia, cyclamen, Phalaenopsis or the foliage staples was obtainable.
2. Actual landed cost per plant for a small buyer in Berlin (Blumengroßmarkt Berlin, minimum order quantities,
   whether a one-person company can even buy at trade).
3. Actual per-plant rental rate in Dubai — every vendor quotes packages or "on request"; the AED 45–60/plant
   figure is my derivation, not a published number.
4. Whether a B2C plant-rental price point clears in either city — no consumer rental competitor was found in
   Germany at all, and UAE consumer rental starts at AED 299/mo (MyDubaiPlants), which is high for a home.
5. Refurbishment economics: what fraction of returned foliage plants can be re-rented, and after how long in a
   holding greenhouse. Plantclub's "circular care system" implies they do this but publish nothing.
6. Berlin-specific winter indoor lux measurements for typical apartments/offices.
7. Poinsettia and cyclamen per-unit wholesale prices (volumes known, prices not).

---

## Sources

Trade / statistics
- BMEL-Statistik, Anbau von Zierpflanzen (survey Jul 2024–Jun 2025): https://www.bmel-statistik.de/landwirtschaft/gartenbau/zierpflanzen
- Destatis, Advent und Weihnachten (poinsettia production, 2025): https://www.destatis.de/DE/Themen/Querschnitt/Weihnachten/Advent/_inhalt.html
- Destatis press release PD25_417_41213, ornamental businesses 2025: https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/11/PD25_417_41213.html
- Royal FloraHolland 2025 results (2026-03-27): https://www.royalfloraholland.com/en/news-2026/week-13/royal-floraholland-succesvol-2025-productomzet-groeit-naar-5-4-miljard-euro
- Royal FloraHolland auction developments 2025/2026 (2026-01-12): https://www.royalfloraholland.com/en/news-2026/week-3/auction-developments-2025-2026
- Theia, RFH €5.4bn (2026-04-01): https://www.theia.global/article/royal-floraholland-achieves-54-billion-revenue-in-2025-amid-cost-control-measures-ff7dc78a
- FloralDaily, June 2025 auction avg €0.36/unit (2025-07-14): https://www.floraldaily.com/article/9750006/more-trade-less-turnover-in-june-2025-at-floraholland/

Seasonal rotation practice
- Botanical Designs, colour rotations (bimonthly/quarterly): https://botanicaldesigns.com/color-rotations/
- Anvilfield seasonal colour field guide (2026-06-28): https://anvilfield.com/field-guides/landscaping/seasonal-color-annual-rotation/
- Merkblatt Wechselflor (2023): https://oeffentlichebeschaffung.kompass-nachhaltigkeit.ch/fileadmin/kundendaten/produkte-labels/Gruenraum/Merkblatt_Wechselflor.pdf
- Plantscapes interior colour: https://plantscapes.com/services/interior/interior-color/ (503 at fetch time)

Care intervals / hydroculture / light
- gruen-im-buero.de Pflanzenservice ("alle 2–3 Wochen"): https://gruen-im-buero.de/leistungen/pflanzenservice
- p2objektgruen Hydro care sheet (2020): https://p2objektgruen.de/wp-content/uploads/2020/03/Pflegeanleitung-Hydropflanzen.pdf
- Ideal Pflanzen Service: https://idealpflanzenservice.de
- Mobilane, light for interior planting (500–1,000 lux): https://mobilane.com/en/news/the-importance-of-light-for-interior-planting/
- Ricoman, EN 12464-1 office lux (2025-06-30): https://ricoman.com/news/office-lighting-lux-levels/

Species suitability / hazards
- Acacia Garden Center, best indoor plants for Dubai offices (2026-06-01): https://acaciagardencenter.com/blogs/care-library/indoor-plants-dubai-offices
- Acacia, low-light plants for AC rooms (2026-04-12): https://acaciagardencenter.com/blogs/blog/low-light-plants-air-conditioning-dubai
- RHS, indoor azaleas: https://www.rhs.org.uk/plants/rhododendron/indoor-azaleas
- LeafyPixels, Ficus benjamina problems (2026-06-16): https://leafypixels.com/plants/ficus-benjamina/problems/
- LeafyPixels, Ficus benjamina spider mites (2026-06-16): https://leafypixels.com/plants/ficus-benjamina/spider-mites/
- Introgreen, Ficus pests: https://introgreen.eu/plant-advice/ficus/pests

Toxicity
- ASPCA cats plant list: https://www.aspca.org/pet-care/animal-poison-control/cats-plant-list
- ASPCA Peace Lily (toxic): https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/peace-lily
- ASPCA Kentia Palm (non-toxic): https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/kentia-palm
- ASPCA Areca Palm (non-toxic): https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/areca-palm

Prices — Europe
- FlorAccess Ficus category (trade prices, GBP): https://www.floraccess.com/en/category/900/ficus/
- 123zimmerpflanzen Ficus lyrata (retail EUR): https://www.123zimmerpflanzen.de/ficus-lyrata.html
- Nieuwkoop Europe (prices login-gated): https://www.nieuwkoop-europe.com/en/plants
- Airy.green Mietpflanzen costs (2025-04-23, €14.50/plant/mo): https://airy.green/blogs/air-up-your-life/mietpflanzen-buero-kosten-vorteile-steuer
- Plantclub Berlin pricing: https://plantclub.io/de/preise
- WELO Green (2025-09-24): https://welo-green.de/blogs/journal/bueropflanzen-mieten-flexible-raumbegruenung-mit-service-und-garantie

Prices — UAE
- Emirates247, Warsan Nursery prices (2026-05-13): https://www.emirates247.com/uae/dubai-municipalitys-warsan-nursery-sells-plants-from-50-fils-heres-what-you-can-buy/1573
- Plantsworld.ae indoor plants: https://plantsworld.ae/collections/indoor-plants
- Plantsworld.ae office rental collection (24-species list): https://plantsworld.ae/collections/office-plant-rental
- Plantsworld.ae maintenance: https://plantsworld.ae/pages/plant-maintanence
- Plntd.ae office maintenance (tier pricing): https://plntd.ae/pages/office-maintenance
- 800petals office plant rental Dubai: https://800petals.com/office-plant-rental-dubai/
- MyDubaiPlants plant rental: https://mydubaiplants.com/plant-rental
- Plantscapes.ae rentals: https://plantscapes.ae/rentals/
- Hadiqat Group (B2B wholesale): https://www.hadiqatgroup.ae
- Green Glades Warsan nursery: https://greenglades.ae/plant-nursery-dubai.html
- Dutch Plants UAE (Warsan 3): https://dutchplantsuae.com/?page_id=307
- Gardenya wholesale: https://gardenya.ae/plants-wholesale/
- Intraflora Nursery: https://intrafloranursery.ae
