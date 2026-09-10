# Planty — Research Lens: Operations (maintenance, logistics, plant care)

Researcher notes. Date of research: 2026-09-10. Every number below carries a source URL and the year of the claim (year = year the figure refers to, or "accessed 2026" where the page is undated but live).

Labelling convention used throughout:
- **[SRC]** = directly reported by a named source (price page, job ad, trade article, standard).
- **[EST]** = my own derived estimate, clearly flagged, built on [SRC] inputs.
- **[ANEC]** = anecdotal (forum, vendor marketing claim, single job ad).

---

## 1. Headline operational finding: cadence is a *market* variable, not a physics variable

The single most decision-relevant thing I found is that **the industry's "standard" maintenance cadence differs by roughly 4x between the two candidate launch markets**, and it is driven by growing system + labour cost, not by botany.

| Market | Typical professional cadence | Source |
|---|---|---|
| Germany / Austria (hydroculture-dominant) | **every 2–4 weeks** | Hydro Lesser: "alle zwei bis vier Wochen" ([hydro-lesser.de](https://www.hydro-lesser.de/mietservice.html), accessed 2026); Kinnula: "alle zwei bis vier Wochen" ([hydro-kulturen.de](https://hydro-kulturen.de/pflanzen-mieten/), accessed 2026); Gärtner Gregg: "regelmäßig (etwa alle vier Wochen)" ([gaertner-gregg.de](https://www.gaertner-gregg.de/pflanzenmiete-oder-leasing/), accessed 2026) |
| Germany, soil/mixed care operators | **every 2 weeks**, 2–3 visits/month | Büropflanzen Pflege Berlin ([bueropflanzen-pflege.de/preise](https://bueropflanzen-pflege.de/preise/), accessed 2026); Pflanzenpflege Berlin "2 Wochen Taktung" ([pflanzenpflege-berlin.de](https://pflanzenpflege-berlin.de/leistungen/), accessed 2026) |
| Austria, hydroculture full-service | **"14-tägige oder dreiwöchige Betreuungsintervalle"**; long-term option 3-, 4-monthly or semi-annual | [hydro4office.at](https://www.hydro4office.at/pflanzenbetreuung/), accessed 2026 |
| Germany, subscription startup (Plantclub) | gardener visit **every 2–3 weeks** | [plantclub.io](https://plantclub.io/de) / de.plantclub.io, accessed 2026 |
| Dubai / UAE | **weekly is the default**; premium tier is 2x/week | 800petals: "weekly visits ideal", "Weekly professional care… watering, leaf cleaning, pruning, fertilizing and pest checks" ([800petals.com](https://800petals.com/office-plant-rental-dubai/), accessed 2026); Royal Plantscape sells a 2-visits/week premium tier ([royalplantscape.com](https://www.royalplantscape.com/pages/indoor-plant-maintenance-service), accessed 2026) |
| US (Ambius) | flexible; search summary of Ambius pages indicates ~**13–17 visits/year** typical, with weekly available | [ambius.com/about/service-options](https://www.ambius.com/about/service-options) (page 403s to automated fetch; figure came from search-engine summary — treat as **[ANEC]** until confirmed) |

**Why this matters for Planty:** the idea text assumes "every week a technician visits". That is the *Dubai* norm and roughly the *most expensive possible* ops model in Germany. In Germany the incumbent model is 12–26 visits/year, not 52. Committing to weekly visits in Berlin would roughly double or triple the dominant cost line versus every competitor the customer will price-compare against.

---

## 2. What actually happens on a visit

Composite task list, consistent across sources:

**Ambius (US) Plant Care Specialist job description** — the most concrete first-party description I found: technicians "visit various customer sites each day and provide care for the plants by performing trained tasks such as grooming, rotating, watering, prune, trim, remove debris from planters, gauge soil moisture accurately with a soil probe and fertilize as needed", while "preventing damage to surrounding floors, walls, carpet, furniture, etc. from water and/or moisture" (Ambius/Rentokil job postings, 2025–2026, e.g. [careers.rentokil-initial.com](https://careers.rentokil-initial.com/job/plant-care-specialist-ambius-in-hayward-ca-jid-24335)).

**German/Austrian hydroculture visit** adds steps a soil operator never does ([hydro4office.at](https://www.hydro4office.at/pflanzenbetreuung/), accessed 2026):
- "Absaugen der Nährlösung im Pflanzengefäß mit elektrischer Pumpe" (pump out the old nutrient solution)
- pH and conductivity (EC) testing as needed
- "Blattreinigung händisch" (manual leaf cleaning)
- "Lecaoberfläche teilweise erneuern" — partially replace the top layer of expanded-clay because of salt build-up
- pest monitoring with environmentally compatible products

**Berlin soil-care visit** ([pflanzenpflege-berlin.de](https://pflanzenpflege-berlin.de/leistungen/), accessed 2026): water-level / soil-moisture check, watering, fertilising, leaf cleaning, removal and disposal of dead plant parts ("das Aufsammeln und Entsorgen von abgestorbenen Pflanzenteilen"), pest prevention, pruning and tying-in of shoots.

**Dubai visit** ([800petals.com](https://800petals.com/indoor-plants-maintenance/), accessed 2026): "Watering, leaf cleaning, pruning, fertilizing, pest checks, and replacement of any declining plant at no cost." Broken out as precise watering, dust removal + leaf polishing, pruning, fertiliser, pest/disease inspection, free replacement under the maintenance agreement. Teams are "skilled, fully equipped personnel", each team supported by a supervisor; company operating since 1992; coverage Dubai, Abu Dhabi, Sharjah.

**Tools implied by the above [SRC]:** soil probe / moisture meter, watering can with long spout + water source access, pruners, microfibre cloths + leaf-shine, slow-release or liquid fertiliser, hand pump (hydro), pH/EC meter (hydro), drip trays, IPM sprays, light meter for surveys (see §6).

---

## 3. Technician throughput and route economics

This is where MVP capacity planning lives.

**Route length and stop count [SRC/ANEC]:**
- "Routes are preset and typically 4-6 hrs." — Plant Designs, Inc. interiorscape technician job ad, starting pay **$16.50/hour**, expected hours 10–15/week ([career.com listing](https://www.career.com/job/plant-designs-inc/plant-care-horticulture-interiorscape-technician/j202307261319141244742), posted 2023, still indexed 2026).
- Technicians "drive to each client location on a preset route… watering, fertilizing, dusting, inspecting, pruning, and rotating the plants"; stop counts range **"as few as five or as many as twenty locations a day"** depending on how busy the tech wants to be (interiorscape employer job pages surfaced 2026, e.g. [insideplants.net/job-openings](https://insideplants.net/job-openings/)). **[ANEC]** — this is a job-ad claim, not a survey.
- Physical spec: "continuous walking, bending, kneeling, and carrying about 15-30 lbs" (same job ad, 2023).

**Wages [SRC]:**
- US Interior Plant Technician average **$38,470/yr ≈ $18/hr**, range $31,526–$45,318 ($15–$22/hr) — [salary.com](https://www.salary.com/research/salary/hiring/interior-plant-technician-salary), 2026.
- US interior landscape technician salary band **$32,000–$64,000** with medical/dental/PTO — [landscapeindustrycareers.org](https://www.landscapeindustrycareers.org/discover-the-industry/career-paths/interior-landscape-technician/), accessed 2026.
- UK Ambius Interior Plant Technician, Bristol/Reading route: **OTE £30,911 p.a.**, plus company vehicle, fuel card, mobile phone, uniform; Mon–Fri 40h week "with potential for up to 48 hours in the future with an increased salary" ([careers.rentokil-initial.com Bristol listing](https://careers.rentokil-initial.com/job/interior-plant-technician-in-bristol-england-united-kingdom-jid-49176), 2025/2026).
- **German statutory minimum wage is €13.90/hour from 1 January 2026** ([BMAS](https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html), 2026). **[EST]** loaded employer cost ≈ €17–18/h with social contributions, before van, fuel, insurance and non-billable time.

**Productivity metrics used by the trade** ([newprocontainers.com](https://www.newprocontainers.com/blog/measuring-your-plant-techs-productivity-efficiency-quality-of-work/), accessed 2026):
- *Productivity* = onsite hours ÷ paid hours. Worked example: "if a tech works a total of 6 hours onsite but is paid 8 hours, their productivity for this particular day is 75%". 100% is only reachable for a tech parked on one large site; multi-site techs cannot hit it.
- *Efficiency* = actual time ÷ budgeted time. A 4-hour budgeted job that takes 5 hours = 125% (over budget).
- Quality is measured by customer retention, satisfaction surveys, and routine inspections, weighted 80/20 toward the largest accounts.

**Route-density economics from adjacent route-service industries** (interiorscape-specific benchmarks were not findable; these are the closest structural analogues, **[SRC]** but cross-industry):
- Pool service: operators at **8–12 stops per tech per day hit 22–28% EBITDA; below 6 stops/day they struggle to break 15%** ([pulserevops.com industry KPIs](https://pulserevops.com/industry-kpis/ik0435), 2026/2027 dataset).
- Route-optimisation guidance: **8–12 accounts/day residential, 5–8 commercial** as the efficiency band ([DynoRoute](https://dynoroute.com/grease-trap-software/blog/grease-trap-route-density), 2026).
- Grease-trap service: 6–10 stops/day, **$800–$1,500 revenue per truck-day, 15–25% net margin** (same source, 2026).
- Superior route density is worth a **15–20% labour cost advantage** vs. scattered competitors ([sealeybb.com](https://www.sealeybb.com/pool-route-valuation-secrets-revealed-why-density-matters-more-than-account-count/), accessed 2026).

**The Berlin operator that proves route density matters most:** Büropflanzen Pflege Berlin restricts its territory to "Berlin Charlottenburg-Wilmersdorf und Spandau" (described as Olympiastadion + ~6–10 km), and explicitly surcharges for "Länge der Anfahrt" (travel distance), larger plants, multi-floor distribution and awkward access ([bueropflanzen-pflege.de/preise](https://bueropflanzen-pflege.de/preise/), accessed 2026). A 25-year-old operator voluntarily serving two boroughs is the strongest available evidence that this business is won or lost on geographic tightness.

---

## 4. Real price points (the ops cost envelope)

**Germany — care only, no plant rental:**
- Up to **30 medium plants, 2-week interval: €299/month net**; up to **50 plants: €349/month net** ([bueropflanzen-pflege.de/preise](https://bueropflanzen-pflege.de/preise/), accessed 2026). That is ~**€10/plant/month at 30 plants and ~€7/plant/month at 50 plants** for care alone, at ~2.17 visits/month.
  - **[EST]** implied labour budget: if a 30-plant site takes ~1.0–1.5h per visit, €299 ÷ 2.17 visits = €138/visit — comfortably profitable at €17/h loaded labour *only if* the tech does 3–5 such sites per day with short hops.

**Germany — plant rental including care:**
- **From €6.99 net per plant per month**, larger vessels **€10.50–€22.90**, ~4-week care interval, typically **12-month minimum term**, free replacement "ohne Zusatzkosten" ([gaertner-gregg.de](https://www.gaertner-gregg.de/pflanzenmiete-oder-leasing/), accessed 2026).
- "Schon ab 6 Euro pro Monat", delivery and placement free, care every 2–4 weeks ([hydro-kulturen.de](https://hydro-kulturen.de/pflanzen-mieten/), accessed 2026).
- Hydro Lesser: **24-month minimum term**, "Pflanzenersatzgarantie" — dead plants replaced "ohne 'Wenn und Aber'" ([hydro-lesser.de](https://www.hydro-lesser.de/mietservice.html), accessed 2026).
- WELO Green: **from €199/month, 12-month minimum**, then monthly cancellable; includes planning, delivery, planting, care, replacement guarantee ([welo-green.de](https://welo-green.de/blogs/journal/pflanzen-mieten-kosten), accessed 2026).
- Plantclub (Berlin, Hamburg, Cologne, Düsseldorf, Frankfurt, Munich, Vienna): **€200/mo up to 150 m²; €400/mo up to 500 m²; €600/mo up to 1,000 m²**; custom above; billed annually, excl. VAT; **12-month minimum**; includes free design concept, full care, free replacements with no redesign fee, account management, delivery + installation ([plantclub.io/de/preise](https://plantclub.io/de/preise), accessed 2026). Sold to offices, not homes.

**Dubai — maintenance packages (published, rare in this industry):**
- Royal Plantscape ([royalplantscape.com](https://www.royalplantscape.com/pages/indoor-plant-maintenance-service), accessed 2026):
  - Basic **AED 120/month — 1 visit/month**
  - Regular **AED 299/month — 2 visits/month**
  - Weekly **AED 499/month — 1 visit/week**
  - Premium **AED 799/month — 2 visits/week**
  - One-time service **AED 120**; à-la-carte tasks AED 150–199
  - **Replacement plants, supplies and specialised treatments are charged separately** — i.e. this is *not* an all-in guarantee.
- 800petals: "Most plans are quoted per plant per month, all-inclusive"; one monthly fee covers plants, pots, weekly maintenance and free replacement; "Most clients choose 12-month agreements for the best monthly rate"; seasonal rotation offered as an option ([800petals.com](https://800petals.com/office-plant-rental-dubai/), accessed 2026).

**Trade pricing formula [SRC]** ([newprocontainers.com](https://www.newprocontainers.com/blog/quick-guide-pricing-interiorscape-jobs/), accessed 2026):
- Maintenance labour = **(average time per visit in hours) × (hourly rate) × (visits per month)**. Worked example: 45-minute visit × $30/h × 5 visits = **$112.50/month**.
- Replacement allowance = retail plant price × **30–50%+ markup**, ÷ 12 months.
- Lease pricing = retail cost **× 1.5 or more, divided over 12 months**.
- Freight can add **up to 30% plus $180** for oversized items.

**[EST] What this implies for Planty's rental price floor:** a €40 retail plant at ×1.5 ÷ 12 = **€5.00/plant/month just to amortise the plant**, before any labour. Add German care at €7–10/plant/month and the honest German B2B floor is **~€12–15/plant/month at ~25–50 plants per site**. That is consistent with the observed €6.99 (small, dense, 4-week cadence) to €22.90 (large vessels) band.

---

## 5. Sub-irrigation is the main lever on visit frequency

- **Lechuza** sub-irrigation: after a 12-week "growing-in phase" during which you water normally from above, the reservoir needs **refilling typically every 2–4 weeks, and up to 12 weeks depending on plant size and environment** ([lechuza.world](https://www.lechuza.world/the-lechuza-sub-irrigation-system/sp_selfwatering.html) and planting instructions PDF, accessed 2026).
- Interiorscape trade: sub-irrigation "minimise[s] watering frequency, enabling plants to go **14 days or more** between waterings, therefore reducing labor costs" ([newprocontainers.com](https://www.newprocontainers.com/blog/sub-irrigation-system-plantscape-project/), accessed 2026).
- Cost caveat, same publisher: "The costs are not insignificant" — "a Controlled Watering Insert may cost as much as the plant that you install in it" ([newprocontainers.com](https://www.newprocontainers.com/blog/subirrigation-best-interiorscape-investment/), accessed 2026). Benefits claimed: longer maintenance intervals, "dramatically lower plant failure and replacement rates" (no percentage given).
- Vendor claim **[ANEC]**: WaterWell self-watering liners claim **$500/year labour savings per planter and 400 gallons of water saved per planter per year** ([waterwellplanters.com](https://waterwellplanters.com/), accessed 2026). Manufacturer marketing — do not plan on it.
- German hydroculture marketing claim **[ANEC]**: hydro "reduces care time by 60%" with watering intervals of **14–21 days instead of 2–3 days** (German hydroculture vendor pages, accessed 2026 — e.g. [hydroflora.de](https://www.hydroflora.de/produkte/hydrokultur/)).
- Planterra recommends sub-irrigation but warns that **automated/plumbed irrigation is rarely advisable indoors** because of breakdown and water-damage risk; reservoirs still need manual checking on each visit ([planterra.com](https://planterra.com/blogposts/what-are-the-best-irrigation-methods-for-interior-plants/), accessed 2026).

**Read-through:** sub-irrigation is not a nice-to-have for Planty; it is the mechanism that converts a weekly-visit business into a 3–4-weekly-visit business. The capex hit (insert ≈ price of the plant) is a rental-model asset, amortised over 12–24 months, which is exactly what a rental business can absorb and a one-off retail customer cannot.

---

## 6. Plant selection, acclimatisation and light — the failure-rate controls

- Acclimatisation = transitioning a plant from fast greenhouse growth to slow indoor conditions by **reducing light, water and fertiliser before installation**. The three stressors indoors are **reduced light intensity, shorter day length, lower humidity** ([plantspecialists.com](https://plantspecialists.com/blog/acclimatization/) and [UT Extension W1128B](https://utia.tennessee.edu/publications/wp-content/uploads/sites/269/2023/10/W1128B.pdf), 2023).
- Peer-reviewed 2024 study on office-like light: plants underwent a **47-day acclimatisation period** in a shaded, air-conditioned glasshouse; shade-tolerant species sustained growth under just **6.8 μmol m⁻² s⁻¹ white LED for 9 h/day**, suggesting supplemental lighting may be unnecessary for the right species in offices ([Scientific Reports, 2024](https://www.nature.com/articles/s41598-024-67877-y)).
- Classic interiorscape screening thresholds: light intensities of **75 / 150 / 225 / 300 foot-candles at 12 h/day**, with cultivars keeping "satisfactory quality for 3 or more weeks under 150 ft-c" considered promising ([UF/IFAS MREC foliage research report](https://mrec.ifas.ufl.edu/Foliage/Resrpts/rh_96_3.htm)).
- Field heuristic from NALP trade coverage: "If you have enough light to read a piece of paper without squinting you could probably have a plant" — Raimondi; companies use light meters on survey ([NALP blog, accessed 2026](https://blog.landscapeprofessionals.org/the-ins-and-outs-of-interior-plantscaping/)).
- Same article: **overwatering is the primary killer** — water management is about sophistication, not volume. **Philodendron and Dracaena families dominate** interiorscapes because they are the most low-light tolerant.
- Dubai species reality: AC-driven very low humidity dries leaves and soil fast; the recommended indoor set is **ZZ plant, snake plant, peace lily, rubber plant, pothos** ([mygreenresort.ae](https://mygreenresort.ae/blogs/news/survive-the-heat-10-best-indoor-plants-for-uae-summers), 2026; [upscaleandposh.com 2026 guide](https://upscaleandposh.com/blogs/news/indoor-plants-in-dubai-the-2026-guide-to-greenery-that-thrives)).

---

## 7. Sourcing, holding stock, and the "plant hospital"

- **Sourcing has got materially harder post-COVID**: sourcing now "requires contacting 5-6 nurseries and consuming most of a day", where it previously took 1–3 nurseries and about an hour ([NALP blog](https://blog.landscapeprofessionals.org/the-ins-and-outs-of-interior-plantscaping/), accessed 2026). Rising plant costs compress margins.
- **The rental business model is self-insurance.** Lustig, quoted in the same article: "We provide horticultural services, and we guarantee the health of the plant. When the plant needs to be replaced there's no additional cost because we're basically collecting money from them every single month to make those replacements." That is the entire economic logic of Planty in one sentence — the monthly fee funds a replacement pool.
- **Dubai supply is unusually strong.** The Warsan nursery cluster is one of the largest in Dubai and hosts wholesalers/importers ([propertyfinder.ae guide](https://www.propertyfinder.ae/blog/plant-nurseries-dubai/), accessed 2026; [greenglades.ae](https://greenglades.ae/plant-nursery-dubai.html)). Desert Group's Wahat Al Sahraa operates **over 10 million sq ft of nursery land in the UAE plus 5 million sq ft overseas including Thailand** ([desertgroup.ae](https://desertgroup.ae/plant-nursery/) / [dgnurseries.com](https://dgnurseries.com/), accessed 2026). Vertically integrated import-to-nursery supply sits inside the city.
- **Plant hospital / rehab is a real, named service** in the trade — repot, refresh and an extended greenhouse stay for intensive care ([traknco.com/plant-hospital-rehab](https://traknco.com/plant-hospital-rehab/), accessed 2026). For Planty this is the return leg of every rotation: declining assets go back to a holding space, recover, and re-enter inventory rather than being written off.
- **Seasonal colour rotation** is a distinct, separately-priced product line in the US/UK trade (orchid and bromeliad rotations year-round, poinsettias at Christmas), typically bundling maintenance and installation ([greenthumbinterior.com rotations catalog](https://www.greenthumbinterior.com/blooming-plant-rotations-catalog/), accessed 2026). Retail poinsettia cost reference: standard 6–8" poinsettias **$12–$25**, small tabletop $8–$15, premium cultivars $22–$40 during peak season ([alibaba lifetips guide](https://lifetips.alibaba.com/plant-care/how-much-is-a-poinsettia), 2025). Rotation is high-margin because the plant is consumable and the visit is already scheduled.

---

## 8. Transport

- **Cold (Berlin problem):** most tropicals suffer damage below **40 °F / 4 °C**; the ideal transport band is **60–85 °F / 15–29 °C** ([Lowe's transport guide](https://www.lowes.com/n/how-to/transport-plants-in-cold-weather), accessed 2026). Chilling injury occurs during packing/shipping and "if plants are transported in unheated trucks during winter months, foliage may be damaged" ([UF/IFAS EP530](https://edis.ifas.ufl.edu/publication/EP530/pdf)). Mitigations: sleeving/wrapping, boxed + bagged, heated vehicle, minimise dwell time on the pavement. Berlin has roughly four to five months a year where an unheated van is a plant-killer. **[EST]** this pushes winter installs toward a heated cargo van and sleeve-on-load discipline, and argues for *not* scheduling seasonal rotations in January.
- **Heat (Dubai problem):** June–September temperatures exceed **45 °C** with high UV and fast evaporation ([mygreenresort.ae UAE climate guide](https://mygreenresort.ae/blogs/news/how-to-care-for-plants-in-uaes-climate-guide-by-my-green-resort), 2026). Premium Dubai plant retailers already advertise **air-conditioned vans and same-day delivery** to avoid "the temperature shock of a hot car ride" ([upscaleandposh.com](https://upscaleandposh.com/blogs/news/indoor-plants-in-dubai-the-2026-guide-to-greenery-that-thrives), 2026). Mitigation is an AC van and early-morning routing — both cheaper and more predictable than heating in a German winter, but AC vans plus summer route timing are a hard requirement, not optional.

---

## 9. Pests, hygiene and chemicals in occupied space

- Common interiorscape pests: **soft and armoured scales, mealybugs, spider mites, thrips, aphids, whiteflies, black vine weevil** ([UK Entomology PSEP Interior Plantscapes](https://www.uky.edu/Ag/Entomology/PSEP/cat19insects.html)).
- Regulatory/practical constraint: "The use of pesticides in interior plantscapes is often difficult and undesirable because of the proximity to living or working areas"; **few pesticides are registered for indoor use** and biological control is increasingly used instead ([same source](https://www.uky.edu/Ag/Entomology/PSEP/cat19insects.html); [Rincon-Vitova interiorscape biocontrol bulletin](https://www.rinconvitova.com/bulletins_crop_htm/Interiorscape%20Biocontrol%20ABN.htm)).
- Preferred order of intervention: insecticidal soap or horticultural oil first; **soil-applied systemics to avoid foliar sprays** in occupied rooms ([MU Extension G7273](https://extension.missouri.edu/publications/g7273), accessed 2026; [Kansas State MF3001 mealybug management in greenhouses and interiorscapes](https://bookstore.ksre.ksu.edu/pubs/mealybug-management-in-greenhouses-and-interiorscapes_MF3001.pdf)).
- **Ops consequence:** infested plants should be *swapped out and treated off-site*, not sprayed in a client's living room or open-plan office. This makes a holding/quarantine space a hard requirement, not a nice-to-have — and it is another reason the rental model beats the retail model (you can just take the problem away).

---

## 10. Software and per-asset tracking

- **FolioGreen** is a purpose-built interior-plant-maintenance platform whose data model matches what Planty needs: sites, **displays**, **plant assets**, **rotations**, renewals, recurring scheduled visits tied to sites, route memory and technician notes, care history containing **condition notes, replacement choices and watering cycles**, species and colour programs, visit-based pricing (hourly or fixed), estimate/deposit records, and invoice-ready service history used as renewal evidence ([foliogreen.com](https://foliogreen.com/), page describes a 2026 launch). Notably it does **not** advertise QR/barcode asset scanning — so per-plant QR tagging is not table stakes in this industry today.
- Generic alternatives: Aspire (aimed at landscape contractors >$1M revenue, inventory tied to job costing, mobile field tech), Service Fusion, and NatureTrack which does offer **QR inventory** for nurseries and crews ([naturetrackapp.com](https://naturetrackapp.com/), accessed 2026; [getapp landscape inventory roundup](https://www.getapp.com/industries-software/landscape/f/inventory-management/), 2025).
- **[EST]** Planty's actual software edge is not routing — it is the **per-asset record**: plant instance → site → position → install date → last serviced → condition score → photo → rotation due date → replacement history. That table is what makes a replacement guarantee costable, and it is exactly what FolioGreen is selling to incumbents who don't have it.

---

## 11. Derived ops playbook for an MVP city launch (1–2 technicians) — **[EST]** throughout

**Capacity model.** Anchor on the trade formula (time × rate × visits) and the route-density band of 5–8 commercial stops/day.
- Assume a 6-hour on-route day (job ads say routes are 4–6h), 75% productivity (the trade's own worked example), so ~4.5 productive hours/day.
- Assume 45 min average per B2B site of ~20–30 plants (trade example uses 45 min) plus 15–20 min inter-stop travel in a tight urban zone → **~5 sites/day, ~25 sites/week per technician** at a 4-weekly cadence → **~100 B2B sites per technician** if every site is monthly, or **~50 sites** at a fortnightly cadence, or **~25 sites** at weekly.
- Reality check against the Berlin price sheet: 25 fortnightly sites × €299 = **€7,475/month revenue per technician** at German care-only pricing. Against ~€3,000/month loaded technician cost + van, that is a workable gross margin — *provided* the sites are in two adjacent boroughs.

**Ten rules I'd run the MVP on:**
1. **Sell one postcode cluster, not a city.** Copy Büropflanzen Pflege Berlin: define a ~6–10 km service polygon, refuse or surcharge everything outside it. Route density is the whole business.
2. **Default cadence 4-weekly in Germany, weekly only in Dubai.** Price weekly as a premium tier, never as the base.
3. **Sub-irrigate everything from day one.** Lechuza-style inserts/planters push refills to 2–4 weeks and let the 4-weekly cadence actually work. Budget insert cost ≈ plant cost; amortise over the 12-month term.
4. **Species whitelist of ~12 SKUs**, all low-light tolerant (Dracaena, Philodendron/Pothos, Sansevieria, ZZ, Zamioculcas, Aspidistra, Ficus elastica, Spathiphyllum, Chamaedorea). Fewer SKUs = predictable care, predictable replacement stock, predictable photography.
5. **Light survey before every install.** A €30 light meter, plus the read-a-paper heuristic. Refuse dark corners or place a low-light SKU there. This is the single cheapest lever on replacement rate.
6. **Acclimatise before install.** Hold new stock 3–6 weeks in a shaded, reduced-water/reduced-fertiliser holding space. The research precedent is a 47-day acclimatisation window; you will not manage 47 days but 3 weeks beats zero.
7. **Never treat pests on site.** Swap the plant, quarantine and treat off-site with soap/oil or a soil systemic. This is both an IPM best practice and a customer-experience feature.
8. **Build the plant-asset table before the booking flow.** plant_instance, site, room/position, install_date, last_service, condition_score (1–5), photo_url, next_rotation_due, replacement_of. Every technician visit writes one row per plant. This is the defensible artefact.
9. **Price replacement explicitly into the subscription** (retail × 1.5 ÷ 12, or a 30–50% markup allowance ÷ 12) and then honour a no-questions replacement guarantee — every serious German competitor already advertises a Pflanzenersatzgarantie, so it is table stakes, not a differentiator.
10. **Vehicle spec is market-dependent:** heated van + sleeving in Berlin (below 4 °C damages tropicals, so ~Nov–Mar is a risk window); AC van + early-morning routing in Dubai (45 °C+ Jun–Sep).

**Where B2C breaks.** Homes are the worst case for every driver above: 1–5 plants per stop instead of 25, residential access friction, and a revenue-per-stop of maybe €15–40 against the same 20-minute travel leg. The route-density benchmarks (8–12 residential stops/day at *low* per-stop value) plus the pool-service margin cliff below 6 stops/day both point the same way. **B2C is only viable if (a) sub-irrigation pushes visits to 6–8 weeks, (b) stops are clustered by building/neighbourhood on a fixed weekday, and (c) the minimum basket is ~4–6 plants.** Note that Plantclub — the best-funded German analogue — sells only to offices and routes non-office demand to a *purchase* platform, which is a strong revealed-preference signal about B2C rental unit economics.

**Where the two markets diverge on ops cost.** Germany: high labour cost (€13.90/h statutory minimum from 2026, loaded ~€17–18/h), but the market accepts 2–4 weekly cadence, so labour per account is low. Dubai: much lower labour cost, but the market expects weekly (4x the visits) and pays AED 499/month for weekly care of one site (≈ €125/month), i.e. **lower revenue per site than Berlin's €299 for fewer visits**. Berlin looks like the better *ops-margin* market on published prices; Dubai looks like the better *supply-chain and climate-logistics* market. That tension should be resolved by the demand/pricing lenses, not by ops alone.

---

## 12. Gaps I could not close

- No first-party Ambius page could be fetched (ambius.com, ambius.nl, ambius.co.uk and ambiusindoorplants.com.au all return 403 to automated fetch). The "13–17 visits per year" figure is search-summary-derived and must be confirmed manually before being quoted.
- No industry-standard "plants per technician-hour" benchmark exists publicly. The NALP/interiorscape trade press publishes formulas, not productivity norms. My throughput numbers are **[EST]** built from the 45-min visit example and the 4–6h route length.
- No published per-plant-per-month rental price for Dubai. Every UAE operator quotes after a site assessment; only maintenance-package prices (Royal Plantscape) are public.
- Gardener/technician wage data for Dubai and German horticulture tariff wages could not be retrieved (search budget exhausted mid-research). Only the German statutory minimum wage is sourced.
- Plantclub's per-package plant count and exact visit frequency are not published; the 2–3 week figure comes from a search summary of their blog/FAQ, not from a fetched page section.

---

## Sources

1. https://www.ambius.com/about/service-options — Ambius service/program options (403 to fetch; search summary only), accessed 2026
2. https://careers.rentokil-initial.com/job/plant-care-specialist-ambius-in-hayward-ca-jid-24335 — Ambius Plant Care Specialist duties, 2025/2026
3. https://careers.rentokil-initial.com/job/interior-plant-technician-in-bristol-england-united-kingdom-jid-49176 — Ambius UK Interior Plant Technician, OTE £30,911, 2025/2026
4. https://www.career.com/job/plant-designs-inc/plant-care-horticulture-interiorscape-technician/j202307261319141244742 — route length 4–6 h, $16.50/h, physical requirements, 2023
5. https://insideplants.net/job-openings/ — 5–20 locations per day (job-ad claim), accessed 2026
6. https://www.landscapeindustrycareers.org/discover-the-industry/career-paths/interior-landscape-technician/ — $32,000–$64,000 band, duties, accessed 2026
7. https://www.salary.com/research/salary/hiring/interior-plant-technician-salary — US avg $38,470 / $18 per hour, 2026
8. https://blog.landscapeprofessionals.org/the-ins-and-outs-of-interior-plantscaping/ — NALP: subscription/replacement model, light heuristic, overwatering, Philodendron/Dracaena, post-COVID sourcing, accessed 2026
9. https://www.newprocontainers.com/blog/quick-guide-pricing-interiorscape-jobs/ — pricing formulas, replacement allowance, lease ×1.5/12, freight, accessed 2026
10. https://www.newprocontainers.com/blog/measuring-your-plant-techs-productivity-efficiency-quality-of-work/ — productivity 75% worked example, efficiency 125% example, accessed 2026
11. https://www.newprocontainers.com/blog/sub-irrigation-system-plantscape-project/ — 14+ days between waterings, accessed 2026
12. https://www.newprocontainers.com/blog/subirrigation-best-interiorscape-investment/ — insert may cost as much as the plant, accessed 2026
13. https://www.lechuza.world/the-lechuza-sub-irrigation-system/sp_selfwatering.html — refill every 2–4 weeks, up to 12 weeks; 12-week growing-in phase, accessed 2026
14. https://planterra.com/blogposts/what-are-the-best-irrigation-methods-for-interior-plants/ — sub-irrigation recommended; automated indoor irrigation discouraged, accessed 2026
15. https://waterwellplanters.com/ — vendor claim $500/yr labour and 400 gal water saved per planter, accessed 2026
16. https://www.hydroflora.de/produkte/hydrokultur/ — hydro care-time and 14–21 day watering interval claims, accessed 2026
17. https://www.hydro4office.at/pflanzenbetreuung/ — "14-tägige oder dreiwöchige Betreuungsintervalle"; nutrient-solution pump-out, pH/EC, leca renewal, accessed 2026
18. https://www.hydro-lesser.de/mietservice.html — "alle zwei bis vier Wochen", 24-month minimum, Pflanzenersatzgarantie, accessed 2026
19. https://hydro-kulturen.de/pflanzen-mieten/ — "ab 6 Euro pro Monat", care every 2–4 weeks, free delivery/placement, accessed 2026
20. https://www.gaertner-gregg.de/pflanzenmiete-oder-leasing/ — €6.99 net/plant/month, €10.50–22.90 larger vessels, ~4-week interval, 12-month term, accessed 2026
21. https://welo-green.de/blogs/journal/pflanzen-mieten-kosten — from €199/month, 12-month minimum, accessed 2026
22. https://bueropflanzen-pflege.de/preise/ — €299/mo up to 30 plants, €349/mo up to 50, 2-week cadence, 2–3 visits/month, Charlottenburg-Wilmersdorf/Spandau territory, travel surcharges, accessed 2026
23. https://pflanzenpflege-berlin.de/leistungen/ — "2 Wochen Taktung", visit task list, 25 years experience, accessed 2026
24. https://plantclub.io/de/preise — €200/€400/€600 per month by m², 12-month minimum, inclusions, accessed 2026
25. https://plantclub.io/de/faq — cities served (Berlin, Hamburg, Cologne, Düsseldorf, Frankfurt, Munich, Vienna); office-focused, accessed 2026
26. https://800petals.com/office-plant-rental-dubai/ — weekly care, per-plant-per-month all-inclusive quoting, 12-month agreements, free replacement, seasonal rotation, accessed 2026
27. https://800petals.com/indoor-plants-maintenance/ — weekly standard, task list, supervisor per team, since 1992, Dubai/Abu Dhabi/Sharjah, accessed 2026
28. https://www.royalplantscape.com/pages/indoor-plant-maintenance-service — AED 120 / 299 / 499 / 799 monthly tiers by visit frequency; replacements billed separately, accessed 2026
29. https://www.desertblooms.me/blogs/plant-care-guides/office-plant-rental-dubai-professional-green-solutions-for-modern-workspaces-desertblooms — Dubai office plant rental service scope (no prices), accessed 2026
30. https://desertgroup.ae/plant-nursery/ and https://dgnurseries.com/ — Wahat Al Sahraa: >10M sq ft UAE nursery land + 5M sq ft overseas incl. Thailand, accessed 2026
31. https://www.propertyfinder.ae/blog/plant-nurseries-dubai/ — Warsan nursery cluster, accessed 2026
32. https://greenglades.ae/plant-nursery-dubai.html — Dubai wholesaler/importer/exporter, Warsan garden centre, accessed 2026
33. https://www.nature.com/articles/s41598-024-67877-y — Scientific Reports 2024: 47-day acclimatisation, 6.8 µmol m⁻² s⁻¹ LED 9 h/day
34. https://mrec.ifas.ufl.edu/Foliage/Resrpts/rh_96_3.htm — 75/150/225/300 ft-c interior testing thresholds
35. https://plantspecialists.com/blog/acclimatization/ — acclimatisation definition and process, accessed 2026
36. https://utia.tennessee.edu/publications/wp-content/uploads/sites/269/2023/10/W1128B.pdf — UT Extension indoor plant care, 2023
37. https://edis.ifas.ufl.edu/publication/EP530/pdf — chilling injury in shipping/unheated trucks
38. https://www.lowes.com/n/how-to/transport-plants-in-cold-weather — tropicals damaged below 40 °F, ideal 60–85 °F, accessed 2026
39. https://mygreenresort.ae/blogs/news/how-to-care-for-plants-in-uaes-climate-guide-by-my-green-resort — UAE 45 °C+ Jun–Sep, evaporation, 2026
40. https://upscaleandposh.com/blogs/news/indoor-plants-in-dubai-the-2026-guide-to-greenery-that-thrives — AC vans, same-day delivery, temperature shock, 2026
41. https://mygreenresort.ae/blogs/news/survive-the-heat-10-best-indoor-plants-for-uae-summers — UAE indoor species set, 2026
42. https://www.uky.edu/Ag/Entomology/PSEP/cat19insects.html — interiorscape pest list; pesticide constraints indoors
43. https://www.rinconvitova.com/bulletins_crop_htm/Interiorscape%20Biocontrol%20ABN.htm — biological control in interiorscapes
44. https://extension.missouri.edu/publications/g7273 — least-toxic indoor plant pest control, accessed 2026
45. https://bookstore.ksre.ksu.edu/pubs/mealybug-management-in-greenhouses-and-interiorscapes_MF3001.pdf — KSU mealybug management
46. https://foliogreen.com/ — interior plant maintenance software: sites, displays, plant assets, rotations, care history, route memory, 2026 launch
47. https://naturetrackapp.com/ — QR inventory for nurseries/crews, accessed 2026
48. https://www.getapp.com/industries-software/landscape/f/inventory-management/ — landscape inventory software roundup, 2025
49. https://pulserevops.com/industry-kpis/ik0435 — pool service: 8–12 stops/tech/day → 22–28% EBITDA; <6 → <15%
50. https://dynoroute.com/grease-trap-software/blog/grease-trap-route-density — 8–12 residential / 5–8 commercial stops per day; $800–1,500 revenue per truck-day, 2026
51. https://www.sealeybb.com/pool-route-valuation-secrets-revealed-why-density-matters-more-than-account-count/ — route density worth 15–20% labour cost advantage, accessed 2026
52. https://traknco.com/plant-hospital-rehab/ — plant hospital / rehab service concept, accessed 2026
53. https://www.greenthumbinterior.com/blooming-plant-rotations-catalog/ — seasonal blooming rotation programs, accessed 2026
54. https://lifetips.alibaba.com/plant-care/how-much-is-a-poinsettia — poinsettia retail price bands, 2025
55. https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html — German statutory minimum wage €13.90/h from 1 Jan 2026
