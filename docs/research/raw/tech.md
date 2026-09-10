# Planty — Technical Architecture Research (raw notes)

Lens: Technical architecture for the MVP.
Researcher date: 2026-09-10. Stack assumption: Next.js App Router + Supabase (Postgres/Auth/RLS/Storage/Edge Functions) + Tailwind, Vitest + pgTAP, mobile-first PWA.

**Research-hygiene caveat:** this session's WebSearch budget (200 calls) was already exhausted by sibling lenses before this lens started, so all evidence below comes from **direct WebFetch of primary vendor documentation and pricing pages** rather than from search snippets. That is arguably better for a technical lens (every number below is from the vendor's own docs page), but it means I could not sweep Reddit/forums/job ads for anecdotal engineering evidence, and I could not chase German-language secondary sources. Gaps are flagged explicitly in "Open questions".

Every figure is labelled with the source URL. Where a page did not contain a figure, I say so rather than estimating.

---

## 1. Payments and rental billing

### 1.1 Stripe is available in BOTH candidate markets — but they are not equivalent

Stripe's global availability page lists both **United Arab Emirates** (`dashboard.stripe.com/register?country=AE`) and **Germany** (`?country=DE`) as fully available countries, with no "Preview" or "Extended network" qualifier (which are applied to India, Indonesia, and the Paystack-served African countries respectively).
Source: https://stripe.com/global (fetched 2026-09-10)

So "can I take money at all" is not the differentiator. The differentiator is **cost and payment-method mix**, which is materially different.

### 1.2 Germany pricing (Stripe's own DE pricing page, 2026)

- EEA **standard** cards: **1,5 % + 0,25 €**
- EEA **premium** cards (commercial/corporate — relevant for B2B office customers!): **2,8 % + 0,25 €**
- Non-EEA cards: **3,15 % + 0,25 €** (+2 % FX if conversion needed)
- UK cards: **2,5 % + 0,25 €** (+2 % FX)
- **SEPA Direct Debit (Lastschrift): 0,35 € flat** — no percentage
- Klarna: from **2,99 % + 0,35 €**
- Invoicing (Starter): **0,4 %** per paid invoice
- Stripe Billing: **0,7 %** of billing volume pay-as-you-go, or a monthly subscription from **500,00 €** (annual, billed monthly)
- Stripe Tax: Tax Basic **0,5 %** per transaction (no-code) or **0,45 €** per transaction (API); Tax Complete from **80,00 €/month** on an annual contract

Source: https://stripe.com/de/pricing (fetched 2026-09-10)

### 1.3 UAE pricing (Stripe's own AE pricing page, 2026)

- Domestic cards: **2.9 % + AED 1.00** per successful transaction
- International cards: **+1 %** on top
- Currency conversion: **+1 %**
- Disputes: **AED 60** per dispute
- Post-payment invoices: **0.4 %** of transaction total (AED 2 cap)
- Instant payouts: **1.5 %** of volume (min AED 2)
- Stripe Billing: **0.7 %** pay-as-you-go, or monthly subscription from **AED 2,200/month** on a 1-year contract
- Settlement in **AED**; USD payouts at 1 % of volume (min $25)

Source: https://stripe.com/ae/pricing (fetched 2026-09-10)

### 1.4 The decisive difference: recurring payment methods available per market

I pulled Stripe's payment-method support matrix and grepped it for `AE`. **The only entry that lists AE as a supported business location is Onelink (Stripe Link).** Cards are listed as "Most locations". SEPA Direct Debit's business-location list is explicit and long — `AT, AU, BE, BG, CA, CH, CY, CZ, **DE**, DK, EE, ES, FI, FR, GB, GI, GR, HK, HR, HU, IE, IT, JP, LI, LT, LU, LV, MT, MX, NL, NO, NZ, PL, PT, RO, SE, SG, SI, SK, US` — and **AE is not on it**. Klarna, PayPal, Bancontact, iDEAL, EPS, MobilePay, TWINT etc. likewise do not list AE.

Sources:
- https://docs.stripe.com/payments/payment-methods/payment-method-support (fetched 2026-09-10)
- https://docs.stripe.com/payments/sepa-debit (business-locations list, fetched 2026-09-10)

**Practical consequence for a UAE launch:** recurring billing is **card-only** (plus Apple Pay / Google Pay / Link, which are card rails underneath). There is **no Stripe-native Tabby / Tamara / Mada** support — those would be separate integrations with separate PSPs (Checkout.com, Network International, Telr, PayTabs, Amazon Payment Services are the usual UAE alternatives; I could not verify their 2026 rates without WebSearch — flagged as open question).

**Worked cost comparison (my calculation, from the vendor rates above):**

