# Planty — Raw research notes: Legal, contracts, insurance, compliance

Lens: Legal / contracts / insurance / compliance for a plant-rental + maintenance service in (a) Germany/EU (Berlin) and (b) UAE (Dubai).
Date of research: 2026-09-09. Every number carries a source URL and the year the source states or was published. "Est." = my own estimate, not a source figure. Anecdotal/secondary sources are labelled as such.

Method: ~30 WebSearch queries (EN + DE + UAE-specific), ~35 WebFetch reads of primary/secondary pages. Several important primary texts (Cabinet Decision 66/2023 full PDF, Bird & Bird case overview, Chambers penalties article) could not be fetched (402/403/404/timeout) and are flagged as open questions.

---

## 1. Contract structure: what Planty legally is

- Planty's offer is a **mixed contract**: a lease of movable goods (Mietvertrag über bewegliche Sachen, §§ 535 ff. BGB) bundled with a recurring service (Pflege/Dienstleistung), sold at a distance to consumers (Fernabsatzvertrag) and to businesses. In German law this is a "Dauerschuldverhältnis" (continuing obligation), so all the 2022 "faire Verbraucherverträge" rules apply to B2C contracts.
- Rental of movables is barely regulated in Germany (contractual freedom on deposit, term, liability) compared to residential leases; written form is not mandatory but recommended. Suggested content of a Mietvertrag über bewegliche Sachen (8 items: parties, item description, period, rent, deposit + refund conditions, insurance, usage restrictions, damage liability). Source (2026): https://miet24.de/blog/mietvertrag-bewegliche-sachen
- Damage allocation in such leases: normal wear = lessor; improper use = lessee; force majeure = typically lessor's insurance (miet24, 2026, same URL). Statutory baseline § 538 BGB: lessee not liable for changes/deterioration from contractual use (from statute; https://www.gesetze-im-internet.de/bgb/__538.html).
- Deposit (Kaution) for movables: no statutory cap (unlike § 551 BGB's 3 months for housing); customary practice "up to six months' rent" for movables (insurancy.de, 2026, https://www.insurancy.de/kautionsversicherung/mietkaution-bewegliche-sachen/ — page fetched via search snippet only; direct fetch 404). Examples of deposits by category: cars 200–2,500 €, event equipment 100–500 € (miet24, 2026).

### What German plant-rental competitors actually put in their AGB (evidence for market norms)
- **WELO Green** (B2B office plants, nationwide): packages "ab 199 €/Monat" (Basic, offices ≤200 m², 5–10 plants), "ab 299 €/Monat" (Comfort, ≤400 m²), "ab 649 €/Monat" (Plus, ≤1000 m²); "12 Monate Mindestlaufzeit, danach monatlich kündbar"; "Alle 3 Wochen Pflege inklusive"; "Kostenlose Pflanzengarantie bei Ausfall". No deposit or damage clause published. (2025/2026) https://welo-green.de/pages/mietpflanzen
- **Decher GmbH** (event plant rental): "Bei Trockenschäden haftet der Auftraggeber mit dem Wiederbeschaffungspreis", same for loss or wilful damage; cancellation fee 35% once plants are ready, 100% after delivery on site; no deposit. https://decher.de/pflanzen-mieten/agb/
- **Pflanzenvermietung Ludwig** (Hamburg area): "Der Kunde haftet für evtl. Verlust oder sämtliche Schäden am Vertragsgegenstand" incl. those caused by guests/third parties; customer must keep plants in contractual condition at own cost; delivery only to ground-floor entrance; no deposit, no caps. https://www.pflanzenvermietung-ludwig.de/pflanzenverleih/agb.html
- **Rentaflor** (Bern, CH — not DE law but same market norm): renter liable for every damage/loss; insurance of rented items is the renter's matter. https://www.rentaflor.ch/kontakt-agb/agb/
- Takeaway: the German market norm for *short-term/event* rental is full lessee liability at replacement price with no deposit; for *long-term office* rental the norm is a 12-month minimum term, then monthly, with free replacement of declining plants included. None of the competitor AGB I could read address B2C consumers specifically (all are B2B/event-oriented) — a B2C-compliant contract would be a differentiator and also a compliance necessity.

### UAE competitor terms
- **800petals (Dubai office plant rental)**: pricing on quote only ("depends on plant count, sizes and pot finishes"); "Weekly maintenance visits by trained plant care staff"; "Free replacement of declining plants"; "Most clients choose 12-month agreements for the best monthly rate", flexible terms offered; no published deposit/damage/cancellation clauses. (2025/2026) https://800petals.com/office-plant-rental-dubai/
- **Adplants (Abu Dhabi/Dubai)**: quote-only; serves offices, hotels, retail, events *and homes*; maintenance includes "watering, pruning, pest control, and fertilizing". No published terms. https://adplants.com/pages/plant-rentals
- Hope Plants Dubai advertises "Plants & Flowers Rentals" for events/offices. https://hopeplantsdubai.com/
- Takeaway: in Dubai nobody publishes prices or terms online; weekly visits + free replacement + 12-month preferred term is the norm. An instant-quote, self-serve checkout is itself unusual in that market.

---

## 2. Germany — consumer-protection specifics (B2C)

### 2.1 § 309 Nr. 9 BGB — term, renewal, notice (contracts from 1 March 2022)
- Initial binding term in AGB: max **2 years** ("eine länger als zwei Jahre bindende Vertragslaufzeit unwirksam"). Automatic renewal is only valid if the contract renews **for an indefinite period** and the consumer can terminate the renewed contract **at any time with at most one month's notice**. Max notice period at end of the initial term: **one month** (previously 3 months; previously silent renewal of up to 1 year allowed). Applies to contracts concluded from 01.03.2022. Sources: BMJV press release 28.02.2022 https://www.bmjv.de/SharedDocs/Pressemitteilungen/DE/2022/0228_faire_Verbrauchervertraege.html ; LIEB Rechtsanwälte https://www.lieb-online.com/aktuelles/gesetzesaenderung-des-309-nr-9-bgb-neue-regeln-zur-kuendigung-und-vertragsverlaengerung-in-b2c-dauerschuldverhaeltnissen/
- Verbatim (§ 309 Nr. 9 lit. b BGB, quoted by BMJV): "sich der Vertrag auf unbestimmte Zeit verlängert und dem Verbraucher das Recht eingeräumt wird, das verlängerte Vertragsverhältnis jederzeit mit einer Frist von höchstens einem Monat zu kündigen".
- B2B: § 309 applies to B2B only indirectly via § 310 BGB with "großzügige Maßstäbe" (LIEB, same URL) — so 12-month office contracts with e.g. 3-month notice remain feasible for B2B, but keep them reasonable.
- Consequence: an invalid clause is void; the contract continues without it (statutory default = terminable).

### 2.2 § 312k BGB — Kündigungsbutton (since 1 July 2022)
- Any B2C continuing-obligation contract concluded online (or where online conclusion was offered) must have a cancellation button. Required flow: (1) a permanently visible, immediately accessible button labelled unambiguously, e.g. **"Verträge hier kündigen"** (statute) / courts accepted **"Jetzt kündigen"**, rejected "Kündigungsabsicht abschicken"; (2) a confirmation page that collects only the statutory data (type of termination, reason if extraordinary, identification, contract, date, e-mail) and a confirm button ("jetzt kündigen"); (3) immediate confirmation of receipt in Textform (e-mail) with date/time; consumer must be able to save the cancellation on a durable medium.
- **No login may be required before reaching the button** (OLG Köln, Jan 2025; LG München I, Oct 2023). A password may be requested on the confirmation page only as an identification feature, not as a login (LG Berlin II, Nov 2024).
- Sanction: if the button is missing/non-compliant, the consumer can terminate **"jederzeit und ohne Einhaltung einer Kündigungsfrist"** (at any time without notice), plus competitor/consumer-association injunctions (Abmahnung risk).
- Source: Kanzlei Plutte overview (2025) https://www.ra-plutte.de/kuendigung-online-abo-alles-wichtige-312k-bgb/ ; statute https://dejure.org/gesetze/BGB/312k.html
- **BGH 22.05.2025, I ZR 161/24 ("OTTO UP Plus")**: a cancellation button is required even for fixed-term contracts with a one-off payment (€9.90 / 12 months) that end automatically — because the consumer still needs it for extraordinary termination. Source: vzbv https://www.vzbv.de/urteile/bundesgerichtshof-kuendigungsbutton-ist-auch-bei-laufzeitvertraegen-mit-einmalzahlung ; anwalt24 https://www.anwalt24.de/urteile/bgh/2025-05-22/i-zr-161_24
- Implication for Planty: even a "2-week" or "1-month" one-off rental sold online to a consumer needs the button (for extraordinary termination). Build it once in the Next.js app (public route, no auth) from day 1.

### 2.3 Widerrufsrecht (14-day withdrawal, §§ 312g, 355, 357a BGB)
- Distance contracts with consumers carry a 14-day withdrawal right from contract conclusion (for services) — also for rental of movables sold at a distance (rental contracts are "Verträge über die Vermietung" and are not excluded; the housing carve-out § 312 Abs. 4 BGB concerns Wohnraum only). Without proper instruction the period runs up to **12 months + 14 days**. Sources: NRW-Justiz https://www.justiz.nrw.de/BS/Verbraucherschutz/widerruf ; Heinicke Eggebrecht https://www.heinicke-eggebrecht.com/widerruf-bei-mietvertraegen/
- If Planty starts delivering/maintaining before the 14 days end, it must obtain the consumer's **express request** to start early plus acknowledgement that they lose the withdrawal right upon full performance (§ 356 Abs. 4, § 357a Abs. 2 BGB). Then on withdrawal the consumer owes **Wertersatz pro rata temporis** based on the agreed total price (or market value if the price is disproportionate). Source: statute https://www.gesetze-im-internet.de/bgb/__357a.html ; Trusted Shops https://business.trustedshops.de/blog/legal/widerruf-von-dienstleistungen-das-muessen-sie-unbedingt-beachten
- Practical: checkout needs (a) Widerrufsbelehrung + Muster-Widerrufsformular, (b) checkbox "Ich verlange ausdrücklich, dass Sie vor Ablauf der Widerrufsfrist mit der Lieferung/Leistung beginnen …", (c) § 312j Abs. 3 BGB order button labelled "zahlungspflichtig bestellen" (statute; https://dejure.org/gesetze/BGB/312j.html — from my knowledge of the norm, not fetched).
- Note: on withdrawal the plants (rented goods) are collected by Planty; Planty should bear collection cost for plants it delivered (analogous to § 357 Abs. 6 return-cost rules for goods that cannot be posted — my interpretation; confirm with counsel).

### 2.4 Other German items
- Gewerbeanmeldung Berlin: **€15 online / €26 in person** (2025/2026). Source: sevdesk https://sevdesk.de/ratgeber/gruenden/selbstaendigkeit-anmelden/gewerbe/gewerbe-anmelden-in-berlin/ (snippet). Plant rental/maintenance is a free trade (no Meisterpflicht) — my assessment; only the plant-protection Sachkunde (below) is a personal qualification requirement.
- Kleinunternehmerregelung 2025: €25,000 previous-year / €100,000 current-year thresholds (Taxfix, 2025/2026 https://taxfix.de/ratgeber/selbststaendige/kleinunternehmergrenze/). Not attractive for Planty (B2B clients want VAT invoices; input VAT on plants/vans).
- **VAT rate**: supply of live plants = 7% (§ 12 Abs. 2 Nr. 1 UStG, Anlage 2). Rental of Anlage-2 items can be 7% (§ 12 Abs. 2 Nr. 2 UStG), BUT once delivery, set-up, watering, removal and return transport are bundled it is treated as a single service at **19%**: "Kommen Lieferung, Aufstellen, Bewässern, Abbau und Rücktransport hinzu, handelt es sich um eine Dienstleistung. Diese wird in der Regel mit dem allgemeinen Steuersatz abgerechnet." (ETL, 2025, https://www.etl.de/aktuelles/oh-tannenbaum-oh-tannenbaum/). BFH: plant delivery + garden work = one service at 19% even with two contracts (Mayer & Kollegen https://www.mayer-und-kollegen.de/themen-und-fakten/umsatzsteuer/umsatzsteuer-im-gartenbau-wann-ist-der-ermassigte-umsatzsteuersatz-anzuwenden/). → Plan B2C prices at 19% gross; do not count on 7%.

---

## 3. Germany — premises access, liability, insurance

- **Betriebshaftpflicht** (business liability) is not legally mandatory for horticulture/plant care (status 03/2025) but is the practical must-have. Recommended cover **≥ €3m** flat for personal/property damage; €5m is now market standard and "costs only a few euros more". Sources: insurancy https://www.insurancy.de/betriebshaftpflichtversicherung/gartenbau/ ; nuernberger.de / fixversichert (2025/2026) https://fixversichert.de/ratgeber/betriebshaftpflicht-kleingewerbe-kosten/
- Price points found (all secondary/broker sites, 2025–2026): "Betriebshaftpflicht für Landschaftsbau ab ca. **691,87 €/Jahr**" (betriebshaftpflicht24 snippet, 2025, https://www.betriebshaftpflicht24.de/betriebshaftpflicht-landschaftsbau.html); generic small-trade range "77,28 € bis 3.178,49 € pro Jahr" depending on cover (fixversichert); "Gartenservice und Gartenpflege stellen geringere Risiken dar [als GaLaBau] und werden … zu einem günstigeren Beitrag übernommen" (kopf-versicherungen https://www.kopf-versicherungen.de/betriebshaftpflicht/betriebshaftpflicht-gartenbau/). Est.: budget €400–900/yr for a solo plant-care operation with €5m cover — my estimate from these ranges, get quotes.
- Clauses Planty specifically needs (from the water-damage/keys risk profile): **Tätigkeits-/Bearbeitungsschäden** (damage to the customer's floor/furniture while working — often excluded or sub-limited by default), **Obhutsschäden**, **Mietsachschäden**, and a **Schlüsselverlust-Klausel**: key loss "ist in einer Standard-Betriebshaftpflicht meist nicht automatisch mitversichert, sondern nur mit einer gesondert vereinbarten Schlüsselverlust-Klausel"; recommended sub-limit **€50,000** for professional keys; replacement of a Schließanlage can cost "mehrere Tausend Euro"; theft (vs. loss) is mostly excluded and gross negligence usually not covered. Sources: firmeno https://www.firmeno.de/betriebshaftpflichtversicherung/schluesselverlust.html ; Hiscox https://www.hiscox.de/glossar/schluesselverlust-schluesselschaden/ ; pfefferminzia https://www.pfefferminzia.de/gewerbe/versicherung-als-tueroeffner-schluessel-weg-wann-zahlt-die-betriebshaftpflicht/
- Ops implication: avoid holding house keys in B2C at all in the MVP (customer must be present / concierge / smart lock); for B2B use signed key-handover protocol and a key safe; log every visit with timestamped photos (also GDPR-relevant, see §6).

---

## 4. Germany/EU — plant health (Pflanzenpass) and pesticides

### 4.1 Plant passports (Reg. (EU) 2016/2031, since 14.12.2019)
- Since 2019 **all living plants incl. pot plants (Topfpflanzen)** are plant-passport goods when moved between professional operators in the EU. Exemption (Art. 81(1)): no passport needed for **direct supply to a final user (Endnutzer)** — but this exemption does **not** apply if the final user receives the plants by **distance selling (Fernabsatz)**, nor in protected zones. Sources: ISIP Brandenburg https://www.isip.de/brandenburg/pflanzenschutzdienst/pflanzengesundheitskontrolle/pflanzenpasspflicht-390566 ; LWK NRW https://www.landwirtschaftskammer.de/landwirtschaft/pflanzenschutz/psd/pflanzenpass-anbaumaterial.htm
- "Endnutzer" = any natural or legal person who acquires plants **outside their professional activity** for their own use (e.g. hobby gardeners, municipalities) (Sachsen/ADD RLP summaries, https://www.landwirtschaft.sachsen.de/pflanzenpass-43737.html ; https://add.rlp.de/themen/landwirtschaft-und-weinbau/pflanzenschutz/pflanzengesundheit/pflanzenpass-und-handel-im-binnenmarkt). An office that merely decorates its premises is plausibly a "final user" too, but authorities read it narrowly — open question.
- Registration (Art. 65/66): a trader supplying small quantities directly to private final users need not register, **"except for distance selling (online trade, catalogue and similar)"** — i.e. online traders must register with the Pflanzenschutzdienst (Berlin: Pflanzenschutzamt Berlin). (ADD RLP / LfL https://www.lfl.bayern.de/ips/pflanzengesundheit/224407/index.php). Registration is free/low-cost and issues a registration number.
- Practical reading for Planty: Planty buys from wholesalers *with* passports (they issue them); Planty as a registered operator keeps the passport/records (traceability 3 years) and does not need to issue new passports as long as it does not split/repot into new trade units for onward supply to professional operators. Rental to consumers/offices delivered by Planty's own van is not postal "Fernabsatz" in the narrow sense used by the authorities ("Transport durch Post- oder Paketdienste") — but the contract is concluded online, so register anyway (cheap, removes the ambiguity). **Confirm with Pflanzenschutzamt Berlin** — open question.

### 4.2 Pesticides / plant protection (PflSchG)
- Anyone applying plant-protection products professionally needs the **Sachkundenachweis** (§ 9 PflSchG), explicitly including "Dienstleister in Büros an Zimmerpflanzen" (service providers applying products to houseplants in offices). Card format; mandatory refresher training every 3 years. Sources: Berlin Pflanzenschutzamt https://www.berlin.de/pflanzenschutzamt/ueberwachung/sachkundenachweis/ ; LfL https://www.lfl.bayern.de/ips/recht/054922/ ; PflSchSachkV https://www.gesetze-im-internet.de/pflschsachkv_2013/BJNR195310013.html
- Additionally **§ 10 PflSchG Meldepflicht**: persons applying products *for others* (service providers, incl. "als Dienstleister in Büros an Zimmerpflanzen") must notify the competent authority **before starting** the activity; prerequisite = Sachkunde. Source: LfL https://www.lfl.bayern.de/ips/recht/026363/index.php
- MVP workaround: adopt a **"no chemical plant-protection products" policy** — use mechanical control (wiping, showering, sticky traps), biological control (beneficial insects), and swap-out of infested plants (which Planty's model already does). Products that are *not* plant-protection products (e.g. plain soap/neem-oil products may or may not be classified — check) avoid the Sachkunde requirement. Est.: Sachkunde course + exam ~€200–400 and a few days — secondary sites mention costs but I could not verify a figure (bussgeldkatalog.org https://www.bussgeldkatalog.org/sachkundenachweis-pflanzenschutz/).

---

## 5. UAE — consumer protection and e-commerce

### 5.1 Federal Law 15/2020 on Consumer Protection + Cabinet Decision 66/2023 (executive regulation, in force 14 Oct 2023)
- Scope: all goods and services offered by suppliers in mainland **and free zones**, incl. e-commerce platforms registered in the UAE; "any legal person who offers a service or a commodity to the consumer". Sources: MoET https://www.moet.gov.ae/en/web/guest/federal-law-no-15-of-2020-on-consumer-protection ; ohllp https://ohllp.com/consumer-protection-uae ; Afridi & Angell https://afridi-angell.com/executive-regulations-concerning-the-uae-consumer-protection-law/
- **No statutory cooling-off / change-of-mind right**: "There is no general cooling-off period … your right is contractual, governed by the platform's published return policy, not by a UAE-wide cooling-off law" (uaeexperthub, Aug 2026, https://www.uaeexperthub.com/consumer-rights-uae-returns-refunds-counterfeit/); "UAE law does not mandate a general change-of-mind return right" (Noura Lawyers guide, 2026, https://www.almaazmilawyers.com/insights/uae-consumer-protection-rights-guide). Consumers can cancel an online order **before dispatch** and return goods that do not match the description at supplier's cost.
- Unfair terms that are **null and void** (Cabinet Decision 66/2023, per Afridi & Angell / ohllp / K&L Gates): unilateral amendment or termination by the supplier, cancelling/limiting the consumer's compensation claims, refusing refunds when the supplier breaches, forcing a particular finance/insurance provider, terms hidden in fine print/invoices. Source: K&L Gates (Jan 2024) https://www.klgates.com/Update-UAE-Consumer-Protection-and-E-Commerce-Laws-1-23-2024
- Penalties: misleading descriptions up to **AED 250,000**; general violations **AED 50,000–1,000,000** plus licence suspension/removal (Afridi & Angell, 2023). Federal Decree-Law 5/2023 amendment: penalties up to **AED 2,000,000**, criminal up to **AED 5,000,000** (Noura Lawyers guide, 2026). Secondary source claims a table of 46 fines "Dh 100,000 to Dh 1 million" (Chambers — page not fetchable, treat as unverified).
- Warranty: 2-year mandatory warranty for tangible goods, 6-month presumption of defect (Noura Lawyers, 2026) — relevant only marginally (Planty rents, does not sell).
- **Auto-renewal**: a business-setup blog states "a gym membership contract that auto-renews for 12 months without 30-day advance notice to the consumer is unenforceable" and cites Cabinet Decision 66/2023 (dubaisouthbh, 2026, https://dubaisouthbh.com/blogs/uae-consumer-protection-regulations). I could **not** verify this article number in the primary text (PDF fetch timed out). Treat as **unverified secondary**; design for it anyway (30-day renewal reminder e-mail).
- Same blog claims: written/digital receipt required for every transaction **≥ AED 100**; warranty docs and labelling in **Arabic**, fines AED 10,000–100,000 — secondary, unverified.
- Complaints go to consumerrights.ae (federal) or Dubai DET Consumer Protection, hotline 600 545 555 (Noura Lawyers, 2026).

### 5.2 Federal Decree-Law 14/2023 "Trading by Modern Technological Means" (e-commerce law, in force Sept 2023)
- Applies to websites, apps, social accounts and marketplaces. Traders must be licensed; issue a **non-paper (digital) invoice** for every transaction; display a clear **return and refund policy before purchase**; "information, advertisements, and contracts … must be in Arabic or any other language in addition to Arabic"; provide permanently staffed phone support; allow opt-out of marketing; **no surcharge for digital payment**; mandatory arbitration cannot be imposed for disputes < USD 50,000; data processing per PDPL. Penalties to be set by a later Cabinet Decision. Sources: Reed Smith https://www.reedsmith.com/our-insights/blogs/viewpoints/102iqny/uae-federal-law-on-modern-trading-by-technological-means/ ; Khairallah (2025) https://www.khairallahlegal.com/federal-decree-law-no-14-2023-on-trading-by-modern-technological-means/ ; K&L Gates (2024) as above.
- Implication: the Planty UAE site needs an **Arabic version of T&Cs, invoices and key info** (bilingual EN/AR) — a real cost for a solo founder (translation + legal review), and a phone support number.

### 5.3 UAE lease of movables (Civil Code, Fed. Law 5/1985)
- The Civil Code lease chapter (Art. 742 ff.) applies to movables; lessor must keep the thing fit for use; lessee liable for damage caused by fault/improper use; for finance leases risk of loss passes to lessee on delivery unless agreed otherwise. Sources: Al Suwaidi https://alsuwaidi.ae/weather-related-damage-in-uae-tenancies-who-ultimately-bears-the-risk/ ; ATB Legal https://atblegal.com/blog/uae-revises-finance-lease-laws/ ; Civil Code text https://www.acerislaw.com/wp-content/uploads/2024/09/UAE-Civil-Code.pdf (not read in full). Contractual freedom is wide; deposits are common in UAE rentals and not capped by consumer law that I could find (open question).

---

## 6. Data protection

- **Germany/EU — GDPR**: standard. Planty processes names, addresses, access instructions, technician visit logs and *photos of the inside of homes* (sensitive in practice, not "special category" legally). Needs: privacy notice, Art. 28 processor agreements (Supabase — choose EU region; Stripe; e-mail provider), records of processing, data-minimised photo policy (plants only, retention e.g. 90 days), technician devices with MDM/lock. No numbers needed.
- **UAE — PDPL (Federal Decree-Law 45/2021, in force 2 Jan 2022)**: applies to controllers/processors in the UAE (free zones DIFC/ADGM have their own regimes). **Executive regulations still not published as of 6 Jan 2025** (DLA Piper, updated 27 Jan 2025, https://www.dlapiperdataprotection.com/countries/uae-general/law.html); some 2026 vendor blogs claim they were issued (e.g. as "Cabinet Resolution 33/2022" or "111/2023") but an Aug 2026 check of the UAE legislation portal found nothing (uaeexperthub) — **conflicting; treat as not yet fully in force**, Data Office "not yet fully operational". Consent-based processing with contract-performance exception; cross-border transfer only to adequate jurisdictions or with SCC-style contract/express consent; DPO only for high-risk/large-scale sensitive processing; breach notification to Data Office; PDPL itself sets no fines (Cabinet decision pending), but Cyber Crime Law fines up to **AED 500,000** for illegal data collection (DLA Piper, 2025). Vendor blogs cite AED 50,000–5,000,000 ranges (bshsoft/eShield, 2026) — unverified.
- Practical: hosting Supabase in an EU region for UAE customers is a cross-border transfer under PDPL; with unpublished regulations the practical approach is express consent in the sign-up flow + contract clause. Low enforcement risk for a micro-business today; not zero.

---

## 7. Payments

### 7.1 Germany
- Stripe DE (official pricing page, 2026): EEA cards **1.5% + €0.25**; UK cards 2.5% + €0.25; non-EEA 3.15% + €0.25 (+2% FX); **SEPA Lastschrift €0.35** per transaction; **Billing 0.7%** of billing volume (pay-as-you-go); chargeback €20. https://stripe.com/de/pricing
- SEPA Core Direct Debit mechanics: creditor needs an 18-character **Gläubiger-ID** from the Bundesbank and a mandate reference (≤35 chars); mandate can be collected electronically via Stripe; **pre-notification (Vorabankündigung) at least 14 days before due date unless a shorter period is agreed** (Stripe's mandate text agrees a shorter period); consumer has an **unconditional 8-week chargeback right** on authorised SEPA Core debits (13 months if unauthorised). Sources: DKB https://www.dkb.de/geschaeftskunden/electronic-banking/sepa ; GoCardless https://gocardless.com/de/handbuch/artikel/sepa-pre-notification ; Qonto https://qonto.com/de/blog/bezahlmethoden/lastschriftverfahren/lastschrift-zurueckbuchen
- Implication: SEPA is cheapest for monthly plans (€0.35 vs ~€0.55 on a €20 card charge) but carries 8-week reversal risk; cards/Link for the first payment, SEPA optional for recurring. Stripe Billing + Customer Portal covers invoices, dunning, proration; the Kündigungsbutton must still be Planty's own public page (not behind Stripe portal login).

### 7.2 UAE
- **Stripe is live in the UAE**: Billing, Checkout, Connect, Payment Links, Radar, Tax available; cards Visa/Mastercard, Apple Pay, Google Pay, Link; minimum charge **AED 2.00**. https://support.stripe.com/questions/which-payments-methods-and-products-are-available-in-the-uae
- Stripe AE pricing (official, 2026): **2.9% + AED 1.00** per successful domestic card charge; +1% international cards; +1% FX; Billing **0.7%** or from AED 2,200/month; dispute fee **AED 60**; standard payouts free. https://stripe.com/ae/pricing
- Eligibility: UAE trade licence or **freelancer permit** (sole establishments and **free-zone entities qualify**; LLCs need MoA), UAE bank account (sole establishments may use a personal account), Emirates ID/visa copies of owners; payouts in AED/USD on **T+5** business days. Source: Stripe dev blog https://stripe.dev/blog/getting-started-with-stripe-in-the-uae
- Alternatives (secondary comparison sites, 2026): Tap Payments 2.75% flat headline, all-in "3.15–3.55%", payouts T+3, chargeback ~AED 92, no monthly fee (GulfSaasReview https://gulfsaasreview.com/article/tap-payments-transaction-fees-uae-2026); Telr ~AED 99/month + 2.49% + AED 0.50 (skimbox https://www.skimbox.us/en/resources/blogs/uae-payment-gateway-comparison-telr-stripe-checkout); PayTabs "1.75% + AED 1" (GulfSaasReview); Checkout.com custom pricing, minimum volumes, "if under $50,000/month a regional gateway is more practical" (paymentproviders.io https://paymentproviders.io/blog/best-payment-gateways-uae-saudi-arabia). Tabby: BNPL, merchant fees "2.79%–5.99%" (skimbox) / "4–6%" (other) — consumer-side pay-in-4; Tabby is **not** a subscription-billing rail for merchants (only a separate Tabby+ consumer subscription at AED 49/month exists; seamlessxtra https://seamlessxtra.com/tabby-launches-monthly-subscription-for-uae-shoppers/). Not useful for recurring plant rental; maybe for an upfront 3-month prepay.
- Verdict: Stripe Billing works in both markets with the same code base; UAE card cost is roughly **2× Germany** (2.9% + AED 1 vs 1.5% + €0.25) and there is no cheap SEPA equivalent (UAE direct debit "UAEDDS" exists but is not on Stripe).

---

## 8. Business licensing

### 8.1 Germany
- Gewerbeanmeldung Berlin €15 online / €26 in person (2025/26, sevdesk). Register with Pflanzenschutzamt Berlin as plant-passport operator (free). Sachkunde only if applying plant-protection products. IHK membership automatic. Est. total set-up cost < €100 excluding insurance and tax advisor.

### 8.2 Dubai
- Relevant DET activity: **8130.00 "Landscape Care and Maintenance Service Activities"** (Services to Buildings and Landscape Activities) — explicitly includes "indoor gardens maintenance"; requires **third-party approval from Dubai Municipality's Agriculture & Irrigation Department before licence issuance**. Excludes nurseries/production. Design work = 7110.44 "Landscape Architecture Services" (approval after issuance). Source: Meydan Free Zone activity hub https://www.meydanfz.ae/activity-hub/start-a-landscaping-business-dubai ; Flyingcolour (updated Aug 2025): "total Governmental cost of the professional license is **AED 9,538 approx** + external approval fees from Dubai Municipality" https://www.flyingcolour.net/blog/starting-a-landscaping-business-in-dubai/ ; Meydan FZ package prices from **AED 12,500** (company formation). No dedicated "plant rental" activity code found; rental would be covered by combining 8130.00 with a trading/rental activity (e.g. flowers & plants trading) — **confirm with DET / a corporate-services agent** (open question).
- For residential work, secondary sources say mainland (DET) licensing is "almost always required" for property maintenance firms and mainland set-up runs **AED 15,000–25,000**; technicians must be sponsored via MOHRE with work visas at roughly **AED 1,500–3,500 per employee** sponsorship cost; a general maintenance firm is expected to carry public liability of at least **AED 100,000** (handyman/maintenance licence guides, 2026: https://swifthub.ae/get-general-maintenance-license-in-dubai/ ; https://mrhandymandubai.com/license-insurance/) — secondary, business-setup marketing sites.
- Free zone → mainland: since Executive Council Resolution 11/2025 (March 2025) free-zone companies can obtain a **DET "Free Zone Mainland Operating Permit"** for approved (mostly non-regulated) activities; DET published the approved-activity list on 3 Sept 2025; unclear whether 8130.00 (which needs Dubai Municipality approval) is on it. Sources: Dubai Media Office (Oct 2025) https://mediaoffice.ae/en/news/2025/october/08-10/dubai-launches-free-zone-mainland-operating-permit ; CMS https://cms.law/en/are/legal-updates/dubai-s-game-changer-new-executive-council-resolution-unlocks-mainland-access-for-free-zone-companies
- Pesticides in Dubai: applying pesticides commercially requires a **Public Health Pest Control licence (activity 8129.92)** with a Dubai Municipality Public Health & Safety operational permit; technicians need certified training and individual permits; only MOCCAE-registered pesticides may be used (Ministerial Decree 27/2018; 167 pesticides banned, 32 restricted). Sources: Meydan FZ https://www.meydanfz.ae/activity-hub/apply-for-a-public-health-pests-control-services-license-in-dubai ; alwahahygiene (2026) https://www.alwahahygiene.ae/the-ultimate-guide-to-dubai-municipality-approved-pest-control-standards-2026/ ; Gulf News on MOCCAE registration https://gulfnews.com/uae/environment/new-rules-on-pesticide-registration-issued-1.2170545 . Whether a landscaping-licensed firm may apply *agricultural* pesticides on ornamental plants without the pest-control licence is not clear from public sources — **open question**; MVP policy again: no chemical pesticides, swap infested plants.
- Insurance UAE: public liability is not mandatory federally but usually required by landlords/free zones/contracts; SME plans advertised "from AED 500" (PolicyBazaar UAE, 2025/26, https://www.policybazaar.ae/business-insurance/public-liability-insurance/ — page fetch 403, snippet only); general liability typically **AED 2,000–10,000+/yr** for SMEs (naviracorporate 2025/26 https://www.naviracorporate.com/blog/business-insurance-in-uae/); contractors AED 2,000–25,000/yr (uaecontractorshub). Est.: budget AED 2,000–4,000/yr for a small plant-care firm — my estimate.
- Tax UAE: VAT 5% (registration mandatory above AED 375,000 taxable turnover — statutory, from knowledge); corporate tax 9% above AED 375,000 taxable income, and **Small Business Relief** (0% CT election) for revenue ≤ AED 3m, originally to 31 Dec 2026, reported extended by Ministerial Decision 131/2026 (29 July 2026) to periods ending on/before 31 Dec 2029 (secondary tax-firm blogs, 2026, e.g. https://theaccountant.ae/small-business-relief-uae-corporate-tax/ ; https://afridi-angell.com/corporate-tax-threshold-for-small-business-relief-set-at-aed-3-million-or-less/ for the AED 3m figure). The 2029 extension is from vendor blogs — verify on mof.gov.ae.

---

## 9. Comparison table (legal/compliance burden for a solo founder)

| Item | Berlin / DE | Dubai / UAE |
|---|---|---|
| Set-up licence | €15–26 Gewerbe; free plant-health registration | AED ~9.5k govt fees + DM approval + office/flexi-desk; AED 12.5k–25k all-in typical (2025/26, secondary) |
| Consumer withdrawal | 14-day Widerruf, pro-rata Wertersatz if early start | none statutory; policy-driven; cancel before dispatch |
| Term/renewal (B2C) | max 24 m; renewal only indefinite + ≤1 m notice; mandatory Kündigungsbutton (BGH 2025 even for one-off) | no explicit cap found; 30-day renewal notice claimed (unverified); no unilateral termination/amendment clauses |
| Language | German T&Cs | Arabic + English required for contracts/info (e-commerce law) |
| Liability insurance | ~€400–900/yr est. (€5m cover), needs key-loss + Tätigkeitsschaden clauses | ~AED 2–10k/yr; often ≥AED 100k demanded |
| Pesticides | Sachkunde + § 10 notification if any PSM used | separate pest-control licence + DM permit; MOCCAE-registered products only |
| Payments | Stripe 1.5%+€0.25; SEPA €0.35; Billing 0.7% | Stripe 2.9%+AED1; Billing 0.7%; no cheap DD |
| Data | GDPR, EU hosting easy | PDPL, regulations unsettled; cross-border consent |
| Tax | 19% VAT on bundled rental+care | 5% VAT; 0% CT under SBR ≤AED 3m |

---

## 10. Recommended MVP Terms-of-Service outline (both markets, market-specific annexes)

1. **Parties & definitions** — Planty (owner/lessor + service provider); Customer (Consumer vs Business flag captured at checkout, drives which annex applies).
2. **Subject** — rental of living plants + containers; **title remains with Planty at all times**; customer gets possession/use only; no sub-letting, no relocation outside the delivery address without consent.
3. **Ordering** — offer/acceptance at order confirmation; DE: § 312j "zahlungspflichtig bestellen" button, AGB + Widerrufsbelehrung provided in Textform; UAE: bilingual EN/AR summary, digital invoice per transaction.
4. **Plans, term, renewal** — fixed plans (2 wk / 1 m / 3 m) end automatically; "ongoing" plan = indefinite, cancellable monthly (DE: ≤1-month notice; UAE: same, plus 30-day renewal reminder e-mail). B2B: 12-month minimum then monthly, 1-month notice (WELO-style norm). Cancellation button page (public, no login) + e-mail confirmation.
5. **Withdrawal (DE consumers)** — 14 days; express request to start early + pro-rata Wertersatz; collection by Planty free of charge. UAE: cancellation free until dispatch; after installation, early termination = fee of X days' rent (must be proportionate — UAE bans "disproportionate" termination charges).
6. **Delivery & installation** — access window; customer must be present or provide access; ground-floor/elevator conditions; site suitability (light/AC) disclaimer.
7. **Maintenance visits** — cadence per plan; customer to allow access; missed-visit policy (one free reschedule, then a fee); no chemical pesticides in MVP — Planty swaps infested plants instead.
8. **Plant health guarantee / replacement** — Planty replaces declining plants at no cost when decline is not caused by the customer; seasonal rotation at Planty's discretion with equivalent value.
9. **Customer duties & liability** — keep plants at address, no watering unless instructed, no pets/children damage; customer liable for **loss, theft, wilful/negligent damage** (DE: fault-based, normal wear excluded per § 538 BGB); valuation at **replacement cost per the price list**, with an aggregate **cap = 3 months' rent** for consumers (my recommendation — a cap is not required by law but makes the clause defensible in AGB review); business customers: replacement cost uncapped.
10. **Deposit** — B2C MVP: **no deposit** (card on file + capped liability instead; deposits raise checkout friction and refund admin); B2B: optional 1-month deposit or first+last month.
11. **Planty's liability** — unlimited for injury/gross negligence (mandatory in DE §309 Nr. 7); otherwise limited to foreseeable, contract-typical damage; water/floor damage during visits covered by Planty's liability insurance; customer to disclose sensitive floors/electronics; Planty not liable for allergies/pets (disclose plant toxicity list).
12. **Keys & access data** — keys only under a separate signed key-handover protocol (B2B); GDPR/PDPL-compliant storage of access codes; visit photo policy.
13. **Prices & payment** — gross prices incl. VAT (19% DE / 5% UAE); monthly in advance; Stripe card / SEPA (DE) with mandate text and pre-notification period; failed-payment retry and suspension after 14 days; no surcharge for digital payment (UAE law).
14. **Termination for cause** — non-payment, repeated denied access, misuse; collection within 7 days; charges accrue until collection is possible.
15. **Data protection** — reference to Privacy Policy (GDPR / PDPL), cross-border transfer consent (UAE).
16. **Governing law & disputes** — DE: German law, ODR/consumer arbitration note (§ 36 VSBG); UAE: UAE law, Dubai courts; no mandatory arbitration for consumers (< USD 50k rule).
17. **Changes to T&Cs** — DE: only with notice and right to object (no unilateral change clause); UAE: same (unilateral amendment terms are void).

---

## 11. Open questions (need a lawyer / authority call before launch)
1. DE: does renting plants to an office count as supply to a "final user" (no plant passport) or to a professional operator (passport + traceability)? Ask Pflanzenschutzamt Berlin; register regardless.
2. DE: exact VAT treatment of a plan where rental is dominant and care is ancillary — any chance of 7%? Ask a Steuerberater; plan for 19%.
3. UAE: verify in the primary text of Cabinet Decision 66/2023 whether there is an auto-renewal notice rule (30 days) and any statutory return period for services; fetch failed.
4. UAE: which DET activity combination covers *rental* of plants to residences (8130.00 + a rental/trading code?) and whether 8130.00 is on the free-zone mainland-permit list.
5. UAE: whether a landscaping-licensed firm may apply MOCCAE-registered ornamental pesticides without a pest-control licence.
6. UAE: PDPL executive-regulation status in 2026 — conflicting reports.
7. Both: Betriebshaftpflicht / public liability quotes with explicit Tätigkeitsschäden + key-loss cover for a "Pflanzenpflege im Innenraum" risk class.

---

## Sources (all accessed 2026-09-09)
- https://www.ra-plutte.de/kuendigung-online-abo-alles-wichtige-312k-bgb/
- https://dejure.org/gesetze/BGB/312k.html
- https://www.vzbv.de/urteile/bundesgerichtshof-kuendigungsbutton-ist-auch-bei-laufzeitvertraegen-mit-einmalzahlung
- https://www.anwalt24.de/urteile/bgh/2025-05-22/i-zr-161_24
- https://www.bmjv.de/SharedDocs/Pressemitteilungen/DE/2022/0228_faire_Verbrauchervertraege.html
- https://www.lieb-online.com/aktuelles/gesetzesaenderung-des-309-nr-9-bgb-neue-regeln-zur-kuendigung-und-vertragsverlaengerung-in-b2c-dauerschuldverhaeltnissen/
- https://www.gesetze-im-internet.de/bgb/__357a.html
- https://business.trustedshops.de/blog/legal/widerruf-von-dienstleistungen-das-muessen-sie-unbedingt-beachten
- https://www.justiz.nrw.de/BS/Verbraucherschutz/widerruf
- https://www.heinicke-eggebrecht.com/widerruf-bei-mietvertraegen/
- https://miet24.de/blog/mietvertrag-bewegliche-sachen
- https://www.insurancy.de/kautionsversicherung/mietkaution-bewegliche-sachen/
- https://welo-green.de/pages/mietpflanzen
- https://decher.de/pflanzen-mieten/agb/
- https://www.pflanzenvermietung-ludwig.de/pflanzenverleih/agb.html
- https://www.rentaflor.ch/kontakt-agb/agb/
- https://800petals.com/office-plant-rental-dubai/
- https://adplants.com/pages/plant-rentals
- https://hopeplantsdubai.com/
- https://sevdesk.de/ratgeber/gruenden/selbstaendigkeit-anmelden/gewerbe/gewerbe-anmelden-in-berlin/
- https://taxfix.de/ratgeber/selbststaendige/kleinunternehmergrenze/
- https://www.etl.de/aktuelles/oh-tannenbaum-oh-tannenbaum/
- https://www.mayer-und-kollegen.de/themen-und-fakten/umsatzsteuer/umsatzsteuer-im-gartenbau-wann-ist-der-ermassigte-umsatzsteuersatz-anzuwenden/
- https://www.insurancy.de/betriebshaftpflichtversicherung/gartenbau/
- https://www.betriebshaftpflicht24.de/betriebshaftpflicht-landschaftsbau.html
- https://fixversichert.de/ratgeber/betriebshaftpflicht-kleingewerbe-kosten/
- https://www.kopf-versicherungen.de/betriebshaftpflicht/betriebshaftpflicht-gartenbau/
- https://www.finanzchef24.de/versicherung/garten-und-landschaftsbau
- https://www.firmeno.de/betriebshaftpflichtversicherung/schluesselverlust.html
- https://www.hiscox.de/glossar/schluesselverlust-schluesselschaden/
- https://www.pfefferminzia.de/gewerbe/versicherung-als-tueroeffner-schluessel-weg-wann-zahlt-die-betriebshaftpflicht/
- https://www.isip.de/brandenburg/pflanzenschutzdienst/pflanzengesundheitskontrolle/pflanzenpasspflicht-390566
- https://www.landwirtschaftskammer.de/landwirtschaft/pflanzenschutz/psd/pflanzenpass-anbaumaterial.htm
- https://www.landwirtschaft.sachsen.de/pflanzenpass-43737.html
- https://add.rlp.de/themen/landwirtschaft-und-weinbau/pflanzenschutz/pflanzengesundheit/pflanzenpass-und-handel-im-binnenmarkt
- https://www.lfl.bayern.de/ips/pflanzengesundheit/224407/index.php
- https://www.berlin.de/pflanzenschutzamt/ueberwachung/sachkundenachweis/
- https://www.lfl.bayern.de/ips/recht/054922/
- https://www.lfl.bayern.de/ips/recht/026363/index.php
- https://www.gesetze-im-internet.de/pflschsachkv_2013/BJNR195310013.html
- https://www.bussgeldkatalog.org/sachkundenachweis-pflanzenschutz/
- https://www.moet.gov.ae/en/web/guest/federal-law-no-15-of-2020-on-consumer-protection
- https://ohllp.com/consumer-protection-uae
- https://afridi-angell.com/executive-regulations-concerning-the-uae-consumer-protection-law/
- https://www.klgates.com/Update-UAE-Consumer-Protection-and-E-Commerce-Laws-1-23-2024
- https://www.uaeexperthub.com/consumer-rights-uae-returns-refunds-counterfeit/
- https://www.almaazmilawyers.com/insights/uae-consumer-protection-rights-guide
- https://dubaisouthbh.com/blogs/uae-consumer-protection-regulations
- https://www.reedsmith.com/our-insights/blogs/viewpoints/102iqny/uae-federal-law-on-modern-trading-by-technological-means/
- https://www.khairallahlegal.com/federal-decree-law-no-14-2023-on-trading-by-modern-technological-means/
- https://alsuwaidi.ae/weather-related-damage-in-uae-tenancies-who-ultimately-bears-the-risk/
- https://atblegal.com/blog/uae-revises-finance-lease-laws/
- https://www.dlapiperdataprotection.com/countries/uae-general/law.html
- https://bshsoft.com/uae-data-protection-law-for-businesses
- https://stripe.com/de/pricing
- https://stripe.com/ae/pricing
- https://support.stripe.com/questions/which-payments-methods-and-products-are-available-in-the-uae
- https://support.stripe.com/questions/how-much-does-stripe-cost-in-the-uae
- https://stripe.dev/blog/getting-started-with-stripe-in-the-uae
- https://www.dkb.de/geschaeftskunden/electronic-banking/sepa
- https://gocardless.com/de/handbuch/artikel/sepa-pre-notification
- https://qonto.com/de/blog/bezahlmethoden/lastschriftverfahren/lastschrift-zurueckbuchen
- https://gulfsaasreview.com/article/tap-payments-transaction-fees-uae-2026
- https://www.skimbox.us/en/resources/blogs/uae-payment-gateway-comparison-telr-stripe-checkout
- https://paymentproviders.io/blog/best-payment-gateways-uae-saudi-arabia
- https://seamlessxtra.com/tabby-launches-monthly-subscription-for-uae-shoppers/
- https://www.meydanfz.ae/activity-hub/start-a-landscaping-business-dubai
- https://www.flyingcolour.net/blog/starting-a-landscaping-business-in-dubai/
- https://www.meydanfz.ae/activity-hub/apply-for-a-public-health-pests-control-services-license-in-dubai
- https://www.alwahahygiene.ae/the-ultimate-guide-to-dubai-municipality-approved-pest-control-standards-2026/
- https://gulfnews.com/uae/environment/new-rules-on-pesticide-registration-issued-1.2170545
- https://swifthub.ae/get-general-maintenance-license-in-dubai/
- https://mrhandymandubai.com/license-insurance/
- https://mediaoffice.ae/en/news/2025/october/08-10/dubai-launches-free-zone-mainland-operating-permit
- https://cms.law/en/are/legal-updates/dubai-s-game-changer-new-executive-council-resolution-unlocks-mainland-access-for-free-zone-companies
- https://www.policybazaar.ae/business-insurance/public-liability-insurance/
- https://www.naviracorporate.com/blog/business-insurance-in-uae/
- https://theaccountant.ae/small-business-relief-uae-corporate-tax/
- https://afridi-angell.com/corporate-tax-threshold-for-small-business-relief-set-at-aed-3-million-or-less/
