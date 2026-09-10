import { createClient } from "@/lib/supabase/server";
import { tierLabel, type SizeTier } from "@/lib/catalog";
import {
  changeKindLabel,
  changeStatusLabel,
  isOpen,
  offerReplacement,
  renewalPhrase,
  rotationsPhrase,
  type ChangeKind,
  type ChangeStatus,
} from "@/lib/rotations";
import { RequestForm, type CarePlant, type SwapTarget } from "./request-form";

/**
 * The care section. Two promises live here and are deliberately kept apart:
 * a replacement is free and unlimited because that is what Planty sells, and a
 * swap spends a counted quarterly entitlement.
 */
export async function CareSection({
  subscriptionId,
  active,
}: {
  subscriptionId: string;
  active: boolean;
}) {
  const supabase = await createClient();

  const [
    { data: lines },
    { data: requests },
    { data: remaining },
    { data: periodEnd },
    { data: allowanceRow },
    { data: exclusions },
    { data: catalog },
  ] = await Promise.all([
    supabase
      .from("subscription_lines")
      .select("id, variant_id, species_name, size_tier, quantity")
      .eq("subscription_id", subscriptionId)
      .order("species_name"),
    supabase
      .from("plant_change_requests")
      .select("id, subscription_line_id, kind, status, reason, decision_note, created_at, fulfilled_at, requested_variant_id")
      .eq("subscription_id", subscriptionId)
      .order("created_at", { ascending: false }),
    supabase.rpc("rotations_remaining", { p_subscription_id: subscriptionId }),
    supabase.rpc("rotation_period_end", { p_subscription_id: subscriptionId }),
    supabase.from("subscriptions").select("rotation_allowance").eq("id", subscriptionId).maybeSingle(),
    supabase.from("operator_settings").select("value").eq("key", "replacement_exclusions").maybeSingle(),
    supabase
      .from("plant_variants")
      .select("id, size_tier, stock_available, plant_species(common_name)")
      .eq("published", true)
      .gt("stock_available", 0),
  ]);

  // The most recent verdict per plant, so a struggling one is offered up
  // without the customer having to describe the problem (FR-002).
  const { data: lastVisit } = await supabase
    .from("visits")
    .select("id, completed_at")
    .eq("subscription_id", subscriptionId)
    .eq("status", "done")
    .order("scheduled_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: lastRecords } = lastVisit
    ? await supabase
        .from("visit_plant_records")
        .select("subscription_line_id, condition")
        .eq("visit_id", lastVisit.id)
    : { data: [] };

  const condition = new Map(
    (lastRecords ?? []).map((r) => [r.subscription_line_id, r.condition as string])
  );
  const openByLine = new Map(
    (requests ?? [])
      .filter((r) => isOpen(r.status as ChangeStatus))
      .map((r) => [r.subscription_line_id, r])
  );

  // When each plant was last actually replaced, so a verdict the replacement
  // has already answered stops being offered up.
  const replacedAt = new Map<string, string>();
  for (const r of requests ?? []) {
    if (r.kind !== "replacement" || !r.fulfilled_at) continue;
    const seen = replacedAt.get(r.subscription_line_id);
    if (!seen || r.fulfilled_at > seen) {
      replacedAt.set(r.subscription_line_id, r.fulfilled_at);
    }
  }

  const plants: CarePlant[] = (lines ?? []).map((l) => ({
    line_id: l.id,
    species_name: l.species_name,
    size_tier: l.size_tier,
    quantity: l.quantity,
    flagged: offerReplacement(
      condition.get(l.id),
      lastVisit?.completed_at,
      replacedAt.get(l.id)
    ),
    has_open_request: openByLine.has(l.id),
  }));

  const swapTargets: SwapTarget[] = (catalog ?? []).map((v) => ({
    variant_id: v.id,
    label: `${(v.plant_species as unknown as { common_name: string } | null)?.common_name ?? "Plant"}${
      v.size_tier ? ` · ${tierLabel(v.size_tier as SizeTier)}` : ""
    }`,
  }));

  const allowance = allowanceRow?.rotation_allowance ?? 0;
  const left = (remaining as number) ?? 0;
  const history = (requests ?? []).filter((r) => !isOpen(r.status as ChangeStatus));
  const open = (requests ?? []).filter((r) => isOpen(r.status as ChangeStatus));

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold">Looking after your plants</h2>

      {/* The guarantee, and what it does not cover (constitution V). */}
      <div className="space-y-2 rounded-xl border border-line bg-white p-5">
        <h3 className="font-semibold">Our replacement guarantee</h3>
        <p className="whitespace-pre-wrap text-sm text-muted">
          {exclusions?.value ??
            "We replace any plant that declines under our care, free."}
        </p>
      </div>

      {/* Rotations: a counted entitlement, shown and consumed. */}
      <div className="rounded-xl border border-line bg-leaf-soft/50 p-5">
        <h3 className="font-semibold">Seasonal swaps</h3>
        <p className="mt-1 text-sm">
          {rotationsPhrase(left, allowance)}
          {allowance > 0 && periodEnd ? `, ${renewalPhrase(periodEnd as string)}.` : "."}
        </p>
        <p className="mt-2 text-sm text-muted">
          A swap is for when you fancy something different. A plant that is
          struggling is replaced free and does not use one.
        </p>
      </div>

      {open.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">In progress</h3>
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {open.map((r) => {
              const plant = plants.find((p) => p.line_id === r.subscription_line_id);
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-2 p-4 text-sm">
                  <span className="flex-1">
                    <span className="font-medium">{changeKindLabel(r.kind as ChangeKind)}</span>
                    {" · "}
                    {plant?.species_name ?? "Plant"}
                    {r.reason && <span className="block text-muted">{r.reason}</span>}
                  </span>
                  <span className="rounded-full bg-leaf-soft px-2.5 py-1 text-xs font-medium text-leaf">
                    {changeStatusLabel(r.status as ChangeStatus)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {active && (
        <RequestForm
          plants={plants}
          swapTargets={swapTargets}
          rotationsLeft={left}
          renewalDate={(periodEnd as string) ?? null}
        />
      )}

      {history.length > 0 && (
        <details className="rounded-xl border border-line bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Earlier requests ({history.length})
          </summary>
          <ul className="mt-3 space-y-2 text-sm">
            {history.map((r) => {
              const plant = plants.find((p) => p.line_id === r.subscription_line_id);
              return (
                <li key={r.id}>
                  <span className="text-muted">
                    {new Date(r.created_at).toLocaleDateString("en-AE", {
                      day: "numeric", month: "short",
                    })}
                    {" · "}
                  </span>
                  {changeKindLabel(r.kind as ChangeKind)} · {plant?.species_name ?? "Plant"} ·{" "}
                  {changeStatusLabel(r.status as ChangeStatus)}
                  {r.decision_note && (
                    <span className="block text-muted">{r.decision_note}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </section>
  );
}
