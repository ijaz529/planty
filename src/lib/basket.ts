/**
 * The basket lives in the browser.
 *
 * It stores variant ids and quantities, plus the chosen term, cadence and site
 * — and deliberately NO prices. A basket that remembered a price could show a
 * stale total after an operator changes one; storing only ids means every load
 * reprices from current data, which is what FR-010 requires.
 *
 * Every storage access is wrapped: localStorage throws outright in some
 * contexts (private windows, blocked site data, embedded previews) rather than
 * returning null, and an unreadable basket must degrade to an empty one instead
 * of a blank page.
 */

const KEY = "planty.basket.v1";

export type BasketLine = { variant_id: string; quantity: number };

export type Basket = {
  lines: BasketLine[];
  term_id: string | null;
  cadence_id: string | null;
  site_id: string | null;
};

export const EMPTY_BASKET: Basket = {
  lines: [],
  term_id: null,
  cadence_id: null,
  site_id: null,
};

const MAX_QUANTITY = 500;

function isLine(v: unknown): v is BasketLine {
  if (typeof v !== "object" || v === null) return false;
  const l = v as Record<string, unknown>;
  return (
    typeof l.variant_id === "string" &&
    l.variant_id.length > 0 &&
    typeof l.quantity === "number" &&
    Number.isInteger(l.quantity) &&
    l.quantity >= 1
  );
}

/** Reads the stored basket, or an empty one if anything at all is wrong. */
export function readBasket(): Basket {
  if (typeof window === "undefined") return EMPTY_BASKET;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_BASKET;

    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return EMPTY_BASKET;

    const b = parsed as Record<string, unknown>;
    return {
      lines: Array.isArray(b.lines) ? b.lines.filter(isLine) : [],
      term_id: typeof b.term_id === "string" ? b.term_id : null,
      cadence_id: typeof b.cadence_id === "string" ? b.cadence_id : null,
      site_id: typeof b.site_id === "string" ? b.site_id : null,
    };
  } catch {
    // Corrupt, or storage is unavailable. An empty basket is the safe answer.
    return EMPTY_BASKET;
  }
}

export function writeBasket(basket: Basket): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(basket));
  } catch {
    // Storage is full or blocked. The basket still works for this page view.
  }
}

export function clearBasket(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing useful to do.
  }
}

/** Adds to an existing line rather than duplicating it. */
export function addLine(
  basket: Basket,
  variantId: string,
  quantity = 1
): Basket {
  const qty = normalizeQuantity(quantity);
  if (qty === 0) return basket;

  const existing = basket.lines.find((l) => l.variant_id === variantId);
  const lines = existing
    ? basket.lines.map((l) =>
        l.variant_id === variantId
          ? { ...l, quantity: normalizeQuantity(l.quantity + qty) }
          : l
      )
    : [...basket.lines, { variant_id: variantId, quantity: qty }];

  return { ...basket, lines };
}

/** Setting a quantity of zero or less removes the line. */
export function setQuantity(
  basket: Basket,
  variantId: string,
  quantity: number
): Basket {
  const qty = normalizeQuantity(quantity);
  if (qty === 0) return removeLine(basket, variantId);
  return {
    ...basket,
    lines: basket.lines.map((l) =>
      l.variant_id === variantId ? { ...l, quantity: qty } : l
    ),
  };
}

export function removeLine(basket: Basket, variantId: string): Basket {
  return {
    ...basket,
    lines: basket.lines.filter((l) => l.variant_id !== variantId),
  };
}

/** Replaces the contents entirely — what choosing a bundle does. */
export function replaceLines(basket: Basket, lines: BasketLine[]): Basket {
  return {
    ...basket,
    lines: lines
      .map((l) => ({
        variant_id: l.variant_id,
        quantity: normalizeQuantity(l.quantity),
      }))
      .filter((l) => l.quantity > 0),
  };
}

export function totalItems(basket: Basket): number {
  return basket.lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function quantityOf(basket: Basket, variantId: string): number {
  return basket.lines.find((l) => l.variant_id === variantId)?.quantity ?? 0;
}

/** Whole numbers only, never negative, capped so a typo cannot order a forest. */
export function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 0;
  const whole = Math.floor(quantity);
  if (whole < 1) return 0;
  return Math.min(whole, MAX_QUANTITY);
}

export { KEY as BASKET_STORAGE_KEY, MAX_QUANTITY };

/* ── external store ───────────────────────────────────────────────────
 * The basket is external state (localStorage), so React should subscribe to
 * it rather than copy it into component state inside an effect. This is what
 * `useSyncExternalStore` is for, and it gives cross-tab sync for free.
 *
 * `getSnapshot` must return a referentially stable value while the underlying
 * data is unchanged, or React re-renders forever — hence the raw-string cache.
 */

let cachedRaw: string | null = null;
let cachedBasket: Basket = EMPTY_BASKET;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function getBasketSnapshot(): Basket {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedBasket = readBasket();
  }
  return cachedBasket;
}

/** The server has no basket, and this value must be stable across renders. */
export function getBasketServerSnapshot(): Basket {
  return EMPTY_BASKET;
}

export function subscribeToBasket(onChange: () => void): () => void {
  listeners.add(onChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onChange);
  }
  return () => {
    listeners.delete(onChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onChange);
    }
  };
}

/** Persists and notifies subscribers in this tab. */
export function commitBasket(basket: Basket): void {
  writeBasket(basket);
  cachedRaw = readRaw();
  cachedBasket = basket;
  listeners.forEach((l) => l());
}

export function commitClear(): void {
  clearBasket();
  cachedRaw = null;
  cachedBasket = EMPTY_BASKET;
  listeners.forEach((l) => l());
}
