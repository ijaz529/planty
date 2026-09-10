import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { shortDate } from "@/lib/visits";
import { VisitForm, type VisitPlant } from "./visit-form";
import { StopJobs, type StopJob } from "./jobs";

export default async function VisitPage({
  params,
}: {
  params: Promise<{ visitId: string }>;
}) {
  const { visitId } = await params;
  const { supabase } = await requireUser();
  const { data: isTechnician } = await supabase.rpc("is_technician");
  if (!isTechnician) notFound();

  const { data: visit } = await supabase
    .from("visits")
    .select("id, subscription_id, scheduled_date, status, note, sites(label, building, unit, access_notes)")
    .eq("id", visitId)
    .maybeSingle();
  if (!visit) notFound();

  const site = visit.sites as unknown as {
    label: string; building: string; unit: string | null; access_notes: string | null;
  } | null;

  const [{ data: lines }, { data: records }, { data: photos }, { data: jobs }] = await Promise.all([
    supabase
      .from("subscription_lines")
      .select("id, species_name, size_tier, quantity")
      .eq("subscription_id", visit.subscription_id)
      .order("species_name"),
    supabase.from("visit_plant_records").select("subscription_line_id, condition, note").eq("visit_id", visitId),
    supabase.from("visit_photos").select("id").eq("visit_id", visitId),
    supabase
      .from("plant_change_requests")
      .select("id, kind, status, reason, decision_note, subscription_lines(species_name, quantity), plant_variants(plant_species(common_name))")
      .eq("visit_id", visitId)
      .in("status", ["approved", "fulfilled"]),
  ]);

  const recorded = new Map((records ?? []).map((r) => [r.subscription_line_id, r]));
  const plants: VisitPlant[] = (lines ?? []).map((l) => ({
    line_id: l.id,
    species_name: l.species_name,
    size_tier: l.size_tier,
    quantity: l.quantity,
    condition: (recorded.get(l.id)?.condition as VisitPlant["condition"]) ?? null,
    note: recorded.get(l.id)?.note ?? "",
  }));

  return (
    <main className="mx-auto w-full max-w-lg flex-1 space-y-5 p-5">
      <Link href="/today" className="text-sm text-muted underline underline-offset-4">
        Back to today
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{site?.label}</h1>
        <p className="text-sm text-muted">
          {site?.building}
          {site?.unit ? `, ${site.unit}` : ""} · {shortDate(visit.scheduled_date)}
        </p>
      </header>

      {site?.access_notes && (
        <section className="rounded-xl border border-line bg-leaf-soft/60 p-4">
          <h2 className="text-sm font-semibold">Getting in</h2>
          <p className="mt-1 text-sm">{site.access_notes}</p>
        </section>
      )}

      <StopJobs
        jobs={(jobs ?? []).map((j) => {
          const line = j.subscription_lines as unknown as { species_name: string; quantity: number } | null;
          const target = j.plant_variants as unknown as { plant_species: { common_name: string } | null } | null;
          return {
            id: j.id,
            kind: j.kind as StopJob["kind"],
            plant: line ? `${line.quantity} × ${line.species_name}` : "a plant",
            wants: target?.plant_species?.common_name ?? null,
            reason: j.reason,
            note: j.decision_note,
            done: j.status === "fulfilled",
          };
        })}
      />

      {visit.status === "planned" ? (
        <VisitForm visitId={visit.id} plants={plants} photoCount={photos?.length ?? 0} />
      ) : (
        <section className="space-y-2 rounded-xl border border-line bg-white p-4">
          <p className="font-semibold">
            {visit.status === "done" ? "Visit completed" : "Could not be done"}
          </p>
          {visit.note && <p className="text-sm text-muted">{visit.note}</p>}
        </section>
      )}
    </main>
  );
}
