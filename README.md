# Planty

Rent plants. We keep them alive.

Planty rents living plants to offices and homes in Dubai, delivers and installs
them, and sends a technician every week to look after them. Plants that decline
are replaced, not invoiced. Every price is published online, which no
competitor in the market currently does.

[PRD](docs/PRD.md) · [Constitution](.specify/memory/constitution.md) ·
[Research](docs/research/) · [Specs](specs/)

**Stack**: Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Supabase
(Postgres + PostGIS, Auth, Storage, RLS) · Zod · Leaflet · Vitest · pgTAP

## Setup

Prerequisites: Node 20+, Docker, Supabase CLI.

```bash
npm install
supabase start
cp .env.example .env.local   # fill NEXT_PUBLIC_SUPABASE_ANON_KEY from `supabase status -o env`
npm run seed:images          # placeholder catalog photos into local storage
npm run dev
```

The app runs on http://localhost:3020. Two other Supabase projects may already
be running on this machine, so Planty is pinned to the **553xx** port range
(API 55321, Studio 55323).

## Test sign-ins

Local sign-in never sends an SMS. **The code is always `123456`.**

| Number | Who | Lands on |
|---|---|---|
| 050 000 0001 | Priya, private customer | Catalog |
| 050 000 0002 | Nadia, owner of Northwind Labs | Catalog, with the organization |
| 050 000 0003 | Omar, Planty operator | `/ops` |
| 050 000 0004 | Tariq, Planty technician | Catalog (no technician surface until feature 004) |

Any accepted format works: `0500000001`, `500000001`, `+971500000001`.

## Commands

```bash
npm run dev          # app on http://localhost:3020
npm run test         # Vitest unit tests
npm run build        # production build
npm run lint         # ESLint
npm run seed:images  # placeholder catalog images into Supabase Storage
supabase test db     # pgTAP: RLS, guards, zone containment
supabase db reset    # replay migrations, then seed
```

Ad-hoc SQL against the running stack:

```bash
docker exec supabase_db_planty psql -U postgres -d postgres -c 'select * from public.service_zones'
```

## Surfaces

| URL | What it is | Audience |
|---|---|---|
| `/` | Plant catalog with every monthly price | Everyone, no account needed |
| `/plants/[id]` | One plant, its care profile and size options | Everyone |
| `/bundles` | Starter bundles, priced from their contents | Everyone |
| `/basket` | Build a basket, pick a term and cadence, see the exact monthly total | Everyone |
| `/checkout` | Confirm the site, pick an installation day, place the order | Signed in |
| `/subscriptions` | Your orders, their status, invoice details, and the record of every visit | Signed in |
| `/today` | The day's round: stops in order, access notes, plant conditions, photo | Technician |
| `/auth` | Phone sign-in | Everyone |
| `/profile` | Name, email, verified phone | Signed in |
| `/sites` | Where the plants live, with map pin and zone check | Signed in |
| `/organizations` | Business accounts and their people | Signed in |
| `/ops` | Catalog, pricing, subscriptions, visits, zones and waitlist | Operator |

## How it is built

Work flows through [Spec Kit](https://github.com/github/spec-kit): specify →
plan → tasks → implement, one numbered feature per branch under `specs/`.

Postgres is the security boundary. Every table has Row Level Security policies
before it ships, and the rules the business depends on — zone containment,
publish completeness, stock sanity, an organization never losing its last owner
— are constraints and triggers in the database, not checks in a form. The
pgTAP suite in `supabase/tests/` is the executable version of the access
contract.

## Status

Features 001 (foundation), 002 (configure and price) and 003 (checkout) are
complete, and so is 004 (the visit engine). A customer can price an office with
no account, place an order that reserves stock at the price they saw, and pay by
bank transfer. Visits are then generated automatically on the days their zone is
served, a technician works the round from a phone, and the customer sees a photo
and a verdict on every plant after each visit. Card payment is deliberately
deferred until the trade licence exists. The roadmap is in
[the PRD](docs/PRD.md).

The pricing rule is deliberately implemented twice — `price_basket()` in
Postgres is the authority, `src/lib/pricing.ts` keeps the basket responsive —
and one shared fixture file is run against both suites, so the price displayed
and the price charged cannot drift without a test failing.

**The market is settled: Dubai**, chosen by the founder over the research's
Berlin recommendation. Two obligations follow. No UAE operator publishes a
rental price, so Planty's are the first observable ones and remain a hypothesis
to be tested — which is why every price, fee and multiplier is operator-edited
data rather than a constant. And the open question is now who physically runs
the Dubai route. See [the market decision](docs/DECISION-market.md).