| Scenario | Rail | Fee | Effective % |
|---|---|---|---|
| Berlin B2C, €39/month | SEPA Direct Debit | €0.35 | **0.90 %** |
| Berlin B2C, €39/month | EEA standard card | €0.25 + €0.585 = €0.835 | **2.14 %** |
| Berlin B2B, €400/month invoice | SEPA DD | €0.35 | **0.09 %** |
| Berlin B2B, €400/month | EEA *premium* (corporate) card | €0.25 + €11.20 = €11.45 | **2.86 %** |
| Dubai B2C, AED 150/month | Card (domestic) | AED 1 + AED 4.35 = AED 5.35 | **3.57 %** |
| Dubai B2B, AED 1,500/month | Card (domestic) | AED 1 + AED 43.50 = AED 44.50 | **2.97 %** |

Add Stripe Billing's 0.7 % on top of all of these if using Billing pay-as-you-go. So Berlin-on-SEPA is roughly **1.6 %** all-in; Dubai-on-cards is roughly **3.7–4.3 %** all-in. On a subscription business with maybe 25–40 % gross margin, a ~2.5-point payment-cost delta is real but not decisive on its own — the bigger risk is card-on-file churn (expiries, declines) which SEPA mandates largely avoid.

### 1.5 SEPA Direct Debit operational realities (important, often underestimated)

From https://docs.stripe.com/payments/sepa-debit (fetched 2026-09-10):

- **Core scheme only** — Stripe "currently supports the SEPA Direct Debit Core scheme and not the SEPA Direct Debit B2B scheme". The Core scheme does support business bank accounts.
- **Payout timing: 6 business days.** Settlement table: "Standard Settlement — T+6 at 00:00 UTC", cutoff 10:30 CET. Doc says explicitly: "Wait at least 6 business days before considering a SEPA Direct Debit payment as successful."
- **Transaction limit 10,000 EUR each**; new accounts additionally capped at 10,000 EUR/week until volume builds.
- **Dispute window: 8 weeks "no questions asked", up to 13 months if unauthorised.** Disputes are **final — no appeal process**. In Germany specifically, "disputed payments in Germany don't provide additional information for privacy reasons."
- Failure timeline: submission 1–2 business days, then a 5-business-day **refusal window**.
- Retries: Stripe can auto-retry a failed SEPA DD **max 2 times, within 30 days**.
- Debit notification emails are mandatory under the SEPA rulebook; Stripe sends them automatically when using the Stripe Creditor ID. Stripe recommends EU businesses **get their own Creditor ID** to reduce disputes — and warns you **cannot change Creditor ID in the Dashboard after collecting live payments**.

**Architecture implication:** a 6-business-day settlement lag plus an 8-week no-questions dispute window means Planty must not treat "subscription created" as "paid" for the purpose of scheduling an expensive physical delivery. Delivery-gating should key off `invoice.paid` **and** a minimum age, or accept the float as a cost of doing business. For the very first order from a new customer, taking a card is safer; switching to SEPA on renewal is the classic pattern.

### 1.6 Modelling fixed-term rentals: Stripe Subscription Schedules

Planty's core object is "N plants for a fixed term (2 weeks / 1 month / 3 months / ongoing)". Stripe's native fit is **Subscription Schedules**.

From https://docs.stripe.com/billing/subscriptions/subscription-schedules (fetched 2026-09-10):

- Schedules automate changes over time via **phases**; **max 10 current or future phases**; `duration` accepts `week`, `month`, `year`.
- `end_behavior` is either `release` (subscription continues, detached from schedule) or **`cancel`** (subscription ends). The "installment plan" pattern — `phases[0][iterations]=6` + `end_behavior=cancel` — is exactly a fixed-term rental: "The number of `iterations` is multiplied by the price's interval… `end_behavior` determines what happens to the subscription after the last iteration."
- Seasonal rotation / plan upgrades map cleanly onto multi-phase schedules with `proration_behavior` per phase (`create_prorations` | `none` | `always_invoice`).
- Gotcha the docs call out: with `charge_automatically`, the **first invoice of a schedule is NOT immediately finalized** — it starts as `draft` and Stripe finalizes it "approximately 1 hour after creation". That breaks a naive "customer pays, immediately show confirmation + book a delivery slot" flow. Use Checkout (which collects payment up front) for the first charge, or handle the `draft` window explicitly.
- Best practice from the docs: "Store the subscription schedule IDs alongside the subscription ID"; once a schedule is attached, modify via the Schedule API, **not** the Subscriptions API, or the schedule will overwrite your changes at the next phase boundary.

