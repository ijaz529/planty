# Planty — Technical architecture research (raw notes)

Research date: 2026-09-09. Lens: technical architecture for the MVP given the founder's stack (Next.js App Router + Supabase Postgres/Auth/RLS + Tailwind, Vitest/pgTAP, mobile-first PWA). Every number carries a URL and the year of the source. "Reported" = taken from the source; "Estimate" = my own inference.

---

## 0. TL;DR recommendations

1. **Payments: Stripe in both candidate markets, but the UAE path has a hard gate.** Stripe UAE requires a UAE trade licence (sole establishment / LLC / free-zone LLC); individuals without a licence are not accepted (Stripe support, 2025/26). Stripe Germany just needs a German-registered business/freelancer. UAE fees are 2.9% + AED 1.00 per domestic card charge, DE fees are 1.5% + EUR 0.25 for standard European cards and EUR 0.35 flat for SEPA Direct Debit. Billing costs 0.7% of billing volume in both countries.
2. **Model rentals as Stripe subscriptions, not one-off charges.** Use Checkout in `subscription` mode with one recurring price line per plant tier (quantity = number of plants), `billing_cycle_anchor` for the 1st-of-month, Subscription Schedules with `end_behavior=cancel` for fixed-term (2-week/1-month/3-month) rentals, and `pause_collection` for holidays. B2B in Germany: SEPA Direct Debit + Stripe Invoicing (0.4% per paid invoice) with `tax_id_collection` for VAT IDs.
3. **Scheduling: pure Postgres for the MVP.** A `visit_plans` table (cadence per subscription) + a nightly `pg_cron` job that calls a PL/pgSQL function to materialise `visits` rows 2–4 weeks ahead. pg_cron on Supabase runs in UTC; keep max 8 concurrent jobs and <10 min per job. Route ordering: start with manual drag-order per technician per day; add Google Route Optimization (Single Vehicle SKU: 5,000 free shipments/month, then $10 per 1,000) or self-hosted VROOM only when >1 technician and >~15 stops/day.
4. **Inventory/availability: Postgres range types + `EXCLUDE USING gist` (btree_gist)** on `(plant_asset_id WITH =, period WITH &&)` prevents double-allocating a physical plant. Track physical plants (`plant_assets`) separately from catalogue SKUs (`plant_types`), each asset with a QR label and a status enum lifecycle.
5. **Multi-tenant B2B: `organizations` + `organization_members(role)` tables, `org_id` on every tenant row, `security definer` helper for membership checks, and (select auth.uid()) wrapping + indexes per Supabase RLS performance guidance.** Put `active_org_id`/role in JWT via the Custom Access Token hook only once switching orgs becomes common.
6. **Notifications: Resend (email, 3,000/month free) first; WhatsApp via Meta Cloud API (direct) or Twilio ($0.005/msg platform fee on top of Meta rates) second.** Utility templates are free inside a 24-hour customer-service window and cost ~$0.055 in Germany otherwise (2025). WhatsApp is far more important for Dubai than Berlin.
7. **PWA first, Expo later.** Web Push works on iOS 16.4+ when installed to the home screen (Next.js docs, 2026). Go native only for the technician app if offline/camera/QR ergonomics demand it.
8. **Admin/ops: build in Next.js (same repo, `/admin` routes gated by RLS role).** Retool is $10/builder + $5/internal user per month on Team (2026 reported) — fine for a solo founder, but the ops dashboard *is* the product for a service business, so own it.
9. **Regions: Supabase has no Middle East region (nearest to Dubai is Mumbai ap-south-1; Frankfurt eu-central-1 for Berlin).** Stripe Invoicing is not listed among UAE-available products; and the UAE e-invoicing mandate (PINT AE / Peppol) hits SMEs from 1 July 2027, Germany's B2B issuing mandate hits all businesses 1 Jan 2028 (turnover >EUR 800k from 1 Jan 2027).

---

## 1. Subscription and rental billing

### 1.1 Stripe availability and fees — UAE

- Stripe launched in the UAE in April 2021 with an office in Dubai Internet City (Stripe newsroom, 2021): https://stripe.com/newsroom/news/stripe-launches-uae
- **Eligibility (reported 2025/26):** "Only registered UAE businesses can establish connected accounts... Sole establishments, free zone establishments, or branches of sole establishments... LLCs, free zone LLCs, or branches of LLCs"; "we don't currently support individuals" without a valid UAE trade licence. https://support.stripe.com/questions/connect-availability-in-the-uae
- **Available products/methods in UAE (reported, Stripe support page, 2025/26):** Visa, Mastercard, Apple Pay, Google Pay, Link; products: Billing, Checkout, Connect, Payment Links, Radar, Sigma, Climate, Tax. Terminal and Invoicing are not listed. "There is a minimum charge amount of 2.00 AED". https://support.stripe.com/questions/which-payments-methods-and-products-are-available-in-the-uae
  - Note: Stripe Invoicing not being listed matters for B2B office contracts; Billing can still email hosted invoices for subscriptions, but verify with Stripe sales before relying on standalone Invoicing in UAE.
