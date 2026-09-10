import { createClient } from "@/lib/supabase/server";
import type { DepotRow } from "@/lib/depot";
import { DepotManager, type Movement } from "./depot-manager";
import { DepotLocation, type DepotPoint } from "./depot-location";

export default async function OpsDepotPage() {
  const supabase = await createClient();

  const [{ data: positions }, { data: rate }, { data: movements }, { data: where }] =
    await Promise.all([
    supabase.rpc("depot_positions"),
    supabase.rpc("replacement_rate", { p_days: 30 }),
    supabase
      .from("stock_movements")
      .select("id, reason, delta_total, delta_allocated, delta_recovering, note, created_at, variant_id")
      .order("created_at", { ascending: false })
      .limit(40),
    supabase.rpc("depot_point"),
  ]);

  const rows = (positions ?? []) as DepotRow[];
  const names = new Map(rows.map((r) => [r.variant_id, `${r.species_name}${r.size_tier ? ` · ${r.size_tier}` : ""}`]));

  const depot = ((where ?? []) as DepotPoint[])[0] ?? null;

  return (
    <div className="space-y-10">
      <DepotManager
        rows={rows}
        rate={rate === null || rate === undefined ? null : Number(rate)}
        movements={(movements ?? []).map((m) => ({
          id: m.id,
          reason: m.reason,
          delta_total: m.delta_total,
          delta_allocated: m.delta_allocated,
          delta_recovering: m.delta_recovering,
          note: m.note,
          created_at: m.created_at,
          plant: names.get(m.variant_id) ?? "Plant",
        })) as Movement[]}
      />
      <DepotLocation depot={depot} />
    </div>
  );
}
