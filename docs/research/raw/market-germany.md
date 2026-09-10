# Planty — Market Deep-Dive: Germany / Berlin

Research date: 2026-09-10. Lens: Berlin/Germany as launch market.
Convention: every number carries a year and a source URL. "R" = reported by source, "E" = my own estimate/derivation.

---

## 1. Headline judgement (stated up front, evidence below)

Berlin is a **real but already-served B2B market** and a **weak B2C market**. The office plant rental category ("Pflanzenmiete", "Bürobegrünung") is a mature, decades-old German trade with an established price grammar (€7–€23 per planter per month net, 12–36 month terms, 4-week service cadence). A venture-funded, design-led competitor (Plantclub) already occupies the exact "modern startup office, subscription, app-ish" positioning Planty describes, in Berlin, since 2020.

The consumer half of Planty's thesis is contradicted by German category spend data: the average German resident spent **under €6 in the whole of 2025** on green houseplants (R). Planty's B2C pitch asks that same person to spend more per *month* than they currently spend per *year*.

Two elements of Planty's spec are actively mispriced for Germany: **weekly technician visits** (the German norm is every 4 weeks; weekly is ~4x the labour) and **seasonal rotation** (adds reverse logistics, holding space and winter frost risk that incumbents avoid by not doing it).

---

## 2. Competitive landscape — Berlin B2B, with real EUR pricing

### 2.1 Plantclub (the direct competitor)

The closest thing to "Planty for Berlin offices" already exists and is funded and scaled.

Published tiers, all **excl. VAT, billed yearly, 12-month minimum term** (R, 2026):

| Plan | €/month | Office size |
|---|---|---|
| Greenhouse | €200 | up to 150 m² |
| Woodland | €400 | up to 500 m² |
| Jungle | €600 | up to 1,000 m² |
| Rainforest | custom | 1,000+ m² |

Source: https://plantclub.io/de/preise (2026)

Included across all tiers (R): "Full ongoing care for all plants", "Free plant replacements, no redesign fees", "Dedicated account manager", "Delivery & installation".

