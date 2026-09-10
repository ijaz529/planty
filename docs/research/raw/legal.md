# Planty — Legal, contracts, insurance & compliance research
Lens: Legal / contracts / insurance / compliance. Markets compared: Germany (Berlin) vs UAE (Dubai).
Research date: 2026-09-10. All statutory text checked against primary sources (gesetze-im-internet.de, gdpr-info.eu, u.ae, Stripe docs).

> **Method caveat (read first).** The session's WebSearch quota was already exhausted before this lens ran (200/200 calls consumed by earlier lenses), so I could not run the 10+ discovery searches the brief asks for. Everything below comes from **direct WebFetch of primary/official sources** that I could address by URL. Where I could not reach a source (Dubai DET activity codes, German insurance price points, competitor AGB), I say so explicitly rather than guessing. Several commercial sites (ambius.de, ambius.co.uk, dubaided.gov.ae) returned HTTP 403 to automated fetches.

---

## 1. What kind of contract is "renting a plant"? (Germany/EU)

This is the foundational classification and it drives almost everything else.

- It is a **Mietvertrag über bewegliche Sachen** (rental of movable goods) under §§ 535 ff. BGB, **bundled with a Dienstleistung** (weekly watering/maintenance) and a **Werk-/Dienstleistungs-Element** (delivery + installation). German law treats this as a *typengemischter Vertrag*; the dominant element is usually the rental.
- **Ownership stays with Planty by operation of law.** A rental contract does not transfer title. No retention-of-title clause is strictly needed, but the contract should still say it plainly for the customer's benefit and for insolvency/third-party situations.
- **§ 312 BGB (Anwendungsbereich)**: the consumer-contract regime (§§ 312 ff.) excludes only *"Verträge über die Vermietung von Wohnraum"* — residential-space letting. Rental of **movable** things is **not** excluded. Source: https://www.gesetze-im-internet.de/bgb/__312.html (checked 2026).
  → **Consequence: the 14-day distance-selling withdrawal right applies in full to a B2C plant rental signed online.**
