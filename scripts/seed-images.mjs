/**
 * Uploads placeholder catalog images into the public `catalog` storage bucket
 * so a freshly reset local database renders a catalog that looks like the real
 * thing. Real photos are uploaded by operators through /ops/catalog.
 *
 *   npm run seed:images
 */
import { createClient } from "@supabase/supabase-js";
import { execSync } from "node:child_process";

const status = execSync("supabase status -o env", { encoding: "utf8" });
const read = (key) =>
  status.match(new RegExp(`^${key}="?([^"\\n]+)"?$`, "m"))?.[1];

const url = read("API_URL");
const serviceKey = read("SERVICE_ROLE_KEY");

if (!url || !serviceKey) {
  console.error("Could not read local Supabase credentials. Is `supabase start` running?");
  process.exit(1);
}

// Each entry matches a photo_path in supabase/seed.sql.
const PLANTS = [
  { path: "seed/snake-desk.svg", leaf: "#2f6b46", shape: "spikes" },
  { path: "seed/snake-floor.svg", leaf: "#27573a", shape: "spikes" },
  { path: "seed/zz-desk.svg", leaf: "#356f4a", shape: "oval" },
  { path: "seed/zz-floor.svg", leaf: "#2b6040", shape: "oval" },
  { path: "seed/pothos-desk.svg", leaf: "#4a8c5e", shape: "trail" },
  { path: "seed/aglaonema-desk.svg", leaf: "#5c9a6e", shape: "oval" },
  { path: "seed/aglaonema-floor.svg", leaf: "#4d8a60", shape: "oval" },
  { path: "seed/kentia-statement.svg", leaf: "#2f6b46", shape: "palm" },
  { path: "seed/areca-statement.svg", leaf: "#3d7d51", shape: "palm" },
];

function svg({ leaf, shape }) {
  const foliage = {
    spikes: `<path d="M200 260 L170 90 M200 260 L200 70 M200 260 L230 95" stroke="${leaf}" stroke-width="18" stroke-linecap="round" fill="none"/>`,
    oval: `<ellipse cx="150" cy="150" rx="46" ry="30" fill="${leaf}" transform="rotate(-28 150 150)"/>
           <ellipse cx="250" cy="140" rx="46" ry="30" fill="${leaf}" transform="rotate(24 250 140)"/>
           <ellipse cx="200" cy="105" rx="44" ry="30" fill="${leaf}"/>
           <path d="M200 260 V130" stroke="${leaf}" stroke-width="10" stroke-linecap="round"/>`,
    trail: `<path d="M200 120 C140 160 130 220 160 265 M200 120 C260 160 272 220 242 265" stroke="${leaf}" stroke-width="8" fill="none" stroke-linecap="round"/>
            <circle cx="150" cy="190" r="20" fill="${leaf}"/><circle cx="252" cy="190" r="20" fill="${leaf}"/>
            <circle cx="166" cy="245" r="17" fill="${leaf}"/><circle cx="236" cy="245" r="17" fill="${leaf}"/>
            <circle cx="200" cy="120" r="24" fill="${leaf}"/>`,
    palm: `<path d="M200 265 V110" stroke="${leaf}" stroke-width="12" stroke-linecap="round"/>
           <path d="M200 115 C150 70 105 80 80 110 C130 118 170 130 200 150 Z" fill="${leaf}"/>
           <path d="M200 115 C250 70 295 80 320 110 C270 118 230 130 200 150 Z" fill="${leaf}"/>
           <path d="M200 150 C160 120 120 130 96 158 C146 166 176 178 200 196 Z" fill="${leaf}" opacity="0.85"/>
           <path d="M200 150 C240 120 280 130 304 158 C254 166 224 178 200 196 Z" fill="${leaf}" opacity="0.85"/>`,
  }[shape];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="400" height="320">
  <rect width="400" height="320" fill="#e8f1ea"/>
  ${foliage}
  <path d="M158 258 h84 l-10 46 a8 8 0 0 1 -8 7 h-48 a8 8 0 0 1 -8 -7 Z" fill="#c9b8a4"/>
  <rect x="152" y="250" width="96" height="14" rx="5" fill="#b8a692"/>
</svg>`;
}

const supabase = createClient(url, serviceKey);

let uploaded = 0;
for (const plant of PLANTS) {
  const { error } = await supabase.storage
    .from("catalog")
    .upload(plant.path, new Blob([svg(plant)], { type: "image/svg+xml" }), {
      contentType: "image/svg+xml",
      upsert: true,
    });
  if (error) {
    console.error(`  ✗ ${plant.path}: ${error.message}`);
  } else {
    uploaded += 1;
  }
}

console.log(`Uploaded ${uploaded}/${PLANTS.length} placeholder catalog images.`);
