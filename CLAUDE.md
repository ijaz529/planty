# planty Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-09-10

## Active Technologies

- TypeScript 5.x, Node 20+ + Next.js 16 (App Router), React 19, `@supabase/supabase-js` v2, `@supabase/ssr`, Tailwind CSS v4, Zod v4, Leaflet + react-leafle (001-foundation-accounts-catalog)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x, Node 20+: Follow standard conventions

## Recent Changes

- 001-foundation-accounts-catalog: Added TypeScript 5.x, Node 20+ + Next.js 16 (App Router), React 19, `@supabase/supabase-js` v2, `@supabase/ssr`, Tailwind CSS v4, Zod v4, Leaflet + react-leafle

<!-- MANUAL ADDITIONS START -->

## Local stack (ports are deliberate)

Two other Supabase projects run on this machine (barber-hero 543xx,
laundry-shop 563xx). Planty is pinned to **553xx** and the dev server to
**3020**. Container name is `supabase_db_planty`.

```bash
supabase start && npm run dev          # app at http://localhost:3020
supabase test db                       # pgTAP
supabase db reset                      # migrations + seed
docker exec supabase_db_planty psql -U postgres -d postgres -c '<sql>'
```

## House rules that are easy to break

- **Migrations are hand-numbered** `supabase/migrations/NNNN_name.sql`. Never
  run `supabase migration new` — its timestamp prefix breaks the ordering.
- **Every table ships with RLS policies and a pgTAP test in the same change.**
  Policy names read `"table: what it does"`, always name the role
  (`to authenticated` / `to anon`), and always wrap as `(select auth.uid())`.
- Helper functions are `security definer` with `set search_path = ''`, and
  `stable` when they only read. `org_role()` exists to stop RLS recursion on
  `organization_members` — never sub-query that table inside its own policy.
- **Local phone sign-in needs an enabled SMS provider** with dummy Twilio
  credentials, even though no SMS is sent. Test-OTP keys in `config.toml` are
  bare digits, no `+`, no quotes. `auth.users.phone` has no `+`;
  `profiles.phone` is E.164 with one.
- Seeding `auth.users` directly requires all eight GoTrue token columns set to
  `''`, not NULL.
- **PostGIS geography is (longitude, latitude).** Dubai is about
  `55.27, 25.20`. A reversed pair lands in the ocean and makes zone tests pass
  for the wrong reason.
- Tailwind v4: there is no `tailwind.config`. Theme tokens live in
  `src/app/globals.css` under `@theme inline`.
- Next 16: `cookies()` is async; a client page calling `useSearchParams()` must
  sit inside `<Suspense>` or the production build fails.
- `.gitignore` ignores `.env*`, so `.env.example` needs `git add -f`.

## Where the thinking lives

- `.specify/memory/constitution.md` — the nine principles. Principle I (route
  density) and II (B2B-first) decide most product arguments.
- `docs/PRD.md` — market decision, scope, pricing hypothesis, open questions.
- `docs/research/` — 14 evidence lenses behind every claim above.

<!-- MANUAL ADDITIONS END -->
