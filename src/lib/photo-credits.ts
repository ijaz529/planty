/**
 * Attribution for the seed catalog photographs.
 *
 * The seed photographs come from Wikimedia Commons under CC BY / CC BY-SA,
 * which require the photographer to be credited wherever the image is shown.
 * The same file drives `npm run seed:images`, so the credit and the upload can
 * never disagree.
 *
 * A photograph an operator uploads has no entry here, and gets no credit —
 * correct for a picture Planty owns.
 */
import credits from "../../scripts/plant-photos/CREDITS.json";

export type PhotoCredit = {
  path: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
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
