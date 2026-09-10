/**
 * Uploads the seed catalog photographs in `scripts/plant-photos/` into the
 * public `catalog` storage bucket, so a freshly reset local database renders a
 * catalog of real plants.
 *
 * The photographs come from Wikimedia Commons under CC BY / CC BY-SA — see
 * CREDITS.md in that folder, which the plant page renders as attribution.
 * Real Planty photographs are uploaded by operators through /ops/catalog.
 *
 *   npm run seed:images
 */
import { createClient } from "@supabase/supabase-js";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const photos = join(here, "plant-photos");

const status = execSync("supabase status -o env", { encoding: "utf8" });
const read = (key) =>
  status.match(new RegExp(`^${key}="?([^"\\n]+)"?$`, "m"))?.[1];

const url = read("API_URL");
const serviceKey = read("SERVICE_ROLE_KEY");

if (!url || !serviceKey) {
  console.error("Could not read local Supabase credentials. Is `supabase start` running?");
  process.exit(1);
}

// Each entry's `path` matches a photo_path in supabase/seed.sql.
const CREDITS = JSON.parse(readFileSync(join(photos, "CREDITS.json"), "utf8"));

const supabase = createClient(url, serviceKey);

let uploaded = 0;
for (const credit of CREDITS) {
  const file = credit.path.replace(/^seed\//, "");
  const body = readFileSync(join(photos, file));
  const { error } = await supabase.storage
    .from("catalog")
    .upload(credit.path, body, { contentType: "image/jpeg", upsert: true });
  if (error) {
    console.error(`  ✗ ${credit.path}: ${error.message}`);
  } else {
    uploaded += 1;
  }
}

console.log(`Uploaded ${uploaded}/${CREDITS.length} catalog photographs.`);