- **UAE pricing (Stripe official, 2026):** "2.9% + AED1.00 per successful transaction" domestic cards; +1% international cards; +1% currency conversion; Billing pay-as-you-go 0.7% of billing volume (or from AED 2,200/month on a 1-year contract); Invoicing 0.4% per paid invoice (listed on the pricing page even though the support page omits it); disputes AED 60; instant payouts 1.5%; Stripe Tax Basic no-code 0.5% per transaction. https://stripe.com/ae/pricing
  - Discrepancy: a third-party 2026 guide quotes "2.9% + USD 0.30" — I trust the official AED 1.00 figure. https://www.uaefreezonecompare.com/banking/uae-payment-gateways-free-zone-ecommerce-stripe-checkout-paytabs-2026/
- **No Mada support; BNPL (Tabby/Tamara) requires direct integration** (reported, 2026 comparison): https://www.skimbox.us/en/resources/blogs/uae-payment-gateway-comparison-telr-stripe-checkout
- **Stripe Tax UAE (Stripe docs, 2026):** Stripe can collect tax if the business is established in the UAE; when both business and customer are in the UAE Stripe calculates 5% VAT unless exempt/zero-rated; registration threshold shown as "1 transaction" for remote digital sellers. https://docs.stripe.com/tax/supported-countries/asia-pacific/united-arab-emirates
- UAE VAT is 5% (Stripe resource, 2025): https://stripe.com/resources/more/uae-vat-rate-what-businesses-need-to-know

### 1.2 UAE alternatives to Stripe (reported fees, 2025/26)

- **Telr:** 2.69% + AED 1 per transaction, monthly plan AED 99–349 (Ziina comparison blog, 2025); another source says "AED 199/month + 2.5%" (2026). Supports recurring billing. https://ziina.com/blog/stripe-alternatives ; https://www.uaefreezonecompare.com/banking/uae-payment-gateways-free-zone-ecommerce-stripe-checkout-paytabs-2026/
- **Tap Payments:** 2.75% + AED 1, developer APIs + sandbox (2025). https://ziina.com/blog/stripe-alternatives
- **Ziina:** 2.6% + AED 1 (+1.5% international/non-AED), no setup or monthly fees (2025). https://ziina.com/blog/stripe-alternatives
- **PayTabs:** 2.5–2.85% per transaction, no recurring billing per the 2026 comparison. https://www.uaefreezonecompare.com/banking/uae-payment-gateways-free-zone-ecommerce-stripe-checkout-paytabs-2026/
- **Checkout.com:** "typically 1.8–2.9% + per-transaction fee", licensed by UAE Central Bank (2026). Same URL.
- Estimate: none of these have a subscription engine as mature as Stripe Billing (schedules, proration, customer portal, dunning). If Stripe UAE is available to the founder's entity, use it; Telr is the fallback with recurring support.

### 1.3 Stripe — Germany

- **Official DE pricing (Stripe, 2026):** European standard cards "1,5 % + 0,25 €"; European premium cards 2.8% + EUR 0.25; UK cards 2.5% + EUR 0.25; non-European 3.15% + EUR 0.25; currency conversion +2%; **SEPA Direct Debit "0,35 €" per transaction**; Billing pay-as-you-go 0.7%; Invoicing 0.4% per paid invoice; Stripe Tax Basic no-code 0.5%; chargeback EUR 20. https://stripe.com/de/pricing
  - A third-party 2026 guide claims SEPA is "0.8% + €0.25, capped at €5" — this conflicts with the official page; trust the official EUR 0.35 flat. https://www.feecalcpro.com/blog/stripe-fees-germany-guide/
  - Third-party note (2026): 19% German VAT is added on Stripe fees; a Kleinunternehmer cannot reclaim it. https://www.profitvana.com/guides/stripe-fees-in-germany
- **SEPA Direct Debit subscriptions:** "Stripe Invoicing, Billing, and Checkout make it easier to collect bank debits with hosted mandates"; enable from the Dashboard for Payment Element/Checkout/Payment Links with no extra integration (Stripe, 2025). https://stripe.com/payments/sepa-direct-debit
- SEPA Core (B2C) debits can be reversed within 8 weeks; SEPA B2B has no right of objection (Stripe resource, 2025). https://stripe.com/en-si/resources/more/sepa-business-to-business-direct-debit-germany
- Subscription with SEPA guide: https://docs.stripe.com/billing/subscriptions/ideal (2025)
- Checkout: `tax_id_collection` supported in payment and subscription mode; `customer_update[address]=auto` for tax on billing address; Stripe Tax validates EU VAT IDs and applies reverse charge (Stripe docs, 2025). https://docs.stripe.com/tax/checkout/tax-ids ; https://docs.stripe.com/payments/checkout/automatic_taxes