**My recommendation:** for a 2-week / 1-month / 3-month term, use `phases[0].iterations = N` with `end_behavior=cancel`; for "ongoing", use a plain subscription with no schedule. Do **not** try to model per-plant line items as separate Stripe subscription items in v1 — model the *package* as the Stripe price and keep the per-plant composition in Postgres. Stripe should know about money; Postgres should know about plants.

### 1.7 B2B invoicing

From https://docs.stripe.com/invoicing/integration (fetched 2026-09-10):

- Set `collection_method=send_invoice` plus **`days_until_due`** (e.g. 30) — required for Stripe to mark an invoice past due. This is the standard "one invoice per office, net 30" flow German and UAE corporates expect.
- `auto_advance=false` keeps the invoice editable until you finalize; after finalization "many jurisdictions consider finalized invoices a legal document making certain fields unalterable" and you **cannot edit monetary values or `collection_method`**.
- **`custom_fields`** — up to 4 key/value pairs in the header — is the mechanism for **PO number** and **VAT/TRN number**, and the docs literally use "PO number" and "VAT" as the examples. Custom fields set on the Customer inherit to all future draft invoices. This covers the B2B procurement requirement cheaply.
- Max **250 invoice items** per invoice (plenty; a 200-plant office is fine).
- Listen to **`invoice.paid`** rather than `invoice.payment_succeeded` — the docs recommend it because `invoice.paid` also fires for `paid_out_of_band` (i.e. a customer who bank-transferred you directly, which UAE corporates will do).

### 1.8 E-invoicing regulation — a real 2026-2027 architecture constraint (partially verified)

**UAE:** The Ministry of Finance confirms the UAE uses a **Decentralized Continuous Transaction Control and Exchange (DCTCE)** model — a **5-corner** architecture: supplier → supplier's Accredited Service Provider (ASP) → buyer's ASP → buyer, with the **Federal Tax Authority as the fifth corner**. The ASP "validate[s] the eInvoice data received from C1 and converts it into the UAE standard eInvoice xml format" and reports to the FTA. The FTA page references Ministerial Decisions No. 243, 244 and 64 of 2025, plus **Ministerial Resolution No. 66 of 2026** and Cabinet Decision 106 of 2025 (penalties), and links a document titled "UAE eInvoicing Programme-30June2026".
Sources: https://mof.gov.ae/en/about-ministry/mof-initiatives/einvoicing/ and https://tax.gov.ae/en/content/uae.einvoicing.aspx (both fetched 2026-09-10)

**I could NOT extract the exact phase dates / turnover thresholds from these pages** — the rendered content did not include the timeline table. This is an open question, not a number I will invent.

**Germany:** I attempted the BMF's own pages (the primary source, `2024-10-15` BMF-Schreiben and the e-Rechnung FAQ) — one returned HTTP 404 and one was blocked by a Radware bot-detection redirect. **I therefore have no citable primary source for the German B2B E-Rechnung dates and will not state them from memory.** Flagged as an open question; a finance/legal lens should pin this down.

**Architecture implication regardless of exact dates:** in both markets, B2B invoicing is trending toward structured XML delivered via an accredited network, not a PDF emailed by Stripe. Stripe Invoicing produces a hosted page + PDF, which is *not* an EN 16931 / UAE-XML e-invoice. For an MVP with a handful of B2B customers this is fine — you issue the Stripe invoice and, if required, hand the data to an ASP/e-invoicing provider. Design the invoice data model so line items, tax rate, buyer tax ID and PO number are **first-class columns in Postgres**, not only fields inside Stripe, so you can emit a structured invoice later without a migration.

---

## 2. Scheduling recurring maintenance visits

### 2.1 pg_cron / Supabase Cron is sufficient — and the granularity is generous

Supabase Cron wraps `pg_cron`. Key facts from https://supabase.com/docs/guides/cron (fetched 2026-09-10):

- Jobs "can run anywhere from **every second** to once a year" — sub-minute scheduling is supported.
- Jobs live in the `cron` schema: `cron.job` (definitions) and `cron.job_run_details` (execution history) — so you get an audit trail for free, queryable from your admin dashboard.
- A job can "run SQL snippets or database functions with zero network latency or make an HTTP request, such as invoking a Supabase Edge Function".
- **Limits: max ~8 concurrent jobs recommended; each job capped at 10 minutes runtime.**

That is comfortably enough for Planty. The visit generator is a nightly job, not a per-second one.

### 2.2 Recommended data model for visits

Do **not** compute visits on the fly from a cadence rule. Materialise them as rows, because a technician needs to be assigned, a customer needs to be notified, a photo needs to be attached, and the visit needs to be reschedulable — all of which need a stable primary key.