- **§ 536 BGB (Mietminderung)**: if the rented item is defective, rent is reduced *automatically, by law* — the tenant is *"von der Entrichtung der Miete befreit"* where suitability is entirely lost, and owes only *"angemessen herabgesetzte Miete"* where it is diminished; *"Eine unerhebliche Minderung der Tauglichkeit bleibt außer Betracht."* Crucially, § 536 Abs. 4 (which voids agreements to the tenant's disadvantage) is expressly limited to *"Bei einem Mietverhältnis über Wohnraum"*. Source: https://www.gesetze-im-internet.de/bgb/__536.html (2026).
  → **Planty-specific risk:** a dead or visibly declining plant is a *Sachmangel*. Left unreplaced, the customer can legally withhold a proportion of the monthly fee without asking. Because § 536(4) is not mandatory outside residential letting, Planty **can** modify Minderung contractually — but only within AGB limits (§ 307 BGB, no gutting of the cardinal obligation). The commercially sane answer is not to exclude Minderung but to **pre-empt it with a contractual replacement SLA** ("any plant we judge to be in decline is replaced free within X working days; that is your exclusive remedy for cosmetic decline"). That is defensible; a blanket "no reduction" clause is not.
- **§ 548 BGB (Verjährung)**: *"Die Ersatzansprüche des Vermieters wegen Veränderungen oder Verschlechterungen der Mietsache verjähren in sechs Monaten"*, running *"mit dem Zeitpunkt, in dem er die Mietsache zurückerhält"*. Source: https://www.gesetze-im-internet.de/bgb/__548.html (2026).
  → **Planty must invoice damage/loss within 6 months of collecting the plant.** Build that into ops: the collection checklist must be timestamped and photographed, and any damage claim raised immediately.

## 2. Minimum term, auto-renewal and the Kündigungsbutton (Germany) — the single biggest product-design constraint

### 2.1 § 309 Nr. 9 BGB — term limits in consumer AGB
Verbatim from https://www.gesetze-im-internet.de/bgb/__309.html (2026):
- Maximum binding initial term: *"eine den anderen Vertragsteil länger als zwei Jahre bindende Laufzeit des Vertrags"* is void.
- Tacit renewal: *"eine den anderen Vertragsteil bindende stillschweigende Verlängerung des Vertragsverhältnisses, es sei denn das Vertragsverhältnis wird nur auf unbestimmte Zeit verlängert"* — i.e. since the *Gesetz für faire Verbraucherverträge* (in force for contracts concluded from 1 March 2022), an auto-renewal may only roll into an **indefinite term terminable on max. one month's notice**. A fixed 12-month auto-renewal is void.
- Maximum notice period: *"eine zu Lasten des anderen Vertragsteils längere Kündigungsfrist als einen Monat vor Ablauf der zunächst vorgesehenen Vertragsdauer"* is void.

→ **Planty MVP rule for Germany: initial term ≤ 12 months (24 is the hard ceiling), renewal into an open-ended contract cancellable with 1 month's notice, at any time.** "3-month minimum, then monthly" is fully compliant and is the right default.

### 2.2 § 312k BGB — the cancellation button
From https://www.gesetze-im-internet.de/bgb/__312k.html (2026). Applies to consumer contracts concluded **via a website** that create an **ongoing payment obligation** — exactly Planty's subscription.
- A permanently visible, clearly legible button labelled **"Verträge hier kündigen"** (or equally unambiguous wording).
- It must lead to a **confirmation page** where the consumer can state: type of termination (ordinary/extraordinary) and, for extraordinary, the grounds; identifying details; designation of the contract; the intended termination date; and an electronic means of receiving confirmation quickly.
- A **confirmation button labelled "jetzt kündigen"**.
- The consumer must be able to **save the declaration with date and time**; the trader must **immediately confirm receipt in Textform** (email is fine), stating content, time of receipt and termination date.
- Sanction, verbatim: a consumer *"kann ein Verbraucher einen Vertrag ... jederzeit und ohne Einhaltung einer Kündigungsfrist kündigen"* — **if the button is missing or defective, the customer can walk out at any moment with no notice at all.**

→ This is a **build item for the Next.js MVP, not a later polish task.** It is cheap to implement (a public `/kuendigen` route that does not require login, a form, and a transactional email) and expensive to omit — missing buttons are a classic *Abmahnung* target for Verbraucherzentrale and competitor lawyers.

### 2.3 § 312j BGB — the order button
Also from gesetze-im-internet: the order button must read **"zahlungspflichtig bestellen"** or equally clear wording and *nothing else*; the price, term, minimum duration and key terms must be displayed immediately above it. Sanction: *"Ein Vertrag nach Absatz 2 kommt nur zustande, wenn der Unternehmer seine Pflicht aus Absatz 3 erfüllt"* — **no compliant button, no contract at all.** Source: https://www.gesetze-im-internet.de/bgb/__312j.html (2026).

## 3. The 14-day withdrawal right and how it interacts with "we already delivered the plants"

- **§ 312g BGB** grants the withdrawal right for distance/off-premises consumer contracts. Its exception catalogue includes *"Verträge zur Lieferung von Waren, die schnell verderben können"* (rapidly perishable goods), individually customised goods, and *"Dienstleistungen im Zusammenhang mit Freizeitbetätigungen, wenn der Vertrag für die Erbringung einen spezifischen Termin oder Zeitraum vorsieht"*. Source: https://www.gesetze-im-internet.de/bgb/__312g.html (2026).
  → **Do not rely on the "perishable goods" exception.** A potted ficus is not *schnell verderblich* in the sense of cut flowers or fresh food, and it is being **rented, not supplied**. Assume the withdrawal right applies.
- **§ 356 Abs. 4 BGB**: for a *service* contract, the withdrawal right expires on full performance only where the consumer expressly consented in advance to performance starting before the period expired **and** acknowledged losing the right. For an ongoing rental this never "fully performs", so the right does not extinguish that way. Source: https://www.gesetze-im-internet.de/bgb/__356.html (2026).
- **§ 357a Abs. 2 BGB**: the consumer owes *Wertersatz* for services already rendered before withdrawal **only if** they expressly requested performance to begin early and were properly informed; the agreed total price is the basis, capped at market value if the agreed price is disproportionately high. Source: https://www.gesetze-im-internet.de/bgb/__357a.html (2026).
  → **MVP flow:** at checkout, an explicit, separately-ticked request — *"Ja, Planty soll vor Ablauf der Widerrufsfrist liefern; mir ist bekannt, dass ich bei Widerruf anteilig für die bis dahin erbrachte Leistung zahle"* — otherwise a customer can enjoy 13 days of installed plants and pay nothing.
- **§ 357 BGB**: goods must be returned within 14 days; the consumer bears direct return costs **only if informed**. Notably: for contracts concluded off-premises where goods were brought to the consumer's home and *"nicht per Post zurückgesandt werden können"*, the trader must collect **at its own cost**. Source: https://www.gesetze-im-internet.de/bgb/__357.html (2026).
  → A 1.8 m potted plant is exactly a "cannot be sent by post" item. Even for pure distance contracts, Planty will in practice collect. **Model the cost of a wasted delivery+collection cycle into CAC** — my estimate (not sourced): 2 van-hours per withdrawn order.
- **Art. 246a EGBGB** governs the exact pre-contractual information list; I could not fetch the article page (404 on the URL I tried), so treat the itemised list as a to-verify item with a German lawyer.

## 4. VAT — a genuinely material and easy-to-miss advantage in Germany

- **§ 12 Abs. 2 Nr. 2 UStG**, verbatim: the reduced rate applies to *"die Vermietung der in Anlage 2 bezeichneten Gegenstände mit Ausnahme der in der Nummer 49 Buchstabe f, den Nummern 53 und 54 bezeichneten Gegenstände"*. Source: https://www.gesetze-im-internet.de/ustg_1980/__12.html (2026).
- **Anlage 2 UStG Nr. 7**: *"Andere lebende Pflanzen einschließlich ihrer Wurzeln, Stecklinge und Pfropfreiser; Pilzmyzel"* — customs position **0602**. (Nr. 6 = bulbs/tubers, position 0601; Nr. 8 = cut flowers, aus 0603.) Source: https://www.gesetze-im-internet.de/ustg_1980/anlage_2.html (2026).
- **Reading**: renting a live potted plant falls squarely under "Vermietung der in Anlage 2 bezeichneten Gegenstände" → **7% VAT, not 19%.**
- **Caveat I must flag honestly**: if the offering is invoiced as one inseparable *Raumbegrünungs-Dienstleistung* (a single supply where maintenance dominates), the tax authority may treat the whole thing as a 19% service (*einheitliche Leistung*). The defensible structure is a **contract and invoice that separates the plant rental line (7%) from the care/visit line (19%)**, with the rental economically dominant. This needs a Steuerberater sign-off before launch — it is worth real money: on a €49/month B2C plan, the VAT delta between 7% and 19% is roughly €5/month per customer.
- **§ 19 UStG Kleinunternehmer**: exempt if prior-year turnover did not exceed **€25,000** and current-year turnover does not exceed **€100,000**. Source: https://www.gesetze-im-internet.de/ustg_1980/__19.html (2026).
  → For a solo-founder MVP this means **no VAT at all below €25k/yr**, but also **no input-VAT recovery on the plant stock you buy** — and plant stock is the single biggest capex. For a rental model that front-loads inventory purchase, **opting out of Kleinunternehmer status is probably correct from day one**.

## 5. Licensing, trade registration, professional qualification (Germany)

- **Gewerbeanmeldung** is required (standard *Gewerbefreiheit* regime; IHK Berlin confirms *"it is basically permitted for everyone to operate a business"* — https://www.ihk.de/berlin/service-und-beratung/recht-und-steuern/gewerberecht, 2026). I could **not** retrieve the exact Berlin fee from an official page; commonly cited figures are €15–65 depending on municipality — **treat as unverified**.
- **No Meisterpflicht.** I checked Handwerksordnung **Anlage B** (zulassungsfreie Handwerke, 56 entries) at https://www.gesetze-im-internet.de/hwo/anlage_b.html (2026): **no garden/landscape/plant trade is listed**, and it is not in Anlage A either. Garden and plant-care work is a free trade — **a solo non-horticulturist founder can legally start**. This is a meaningfully low barrier vs., say, food or electrical services.
- **§ 9 PflSchG (Sachkundenachweis)** — https://www.gesetze-im-internet.de/pflschg_2012/__9.html (2026). Certification is required to apply plant-protection products, to advise on them, to supervise helpers using them, and to sell them commercially or online. Holders must complete approved *Fortbildung* **within 3 years and every 3 years thereafter** or lose the certificate. **Exemption**: no certificate needed for products *authorised for private users* used in household/small-garden contexts, or for simple assistance under a certified person's supervision.
  → **MVP policy: technicians use only Haus- und Kleingarten-authorised products, or none at all (mechanical/biological pest control).** The moment Planty uses professional-grade PSM, at least one person needs the Sachkundenachweis. Cheap to comply with, expensive to ignore.
- **Berufsgenossenschaft**: SVLFG covers *Landwirtschaft, Forsten, Gartenbau* (https://www.svlfg.de/, 2026). Whether an indoor-plant-care service is allocated to SVLFG or to a commercial BG (VBG/BG BAU) I **could not confirm** — the specific competency page 404'd. Statutory accident insurance for employees is compulsory in Germany either way; **open question for a Steuerberater/BG enquiry.**
- **EU plant passport** (Regulation (EU) 2016/2031): I was **unable to retrieve** the Commission page or the EUR-Lex articles (404 / empty response). What I can say without a citation is only the general shape: professional operators moving *plants for planting* within the EU generally need registration and plant passports, with an exemption for supply directly to final users. **Flagged as an unverified but potentially significant B2B constraint** — Planty rotating plants between customer sites and a warehouse may count as professional movement. Must be checked with the Berlin *Pflanzenschutzdienst* before scaling.
- **Verpackungsgesetz / LUCID**: could not verify (404). If Planty ships pots/soil to consumers in packaging it likely triggers LUCID registration. Low cost, but a compliance checkbox.

## 6. Premises access, liability and insurance

The operational risk in this business is not the plants — it is **a technician with a watering can inside someone's home or an office server room.**

- **Betriebshaftpflichtversicherung** (commercial general liability) is the core cover in Germany. Two riders matter specifically for Planty and are usually **not** in the base policy:
  1. **Tätigkeitsschäden** — damage to the very thing/area you are working on (e.g. water-damaged parquet under the pot you are watering).
  2. **Schlüsselverlust** — loss of a customer's or an office's key/fob, which for a commercial building can mean re-keying an entire locking system.
  I was **unable to retrieve price figures** from an official/insurer page (both URLs I tried 404'd). **No number is asserted here.** This is a priority quote to obtain (finanzchef24, hiscox, exali) before launch.
- **AGB limits on liability caps** — § 309 BGB (https://www.gesetze-im-internet.de/bgb/__309.html, 2026), verbatim:
  - Nr. 7a: void is *"ein Ausschluss oder eine Begrenzung der Haftung für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, die auf einer fahrlässigen Pflichtverletzung des Verwenders beruhen"*.
  - Nr. 7b: void is *"ein Ausschluss oder eine Begrenzung der Haftung für sonstige Schäden, die auf einer grob fahrlässigen Pflichtverletzung"* — so **no cap survives gross negligence or personal injury**.
  - Nr. 5: a lump-sum damages clause is void if *"die Pauschale den ... zu erwartenden Schaden oder die gewöhnlich eintretende Wertminderung übersteigt"* — so a flat "€150 if a plant dies" fee must be **evidence-based against real replacement cost** and must let the customer prove lower damage.
  - Nr. 6: contractual penalties (*Vertragsstrafe*) in consumer AGB are void — so **no "early cancellation penalty"** for B2C. Charge the remaining minimum-term instalments instead (permissible as the agreed price), not a penalty.
- **Customer-side damage/loss**: Planty's claim is the ordinary Mietvertrag claim, time-barred at 6 months from return (§ 548). Cap the customer's liability for a single plant at **documented replacement value**, exclude normal wear/decline entirely (that is Planty's business risk and the whole value proposition), and never charge for a plant that simply died under Planty's own care regime.
- **Deposits (Kaution)**: there is **no statutory cap** on deposits for movable-goods rental — the § 551 BGB three-months limit applies to *Wohnraum* only. But a deposit is a hard conversion killer in B2C and is checkout friction. **Recommendation: no deposit for B2C; card-on-file authorisation only. For B2B, take a PO/framework agreement instead.**
- **Keys and access**: put key handling in the contract in writing — who may hold a key, storage (numbered, name-free fobs), immediate-notification duty on loss, and an explicit statement that Planty's staff are the only people entering. GDPR-wise, key-holder logs are personal data.

## 7. Data protection

- **Germany/EU — GDPR.** The lawful bases Planty needs (https://gdpr-info.eu/art-6-gdpr/, 2026): Art. 6(1)(b) *"processing is necessary for the performance of a contract to which the data subject is party"* covers the address, access notes and visit scheduling; Art. 6(1)(f) legitimate interests covers fraud prevention and service analytics; Art. 6(1)(a) consent is needed for marketing email.
  - Planty-specific sensitivities: **home addresses, access instructions/alarm codes, and technician photos of customers' interiors.** Photos of a living room are personal data and can incidentally capture third parties. Policy: photograph the plant, cropped, never people; retain 12 months; access-code fields encrypted and visible only to the assigned technician.
  - Supabase/Stripe are **processors** → Art. 28 DPAs required, plus a Verzeichnis von Verarbeitungstätigkeiten. A solo founder with fewer than 20 people regularly processing generally needs **no Datenschutzbeauftragter**.
- **UAE — PDPL, Federal Decree-Law No. 45 of 2021**, in force **2 January 2022** (https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws, 2026). Consent-led: it *"prohibits the processing of personal data without the consent of its owner, except for some cases..."*; sets cross-border transfer requirements; grants correction and restriction rights. The **UAE Data Office** was established under Federal Decree-Law No. 44 of 2021. **DIFC has its own regime (DIFC Law No. 5 of 2020).**
  - The u.ae page does **not** confirm that PDPL executive regulations have been issued. My understanding is that enforcement has remained light pending those regulations — **flagged as an open question, not asserted.**
  - Practically: a consent-first UAE regime is *easier* than GDPR for a small operator, but the UAE Consumer Protection Law separately bars using consumer data for marketing (below), which bites harder than GDPR does.

## 8. UAE / Dubai specifics

- **Consumer Protection — Federal Law No. 15 of 2020** (https://u.ae/en/information-and-services/justice-safety-and-the-law/consumer-protection, 2026):
  - Suppliers must *"protect consumers' privacy and data security, and refrain from using them for promotional and marketing purposes"* — a **stricter marketing rule than GDPR's soft opt-in**. Planty's UAE growth loop cannot lean on emailing its own customer base without care.
  - Invoices must be **dated and in Arabic**, with trade name, address, product type, price and quantity. → **The MVP must generate Arabic invoices.** That is a real, concrete build item that does not exist for Berlin.
  - Distance sellers must provide *"details about their licensing entity, information in Arabic about the product or service ... specifications, the terms of contract, payment, warranty"*. → **Arabic T&Cs and product pages required**, not optional.
  - Penalties: failure to provide clear information/labelling, misleading prices, or failure to repair/replace a defective product free of charge can bring **imprisonment up to 2 years and a fine up to AED 2 million**.
  - **No EU-style 14-day unconditional cooling-off** is described. The UAE regime is defect/warranty-led rather than withdrawal-led. **This is a genuine operational cost advantage for Dubai** — no wasted delivery+collection cycles from free-withdrawal customers.
- **Ownership/licensing**: 100% foreign ownership of mainland companies is available under **Federal Decree-Law No. 26 of 2020** amending the Commercial Companies Law, effective **early 2021**, refined by **Federal Decree-Law No. 32 of 2021**; the requirement for a majority Emirati shareholder and for a UAE-national service agent for foreign branches has been abolished. Excluded "strategic impact" sectors are security/defence, telecoms, banking/insurance, commercial agencies, Hajj/Umrah, fishing and Quranic institutes — **plants and landscaping are not on that list**. Source: https://u.ae/en/information-and-services/business/Doing-business/doing-business-on-the-mainland/full-foreign-ownership-of-commercial-companies (2026).
- **DET activity codes and licence fees**: **not verified.** dubaided.gov.ae returned 403 and invest.dubai.ae did not resolve. A Dubai plant-rental + maintenance operation would plausibly need a commercial licence covering ornamental plants trading plus a services activity for gardening/landscape maintenance, likely with a Dubai Municipality external approval — **but I have no citation and am not asserting it.** Priority open item.
- **Pesticides / pest control**: Dubai Municipality publishes **"Pest Control Companies Classification Guidelines", dated 04/06/2026** (https://www.dm.gov.ae/business/pest-control/). The page exposes only the PDF metadata, so I cannot state the licensing thresholds — but the existence of a **classification regime for pest-control companies** strongly implies that spraying pesticides commercially in Dubai requires a classified/approved company. **Same MVP answer as Germany: avoid professional pesticides; use approved consumer-grade or non-chemical methods.**
- **Plant import**: MOCCAE governs plant import permits and phytosanitary certificates; their services page rejected the request, so no figures. Relevant because **the UAE imports essentially all its indoor plant stock**, whereas Germany has domestic Dutch/German supply inside the single market — a supply-chain and customs difference worth pricing.
- **VAT**: UAE VAT is 5% (well-established since 2018) versus a possible 7%/19% split in Germany — simpler, and no reduced-rate structuring question.

## 9. Payments and billing

- **Stripe supports both markets.** The UAE and Germany both appear as fully launched countries with direct registration, no "preview" designation (https://stripe.com/global, © 2026). So the founder's Next.js + Stripe Billing stack works in either market — **payments are not a differentiator between Berlin and Dubai at MVP scale.**
- **SEPA Direct Debit (Germany) — the detail that matters** (https://docs.stripe.com/payments/sepa-debit, 2026):
  - Business locations supported include **DE**; **AE is not on the list** — SEPA is EU-only, so a Dubai entity cannot use it.
  - EUR only; **per-transaction limit €10,000**, plus a **€10,000 weekly limit for new accounts**.
  - Settlement **T+6 business days**; cutoff 10:30 CET.
  - The SDD rulebook requires notifying the customer at each debit; Stripe sends this automatically when using Stripe's Creditor ID.
  - **Disputes: a customer can dispute "on a no-questions-asked basis up to eight weeks after their account is debited"; between 8 weeks and 13 months they can dispute only as unauthorised — and SEPA disputes are final with no appeal process.**
  - Refunds possible up to 180 days; failed-payment retries limited to 2 attempts within 30 days.
  → **Implication:** SEPA is the payment method German B2B and many B2C customers expect, but the 8-week no-questions chargeback window plus T+6 settlement is a **working-capital and revenue-risk drag** on a business that has already sunk capex into inventory sitting in the customer's living room. **Recommendation: cards as the default rail for B2C (instant, disputable but evidence-defensible), SEPA offered for B2B/annual plans, and never SEPA for the first invoice.**
- **UAE**: cards via Stripe; **Tabby** is a UAE-regulated BNPL (*"Regulated by the UAE Central Bank"*, https://tabby.ai/en-AE, 2026) offering 4 interest-free instalments or up to 12 monthly payments. Its pages do **not** state recurring/subscription support — **Tabby is a checkout tool for a lump-sum prepaid term (e.g. "6 months upfront, split into 4"), not a subscription rail.** That is actually a neat fit for a prepaid seasonal package. Telr/Tap/Network International/Checkout.com exist as alternatives; I could not verify their subscription features in this session.

## 10. Recommended MVP terms-of-service outline (Germany-first draft)

1. **Parties, scope, definitions** — Planty (Vermieter), customer (Mieter), "Pflanzenset", "Serviceplan", "Standort".
2. **Contract formation** — order via website; § 312j-compliant *"zahlungspflichtig bestellen"* button; contract concluded on Planty's order confirmation email.
3. **Ownership** — plants, pots, substrates and planters remain Planty's property at all times; customer may not sell, pledge, sublet or move them to another address without notice; customer notifies Planty if a third party asserts rights (seizure, insolvency).
4. **Term and termination** — initial minimum term (3 or 6 months); renews **into an indefinite term**; either party may terminate with **one month's notice**; §312k cancellation button and confirmation flow described and linked; extraordinary termination for cause preserved.
5. **Withdrawal (Widerrufsbelehrung)** — full statutory 14-day notice; separate express early-performance consent with the § 357a Wertersatz acknowledgment; Planty collects the plants at its own cost.
6. **Service scope and SLA** — visit cadence, what a visit includes, seasonal rotation, and the **replacement promise as the contractual remedy for decline** (replace within X working days), with a stated exception for damage caused by the customer.
7. **Customer duties** — provide reasonable access at agreed times; do not relocate plants away from the specified light conditions; do not water/fertilise/treat without instruction; notify Planty of pests, leaks or damage promptly.
8. **Liability** — Planty's liability unlimited for injury/gross negligence/intent (mandatory, § 309 Nr. 7); limited to foreseeable, contract-typical damage for ordinary negligence in cardinal duties; customer liable for loss/destruction at documented replacement value, **explicitly excluding natural decline and normal wear**; no Vertragsstrafe.
9. **Prices, VAT and payment** — total prices incl. VAT for consumers; rental and service lines separated for the 7%/19% split; SEPA mandate wording and pre-notification; a price-change clause limited to renewal periods with a right to terminate.
10. **Return** — condition on return, Planty collects; damage claims raised within the § 548 6-month window.
11. **Insurance** — Planty carries Betriebshaftpflicht incl. Tätigkeitsschäden and Schlüsselverlust; keys handled per a named procedure.
12. **Data protection** — link to a separate GDPR notice covering address, access data and site photography.
13. **Miscellaneous** — governing law, ODR/Verbraucherschlichtung notice, severability, Impressum by reference.

For a **UAE launch**, the same skeleton needs: Arabic versions of the T&Cs and every invoice; removal of the withdrawal-right machinery; a marketing-consent regime tightened to match Law 15/2020's prohibition on using consumer data for promotion; and UAE law / Dubai Courts (or DIFC) jurisdiction.

## 11. Legal read on Berlin vs Dubai

**Germany is more regulated but more knowable, and the rules are all public, in force and free to read** — every constraint above came from a URL in one afternoon. The costs are real but bounded: build a cancellation button, run a compliant checkout, get a Sachkundenachweis or avoid professional pesticides, buy the right insurance riders, and get a VAT ruling on the 7%/19% split. The genuine downside is the **14-day withdrawal right**, which for a delivery-and-install business means paying twice for a customer who changes their mind — a cost that has no counterpart in Dubai.

**Dubai is lighter on consumer-withdrawal and VAT complexity (5% flat, no cooling-off), and 100% foreign ownership since 2021 removes the old sponsor problem.** But it imposes three concrete costs a solo German-resident founder should not wave away: **mandatory Arabic invoices and product information**, a **licensing/activity-code process I could not even read from Europe** (403s and blocked government portals are themselves a signal about how much of this runs through in-person channels and agents), and **physical presence** — plant maintenance is an on-site business and the founder is in CEST. Add near-total dependence on imported plant stock via MOCCAE permits.

On the legal lens alone, **Berlin is the lower-risk MVP market for a solo technical founder who is physically there**, with Dubai's advantages (no withdrawal right, low VAT, high villa/office density) real but only capturable with a local operator on the ground.

---

## Sources
- § 312 BGB (scope of consumer contract rules): https://www.gesetze-im-internet.de/bgb/__312.html (2026)
- § 312g BGB (withdrawal right and exceptions): https://www.gesetze-im-internet.de/bgb/__312g.html (2026)
- § 312j BGB (order button): https://www.gesetze-im-internet.de/bgb/__312j.html (2026)
- § 312k BGB (Kündigungsbutton): https://www.gesetze-im-internet.de/bgb/__312k.html (2026)
- § 309 BGB (prohibited AGB clauses incl. Nr. 5, 6, 7, 9): https://www.gesetze-im-internet.de/bgb/__309.html (2026)
- § 356 BGB (expiry of withdrawal right): https://www.gesetze-im-internet.de/bgb/__356.html (2026)
- § 357 BGB (consequences of withdrawal, return, collection): https://www.gesetze-im-internet.de/bgb/__357.html (2026)
- § 357a BGB (Wertersatz): https://www.gesetze-im-internet.de/bgb/__357a.html (2026)
- § 536 BGB (Mietminderung): https://www.gesetze-im-internet.de/bgb/__536.html (2026)
- § 548 BGB (6-month limitation): https://www.gesetze-im-internet.de/bgb/__548.html (2026)
- § 12 UStG (reduced VAT rate incl. rental): https://www.gesetze-im-internet.de/ustg_1980/__12.html (2026)
- Anlage 2 UStG (live plants, position 0602): https://www.gesetze-im-internet.de/ustg_1980/anlage_2.html (2026)
- § 19 UStG (Kleinunternehmer thresholds): https://www.gesetze-im-internet.de/ustg_1980/__19.html (2026)
- § 9 PflSchG (Sachkundenachweis): https://www.gesetze-im-internet.de/pflschg_2012/__9.html (2026)
- Handwerksordnung Anlage B: https://www.gesetze-im-internet.de/hwo/anlage_b.html (2026)
- IHK Berlin, Gewerberecht: https://www.ihk.de/berlin/service-und-beratung/recht-und-steuern/gewerberecht (2026)
- SVLFG (agriculture/forestry/horticulture accident insurance): https://www.svlfg.de/ (2026)
- GDPR Art. 6: https://gdpr-info.eu/art-6-gdpr/ (2026)
- UAE Consumer Protection (Federal Law 15/2020): https://u.ae/en/information-and-services/justice-safety-and-the-law/consumer-protection (2026)
- UAE data protection (PDPL 45/2021, Data Office 44/2021, DIFC Law 5/2020): https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws (2026)
- UAE 100% foreign ownership: https://u.ae/en/information-and-services/business/Doing-business/doing-business-on-the-mainland/full-foreign-ownership-of-commercial-companies (2026)
- Dubai Municipality, Pest Control Companies Classification Guidelines (04/06/2026): https://www.dm.gov.ae/business/pest-control/
- Stripe country availability: https://stripe.com/global (2026)
- Stripe SEPA Direct Debit docs: https://docs.stripe.com/payments/sepa-debit (2026)
- Tabby UAE: https://tabby.ai/en-AE (2026)

### Sources attempted but unavailable (no claim made from them)
- ambius.de and ambius.co.uk terms (HTTP 403), dubaided.gov.ae (403), invest.dubai.ae (DNS), moccae.gov.ae services (rejected), EUR-Lex 32016R2031 (empty), EU Commission plant-passport pages (404), Art. 246a EGBGB (404), verpackungsregister.org (404), SVLFG horticulture competency page (404), German insurance pricing pages (404).