### 1.4 Modelling rentals in Stripe Billing

- Checkout subscription mode: max 20 recurring line items + 20 one-time line items; one-time items (delivery/installation fee) appear on the first invoice only (Stripe API ref, 2025). https://docs.stripe.com/api/checkout/sessions/create
- `billing_cycle_anchor` can be set to a fixed date (e.g., 1st of next month); `proration_behavior=create_prorations` (default) or `none` for a free partial first period (Stripe docs, 2025). https://docs.stripe.com/payments/checkout/billing-cycle
- Subscription Schedules: phases with `start_date`/`end_date`; `end_behavior` = `release` (default) or `cancel` — use `cancel` for fixed-term rentals (Stripe docs, 2025). https://docs.stripe.com/api/subscription_schedules/object
- Prebilling for committed terms: bill the remaining term on early cancellation (Stripe docs, 2025). https://docs.stripe.com/billing/subscriptions/prebilling
- Pause: `pause_collection` keeps the subscription active but stops collecting; full "pause subscription" suspends service and invoicing; both configurable in the Customer Portal (Stripe docs, 2025). https://docs.stripe.com/billing/subscriptions/pause ; https://edge-docs.stripe.com/customer-management/configure-portal
- **Recommended data model:** Stripe Product per plant tier (small/medium/large/statement), monthly recurring Price per tier; subscription item quantity = number of plants of that tier; service tier (visits/week, styling) as a separate recurring Price. Store `stripe_subscription_id`, `stripe_customer_id` on `subscriptions` table; treat Stripe webhooks (`customer.subscription.updated`, `invoice.paid`, `invoice.payment_failed`) as the source of truth for billing status, while Planty's own `rental_lines` table is the source of truth for which physical plants are on site.
- Estimate: 0.7% Billing fee on ~EUR 60/month B2C subscription is EUR 0.42; on a EUR 500/month office contract it is EUR 3.50 — negligible versus card/SEPA fees.

### 1.5 E-invoicing mandates (affects B2B invoicing design)

- **Germany:** receiving structured e-invoices mandatory since 1 Jan 2025; issuing mandatory for businesses with turnover > EUR 800,000 from 1 Jan 2027; all businesses from 1 Jan 2028; formats XRechnung / ZUGFeRD (EN 16931); B2C out of scope (ClearTax, 2026). https://www.cleartax.com/de/en/e-invoicing-timeline-in-germany
- **UAE:** decentralised 5-corner Peppol model with PINT AE; pilot 1 July 2026; businesses ≥ AED 50M revenue must appoint an Accredited Service Provider by 30 Oct 2026 and go live 1 Jan 2027; everyone else appoints ASP by 31 Mar 2027 and goes live 1 July 2027; applies regardless of VAT registration status unless excluded (Avalara/ClearTax/e-invoice.app, 2026). https://www.avalara.com/blog/en/europe/2026/03/uae-e-invoicing-mandate-2026-readiness-asp-pint-ae.html ; https://www.cleartax.com/ae/e-invoicing-uae
- Implication: for the MVP, Stripe-hosted PDF invoices are fine in Germany until 2028 (Planty will be well under EUR 800k in 2027) but B2B customers may *demand* ZUGFeRD earlier. In the UAE a Dubai Planty entity would need an ASP integration by mid-2027 — a real, dated engineering task that is absent in Berlin until 2028.

---

## 2. Scheduling recurring maintenance visits

### 2.1 Supabase Cron / pg_cron

