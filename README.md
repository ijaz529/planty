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
| `/auth` | Phone sign-in | Everyone |
| `/profile` | Name, email, verified phone | Signed in |
| `/sites` | Where the plants live, with map pin and zone check | Signed in |
| `/organizations` | Business accounts and their people | Signed in |
| `/ops` | Catalog, zones and waitlist | Operator |

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

Feature 001 (foundation: accounts, organizations, service zones, plant catalog)
is complete. Next up is 002, which turns the published catalog into a priced
basket. The roadmap is in [the PRD](docs/PRD.md).

**One decision is open and blocks feature 002.** The app is built for Dubai;
the completed research recommends Berlin, B2B only, mainly because no UAE
operator publishes a rental price and because the founder lives in Germany
while this is a physical route business. The structure of feature 001 works
unchanged in either city — only constants and copy differ. See
[the market decision](docs/DECISION-market.md).