```
subscriptions(id, org_id | customer_id, address_id, status, term_range daterange, visit_cadence interval)
visits(id, subscription_id, scheduled_date, window_start, window_end,
       technician_id, status, route_id, seq, completed_at, notes)
visit_items(visit_id, plant_asset_id, action, condition_after)
```

Nightly `pg_cron` job: for every active subscription, ensure `visits` rows exist for the next ~14 days (idempotent `INSERT … ON CONFLICT (subscription_id, scheduled_date) DO NOTHING`). Rolling horizon rather than generating the whole term up front means cadence changes and pauses are cheap.

### 2.3 Do NOT buy route optimisation in v1 — the numbers say so

Google Maps Platform per-SKU pricing (2025/2026), from https://developers.google.com/maps/billing-and-pricing/pricing (fetched 2026-09-10):

| SKU | Free/month | Price per 1,000 (first band) |
|---|---|---|
| Places Autocomplete (per session) — SKU 924B-2797-26F1 | 10,000 | $10.00 |
| Geocoding — SKU BAC8-4E68-E261 | 10,000 | $5.00 |
| Routes: Compute Routes Essentials — 9EFF-679A-9B16 | 10,000 | $5.00 |
| Routes: Compute Routes Pro — 02F7-1B55-DC90 | 5,000 | $10.00 |
| **Route Optimization, single-vehicle — 2020-AA6E-7D49** | **5,000** | **$10.00** |
| Routes Matrix Essentials — 9392-1087-2045 | 10,000 | $5.00 |

Mapbox equivalents, from https://www.mapbox.com/pricing (fetched 2026-09-10):

| API | Free/month | Price per 1,000 (first paid band) |
|---|---|---|
| Temporary Geocoding | 100,000 | $0.75 |
| Permanent Geocoding | none | $5.00 |
| Search Box sessions | 500 | $3.00 |
| Address Autofill sessions | 1,000 | $12.50 |
| Directions | 100,000 | $2.00 |
| Matrix (elements) | 100,000 | $2.00 |
| **Optimization** | **100,000** | **$2.00** |

**Reading:** Mapbox's free tiers are 10–20× Google's for exactly the three things Planty needs (geocode, directions, optimize). At MVP scale — say 200 customers × 4 visits/month = 800 visits/month, plus one optimization call per technician per day (~60/month) — **both vendors are free**, and Mapbox stays free far longer. Google's Places Autocomplete at $10/1,000 sessions above 10k/month is the only line that could bite, and only at real consumer scale.

**Recommendation:** v1 = **no optimisation API at all.** Sort each technician's day by `(postcode, ST_Distance from depot)` in Postgres/PostGIS and let the human reorder by drag-and-drop. Introduce Mapbox Optimization only when a single technician routinely has >8–10 stops/day, which is the point where human ordering measurably loses. Both cities are dense enough that travel time is dominated by parking and building access, not by route order — an optimizer that doesn't model "15 minutes to find parking in Kreuzberg" or "security desk at DIFC" will produce confidently wrong ETAs.

### 2.4 Geocoding and delivery zones — PostGIS, enabled on Supabase

From https://supabase.com/docs/guides/database/extensions/postgis (fetched 2026-09-10):

```sql
create extension postgis with schema "extensions";

create table addresses (
  id bigint generated by default as identity primary key,
  location extensions.geography(POINT) not null   -- POINT(lon lat), longitude FIRST
);
create index addresses_geo_index on addresses using GIST (location);
```
Docs note the `<->` operator for index-backed nearest-neighbour ordering and `&&` for bounding-box filters, and that both integrate with `rpc()` from the client.

**Delivery zones:** store each service area as a `geography(POLYGON)` row and answer "do we serve this address?" with `ST_Contains` / `ST_DWithin` against a GIST index — one query, no API call, no per-request cost. This is strictly better than hardcoding postcodes, and it is the single cheapest piece of "real infrastructure" in the whole build.