Berlin-specific (R, 2026, https://plantclub.io/de/pflanzen-mieten-berlin):
- Care visits **"every two weeks"** — watering, fertilisation, pruning, replacement.
- **"150+ Berlin members"**, "5.0★ average client rating".
- Operating **since 2020**.
- Named clients include **Figma, Netflix, GetYourGuide**.
- Covers 8 Berlin districts explicitly: Mitte, Kreuzberg, Prenzlauer Berg, Friedrichshain, Charlottenburg, Schöneberg, Neukölln, Wedding.
- Multi-city: Berlin, Hamburg, Cologne, Düsseldorf, Frankfurt, Munich, Vienna.

FAQ confirms scope is **offices only, not residential** (R, https://plantclub.io/de/faq, 2026).

**Read:** Plantclub is Planty's B2B MVP, already built, already at 150+ Berlin accounts, already multi-city. A solo technical founder entering Berlin B2B is entering *behind* a 6-year-old incumbent with Figma and Netflix as logos.

### 2.2 Gärtner Gregg — the clearest per-unit price grammar

Per-planter monthly rates, **net, excl. VAT and excl. delivery/care fees** (R, https://www.gaertner-gregg.de/pflanzenmiete-oder-leasing/, accessed 2026):

- 40 cm plant dish: **"Ab 6,90 €"**/month
- Wheeled floor planters: **"Ab 10,50 €"** to **"Ab 12,50 €"**/month
- Sideboard vessels: **"Ab 13,50 €"**/month
- Room dividers (large format): **"Ab 22,90 €"**/month

Terms (R): standard **12 months**; care visits **"Regelmäßig (etwa alle vier Wochen)"** — approximately every 4 weeks; replacement free: *"Unansehnliche oder kranke Pflanzen tauschen wir selbstverständlich kostenlos aus."*

This is the reference price band the whole German trade sits in: **~€7–€23 per planter per month net**.

### 2.3 P2 Objekt Grün (Berlin, Charlottenburg)

R, https://p2objektgruen.de/pflanzen-kaufen-mieten/ (2026):
- **"Die Mindestlaufzeit beträgt 36 Monate"** — 36-month minimum term.
- Minimum **5 plants** per rental package.
- Minimum **€2,000 net asset value**.
- "Vollpflege" included; price calculated individually off the value of the greenery.
- Berlin and surrounding area. Offices only, no private customers.

**Read:** the traditional Berlin incumbent gates at 36 months and €2,000 asset value. That is a very high commitment bar — and it is the gap Plantclub already exploited with 12 months.

### 2.4 WELO Green

R, https://welo-green.de/blogs/journal/pflanzen-mieten-kosten (2026): **"Pflanzenvermietung ab 199,-€ pro Monat"**, **"12 Monaten Mindestlaufzeit"**, thereafter month-to-month. Includes consultation with on-site visit and visualisation, delivery and planting, regular care, and **"Pflanzengarantie – bei Ausfällen wird kostenlos ersetzt"**.

Note the convergence: WELO €199/month entry, Plantclub €200/month entry, airy.green cites "from approx. €200/month including concept and care" for up to 150 m² (R, https://airy.green/en/blogs/air-up-your-life/mietpflanzen-buero-kosten-vorteile-steuer). **~€200/month is the hard floor price for a serviced office greenery contract in Germany.** Planty cannot enter meaningfully below this without breaking the labour maths (§5).

Per-plant benchmark from the same airy.green page (R): individual hydroculture plants **"approx. €14.50/month"**.

### 2.5 Care-only pricing — the single best unit-economics datapoint found

Büropflanzen Pflege Berlin publishes actual maintenance-only packages (R, https://bueropflanzen-pflege.de/preise/, 2026):

- Up to **30 medium plants: "299 € zzgl. MwSt."** per month
- Up to **50 medium plants: "349€ zzgl. MwSt."** per month
- Cadence: 2-week intervals, stated as **"2-3 Besuche pro Monat (2,1666 Besuche pro Monat)"**
- Stated service+travel time: **~70 minutes per visit**
- Service area: Charlottenburg-Wilmersdorf and Spandau, Olympic Stadium + 10 km radius; surcharges possible for travel distance.

**E (derived):** 299 € ÷ 2.1666 visits = **~€138 revenue per visit** for ~70 minutes of tech time including travel. That is ~€118/hour of gross service revenue — which has to cover the technician, travel, vehicle, plants and overhead. And note this is **care only, no plant rental capital** in it. It also tells you the incumbent thinks 30 plants is ~70 minutes of work.

### 2.6 Other Berlin / German players (no public pricing)

- **Mr. Monstera** (Berlin + Potsdam) — rental + care + plant "Krankenstation"; explicitly travels **only by public transport**; pricing individual (R, https://mr-monstera.de/, 2026).
- **Plant Circle** (Berlin, HRB 252282 B) — B2B bespoke plants; no public pricing (R, https://business.plantcircle.com/blog/office-plant-rental-vs-buying-which-is-right-for-your-berlin-workspace).
- **Mohr Hydrokultur** — "feste monatliche Preise", B2B only, no EUR published (R, https://www.mohr-hydro.de/mietpflanzen).
- **OfficeFlorist**, **hydroflora** (50+ years), **Pflanzen-Kölle**, **akzente raumbegrünung**, **Kinnula Hydrokulturen**, **as-hydroplant**, **Rogel/hydrokultur.de**, **Späth'sche Baumschulen** — all established, all B2B, all quote-on-request.

**Read:** the market is crowded but **opaque**. Almost nobody publishes prices. Plantclub's transparent tiers are its main differentiator, and that differentiator is taken.

### 2.7 A competitor openly arguing against the rental model

Plant Circle's own B2B blog states that buying **"is almost always the more economical choice"** over a 3-year horizon versus renting (R, https://business.plantcircle.com/blog/office-plant-rental-vs-buying-which-is-right-for-your-berlin-workspace). A competitor conceding this in public is a strong signal that German office buyers do run the rent-vs-buy maths and that rental sells on convenience/OpEx-treatment, not on cost.

### 2.8 Adjacent, much better margins: event rental

Systemgrün's published 2025 event price list (R, excl. VAT, pots included, https://www.eventbegruenung.com/mietpflanzen-fuer-events/preisliste/) — prices are for **"eine Verleihdauer bis zu 10 Tagen"**:
- Bamboo 120–400 cm: **€45–€175**
- Kentia palm 160–200 cm: **€65–€85**
- Fan palm 160–300 cm: **€85–€245**
- Eucalyptus 180 cm: **€85**; Laurel ball 200 cm: **€95**

**E:** a Kentia at €65–85 for ≤10 days versus ~€14.50/month on a 12-month office contract is roughly **20–35x the daily yield**. Event/short-term greening is where German plant rental actually makes money. Miet24 lists 152 plants rentable "ab 10 € pro Tag" (R, https://marktplatz.miet24.de/mieten/events-und-messen/pflanzen).

---

## 3. Consumer (B2C) demand — the evidence is bad

### 3.1 Category spend is small and shrinking

Zentralverband Gartenbau (ZVG), reported January 2026 for full-year 2025 (R, https://www.derdeutschegartenbau.de/2026/01/26/blumen-und-zierpflanzen-anhaltende-kaufzurueckhaltung-belastet-den-markt/):

- Total flowers + ornamental plants market Germany 2025: **€8.5 bn** at retail (down from **€8.7 bn** in 2024).
- Houseplants (Zimmerpflanzen) 2025: **"Insgesamt kamen 1,4 Mrd. Euro als Marktvolumen zusammen, was einem Minus von 4,5 % zum Jahr 2024 entspricht"** — €1.4 bn, **−4.5% vs 2024**.
- Per-capita 2025: flowering houseplants **~€11/year**; **green houseplants under €6/year**.
- Overall per-capita spend fell by more than €2 to **~€102/year** (2025).
- ZVG frames this as **structural**, not a blip: consumer uncertainty and reduced purchasing power.

For 2024 comparison (R, statista/ZVG reporting): green houseplants **~€7/capita**, flowering **~€12/capita**, total **~€107/capita**.

**This is the single most damaging number for Planty B2C in Germany.** A green-houseplant subscription at even €25/month is €300/year — **50x** the current average annual green-houseplant spend. Planty B2C is not competing for share of a category; it is trying to create a spend line that does not exist.

### 3.2 The substitute is extremely cheap

IKEA Deutschland Bodenpflanzen (large floor plants), price range **€6.99–€49.99** (R, https://www.ikea.com/de/de/cat/bodenpflanzen-700524/, 2026):
- MONSTERA 21 cm: **€14.99**
- DRACAENA MARGINATA 19 cm (2 stems): **€14.99**
- FICUS MICROCARPA 19 cm: **€9.99**
- STRELITZIA 19 cm: **€19.99**
- DYPSIS LUTESCENS (Areca palm) 24 cm: **€24.99**
- FICUS ELASTICA ROBUSTA 27 cm: **€34.99**
- HOWEA FORSTERIANA (Kentia) 24 cm: **€49.99**

**E:** a Berlin consumer can buy the exact plant Planty would rent for €14.99. At any plausible rental price (€8–15/plant/month), **the buy option pays back in 1–2 months.** The only thing Planty sells on top is maintenance and replacement — and see §5, the maintenance visit alone costs more than the plant.

### 3.3 Berlin household structure — cuts both ways

Amt für Statistik Berlin-Brandenburg (R):
- **2,231,314 private households** in Berlin at 31.12.2025 (https://www.statistik-berlin-brandenburg.de/186-2025/).
- **56.8% one-person households** (2025); 2-person 24.2%. Average household size **1.76 persons**.
- 2.22 m households at 31.12.2024.
- Among one-person households in rented flats: **26% occupy only one room, 49% two rooms, 25% more than two** (R, https://www.statistik-berlin-brandenburg.de/184-2023/).

**Read:** Berlin is overwhelmingly small rented flats. Positive for "renters who move often, don't want to own bulky plants". Strongly negative for the **"villas / large homes"** add-on tier in Planty's spec — that segment barely exists in Berlin. A technician visiting 2.2 m one-person households is also a scheduling nightmare: nobody is home during working hours, unlike an office with a reception desk.

### 3.4 Free-plant culture is a live competitor

Berlin has an active, organised plant-swap ("Pflanzentauschbörse") culture — Hansabibliothek runs one 13 Apr–5 Jul 2026; Garten der Begegnung (Marzahn-Hellersdorf) runs a permanent fence-based swap with no fixed hours; there are city seed exchanges and free swap platforms (R, https://www.berlin.de/ba-marzahn-hellersdorf/aktuelles/pressemitteilungen/2021/pressemitteilung.1076447.php, https://www.gratis-in-berlin.de/15-leute-treffen/2080669-hof-flohmarkt-mit-pflanzentauschboerse, https://www.tausende-gaerten.de/termine/bunte-saatgutboerse-in-berlin-pflanzensamen-und-wissen-tauschen/, https://www.tauschgnom.de/verschiedenes/pflanzen/172). Kleinanzeigen has a dedicated Berlin plant-swap category.

**Read (anecdotal but consistent):** the Berlin plant-enthusiast segment — Planty's most obvious B2C persona — has a strong norm of getting plants **free** via cuttings and swaps. This is the *worst* possible customer for a rental subscription.

### 3.5 A German B2C plant-subscription that already failed

"The Plant Box" (Berlin) — pre-planted balcony sets, "as simple as ordering pizza" (R, https://www.myhomebook.de/news/the-plant-box-insolvent):
- Founded **2020**; insolvency filed **28 July 2023** at Amtsgericht Berlin-Charlottenburg.
- Had raised **€150,000** from Judith Williams and Carsten Maschmeyer on *Die Höhle der Löwen* in **April 2022**.
- Revenue of nearly **€1 m in 2022**.
- Founder's stated causes: rising energy prices, higher purchasing costs **"could only be partially passed on to customers"**, consumers cutting non-essential spend, handmade production keeping prices high.
- **"Profit margins fell below 50 percent"** — and that was fatal.

**Read:** a Berlin B2C plant-subscription with TV exposure, €150k funding and ~€1 m revenue died in 3 years because sub-50% gross margin could not carry logistics. Planty's model is *more* logistics-heavy (delivery + install + recurring visits + reverse logistics + holding space), so it needs *better* margins than the model that failed.

Broader context: deutsche-startups.de maintains a running list of failed German Abo-Commerce concepts (https://www.deutsche-startups.de/2015/11/25/25-abo-commerce-die-leider-gescheitert-sind/).

---

## 4. Berlin office market context — the B2B TAM is softening

JLL Berlin office market, Q1 2026 (R, https://www.jll.com/de-de/insights/market-dynamics/berlin-office):
- **Vacancy rate 8.4%** in Q1 2026, up from 8.2% in Q4 2025 and **7.7% a year earlier**.
- More than **1.94 m m²** of office space immediately available.
- Take-up Q1 2026: **148,100 m²**, **+43% vs Q1 2025**.
- Prime rent **€47.50/m²/month** (Q1 2026), up €0.50 from €46.00 a year earlier.
- Driver cited: home office permanently established post-Covid reducing space demand, weak economy.

Coworking: **235 coworking spaces listed in Berlin in 2026** (R, https://www.betahaus.com/magazine/the-complete-guide-to-coworking-spaces-in-berlin-2026-edition); another source says "over 200".

**Read:** rising vacancy is a two-sided signal. Negative: fewer occupied desks, and greenery is a discretionary facilities line that gets cut first in a weak economy (exactly what ZVG reports on the consumer side). Positive: landlords with 1.94 m m² of empty space have a real incentive to *stage* offices attractively, and take-up rebounding +43% means fit-outs are happening. The 235 coworking spaces are the single most concentrated, most reachable B2B beachhead in Berlin — high plant density per m², a facilities manager who buys centrally, and a brand incentive to look green.

---

## 5. Unit economics reality check for Germany (labour is the killer)

**Labour costs (R):**
- Statutory minimum wage **2026: €13.90/hour**, up from €12.82; planned **€14.60 in 2027** (https://www.informationsportal.de/mindestlohn-2026-minijob/, https://www.bundesregierung.de/breg-de/aktuelles/mindestlohn-faq-1688186).
- Minijob earnings ceiling **2026: €603/month**, up from €556 — about **43 hours/month** at minimum wage (https://www.deutsche-rentenversicherung.de/BadenWuerttemberg/DE/Presse/Pressemitteilungen/2025/251222_Minijob.html).
- Average **gardener (Gärtner) pay in Berlin: €17.15/hour** (R, Indeed, https://de.indeed.com/career/g%C3%A4rtner/salaries/Berlin, 2025/26).
- P2 Objekt Grün is actively hiring "mobile Gärtner (m/w/d) im Außendienst" for office greenery maintenance in Berlin (R, job listings) — i.e. this is a paid, skilled, employed role in the incumbent model, not a gig.

**E — why Planty's weekly cadence breaks:**
The German trade standard is **every 4 weeks** (Gärtner Gregg, Pflanzen-Kölle) or **every 2 weeks** at the premium end (Plantclub, Büropflanzen Pflege Berlin). Planty's spec says **weekly**.

Take a B2C household with 5 plants. At Gärtner Gregg's per-planter band that is ~€35–60/month of rental value. A single technician visit in Berlin realistically costs 30 min on site + 30 min travel = 1 hour. At €17.15/hour plus employer social contributions (E: ~+21%, so ~€20.75/hour fully loaded), **one visit ≈ €21 in labour alone**, before vehicle, plants, or overhead.

- Weekly (4.33 visits/month): **~€90/month of labour** against ~€35–60 of rental revenue. **Structurally loss-making.**
- Monthly (1 visit): **~€21/month labour** against ~€35–60 revenue — thin but arguable.

Compare with the incumbent benchmark: Büropflanzen Pflege Berlin gets **~€138 per visit** by servicing **30 plants in one stop**. The entire German model depends on **plant density per stop**. A B2C flat with 5 plants can never reach that density. **This is the central economic argument against Planty B2C in Germany, and it is independent of willingness to pay.**

**Holding / greenhouse space (R):** Berlin average **Lagerhalle €6.00/m²/month**; office €14.00/m²/month; retail/gastronomy €26.00/m²/month (2026, https://www.miete-aktuell.de/gewerbepreise/Berlin/Berlin/). **E:** a plain Lagerhalle is *not* a plant-holding space — tropical stock needs heat and light through a Berlin winter, so budget heated greenhouse or accept high attrition on rotated-out stock. Seasonal rotation as specced requires exactly this asset from day one.

---

## 6. Regulatory basics

### 6.1 VAT — a genuinely material and underappreciated question

**§12 Abs. 2 Nr. 2 UStG** (R, https://www.gesetze-im-internet.de/ustg_1980/__12.html) reduces the rate to **7%** for:

> "die Vermietung der in Anlage 2 bezeichneten Gegenstände mit Ausnahme der in der Nummer 49 Buchstabe f, den Nummern 53 und 54 bezeichneten Gegenstände"

Living plants are listed in **Anlage 2 Nrn. 6–9** (R, https://www.gesetze-im-internet.de/ustg_1980/anlage_2.html; IHK München BMF guidance, https://www.ihk-muenchen.de/ihk/documents/Recht-Steuern/Steuerrecht/BMF-ermaessigter-Steuersatz.pdf). Plant *deliveries* are normally 7%.

**The catch:** German practice treats plant supply bundled with services as a single supply taxed at 19% when they form an "einheitliche Leistung". The direct analogue is landscaping: plant delivery alone is 7%, garden construction work is 19%, and **if delivery and works form one unified complex service the whole thing is 19%** (R, https://de.ecovis.com/agrar/steuersatz-pflanzenlieferungen-gartenanlage/; BFH case reported at https://datenbank.nwb.de/Dokument/561714/).

**Why it matters commercially:** for B2B this is neutral (Vorsteuerabzug — business customers reclaim it, and rental payments are deductible Betriebsausgaben, R https://airy.green/en/blogs/air-up-your-life/mietpflanzen-buero-kosten-vorteile-steuer). For **B2C it is a direct 12-point margin or price difference**, because consumers pay gross. A €30 net offer is €32.10 gross at 7% but €35.70 at 19%.

**Open question for a Steuerberater:** can Planty separate the plant rental (7%) from the care service (19%) on the invoice, or does bundling force 19% on everything? I could not find a decided case on plant rental + care specifically. **Do not build pricing on the 7% assumption without written advice.**

Related: **Kleinunternehmerregelung §19 UStG** — from 2025, prior-year turnover ≤ **€25,000** and current year ≤ **€100,000** (R, https://sevdesk.de/ratgeber/gruenden/selbstaendigkeit-anmelden/gewerbe/gewerbe-anmelden-in-berlin/). Useful for a pilot: it removes VAT from invoices entirely, which is a *pricing advantage against consumers* and a disadvantage against businesses.

### 6.2 Consumer subscription law (B2C only)

- **Kündigungsbutton, §312k BGB**, mandatory since **1 July 2022** for paid continuing obligations (Dauerschuldverhältnisse) concluded online with consumers (R, https://www.gesetze-im-internet.de/bgb/__312k.html). The button must read **"Verträge hier kündigen"** and lead to a confirmation button **"Jetzt kündigen"**; it must be permanently visible and directly accessible **without requiring the consumer to log in** (R, https://www.e-recht24.de/ecommerce/13090-wann-der-kuendigungsbutton-pflicht-ist.html). Law firms describe an active **Abmahnwelle** (warning-letter wave) over non-compliance (R, https://www.avocado.de/aktuelles/blog/eintrag-naechste-abmahnwelle-rollt-der-kuendigungsbutton-312k-bgb-muss-bei-dauerschuldverhaeltnissen-im-o/); BGH case law now exists (R, https://www.noerr.com/de/insights/kuendigungsbutton-im-onlinevertrieb-neue-rechtsprechung-des-bgh).
  **Concrete MVP requirement:** a logged-out cancellation page. This is a Next.js route, not a hard problem — but it must exist at launch.
- **Gesetz für faire Verbraucherverträge (2022)** background: consumer contracts auto-renew month-to-month with max **1-month notice** after the initial term, and initial terms are capped at 24 months. So Planty's B2C cannot copy P2 Objekt Grün's 36-month term.
- **Widerrufsrecht:** 14 days from contract conclusion for distance contracts, **§355 Abs. 2 BGB** (R, https://www.gesetze-im-internet.de/bgb/__355.html). Period does not start until the consumer has been correctly informed. For services, the right can lapse early once fully performed (§356 Abs. 4 BGB) (R, https://www.it-recht-kanzlei.de/dienstleistung-widerrufsrecht-verbraucher.html).
  **Concrete ops risk:** a customer can order, receive delivery and installation, then withdraw within 14 days. Planty eats the delivery, install and collection cost. Budget for it.
- **Impressum** (§5 DDG/TMG) and GDPR/DSGVO privacy notice are mandatory on the site. Address data for delivery is straightforward processing under Art. 6(1)(b).

### 6.3 Business setup

Gewerbeanmeldung Berlin: **€15 online**, **€26 in person**; €31 for legal persons with one representative, +€13 per additional representative (R, https://qonto.com/de/blog/unternehmensgruendung/einzelunternehmen/gewerbe-anmelden-berlin, https://www.wermachtwas.online/gewerbeanmeldung-berlin, 2025/26). Online via https://www.berlin.de/ea/. Trivially cheap — not a barrier.

---

## 7. Seasonality and the winter problem

Berlin climate (DWD reference data via R):
- January is the coldest month, mean **+1.0 °C** in the 1991–2020 reference period, up from **−0.5 °C** in 1961–1990 (R, https://www.berlin.de/umweltatlas/klima/entwicklung-von-klimaparametern/2022/ergebnisse-der-historischen-auswertung/).
- Winter (Dec–Feb) mean **~2.6 °C**; January daily highs often **−2 to +3 °C**; regular frost nights **−5 to −10 °C**, first frosts from **mid-November** (R, https://klimatabelle.com/ziel/berlin/klima/, https://www.beste-reisezeit.org/pages/europa/deutschland/berlin.php).

Trade practice for moving tropical houseplants in German winter (R):
- Cold-sensitive houseplants are packed with heatpacks for transport down to **−5 °C** (https://www.griessmeyer-bromelien.de/versand-shipping/).
- Heatpacks activate on air contact and last **up to 48 hours** in an insulated/styrofoam box (https://www.garnelio.de/heatpack-sicherer-tier-und-pflanzenversand).
- Explicit warning that heatpacks carry **"high probability that plants may suffer damage from overheating"** (https://plantaddiction.de/pflegetipps-inspiration/pflanzenversand-im-winter).
- Cold damage presents as mushy, browning leaves, usually on individual leaves only (https://plnts.com/de/blog/how-we-transport-our-plants-in-cold-winter-weather).

**Read:** roughly **November–March (5 months, ~40% of the year)** every delivery, swap and seasonal rotation in Berlin carries frost risk on the pavement-to-door leg and in an unheated van. This is a direct argument against Planty's **seasonal rotation** feature in Germany: rotation forces plant movement in exactly the season when movement is riskiest, and the plants you rotate out need a **heated** holding space (§5). Incumbents avoid this by simply not rotating — they replace individual plants reactively under the Pflanzengarantie.

Demand seasonality: ZVG's 2025 data shows the whole category under pressure; garden plants fell over 1% to €4.1 bn in 2025 (R, same ZVG source). German plant buying peaks in spring (Mar–May); a Berlin launch in Q4 would hit the seasonal trough *and* the frost window simultaneously.

---

## 8. What this means for Planty (Germany-specific)

1. **B2C in Germany is not viable as specced.** €6/capita/year on green houseplants (2025), IKEA plants at €9.99–€49.99, an active free plant-swap culture, and a per-visit labour cost (~€21) that exceeds the monthly rental value of a small flat's worth of plants. The Plant Box's 2023 insolvency is the empirical version of this argument.
2. **Weekly visits must become every 2–4 weeks.** Every German incumbent runs 2-week (premium) or 4-week (standard) cadence. Weekly is ~2–4x the labour for no observed willingness to pay.
3. **The B2B entry price is fixed at ~€200/month** by three independent sources converging (Plantclub €200, WELO €199, airy.green ~€200). Planty cannot undercut this materially and still pay a Berlin gardener €17.15/hour.
4. **B2B Berlin is occupied.** Plantclub has the exact positioning, 150+ Berlin accounts, Figma/Netflix logos, 7 cities, since 2020, with transparent pricing. Differentiation must be something other than "modern plant subscription with an app".
5. **Density per stop is the whole business.** €138/visit at 30 plants vs ~€21 labour/visit. Any Planty route model must optimise plants-per-stop, which pushes hard toward offices and coworking, and hard against scattered flats.
6. **Drop "villas".** 56.8% of Berlin households are one-person, and one-person renters mostly occupy 1–2 rooms. The large-home tier is Gulf-market language that does not map to Berlin.
7. **Two Germany-specific MVP requirements if B2C ships at all:** a logged-out §312k cancellation page ("Verträge hier kündigen" → "Jetzt kündigen"), and 14-day Widerrufsrecht handling with the cost of a post-install withdrawal budgeted.
8. **Get the VAT answer in writing before pricing.** 7% (rental of Anlage 2 goods) vs 19% (bundled einheitliche Leistung) is a 12-point swing that only bites in B2C.
9. **If Germany is chosen anyway, the least-bad wedge is coworking + event/short-term greening**: 235 Berlin coworking spaces, high plant density per stop, central facilities buyer; plus event rental where a Kentia yields €65–85 for ≤10 days vs €14.50/month on contract.
10. **Launch timing:** avoid a Nov–Mar launch. Frost window plus seasonal demand trough.

---

## 9. Open questions I could not resolve

- Plantclub's actual plant counts per tier and its churn/retention — not published; would determine whether €200/150 m² is profitable.
- Whether any German provider does true **B2C home** plant rental at scale. I found none; Gärtner Gregg mentions individual solutions for private customers but publishes no B2C offer. This may be a genuine gap — or a graveyard.
- BuGG Marktreport Gebäudegrün 2025 Innenraumbegrünung figures — the PDF (https://www.gebaeudegruen.info/wp-content/uploads/2025/12/BUG_Marktreport_2025_20251127_FINAL_low.pdf) would not parse. Worth a manual read for German indoor-greening market size.
- No decided German tax case found on **plant rental + care bundled** — 7% vs 19% remains genuinely open.
- Berlin heated greenhouse / Gewächshaus rental cost — I only found generic Lagerhalle rates (€6/m²/month), which understate the real requirement.
- Reddit/forum first-hand consumer sentiment on German plant rental — search budget exhausted before I found primary threads. Flagged as a gap, not as absence of evidence.

---

## Sources

Competitors and pricing
- https://plantclub.io/de/preise (2026)
- https://plantclub.io/de/pflanzen-mieten-berlin (2026)
- https://plantclub.io/de/faq (2026)
- https://www.gaertner-gregg.de/pflanzenmiete-oder-leasing/ (2026)
- https://bueropflanzen-pflege.de/preise/ (2026)
- https://p2objektgruen.de/pflanzen-kaufen-mieten/ (2026)
- https://welo-green.de/blogs/journal/pflanzen-mieten-kosten (2026)
- https://airy.green/en/blogs/air-up-your-life/mietpflanzen-buero-kosten-vorteile-steuer
- https://mr-monstera.de/ (2026)
- https://www.mohr-hydro.de/mietpflanzen
- https://business.plantcircle.com/blog/office-plant-rental-vs-buying-which-is-right-for-your-berlin-workspace
- https://www.officeonair.de/buero-pflanzenmiete/
- https://www.eventbegruenung.com/mietpflanzen-fuer-events/preisliste/ (2025)
- https://marktplatz.miet24.de/mieten/events-und-messen/pflanzen
- https://www.hydroflora.de/produkte/buerobegruenung/
- https://officeflorist.de/dienstleistungen
- https://www.pflanzen-koelle.de/filialen/gaertnerservice/innenraumbegruenung/pflanzen-mieten/

Market size / consumer demand
- https://www.derdeutschegartenbau.de/2026/01/26/blumen-und-zierpflanzen-anhaltende-kaufzurueckhaltung-belastet-den-markt/ (ZVG, 2025 data, published Jan 2026)
- https://lebensmittelpraxis.de/handel-aktuell/44094-zierpflanzenbranche-2024-blumenmarkt-trotzt-wirtschaftlichen-herausforderungen.html (2024)
- https://www.ikea.com/de/de/cat/bodenpflanzen-700524/ (2026)
- https://www.myhomebook.de/news/the-plant-box-insolvent (2023)
- https://www.deutsche-startups.de/2015/11/25/25-abo-commerce-die-leider-gescheitert-sind/

Berlin office & household context
- https://www.jll.com/de-de/insights/market-dynamics/berlin-office (Q1 2026)
- https://www.betahaus.com/magazine/the-complete-guide-to-coworking-spaces-in-berlin-2026-edition (2026)
- https://www.statistik-berlin-brandenburg.de/186-2025/ (2025)
- https://www.statistik-berlin-brandenburg.de/184-2023/
- https://www.miete-aktuell.de/gewerbepreise/Berlin/Berlin/ (2026)

Labour & regulation
- https://www.informationsportal.de/mindestlohn-2026-minijob/ (2026)
- https://www.deutsche-rentenversicherung.de/BadenWuerttemberg/DE/Presse/Pressemitteilungen/2025/251222_Minijob.html (2026)
- https://www.bundesregierung.de/breg-de/aktuelles/mindestlohn-faq-1688186
- https://de.indeed.com/career/g%C3%A4rtner/salaries/Berlin
- https://www.gesetze-im-internet.de/ustg_1980/__12.html
- https://www.gesetze-im-internet.de/ustg_1980/anlage_2.html
- https://de.ecovis.com/agrar/steuersatz-pflanzenlieferungen-gartenanlage/
- https://www.ihk-muenchen.de/ihk/documents/Recht-Steuern/Steuerrecht/BMF-ermaessigter-Steuersatz.pdf
- https://www.gesetze-im-internet.de/bgb/__312k.html
- https://www.e-recht24.de/ecommerce/13090-wann-der-kuendigungsbutton-pflicht-ist.html
- https://www.avocado.de/aktuelles/blog/eintrag-naechste-abmahnwelle-rollt-der-kuendigungsbutton-312k-bgb-muss-bei-dauerschuldverhaeltnissen-im-o/
- https://www.noerr.com/de/insights/kuendigungsbutton-im-onlinevertrieb-neue-rechtsprechung-des-bgh
- https://www.gesetze-im-internet.de/bgb/__355.html
- https://www.it-recht-kanzlei.de/dienstleistung-widerrufsrecht-verbraucher.html
- https://qonto.com/de/blog/unternehmensgruendung/einzelunternehmen/gewerbe-anmelden-berlin
- https://sevdesk.de/ratgeber/gruenden/selbstaendigkeit-anmelden/gewerbe/gewerbe-anmelden-in-berlin/

Climate & winter logistics
- https://www.berlin.de/umweltatlas/klima/entwicklung-von-klimaparametern/2022/ergebnisse-der-historischen-auswertung/
- https://klimatabelle.com/ziel/berlin/klima/
- https://www.griessmeyer-bromelien.de/versand-shipping/
- https://www.garnelio.de/heatpack-sicherer-tier-und-pflanzenversand
- https://plantaddiction.de/pflegetipps-inspiration/pflanzenversand-im-winter
- https://plnts.com/de/blog/how-we-transport-our-plants-in-cold-winter-weather

Plant swap culture (anecdotal)
- https://www.berlin.de/ba-marzahn-hellersdorf/aktuelles/pressemitteilungen/2021/pressemitteilung.1076447.php
- https://www.gratis-in-berlin.de/15-leute-treffen/2080669-hof-flohmarkt-mit-pflanzentauschboerse
- https://www.tausende-gaerten.de/termine/bunte-saatgutboerse-in-berlin-pflanzensamen-und-wissen-tauschen/
- https://www.tauschgnom.de/verschiedenes/pflanzen/172
