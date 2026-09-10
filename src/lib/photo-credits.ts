/**
 * Attribution for the seed catalog photographs.
 *
 * Both sources ask for the same thing in different words. Wikimedia Commons
 * photos are CC BY / CC BY-SA, which require the photographer named wherever
 * the image runs. Unsplash asks for the photographer and Unsplash itself, both
 * as links. One credit shape serves both.
 *
 * The same file drives `npm run seed:images`, so the credit and the upload can
 * never disagree. A photograph an operator uploads has no entry here, and gets
 * no credit — correct for a picture Planty owns.
 */
import credits from "../../scripts/plant-photos/CREDITS.json";

export type PhotoCredit = {
  /** Matches `photo_path` on the variant, e.g. "seed/snake-desk.jpg". */
  path: string;
  title: string;
  author: string;
  /** The photographer's page, where the source publishes one. */
  authorUrl?: string;
  license: string;
  licenseUrl: string;
  /** The page this photo lives on. */
  source: string;
  /** "Unsplash", "Wikimedia Commons". */
  sourceName: string;
};

const BY_PATH = new Map<string, PhotoCredit>(
  (credits as PhotoCredit[]).map((c) => [c.path, c])
);

export function creditFor(path: string | null | undefined): PhotoCredit | null {
  return path ? BY_PATH.get(path) ?? null : null;
}

/** The distinct credits for a set of photos, in the order the photos appear. */
export function creditsFor(paths: (string | null | undefined)[]): PhotoCredit[] {
  const seen = new Set<string>();
  const out: PhotoCredit[] = [];
  for (const p of paths) {
    const c = creditFor(p);
    if (c && !seen.has(c.path)) {
      seen.add(c.path);
      out.push(c);
    }
  }
  return out;
}
