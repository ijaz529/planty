"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBasket } from "@/components/basket/basket-provider";
import type { BasketLine } from "@/lib/basket";

export function UseBundle({
  name,
  lines,
}: {
  bundleId: string;
  name: string;
  lines: BasketLine[];
}) {
  const router = useRouter();
  const { basket, applyBundle } = useBasket();
  const [confirming, setConfirming] = useState(false);

  function apply() {
    applyBundle(lines);
    router.push("/basket");
  }

  function onClick() {
    // Replacing a basket someone has already built is destructive enough to ask.
    if (basket.lines.length > 0 && !confirming) {
      setConfirming(true);
      return;
    }
    apply();
  }

  return (
    <div className="mt-4 space-y-2">
      <button
        onClick={onClick}
        className="w-full rounded-lg bg-leaf px-5 py-3 font-medium text-white"
      >
        {confirming ? `Replace my basket with ${name}` : "Use this bundle"}
      </button>
      {confirming && (
        <p className="text-xs text-muted">
          This clears the {basket.lines.length} plant
          {basket.lines.length === 1 ? "" : " type"} you already chose.{" "}
          <button
            onClick={() => setConfirming(false)}
            className="underline underline-offset-4"
          >
            Keep my basket
          </button>
        </p>
      )}
    </div>
  );
}