- Supabase Cron uses the `pg_cron` extension; jobs run "anywhere from every second to once a year"; can run SQL/DB functions or make HTTP requests (e.g., invoke an Edge Function); recommendations: "no more than 8 Jobs run concurrently", "Each Job should run no more than 10 minutes"; runs logged in `cron.job_run_details` (Supabase docs, 2025). https://supabase.com/docs/guides/cron
- pg_cron schedules are UTC; Supabase runs pg_cron 1.6 which has timezone support but no default config — convert local times manually (Supabase GitHub discussions #7892, #36383, 2024–2025). https://github.com/orgs/supabase/discussions/36383
- Scheduling Edge Functions from cron via `pg_net`: https://supabase.com/docs/guides/functions/schedule-functions (2025)
- Supabase Queues (pgmq): "Postgres-native durable Message Queue system with guaranteed delivery", exactly-once within a visibility window, RLS-controllable (Supabase docs, 2025). https://supabase.com/docs/guides/queues ; pattern with cron + queue + Edge Function worker: https://supabase.com/blog/processing-large-jobs-with-edge-functions
- Edge Function limits (Supabase docs, 2025/26): wall-clock 150 s (Free) / 400 s (paid); CPU 2 s per request; 256 MB memory. https://supabase.com/docs/guides/functions/limits

### 2.2 Recommended schema (my design, informed by the above)

```
subscriptions(id, org_id|customer_id, stripe_subscription_id, status, starts_on, ends_on, address_id, zone_id)
visit_plans(id, subscription_id, cadence interval, weekday smallint, window tstzrange-ish (time_from, time_to), technician_id nullable, active bool)
visits(id, subscription_id, plan_id, scheduled_date date, technician_id, route_position int, status enum('planned','assigned','en_route','done','skipped','rescheduled'), started_at, finished_at, notes, photos[])
visit_plant_checks(visit_id, plant_asset_id, condition enum, watered bool, action enum('none','replace','rotate'), photo_path)
```

- Nightly pg_cron job (e.g., 02:00 UTC) calls `generate_visits(horizon => interval '28 days')` — a PL/pgSQL function that inserts missing `visits` for each active `visit_plan` (idempotent via unique `(plan_id, scheduled_date)`). Keep the logic in a function so it is testable with pgTAP.
- Technician assignment MVP: per `zone_id` default technician on `visit_plans`; ops can override on the day view. Route order: `route_position` set by drag-and-drop in the admin day view.

### 2.3 When to add a routing/optimization API

- **Google Route Optimization API (2026 pricing page):** Single Vehicle Routing 5,000 free shipments/month, then $10 per 1,000 (0–100K); Fleet Routing (≥2 vehicles) 1,000 free, then $30 per 1,000. Billed per shipment. https://developers.google.com/maps/billing-and-pricing/pricing ; https://developers.google.com/maps/documentation/route-optimization/usage-and-billing
- **Google Routes API (2026):** Compute Routes Essentials 10,000 free events/month then $5 per 1,000; Pro (traffic-aware) 5,000 free then $10 per 1,000; Enterprise 1,000 free then $15 per 1,000; Compute Route Matrix same structure. Google retired the universal $200 credit in March 2025 in favour of per-SKU free caps. Same URL.
- **Mapbox (2026 pricing page):** Optimization API free up to 100,000 requests/month then $2.00–$1.20 per 1,000; Directions and Matrix same; Geocoding 100,000 free then $0.75–$0.45 per 1,000; Address Autofill 1,000 free sessions then $12.50–$7.50 per 1,000 sessions. https://www.mapbox.com/pricing
- **Self-hosted:** VROOM (C++, MIT-style licence, HTTP microservice; solves VRP "in milliseconds") vs OR-Tools vs jsprit comparison (2026). https://github.com/VROOM-Project/vroom ; https://www.pistack.xyz/posts/2026-06-16-self-hosted-vehicle-routing-optimization-vroom-jsprit-ortools/
- Estimate: 1 technician doing 10–15 stops/day ≈ 300 shipments/month — inside Google's 5,000 free Single Vehicle shipments and inside Mapbox's 100,000 free requests. Cost is not the issue; integration time is. Do not build until there are ≥2 technicians or ≥15 stops/day.

---

## 3. Asset tracking per physical plant

- No vendor research needed: this is a schema problem. Recommended (my design):
```
plant_types(id, name, latin_name, tier, light_needs, water_interval_days, seasonal_tags[], image_path)
plant_assets(id, plant_type_id, qr_code text unique, pot_id, acquired_on, cost_cents, status enum('in_stock','reserved','deployed','in_transit','recovering','retired'), current_subscription_id nullable, current_location text, last_seen_at)
plant_asset_events(id, plant_asset_id, event enum('received','allocated','delivered','inspected','watered','swapped_out','returned','recovered','retired'), visit_id nullable, actor_id, note, photo_path, created_at)
```
- QR label content: a short opaque ID (`https://planty.app/a/<ulid>`) so a technician scanning with the phone camera lands in the PWA on the asset page. Web-side scanning: use the browser `BarcodeDetector` API where available, fallback to a JS library (e.g., zxing-js/`html5-qrcode`). Estimate: fine in a PWA; not a native-app trigger.
- Photo per inspection to Supabase Storage (see section 6); store only the path in Postgres.
- Seasonal rotation = an `asset_events.swapped_out`/`allocated` pair inside one visit; rotation planning can be a simple query: assets deployed longer than `plant_types.max_deploy_days`.

---

## 4. Inventory / availability logic for rentals

- Postgres range types + exclusion constraints: `EXCLUDE USING gist (plant_asset_id WITH =, period WITH &&)` requires the `btree_gist` extension to mix equality on a scalar column with range overlap; can carry a `WHERE (status <> 'cancelled')` predicate; concurrency-safe where application checks are not (PostgreSQL docs 18, 2025; Neon btree_gist docs, 2025; DEV/jusdb articles 2025). https://www.postgresql.org/docs/current/rangetypes.html ; https://neon.com/docs/extensions/btree_gist ; https://dev.to/franckpachot/postgresql-exclude-constraints-for-better-concurrency-than-serializable-pob
- Multirange (PG14+) and `range_agg` simplify "what is free between dates" queries (2025). https://www.jusdb.com/blog/postgresql-range-types-exclusion-constraints
- **Recommended model:** allocation happens at the *type* level at checkout (customer picks "3 × medium fern-type plants") and at the *asset* level when ops packs the delivery. Two tables:
  - `rental_lines(subscription_id, plant_type_id, qty, period daterange)` — availability check: `SUM(qty)` per type overlapping the period ≤ `plant_types.stock_count` minus a safety buffer (holding stock for replacements — estimate 10–20% of deployed count for a service promising "no dead plants").
  - `asset_allocations(plant_asset_id, subscription_id, period daterange, EXCLUDE ...)` — hard guarantee that one physical plant is never on two sites at once.
- Open-ended rentals: store `period` as `daterange(start, NULL)`; exclusion constraints handle unbounded ranges natively.
- btree_gist is available on Supabase (extension list in dashboard); verify with `select * from pg_available_extensions where name='btree_gist'`.

---

## 5. Address geocoding and delivery zones

- **Google (2026 pricing):** Places Autocomplete Essentials 10,000 free events/month then $2.83 per 1,000; Autocomplete is free inside a Pro/Enterprise session that terminates in Place Details (New)/Address Validation; Place Details Essentials $5 per 1,000 after 10,000 free; Geocoding 10,000 free then $5 per 1,000; Address Validation Pro 5,000 free then $17 per 1,000; Dynamic Maps 10,000 free then $7 per 1,000. https://developers.google.com/maps/billing-and-pricing/pricing ; https://developers.google.com/maps/documentation/places/web-service/session-pricing
- **Mapbox (2026):** Geocoding 100,000 free requests/month; Search Box 500 free sessions; Address Autofill 1,000 free sessions then $12.50–$7.50 per 1,000. https://www.mapbox.com/pricing
- Estimate: at MVP scale (<1,000 checkouts/month) both are effectively free; Google's autocomplete quality in Dubai (villa/community names, no street numbers) is the deciding factor, and Dubai addresses often need a free-text "building/villa/landmark" field plus a map pin regardless of provider — design the address form with `formatted_address`, `lat`, `lng`, `place_id`, `delivery_notes`, and (UAE) `makani_number` optional.
- Delivery zones: store as PostGIS polygons (`zones.geom geography(Polygon)`) and check `ST_Covers(zone.geom, ST_Point(lng, lat))` at checkout; PostGIS is a standard Supabase extension. For MVP a list of allowed Berlin PLZ / Dubai communities is simpler and sufficient — use polygons only once pricing depends on distance.

---

## 6. Notifications

### 6.1 Email — Resend

- Free: 3,000 emails/month, "100 emails per day"; Pro $20/month for 50,000 or $35/month for 100,000; overage $0.90 per 1,000 (Resend pricing, 2026). https://resend.com/pricing
- Use React Email templates rendered in Next.js server actions / Edge Functions; send transactional (order confirmation, visit reminder T-1 day, visit report with photos, invoice).

### 6.2 WhatsApp

- Meta moved to per-message pricing on 1 July 2025: marketing always charged; utility and authentication templates free inside an open 24-hour customer service window; all non-template messages free inside the window; 72-hour free entry point after click-to-WhatsApp ads (Meta developer docs, 2025). https://developers.facebook.com/docs/whatsapp/pricing
- Reported per-message ranges (2025/26): marketing $0.025–$0.1365; utility $0.004–$0.0456 by market; Germany marketing ~$0.13–0.14 and Germany utility $0.0550 reported by aggregators. https://www.engagelab.com/blog/whatsapp-business-api-pricing ; https://setsmart.io/blog/whatsapp-business-api-pricing ; https://montymobile.com/newsroom/whatsapp-business-api-pricing-the-complete-2026-cost-guide-for-enterprise-teams/
- I could not find an authoritative UAE per-message utility rate in a fetchable page; Meta's rate card is a CSV/PDF download. Treat UAE as "Rest of Middle East" tier and look up the CSV before budgeting.
- Twilio adds $0.005 per WhatsApp message (inbound or outbound) on top of Meta fees (Twilio pricing, "current as of August 2026"). https://www.twilio.com/en-us/whatsapp/pricing
- Unverified (search snippet only, could not confirm on the fetched Twilio page): from 1 Oct 2026 service messages and in-window utility templates become chargeable. Treat as a risk to re-check.
- Estimate: a visit-reminder utility template per weekly visit ≈ 4–5 messages/customer/month ≈ $0.25/customer/month in Germany. WhatsApp Business API requires Meta Business verification; set-up time is days to weeks — plan it early for Dubai, where WhatsApp is the default channel.

### 6.3 Web push (PWA)

- Next.js PWA guide (docs v16.3.4, last updated 2026-07-30): Web Push supported on "iOS 16.4+ for applications installed to the home screen", Safari 16 on macOS 13+, Chromium, Firefox; VAPID keys + `web-push` in a Server Action; `beforeinstallprompt` not recommended because it "does not work on Safari iOS". https://nextjs.org/docs/app/guides/progressive-web-apps
- Implication: technician app push works on iOS only after "Add to Home Screen" — acceptable for staff you onboard personally.

### 6.4 Where to run senders

- Send from Next.js server actions for user-triggered events; from a pg_cron → pgmq → Edge Function worker for scheduled reminders (Supabase pattern, 2025). https://supabase.com/blog/processing-large-jobs-with-edge-functions

---

## 7. Image storage

- Supabase Pro ($25/month): 100 GB storage included, then $0.0213/GB (pricing page 2026; docs say $0.021); 250 GB egress then $0.09/GB; cached CDN egress $0.03/GB after 250 GB. https://supabase.com/pricing
- Image transformations: 100 distinct images free per project, then $5 per 1,000 distinct images transformed; Smart CDN + resizing require Pro (Supabase docs, 2025). https://supabase.com/docs/guides/platform/manage-your-usage/storage-image-transformations
- File limits: Free global limit 50 MB; Pro up to 500 GB; standard uploads ≤ 5 GB, resumable ≤ 50 GB (Supabase docs, 2025/26). https://supabase.com/docs/guides/storage/uploads/file-limits
- Recommendation: private bucket `visit-photos` (RLS: org members + staff), public bucket `catalog`. Resize on the client before upload (technician phones produce 3–5 MB JPEGs; estimate 4 photos/visit × 200 visits/month × 1 MB = ~0.8 GB/month — trivial). Use transformations for thumbnails only if >100 distinct images/month matters (it will; budget ~$1–5/month).

---

## 8. Admin / ops dashboard: build vs Retool

- Retool (2026 reported): Free up to 5 users; Team $10/builder/month + $5/internal user/month billed annually; Business ~$50/user/month; external users free up to 50 then $8/month each (Business+). https://uibakery.io/blog/retool-pricing ; https://docs.retool.com/support/billing-usage
- Third-party framing (2026): Retool for small ops teams <10 users, custom Next.js + Supabase when >20 staff or branded portals needed. https://aidxn.com/blog/retool-vs-custom-internal-admin-dashboard-2026/
- Recommendation: build `/admin` in the same Next.js app. Rationale: (1) the technician day view (route list + check-in + QR + photo) is mobile-first and customer-facing in effect — Retool mobile is weak for this; (2) RLS with an `is_staff()` claim gives you the auth for free; (3) Supabase Studio covers ad-hoc data edits at zero cost. Use Retool/Supabase Studio only for one-off back-office queries.

---

## 9. PWA vs Expo native

- PWA push works on iOS 16.4+ when installed (Next.js docs, 2026): https://nextjs.org/docs/app/guides/progressive-web-apps
- Expo SDK 53 (2025): New Architecture on by default; `@stripe/stripe-react-native` did not yet support New Architecture at release; supabase-js had a `ws`/Node-module import issue on SDK 53 (GitHub issue #1400, 2025). https://expo.dev/changelog/sdk-53 ; https://github.com/supabase/supabase-js/issues/1400
- Expo free plan: 15 Android + 15 iOS EAS builds/month (Expo billing docs, 2025/26). https://docs.expo.dev/billing/plans/
- Offline-first React Native with WatermelonDB + Supabase (Supabase blog, 2023 — pattern still current). https://supabase.com/blog/react-native-offline-first-watermelon-db
- Recommendation: customer app = PWA (Next.js) indefinitely; technician app = PWA with camera QR scanning and web push; revisit Expo only if technicians need offline mode in basements/parking garages or background location. Next.js has an experimental `useOffline` hook and Serwist for SW caching (Next.js docs, 2026).

---

## 10. Supabase RLS for multi-tenant B2B (organizations)

- Custom Access Token hook: runs before token issuance; can add claims; "the auth hook will only modify the access token JWT but not the auth response" — decode the JWT client-side (Supabase docs, 2025). https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook ; https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
- RLS performance (Supabase docs, 2025): index every column policies filter on; wrap `auth.uid()` as `(select auth.uid())` so it runs once per statement (initPlan); always specify `TO authenticated`; use `security definer` functions to break recursion between `organization_members` and other tables. https://supabase.com/docs/guides/database/postgres/row-level-security
- Community patterns (2025/26): tenancy boundary must be the organisation for B2B; `org_id` on every table; `WITH CHECK` on inserts; recursive-loop pitfall when `is_org_member()` reads an RLS-protected table. https://makerkit.dev/blog/tutorials/supabase-rls-best-practices ; https://designrevision.com/blog/supabase-row-level-security
- Testing: `supabase test db` runs pgTAP; files `supabase/tests/<table>_rls.test.sql`, alphabetical order so `000-setup-*.sql` first (Supabase docs, 2025). https://supabase.com/docs/guides/local-development/testing/overview ; https://supabase.com/docs/guides/local-development/testing/pgtap-extended
- **Recommended schema (my design):**
```
organizations(id, name, kind enum('household','company'), billing_email, vat_id, stripe_customer_id, country)
organization_members(org_id, user_id, role enum('owner','admin','member'), primary key (org_id,user_id))
staff(user_id, role enum('ops','technician'))
-- every tenant table: org_id uuid not null references organizations, index on org_id
create function public.is_org_member(p_org uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from organization_members where org_id = p_org and user_id = (select auth.uid())) $$;
create policy "org members read" on subscriptions for select to authenticated using ((select public.is_org_member(org_id)));
create policy "staff read all" on subscriptions for select to authenticated using ((select public.is_staff()));
```
- Even B2C customers get a 1-person `organization` of kind `household` so there is one code path (Makerkit "accounts" pattern, 2025).
- Put `is_staff` (boolean) in JWT via the hook from day one (cheap, avoids a lookup on every admin query); put `active_org_id` in JWT only when users belong to multiple orgs.

---

## 11. Regions, residency and latency

- Supabase regions (docs, 2026): eu-central-1 Frankfurt, eu-west-1/2/3, eu-central-2 Zurich, eu-north-1, ap-south-1 Mumbai, ap-southeast-1 Singapore, etc. **No Middle East region.** Nearest to Dubai is Mumbai (ap-south-1). https://supabase.com/docs/guides/platform/regions
- Third-party managed Supabase on UAE servers exists (wz-it.com, 2025) but is not the official cloud. https://wz-it.com/en/managed-open-source/uae/supabase/
- Estimate: Frankfurt→Dubai RTT ~120–150 ms, Mumbai→Dubai ~40–60 ms; either is acceptable for a CRUD PWA. No UAE data-residency law forces local hosting for plant-rental customer data (PDPL applies but permits cross-border transfer with safeguards — not researched in depth; open question).

---

## 12. Testing strategy (founder's Vitest/pgTAP preference)

- pgTAP for: RLS (org isolation, staff access), `generate_visits()` idempotency, exclusion constraint on `asset_allocations`, availability function.
- Vitest for: Stripe webhook handlers (use Stripe CLI fixtures), price calculation, address/zone validation. Stripe now ships agent skills/CLI (`stripe agent setup`) per the docs page fetched (2026). https://docs.stripe.com/skills.md

---

## 13. Market-choice implications from the tech lens

| Topic | Berlin/Germany | Dubai/UAE |
|---|---|---|
| Stripe eligibility | German business/freelancer registration | UAE trade licence mandatory (free-zone LLC ≈ AED 10–20k/yr — not researched here; open question) |
| Card fee (2026) | 1.5% + EUR 0.25 | 2.9% + AED 1.00 |
| Bank debit | SEPA DD EUR 0.35 flat, mandate via Checkout | none on Stripe; cards/Apple Pay/Google Pay only |
| B2B invoicing | Stripe Invoicing 0.4%; e-invoice issuing for all from 2028 | Invoicing not listed as available; PINT AE/Peppol via ASP for SMEs from 1 Jul 2027 |
| Local pay methods missing | none critical | Mada, Tabby/Tamara not native on Stripe |
| Supabase region | Frankfurt (GDPR-clean) | Mumbai nearest; no local region |
| WhatsApp importance | nice-to-have; utility ~$0.055/msg | primary channel; rate unverified |
| Address data | excellent (street + number) | villa/community addressing; needs map-pin + notes field |

Estimate: from a pure infrastructure standpoint Germany is cheaper (payments ~1.5 pp lower on cards, SEPA for B2B) and simpler (no licence gate, Invoicing available, local region). UAE is viable technically but adds: licence prerequisite, ~2x card fees, WhatsApp as a must-have, and an e-invoicing integration dated mid-2027.

---

## Sources

- https://stripe.com/ae/pricing (Stripe UAE pricing, 2026)
- https://support.stripe.com/questions/connect-availability-in-the-uae (Stripe UAE eligibility, 2025/26)
- https://support.stripe.com/questions/which-payments-methods-and-products-are-available-in-the-uae (Stripe UAE methods/products, 2025/26)
- https://stripe.com/newsroom/news/stripe-launches-uae (2021)
- https://docs.stripe.com/tax/supported-countries/asia-pacific/united-arab-emirates (Stripe Tax UAE, 2026)
- https://stripe.com/resources/more/uae-vat-rate-what-businesses-need-to-know (2025)
- https://www.uaefreezonecompare.com/banking/uae-payment-gateways-free-zone-ecommerce-stripe-checkout-paytabs-2026/ (2026)
- https://ziina.com/blog/stripe-alternatives (2025)
- https://www.skimbox.us/en/resources/blogs/uae-payment-gateway-comparison-telr-stripe-checkout (2026)
- https://stripe.com/de/pricing (Stripe Germany pricing, 2026)
- https://www.feecalcpro.com/blog/stripe-fees-germany-guide/ (2026, conflicting SEPA figure)
- https://www.profitvana.com/guides/stripe-fees-in-germany (2026)
- https://stripe.com/payments/sepa-direct-debit (2025)
- https://stripe.com/en-si/resources/more/sepa-business-to-business-direct-debit-germany (2025)
- https://docs.stripe.com/billing/subscriptions/ideal (2025)
- https://docs.stripe.com/tax/checkout/tax-ids (2025)
- https://docs.stripe.com/payments/checkout/automatic_taxes (2025)
- https://docs.stripe.com/api/checkout/sessions/create (2025)
- https://docs.stripe.com/payments/checkout/billing-cycle (2025)
- https://docs.stripe.com/api/subscription_schedules/object (2025)
- https://docs.stripe.com/billing/subscriptions/prebilling (2025)
- https://docs.stripe.com/billing/subscriptions/pause (2025)
- https://edge-docs.stripe.com/customer-management/configure-portal (2025)
- https://www.cleartax.com/de/en/e-invoicing-timeline-in-germany (2026)
- https://www.avalara.com/blog/en/europe/2026/03/uae-e-invoicing-mandate-2026-readiness-asp-pint-ae.html (2026)
- https://www.cleartax.com/ae/e-invoicing-uae (2026)
- https://supabase.com/docs/guides/cron (2025)
- https://github.com/orgs/supabase/discussions/36383 (pg_cron timezone, 2025)
- https://supabase.com/docs/guides/functions/schedule-functions (2025)
- https://supabase.com/docs/guides/queues (2025)
- https://supabase.com/blog/processing-large-jobs-with-edge-functions (2025)
- https://supabase.com/docs/guides/functions/limits (2025/26)
- https://developers.google.com/maps/billing-and-pricing/pricing (2026)
- https://developers.google.com/maps/documentation/route-optimization/usage-and-billing (2025)
- https://developers.google.com/maps/documentation/places/web-service/session-pricing (2025)
- https://www.mapbox.com/pricing (2026)
- https://github.com/VROOM-Project/vroom (2025)
- https://www.pistack.xyz/posts/2026-06-16-self-hosted-vehicle-routing-optimization-vroom-jsprit-ortools/ (2026)
- https://www.postgresql.org/docs/current/rangetypes.html (PG 18, 2025)
- https://neon.com/docs/extensions/btree_gist (2025)
- https://dev.to/franckpachot/postgresql-exclude-constraints-for-better-concurrency-than-serializable-pob (2025)
- https://www.jusdb.com/blog/postgresql-range-types-exclusion-constraints (2025)
- https://resend.com/pricing (2026)
- https://developers.facebook.com/docs/whatsapp/pricing (2025)
- https://www.engagelab.com/blog/whatsapp-business-api-pricing (2026)
- https://setsmart.io/blog/whatsapp-business-api-pricing (2026)
- https://montymobile.com/newsroom/whatsapp-business-api-pricing-the-complete-2026-cost-guide-for-enterprise-teams/ (2026)
- https://www.twilio.com/en-us/whatsapp/pricing (Aug 2026)
- https://nextjs.org/docs/app/guides/progressive-web-apps (2026-07-30)
- https://expo.dev/changelog/sdk-53 (2025)
- https://github.com/supabase/supabase-js/issues/1400 (2025)
- https://docs.expo.dev/billing/plans/ (2025/26)
- https://supabase.com/blog/react-native-offline-first-watermelon-db (2023)
- https://supabase.com/pricing (2026)
- https://supabase.com/docs/guides/platform/manage-your-usage/storage-image-transformations (2025)
- https://supabase.com/docs/guides/storage/uploads/file-limits (2025/26)
- https://uibakery.io/blog/retool-pricing (2026)
- https://docs.retool.com/support/billing-usage (2026)
- https://aidxn.com/blog/retool-vs-custom-internal-admin-dashboard-2026/ (2026)
- https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook (2025)
- https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac (2025)
- https://supabase.com/docs/guides/database/postgres/row-level-security (2025)
- https://makerkit.dev/blog/tutorials/supabase-rls-best-practices (2025)
- https://designrevision.com/blog/supabase-row-level-security (2026)
- https://supabase.com/docs/guides/local-development/testing/overview (2025)
- https://supabase.com/docs/guides/local-development/testing/pgtap-extended (2025)
- https://supabase.com/docs/guides/platform/regions (2026)
- https://wz-it.com/en/managed-open-source/uae/supabase/ (2025)
