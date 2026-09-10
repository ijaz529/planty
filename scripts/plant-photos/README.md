# Seed catalog photographs

One 900x900 JPEG per published variant in `supabase/seed.sql`, committed so
seeding needs no network. `npm run seed:images` uploads them into the public
`catalog` bucket.

`CREDITS.json` is the source of truth for attribution. It names the
photographer, the licence and the page each photo came from, and it is read
twice: by the upload script above, and by `src/lib/photo-credits.ts`, which
renders the credit on the plant page. The two cannot disagree.

Both sources this project uses require the photographer to be credited
wherever the image runs — Wikimedia Commons through CC BY / CC BY-SA, Unsplash
through its API terms — which is why the credit is rendered rather than only
recorded here.

## Refreshing from Unsplash

```bash
# once: create a free app at https://unsplash.com/developers,
# then put its Access Key in .env.local as UNSPLASH_ACCESS_KEY
npm run photos:unsplash   # fetches, crops, rewrites CREDITS.json
npm run seed:images       # uploads them
```

`scripts/fetch-unsplash-photos.mjs` takes the first search hit per slot. When
search returns something that is not the plant, set that slot's `pin` to an
Unsplash photo id and re-run.

## Before launch

Replace all of these with Planty's own photographs. A photo an operator
uploads through `/ops/catalog` has no entry in `CREDITS.json` and gets no
credit line, which is correct for a picture Planty owns.
