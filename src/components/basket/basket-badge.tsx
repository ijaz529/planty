"use client";

import Link from "next/link";
import { useBasket } from "./basket-provider";

export function BasketBadge() {
  const { ready, itemCount } = useBasket();

  return (
    <Link
      href="/basket"
      className="relative text-muted hover:text-foreground"
      aria-label={
        ready && itemCount > 0
          ? `Basket, ${itemCount} plant${itemCount === 1 ? "" : "s"}`
          : "Basket"
      }
    >
      Basket
      {ready && itemCount > 0 && (
        <span className="ml-1 rounded-full bg-leaf px-2 py-0.5 text-xs font-semibold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
