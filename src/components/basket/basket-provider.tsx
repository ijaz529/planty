"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  addLine,
  commitBasket,
  commitClear,
  getBasketServerSnapshot,
  getBasketSnapshot,
  removeLine,
  replaceLines,
  setQuantity as setQty,
  subscribeToBasket,
  totalItems,
  type Basket,
  type BasketLine,
} from "@/lib/basket";

type BasketContextValue = {
  basket: Basket;
  /** False during server render and hydration, so markup cannot mismatch. */
  ready: boolean;
  itemCount: number;
  add: (variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  replace: (lines: BasketLine[]) => void;
  applyBundle: (lines: BasketLine[]) => void;
  setTerm: (termId: string) => void;
  setCadence: (cadenceId: string) => void;
  setSite: (siteId: string | null) => void;
  clear: () => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

const alwaysTrue = () => true;
const alwaysFalse = () => false;

export function BasketProvider({ children }: { children: React.ReactNode }) {
  // Subscribing to the store rather than copying it into state in an effect:
  // the basket lives in localStorage, which is exactly the external system
  // useSyncExternalStore exists for.
  const basket = useSyncExternalStore(
    subscribeToBasket,
    getBasketSnapshot,
    getBasketServerSnapshot
  );
  const ready = useSyncExternalStore(subscribeToBasket, alwaysTrue, alwaysFalse);

  const update = useCallback((next: Basket) => commitBasket(next), []);

  const value = useMemo<BasketContextValue>(
    () => ({
      basket,
      ready,
      itemCount: totalItems(basket),
      add: (variantId, quantity = 1) =>
        update(addLine(basket, variantId, quantity)),
      setQuantity: (variantId, quantity) =>
        update(setQty(basket, variantId, quantity)),
      remove: (variantId) => update(removeLine(basket, variantId)),
      replace: (lines) => update(replaceLines(basket, lines)),
      // Nulling term and cadence sends both back to the active defaults, which
      // is what the bundle's advertised price was computed at.
      applyBundle: (lines) =>
        update({
          ...replaceLines(basket, lines),
          term_id: null,
          cadence_id: null,
        }),
      setTerm: (termId) => update({ ...basket, term_id: termId }),
      setCadence: (cadenceId) => update({ ...basket, cadence_id: cadenceId }),
      setSite: (siteId) => update({ ...basket, site_id: siteId }),
      clear: () => commitClear(),
    }),
    [basket, ready, update]
  );

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}

export function useBasket(): BasketContextValue {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside a BasketProvider");
  return ctx;
}
