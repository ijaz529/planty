import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addLine,
  BASKET_STORAGE_KEY,
  clearBasket,
  EMPTY_BASKET,
  MAX_QUANTITY,
  normalizeQuantity,
  quantityOf,
  readBasket,
  removeLine,
  replaceLines,
  setQuantity,
  totalItems,
  writeBasket,
  type Basket,
} from "../../src/lib/basket";

/** A minimal localStorage so the module's guards can be exercised. */
function installStorage(impl?: Partial<Storage>) {
  const store = new Map<string, string>();
  const base: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => store.get(k) ?? null,
    key: (i: number) => [...store.keys()][i] ?? null,
    removeItem: (k: string) => void store.delete(k),
    setItem: (k: string, v: string) => void store.set(k, v),
  };
  vi.stubGlobal("window", { localStorage: { ...base, ...impl } });
  return store;
}

afterEach(() => vi.unstubAllGlobals());

describe("normalizeQuantity", () => {
  it.each([
    [1, 1],
    [7, 7],
    [0, 0],
    [-4, 0],
    [2.7, 2],
    [0.5, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizeQuantity(input)).toBe(expected);
  });

  it("caps a runaway quantity", () => {
    expect(normalizeQuantity(10_000)).toBe(MAX_QUANTITY);
  });
});

describe("basket operations", () => {
  const base: Basket = { ...EMPTY_BASKET };

  it("adds a line", () => {
    const b = addLine(base, "v1", 3);
    expect(b.lines).toEqual([{ variant_id: "v1", quantity: 3 }]);
  });

  it("adds to an existing line rather than duplicating it", () => {
    const b = addLine(addLine(base, "v1", 2), "v1", 3);
    expect(b.lines).toHaveLength(1);
    expect(quantityOf(b, "v1")).toBe(5);
  });

  it("ignores an add of zero or a fraction", () => {
    expect(addLine(base, "v1", 0).lines).toHaveLength(0);
    expect(addLine(base, "v1", 0.4).lines).toHaveLength(0);
  });

  it("removes a line when its quantity is set to zero", () => {
    const b = setQuantity(addLine(base, "v1", 4), "v1", 0);
    expect(b.lines).toHaveLength(0);
  });

  it("removes a line explicitly", () => {
    const b = removeLine(addLine(addLine(base, "v1"), "v2"), "v1");
    expect(b.lines.map((l) => l.variant_id)).toEqual(["v2"]);
  });

  it("replaces contents wholesale, which is what choosing a bundle does", () => {
    const b = replaceLines(addLine(base, "old", 9), [
      { variant_id: "v1", quantity: 2 },
      { variant_id: "v2", quantity: 1 },
      { variant_id: "junk", quantity: 0 },
    ]);
    expect(b.lines).toEqual([
      { variant_id: "v1", quantity: 2 },
      { variant_id: "v2", quantity: 1 },
    ]);
  });

  it("counts items across lines", () => {
    expect(totalItems(addLine(addLine(base, "v1", 3), "v2", 2))).toBe(5);
  });

  it("keeps the term, cadence and site across edits", () => {
    const configured: Basket = {
      ...base,
      term_id: "t",
      cadence_id: "c",
      site_id: "s",
    };
    const b = setQuantity(addLine(configured, "v1", 2), "v1", 5);
    expect(b.term_id).toBe("t");
    expect(b.cadence_id).toBe("c");
    expect(b.site_id).toBe("s");
  });
});

describe("storage", () => {
  beforeEach(() => installStorage());

  it("round-trips a basket", () => {
    const basket: Basket = {
      lines: [{ variant_id: "v1", quantity: 3 }],
      term_id: "t",
      cadence_id: "c",
      site_id: null,
    };
    writeBasket(basket);
    expect(readBasket()).toEqual(basket);
  });

  it("returns an empty basket when nothing is stored", () => {
    expect(readBasket()).toEqual(EMPTY_BASKET);
  });

  it("clears", () => {
    writeBasket({ ...EMPTY_BASKET, lines: [{ variant_id: "v1", quantity: 1 }] });
    clearBasket();
    expect(readBasket()).toEqual(EMPTY_BASKET);
  });

  it("survives corrupt stored data", () => {
    const store = installStorage();
    store.set(BASKET_STORAGE_KEY, "{not json");
    expect(readBasket()).toEqual(EMPTY_BASKET);
  });

  it("drops malformed lines rather than trusting them", () => {
    const store = installStorage();
    store.set(
      BASKET_STORAGE_KEY,
      JSON.stringify({
        lines: [
          { variant_id: "v1", quantity: 2 },
          { variant_id: "v2", quantity: -1 },
          { variant_id: "", quantity: 3 },
          { quantity: 4 },
          "nonsense",
        ],
      })
    );
    expect(readBasket().lines).toEqual([{ variant_id: "v1", quantity: 2 }]);
  });

  it("degrades to empty when storage throws on read", () => {
    installStorage({
      getItem: () => {
        throw new Error("blocked");
      },
    });
    expect(readBasket()).toEqual(EMPTY_BASKET);
  });

  it("does not throw when storage throws on write", () => {
    installStorage({
      setItem: () => {
        throw new Error("quota");
      },
    });
    expect(() => writeBasket(EMPTY_BASKET)).not.toThrow();
  });

  it("is empty during server rendering", () => {
    vi.stubGlobal("window", undefined);
    expect(readBasket()).toEqual(EMPTY_BASKET);
  });
});
