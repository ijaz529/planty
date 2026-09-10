"use client";

import { useBasket } from "./basket-provider";

export function AddToBasket({
  variantId,
  available,
  label = "Add",
  className = "",
}: {
  variantId: string;
  available: boolean;
  label?: string;
  className?: string;
}) {
  const { ready, add, setQuantity, basket } = useBasket();
  const quantity =
    basket.lines.find((l) => l.variant_id === variantId)?.quantity ?? 0;

  if (!available) {
    return (
      <span className={`text-sm text-muted ${className}`}>
        Not available right now
      </span>
    );
  }

  // Render the neutral state until the stored basket is known.
  if (!ready || quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => add(variantId)}
        className={`rounded-lg bg-leaf px-4 py-2 text-sm font-medium text-white ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => setQuantity(variantId, quantity - 1)}
        aria-label="One fewer"
        className="size-9 rounded-lg border border-line text-lg leading-none"
      >
        −
      </button>
      <span
        aria-live="polite"
        className="min-w-8 text-center text-sm font-semibold"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => add(variantId)}
        aria-label="One more"
        className="size-9 rounded-lg border border-line text-lg leading-none"
      >
        +
      </button>
    </div>
  );
}
