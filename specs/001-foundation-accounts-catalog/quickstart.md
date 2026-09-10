# Quickstart: Foundation — Accounts, Organizations, Zones & Plant Catalog

**Feature**: `001-foundation-accounts-catalog` · **Date**: 2026-09-10

## Prerequisites

- Node 20 or newer
- Docker Desktop running
- Supabase CLI (2.98 or newer)

Two other Supabase stacks may already run on this machine (`barber-hero` on
543xx, `laundry-shop` on 563xx), so Planty is pinned to the **553xx** range and
the dev server to **3020**.

| Service | URL |
|---|---|
| App | http://localhost:3020 |
| Supabase API | http://127.0.0.1:55321 |
| Supabase Studio | http://127.0.0.1:55323 |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:55322/postgres` |

## First-time setup

```bash
npm install
supabase start
cp .env.example .env.local
```

Fill `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` from:

```bash
supabase status -o env
```

Then:

```bash
npm run dev
```

## Signing in without real SMS

Local sign-in never contacts Twilio. `supabase/config.toml` maps four numbers
to a fixed code, and the SMS provider is enabled with dummy credentials so
Supabase Auth accepts the request at all.

**The code is always `123456`.**

| Number to type | Who they are | Where they land |
|---|---|---|
| `050 000 0001` | Priya — private customer | Customer home |
| `050 000 0002` | Nadia — owner of the seeded organization | Customer home, with the organization available |
| `050 000 0003` | Planty operator | Operator console at `/ops` |
| `050 000 0004` | Tariq — Planty technician | Customer home (no technician surface until feature 004) |

Any of the accepted input formats work: `0500000001`, `500000001`,
`971500000001`, `+971500000001`.

A number that is not in that list still reaches the code screen but no code
will ever arrive, which is the expected local behaviour.

## What the seed contains

- The four accounts above, with their staff roles set.
- One organization, **Northwind Labs**, owned by Nadia, with one business site
  inside a served zone.
- One personal site for Priya, also inside a served zone.
- Two active service zones, drawn as simple polygons around Business Bay and
  Dubai Marina, with their service weekdays set.
- Six plant species with published variants across all three size tiers, plus
  one deliberately incomplete draft variant so the publish guard can be seen
  failing, and one published variant with zero stock so the unavailable state
  renders.

## Daily loop

```bash
npm run dev            # app on http://localhost:3020
npm run test           # Vitest unit tests
supabase test db       # pgTAP: RLS, guards, zone resolution
supabase db reset      # replay migrations, then seed
npm run build          # production build
```

Ad-hoc SQL against the running stack:

```bash
docker exec supabase_db_planty psql -U postgres -d postgres -c 'select * from public.service_zones'
```

The pgTAP output is verbose. To see only what matters:

```bash
supabase test db 2>&1 | grep -E "not ok|Failed test|caught|wanted|have|want|ERROR|Result"
```

## Verifying the feature by hand

1. **Public catalog without an account.** Open http://localhost:3020 signed
   out. Every published plant shows a price in AED. The zero-stock variant is
   visible and marked unavailable. No sign-in prompt blocks the page.
2. **Sign up.** Sign in as `050 000 0001`, code `123456`, set a name, land on
   the customer home. Sign out, sign back in, the name is still there.
3. **Phone formats.** Sign out and sign in again as `+971500000001`. Same
   account, same name — no duplicate.
4. **Organization.** As `050 000 0002`, open the organization, invite a number
   that has never signed in (for example `050 000 0009`). Sign in as that
   number: the organization is there immediately. Remove the member as Nadia;
   they lose access. Try to remove Nadia herself: refused, because she is the
   last owner.
5. **Sites and zones.** Add a site with the pin inside the Marina polygon: it
   saves and shows that zone's service days. Drag the pin into open desert and
   save: refused with an explanation and a waitlist offer.
6. **Catalog administration.** As `050 000 0003`, open `/ops`. Create a species,
   add a variant with no photo and no price, try to publish: refused, listing
   exactly what is missing. Add them, publish, and see the variant appear on
   the public catalog. Change its price and confirm the previous price is
   recorded in history.
7. **Access control.** As `050 000 0001`, navigate to `/ops`. It must render as
   not found, not as a permission error — an internal area should not confirm
   it exists.

## Surfaces

| URL | What it is | Audience |
|---|---|---|
| `/` | Public plant catalog with prices | Everyone, no account needed |
| `/plants/[slug]` | Species detail with its size variants | Everyone |
| `/auth`, `/auth/verify` | Phone sign-in and code entry | Everyone |
| `/profile` | Name, email, verified phone | Signed in |
| `/sites` | Sites list, add a site with a map pin | Signed in |
| `/organizations` | Create an organization, manage members | Signed in |
| `/ops` | Operator console home | Operator |
| `/ops/catalog` | Species and variants, publish controls | Operator |
| `/ops/zones` | Service zones and their weekdays | Operator |
| `/ops/waitlist` | Requests from outside served zones | Operator |

## Known local gotchas

- `supabase start` on first run pulls several images; give it a few minutes.
- If sign-in fails immediately with a provider error, the Twilio block in
  `config.toml` is disabled. It must be `enabled = true` with dummy credentials
  even though no SMS is sent.
- Test-OTP keys in `config.toml` are bare digits with no `+` and no quotes.
- PostGIS geography takes coordinates as **(longitude, latitude)**. Dubai is
  roughly `55.27, 25.20`; if a pin appears in the ocean, the pair is reversed.
- `.gitignore` ignores `.env*`, so `.env.example` is tracked only because it was
  force-added.
