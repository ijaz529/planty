/**
 * Rotation entitlement helpers.
 *
 * The count itself is derived in Postgres, never stored — see
 * `rotations_remaining()`. These are for saying it in words.
 */

export type ChangeKind = "replacement" | "rotation";
export type ChangeStatus =
  | "requested"
  | "approved"
  | "declined"
  | "fulfilled"
  | "withdrawn";

const STATUS_LABELS: Record<ChangeStatus, string> = {
  requested: "Received",
  approved: "Booked for the next visit",
  declined: "Not covered",
  fulfilled: "Done",
  withdrawn: "Cancelled by you",
};

export function changeStatusLabel(s: ChangeStatus): string {
  return STATUS_LABELS[s] ?? s;
}

export function changeKindLabel(k: ChangeKind): string {
  return k === "replacement" ? "Replacement" : "Swap";
}

/** True while the customer can still call it off. */
export function isOpen(s: ChangeStatus): boolean {
  return s === "requested" || s === "approved";
}

/** "2 of 2 left this quarter" — or the honest version when there are none. */
export function rotationsPhrase(remaining: number, allowance: number): string {
  if (allowance === 0) return "Swaps are not included on this plan";
  if (remaining === 0) return "No swaps left this quarter";
  if (remaining === allowance)
    return `${allowance} swap${allowance === 1 ? "" : "s"} to use this quarter`;
  return `${remaining} of ${allowance} swaps left this quarter`;
}

/** "renews on 13 December" */
export function renewalPhrase(periodEnd: string | Date): string {
  const d = typeof periodEnd === "string" ? new Date(periodEnd) : periodEnd;
  return `renews on ${d.toLocaleDateString("en-AE", {
    day: "numeric",
    month: "long",
  })}`;
}

/**
 * Conditions from the last visit that make a plant a candidate for a free
 * replacement. A healthy plant can still be replaced on request; this is only
 * about what the product offers up without being asked (FR-002).
 */
export function needsAttention(condition: string | null | undefined): boolean {
  return condition === "declining" || condition === "needs_attention";
}
