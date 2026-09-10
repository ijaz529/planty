/**
 * Replaces the seed catalog photographs with Unsplash ones.
 *
 *   UNSPLASH_ACCESS_KEY=... npm run photos:unsplash
 *
 * Writes 900x900 JPEGs into scripts/plant-photos/ and rewrites CREDITS.json,
 * which drives both `npm run seed:images` and the credit line on the plant
 * page. Run `npm run seed:images` afterwards to upload them.
 *
 * Two obligations from Unsplash's API terms are handled here, not left to the
 * caller: every download pings the photo's `download_location` endpoint, and
 * every credit carries the photographer and Unsplash as links with the utm
 * parameters they ask for.
 *
 * A pick is the first search hit unless `pin` names a photo id, which is the
 * escape hatch for when search returns something that is not the plant.
 */
import { execFileSync } from "node:child_process";
import {
  readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, rmSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const photos = join(here, "plant-photos");
const APP = "planty";
const UTM = `utm_source=${APP}&utm_medium=referral`;
const SIZE = 900;

/** One entry per published variant in supabase/seed.sql. */
const SLOTS = [
  { slot: "snake-desk",       query: "snake plant sansevieria pot",     pin: null },
  { slot: "snake-floor",      query: "tall snake plant interior",       pin: null },
  { slot: "zz-desk",          query: "zz plant zamioculcas pot",        pin: null },
  { slot: "zz-floor",         query: "zz plant floor interior",         pin: null },
  { slot: "pothos-desk",      query: "golden pothos plant pot",         pin: null },
  { slot: "aglaonema-desk",   query: "aglaonema chinese evergreen",     pin: null },
  { slot: "aglaonema-floor",  query: "aglaonema plant interior",        pin: null },
  { slot: "kentia-statement", query: "kentia palm indoor plant",        pin: null },
  { slot: "areca-statement",  query: "areca palm indoor plant",         pin: null },
];

function accessKey() {
  if (process.env.UNSPLASH_ACCESS_KEY) return process.env.UNSPLASH_ACCESS_KEY.trim();
  const envFile = join(here, "..", ".env.local");
  if (existsSync(envFile)) {
    const m = readFileSync(envFile, "utf8").match(/^UNSPLASH_ACCESS_KEY="?([^"\n]+)"?$/m);
    if (m) return m[1].trim();
  }
  console.error(
    [
      "No UNSPLASH_ACCESS_KEY found.",
      "",
      "  1. Sign in at https://unsplash.com/developers and create an app",
      "     (the free Demo tier allows 50 requests an hour; this needs about 20).",
      "  2. Copy its Access Key.",
      "  3. Add it to .env.local:  UNSPLASH_ACCESS_KEY=your-key",
      "",
      "The key is only read here, and .env.local is gitignored.",
    ].join("\n")
  );
  process.exit(1);
}

const KEY = accessKey();
const auth = { Authorization: `Client-ID ${KEY}`, "Accept-Version": "v1" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url, { headers: auth });
    if (r.status === 401) {
      console.error("Unsplash rejected the key (401). Check UNSPLASH_ACCESS_KEY.");
      process.exit(1);
    }
    if (r.status === 403) {
      console.error("Unsplash rate limit reached (403). Wait an hour and re-run.");
      process.exit(1);
    }
    if (r.ok) return r.json();
    await sleep(2000 * (attempt + 1));
  }
  return null;
}

async function pick({ slot, query, pin }) {
  if (pin) return api(`https://api.unsplash.com/photos/${pin}`);
  const url =
    "https://api.unsplash.com/search/photos" +
    `?query=${encodeURIComponent(query)}&per_page=1` +
    "&orientation=squarish&content_filter=high";
  const j = await api(url);
  const photo = j?.results?.[0];
  if (!photo) console.error(`  no result for ${slot}: "${query}"`);
  return photo ?? null;
}

/** Square, SIZE px, ~82 quality — matching what the catalog grid renders. */
function square(fileIn, fileOut) {
  const dim = (flag) => {
    const out = execFileSync("sips", ["-g", flag, fileIn], { encoding: "utf8" });
    const m = out.match(new RegExp(`${flag}:\\s*(\\d+)`));
    if (!m) throw new Error(`sips did not report ${flag} for ${fileIn}`);
    return Number(m[1]);
  };
  const [w, h] = [dim("pixelWidth"), dim("pixelHeight")];
  const fit = w < h ? ["--resampleWidth", String(SIZE)] : ["--resampleHeight", String(SIZE)];
  execFileSync("sips", [...fit, fileIn], { stdio: "ignore" });
  execFileSync("sips", ["-c", String(SIZE), String(SIZE), fileIn], { stdio: "ignore" });
  execFileSync(
    "sips",
    ["-s", "format", "jpeg", "-s", "formatOptions", "82", fileIn, "--out", fileOut],
    { stdio: "ignore" }
  );
}

mkdirSync(photos, { recursive: true });
const staging = join(photos, ".staging");
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
const credits = [];

for (const entry of SLOTS) {
  const photo = await pick(entry);
  await sleep(400);
  if (!photo) continue;

  // Unsplash's API terms require this ping whenever a photo is downloaded.
  await api(`${photo.links.download_location}`).catch(() => {});

  const src = `${photo.urls.raw}&w=1600&fit=max&fm=jpg&q=90`;
  const res = await fetch(src);
  if (!res.ok) {
    console.error(`  ✗ ${entry.slot}: download failed (${res.status})`);
    continue;
  }
  const tmp = join(staging, `${entry.slot}.src`);
  writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
  square(tmp, join(staging, `${entry.slot}.jpg`));
  rmSync(tmp, { force: true });

  credits.push({
    path: `seed/${entry.slot}.jpg`,
    title: photo.alt_description || photo.description || entry.query,
    author: photo.user.name,
    authorUrl: `${photo.user.links.html}?${UTM}`,
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    source: `${photo.links.html}?${UTM}`,
    sourceName: "Unsplash",
  });
  console.log(`  ok  ${entry.slot.padEnd(18)} ${photo.user.name}`);
  await sleep(400);
}

if (credits.length !== SLOTS.length) {
  rmSync(staging, { recursive: true, force: true });
  console.error(
    `\nOnly ${credits.length}/${SLOTS.length} photos fetched. Nothing was changed —` +
      " the existing photographs and CREDITS.json still agree."
  );
  process.exit(1);
}

for (const c of credits) {
  const name = c.path.replace(/^seed\//, "");
  renameSync(join(staging, name), join(photos, name));
}
rmSync(staging, { recursive: true, force: true });
writeFileSync(join(photos, "CREDITS.json"), JSON.stringify(credits, null, 2) + "\n");
console.log(`\nWrote ${credits.length} photographs and CREDITS.json.`);
console.log("Next: npm run seed:images");
