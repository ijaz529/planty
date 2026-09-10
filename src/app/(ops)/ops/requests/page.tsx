import { createClient } from "@/lib/supabase/server";
import { RequestTriage, type TriageRow } from "./triage";

export default async function OpsRequestsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("plant_change_requests")
    .select(
      "id, kind, status, reason, decision_note, created_at, subscription_line_id, requested_variant_id, subscriptions(sites(label)), subscription_lines(species_name, quantity), plant_variants(size_tier, plant_species(common_name))"
    )
    .order("created_at");

  const rows: TriageRow[] = (data ?? []).map((r) => {
    const line = r.subscription_lines as unknown as { species_name: string; quantity: number } | null;
    const target = r.plant_variants as unknown as {
      size_tier: string | null; plant_species: { common_name: string } | null;
    } | null;
    return {
      id: r.id,
      kind: r.kind,
      status: r.status,
      reason: r.reason,
      decision_note: r.decision_note,
      created_at: r.created_at,
      site: ((r.subscriptions as unknown as { sites: { label: string } | null } | null)?.sites?.label) ?? "",
      plant: line ? `${line.quantity} × ${line.species_name}` : "",
      wants: target?.plant_species?.common_name ?? null,
    };
  });

  return <RequestTriage rows={rows} />;
}