**Geocoding choice:** Mapbox Temporary Geocoding gives 100,000 free/month vs Google's 10,000. But note Mapbox's **Permanent** Geocoding (the licence tier you need if you *store* the coordinates, which Planty does — you store the customer's lat/lon in `addresses`) has **no free tier and costs $5.00 per 1,000**. Read the licence terms carefully; the "temporary" tier is cheap precisely because you're not allowed to persist results. At Planty's volume $5/1,000 permanent geocodes is trivial (200 customers = $1), so this is a non-issue in practice — but it is a trap that catches people who budget from the "temporary" price.

---

## 3. Availability, inventory and per-plant asset tracking

### 3.1 Date-range availability: use Postgres exclusion constraints, not application logic

This is the one place I'd argue Planty should reach for a less-obvious Postgres feature, because getting it wrong causes double-booked physical stock.

From https://www.postgresql.org/docs/17/rangetypes.html (fetched 2026-09-10):

```sql
CREATE EXTENSION btree_gist;

CREATE TABLE plant_allocation (
    plant_asset_id text,
    during tstzrange,
    EXCLUDE USING GIST (plant_asset_id WITH =, during WITH &&)
);
```
The docs' own room-reservation example shows this rejects an overlapping range **only when the resource id is equal**, and that "GiST indexes [are] automatically created with exclusion constraints for efficiency."

This makes double-allocation of a specific physical plant **structurally impossible at the database level**, regardless of race conditions in the app, concurrent checkouts, or a buggy admin action. For a business whose whole product is "a specific living object is at a specific address for a specific period", that guarantee is worth the ten minutes it takes to write.

**But — an important scoping argument against over-modelling.** In v1, Planty almost certainly does *not* allocate a *specific* plant at checkout. The customer buys "3 medium floor plants, modern style"; which physical specimens go out is decided at the depot on packing day. So:

- `plant_species` / `plant_product` — the catalogue the customer browses (SKU-level: species, size band, pot style, price/month).
- `plant_assets` — the physical individuals, with a QR code, acquisition date, current status, current location.
- Availability at checkout = a **count** check against SKU-level stock and inbound/outbound commitments, not an individual-asset lock.
- The exclusion constraint applies at the moment of **fulfilment** (assigning asset → subscription), not at checkout.

Recommended lifecycle enum for `plant_assets.status`: `in_nursery → reserved → deployed → in_recovery → retired`, plus `lost`/`damaged`. A state-machine check constraint (or a `plant_asset_events` append-only table) is worth having from day one, because "where is asset #4471 and who had it last" is the question that determines whether the unit economics of a rental business actually work. The whole business thesis is asset reuse; if you can't measure how many rotations a plant survives, you can't price.

### 3.2 QR labels

Nothing exotic needed. Generate a short opaque id (e.g. `nanoid(10)`) per asset, encode `https://planty.app/a/<id>` in a QR sticker, and have that URL open a technician-facing page (auth-gated) or a customer-facing care page (public, read-only). The technician scan flow — scan → confirm condition → photo → done — is the highest-leverage piece of ops UI in the whole product, and it's a PWA camera + `BarcodeDetector` / a small JS QR lib, not a native app requirement.

---

## 4. Notifications

### 4.1 Email — Resend

From https://resend.com/pricing (fetched 2026-09-10):
- **Free: $0 — 3,000 emails/month, hard cap of 100/day, 3 domains.**
- Pro: $20–$35/month for 50,000–100,000 emails/month, 10 domains.
- Scale: $90–$1,150/month for 100,000–2,500,000/month.
- Marketing plans separate: Free 1,000 contacts; Pro $40–$650 for 5,000–150,000 contacts.

The **100/day** free-tier cap is the one to watch: a nightly "your visit is tomorrow" batch across 200 customers exceeds it. Budget $20/month from the moment you have ~50 customers.

### 4.2 WhatsApp — genuinely important in UAE, mostly irrelevant in Germany

Meta switched from conversation-based to **per-message pricing on 1 July 2025**; you are "only charged when a template message is delivered."
Source: https://developers.facebook.com/docs/whatsapp/pricing (fetched 2026-09-10)

Categories: **Marketing** always charged; **Utility** charged only *outside* an open customer service window (free inside it); **Authentication** charged outside the window; **Service** messages free for all businesses. All non-template messages are free within an open 24-hour customer service window.

**This is a big deal for Planty's ops loop.** "Technician arriving between 10:00–12:00 tomorrow" is a *utility* template. If the customer has replied in the last 24 h, it's free. Volume tiers further reduce utility/authentication rates.

Via Twilio (https://www.twilio.com/en-us/whatsapp/pricing, fetched 2026-09-10): Twilio adds **$0.005 per message** (inbound and outbound) on top of Meta's fee. The page showed Utility and Authentication template Meta fees of **$0.0034/message** outside the service window, with marketing shown as no-charge in that particular table view. **Country-specific DE and AE rate cards were not extractable** — Meta publishes those as separate CSV/PDF rate cards by currency, which I could not fetch. Flagged as an open question.

**Recommendation:** in Germany, email + SMS is culturally sufficient and WhatsApp Business API onboarding (Meta Business verification, template approval) is a multi-day tax on a solo founder. In the UAE, WhatsApp is the default channel for service businesses and skipping it will cost conversions and cause missed visits. **This is one of the few places where the market choice genuinely changes the build.** Either way, use **Meta's Cloud API directly** rather than Twilio for v1 — Twilio's $0.005/message is a ~150 % markup on a $0.0034 utility template, and the Cloud API is a plain HTTPS call from a Supabase Edge Function.

### 4.3 Web push / PWA

Push API support in Safari on iOS is listed as **partial from iOS 16.4 onward**, still partial through 26.6.
Source: https://caniuse.com/push-api (fetched 2026-09-10)

The caniuse excerpt I retrieved did **not** confirm the well-known "must be added to Home Screen" restriction, so I won't assert it as sourced — but the practical planning assumption should be that **iOS web push is unreliable for a consumer notification channel**. Do not build the customer's visit reminders on web push. Use email + WhatsApp/SMS. Web push is fine as a *bonus* channel for the technician app, where you control the devices.

---

## 5. Auth, multi-tenancy and RLS

### 5.1 B2B org membership — use the Custom Access Token hook

Supabase's own RBAC guide (https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac, fetched 2026-09-10) recommends:

1. `user_roles` and `role_permissions` tables, both keyed on Postgres **enums**.
2. A **Custom Access Token Auth Hook** that "runs before a token is issued… use it to add additional claims to the user's JWT" — implemented in **PL/pgSQL for best performance**, injecting the role via `jsonb_set()`.
3. An `authorize()` function reading `auth.jwt() ->> 'user_role'`.
4. Policies referencing it: `create policy "…" on public.channels for delete to authenticated using ( (SELECT authorize('channels.delete')) );`

For Planty this becomes: `organizations`, `organization_members(org_id, user_id, role)`, and an `org_ids` claim (array) in the JWT. Every tenant table carries `org_id`, and every policy is `using ( org_id = any( (select auth.jwt() -> 'org_ids') ) )`.

**Caveat worth stating loudly:** claims are baked into the JWT at issue time. Removing someone from an office account does not take effect until their token refreshes. For "the office manager left the company", that lag matters. Either keep the access-token TTL short, or check membership against the table (via a `security definer` helper) for destructive operations rather than trusting the claim.

### 5.2 RLS performance rules (these are not optional at scale)

From https://supabase.com/docs/guides/database/postgres/row-level-security (fetched 2026-09-10):

- **Wrap helper functions in a SELECT**: use `(select auth.uid())`, which lets "the Postgres optimizer… cache the results per-statement, rather than calling the function on each row".
- **Index every column used in a policy filter**: "Postgres evaluates the policy against each candidate row, so an unindexed filter column turns a read into a sequential scan." Put it first in a btree index.
- **Use `security definer` functions for cross-table lookups** — bypasses RLS on the inner query and "breaks the cycle" of recursive policies that would otherwise fail outright. (The recursive-policy trap is exactly what you hit with `organization_members` policies that reference `organization_members`.)
- **Always add `to authenticated` / `to anon`** — this "prevents the policy" from running for the wrong role at all.
- **Enable RLS on every exposed table**: a table "without RLS is readable and writable by any role with a grant on it", and adding policies does not remove grants — you must revoke them.
- **Test with pgTAP**, asserting both allow and deny cases per table, per role, per operation.

That last point matches the founder's stated pgTAP preference and is the correct place to spend test effort. RLS bugs are silent data leaks; unit-testing a React component is not.

### 5.3 Next.js App Router session handling — one specific footgun

From https://supabase.com/docs/guides/auth/server-side/nextjs (fetched 2026-09-10):

- `@supabase/ssr` with `createBrowserClient` (Client Components) and `createServerClient` (Server Components / Actions / Route Handlers).
- Cookie interface is `getAll()` / `setAll(cookiesToSet, headers)`; session cookie is `sb-<project_ref>-auth-token`.
- **The warning, verbatim:** "*Never* trust `supabase.auth.getSession()` inside server code such as Proxy. It isn't guaranteed to revalidate the Auth token." Use **`getClaims()`**, which "validates the JWT signature against the project's published public keys every time."
- Middleware/proxy refreshes tokens via `getClaims()`, writing back with `request.cookies.set` then `response.cookies.set`.
- "Creating a Supabase client is lightweight" — make a new server client **per request**.

Note this doc has moved on from the older `getUser()` advice to `getClaims()`; anything the founder copied from a 2024 tutorial is out of date.

---

## 6. Background work, storage, hosting

### 6.1 Edge Functions and async work

From https://supabase.com/docs/guides/functions (fetched 2026-09-10): Deno runtime, TypeScript-first, globally distributed. Documented use cases explicitly include "Webhook receivers (Stripe, GitHub, etc.)" and "Transactional emails". Guidance: "Design for short-lived, idempotent operations" — heavy workloads should use background workers. The page did **not** state exact CPU/memory/request-size limits.

**Database Webhooks** (https://supabase.com/docs/guides/database/webhooks, fetched 2026-09-10) are a convenience layer over **`pg_net`**, generating a trigger using `supabase_functions.http_request`. They fire AFTER INSERT/UPDATE/DELETE and "will not block your database changes for long-running network" requests. The docs' own guidance: use them when "the receiving endpoint can tolerate occasional failures", and prefer Edge Functions or polling for "guaranteed delivery or complex error handling."

**Supabase Queues** (pgmq) — https://supabase.com/docs/guides/queues (fetched 2026-09-10) — is "a Postgres-native durable Message Queue system with guaranteed delivery" offering "Exactly Once Message Delivery" within a customisable visibility window, with optional archival for auditing, plus RLS-based authorization and dashboard monitoring.

**Recommendation:** Stripe webhooks → Next.js Route Handler (not an Edge Function) so signature verification and business logic live in one codebase with one set of types. Outbound notifications → **pgmq queue + pg_cron drainer**, not Database Webhooks, because a failed "your technician is coming tomorrow" WhatsApp needs a retry and a dead-letter, and Database Webhooks explicitly don't give you that.

### 6.2 Storage and hosting costs

Supabase (https://supabase.com/pricing, fetched 2026-09-10):
- **Free $0**: 500 MB DB, 1 GB storage, 5 GB egress, 50,000 MAU, 500k Edge Function invocations, 1-day log retention. **"Free projects are paused after 1 week of inactivity. Limit of 2 active"** — disqualifying for anything customer-facing.
- **Pro $25/month**: 8 GB DB, 100 GB storage, 250 GB egress, 100,000 MAU, 2M function invocations, Micro compute ($10, covered by credits), 7-day logs.
- Team $599/month (28-day logs, SOC2/ISO 27001) — only relevant if a large corporate customer demands it in procurement. Worth knowing that the compliance jump is **$25 → $599**, a 24× step. If a Dubai bank or a Berlin Konzern asks for SOC 2 in the first year, that's a real, sudden cost.

Vercel (https://vercel.com/pricing, fetched 2026-09-10):
- Hobby free: 1M edge requests, 100 GB transfer, 1M function invocations/month.
- **Pro $20/seat/month**: 10M edge requests, 1 TB transfer, 1M invocations, 5k image transformations. Overages $2/1M edge requests, $0.15/GB transfer, $0.60/1M invocations, builds $0.007/min.

**Total realistic v1 infra: ~$45–65/month** (Supabase Pro $25 + Vercel Pro $20 + Resend $20 once past the 100/day cap). Maps and messaging sit inside free tiers at MVP volume. This is not a business where infrastructure cost is a factor — vans, plants and technician hours are 99 % of COGS. Which is itself the important architectural finding: **do not optimise the software spend, optimise the ops-hours spend.**

### 6.3 Admin/ops: build vs Retool

Retool (https://retool.com/pricing, fetched 2026-09-10, prices shown in GBP): Free £0 for **up to 5 users, 500 workflow runs/month, 5 GB storage**; Team £8/builder + £4/internal user; Business £40/builder + £12/internal user; external users £3–£6.25 tiered on Business. Mobile apps included at no extra cost on all paid tiers; Free includes "Unlimited web & mobile apps."

**Recommendation:** for a solo founder, the honest answer is **use Supabase Studio for the first ~10 customers, then build exactly two custom screens** — (a) today's visit list per technician with a scan-and-complete flow, and (b) the plant asset register. Everything else (refunds, address edits, catalogue) can stay in Studio or Retool Free indefinitely. Retool's free tier covers 5 users, which is more technicians than Planty will have in year one. Building a general-purpose admin panel is the single most common way a solo founder burns two months on software that a spreadsheet would have covered.

### 6.4 PWA vs native

The stack preference (mobile-first PWA) is right for v1. The customer side is a browse-and-checkout flow — a website is the correct shape, and an app-store install is pure friction for a first purchase. The technician side needs camera (QR scan + condition photos) and ideally offline queueing; both are available to a PWA, with the caveat from §4.3 that iOS push is shaky. If the technician fleet is company-issued Android, a PWA is fully sufficient. Revisit Expo only when either (a) push to customers becomes a retention lever you can measure, or (b) technicians work in basements/underground car parks where offline sync failures become a daily ops problem.

---

## 7. Concrete MVP recommendation (opinionated)

**Build:**
1. Next.js App Router + `@supabase/ssr` (`getClaims()`, per-request server client).
2. Postgres schema: `organizations`, `organization_members`, `addresses` (PostGIS geography POINT + GIST), `service_zones` (POLYGON), `plant_products`, `plant_assets` (+ status enum + event log), `subscriptions`, `visits`, `visit_items`, `plant_allocation` (btree_gist EXCLUDE constraint).
3. RLS on every table, `to authenticated`, `(select auth.jwt())` wrapping, indexes on `org_id`, `security definer` helper for membership, pgTAP allow+deny tests.
4. Stripe Checkout → Subscription Schedule with `iterations` + `end_behavior=cancel` for fixed terms; `send_invoice` + `days_until_due=30` + `custom_fields` (PO number, VAT/TRN) for B2B. Webhook on `invoice.paid`.
5. `pg_cron` nightly: materialise `visits` for a rolling 14-day horizon.
6. pgmq + `pg_cron` drainer for outbound notifications; Resend for email; Meta Cloud API directly for WhatsApp (UAE) — skip WhatsApp entirely in a Berlin-first launch.
7. Supabase Storage for plant photos and per-visit condition photos.
8. Two custom ops screens only; Supabase Studio / Retool Free for everything else.

**Deliberately NOT in v1:** route optimisation API, native app, per-plant allocation at checkout, a general admin panel, Stripe Tax (add when the VAT registration threshold actually binds), multi-currency, a design/styling configurator.

**Payment-rail conclusion:** Berlin gives you SEPA Direct Debit at a flat €0.35 — ~0.9 % on a €39 subscription and effectively free on a €400 B2B invoice — but costs you 6 business days of settlement float and an 8-week no-questions dispute window. Dubai gives you instant card settlement but card-only recurring at 2.9 % + AED 1, no SEPA, no Stripe-native BNPL, and a card-expiry churn problem that SEPA doesn't have. **From a purely technical/billing standpoint Berlin is the cheaper and more robust rail**, and it also lets you skip the WhatsApp Business API onboarding that a UAE launch would force on a solo founder in month one. That is one input to the market decision, not the whole decision.

---

## Sources

All fetched 2026-09-10 via WebFetch.

- Stripe global availability — https://stripe.com/global
- Stripe Germany pricing — https://stripe.com/de/pricing
- Stripe UAE pricing — https://stripe.com/ae/pricing
- Stripe SEPA Direct Debit — https://docs.stripe.com/payments/sepa-debit
- Stripe payment method support matrix — https://docs.stripe.com/payments/payment-methods/payment-method-support
- Stripe subscription schedules — https://docs.stripe.com/billing/subscriptions/subscription-schedules
- Stripe Invoicing integration — https://docs.stripe.com/invoicing/integration
- UAE Ministry of Finance eInvoicing — https://mof.gov.ae/en/about-ministry/mof-initiatives/einvoicing/
- UAE Federal Tax Authority eInvoicing — https://tax.gov.ae/en/content/uae.einvoicing.aspx
- Supabase Cron / pg_cron — https://supabase.com/docs/guides/cron
- Supabase Queues (pgmq) — https://supabase.com/docs/guides/queues
- Supabase Database Webhooks — https://supabase.com/docs/guides/database/webhooks
- Supabase Edge Functions — https://supabase.com/docs/guides/functions
- Supabase PostGIS — https://supabase.com/docs/guides/database/extensions/postgis
- Supabase RLS best practices — https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase custom claims & RBAC — https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
- Supabase Next.js server-side auth — https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase pricing — https://supabase.com/pricing
- PostgreSQL 17 range types & exclusion constraints — https://www.postgresql.org/docs/17/rangetypes.html
- Google Maps Platform pricing — https://developers.google.com/maps/billing-and-pricing/pricing
- Mapbox pricing — https://www.mapbox.com/pricing
- Resend pricing — https://resend.com/pricing
- WhatsApp Business Platform pricing — https://developers.facebook.com/docs/whatsapp/pricing
- Twilio WhatsApp pricing — https://www.twilio.com/en-us/whatsapp/pricing
- Vercel pricing — https://vercel.com/pricing
- Retool pricing — https://retool.com/pricing
- Push API browser support — https://caniuse.com/push-api

### Sources attempted but unusable
- https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/2024-10-15-umsatzsteuer-ausstellung-von-rechnungen-nach-paragraf-14-ustg.html — HTTP 404
- https://www.bundesfinanzministerium.de/Content/DE/FAQ/faq-e-rechnung.html — blocked by Radware bot detection
- https://www.datev.de/web/de/aktuelles/e-rechnung/e-rechnungspflicht-2025/ — HTTP 404
- https://www.ihk.de/themen/e-rechnung — HTTP 404
- https://tax.gov.ae/en/taxes/e.invoicing.aspx — banner only, no timeline content
