import { conditionLabel, shortDate, type PlantCondition } from "@/lib/visits";
import { createClient } from "@/lib/supabase/server";

const CONDITION_STYLE: Record<string, string> = {
  healthy: "bg-leaf-soft text-leaf",
  needs_attention: "bg-amber-50 text-amber-800",
  declining: "bg-red-50 text-red-800",
  replaced: "bg-leaf-soft text-leaf",
};

/**
 * The proof-of-service feed — constitution IV from the customer's side. They
 * are buying an outcome they cannot verify, so every visit shows what was
 * found and the photograph taken.
 */
export async function VisitFeed({ subscriptionId }: { subscriptionId: string }) {
  const supabase = await createClient();

  const { data: visits } = await supabase
    .from("visits")
    .select("id, scheduled_date, status, note, completed_at")
    .eq("subscription_id", subscriptionId)
    .order("scheduled_date", { ascending: false });

  const all = visits ?? [];
  const past = all.filter((v) => v.status !== "planned");
  const next = [...all].reverse().find((v) => v.status === "planned");

  const ids = past.map((v) => v.id);
  const [{ data: records }, { data: photos }] = await Promise.all([
    ids.length
      ? supabase
          .from("visit_plant_records")
          .select("visit_id, condition, note, subscription_lines(species_name, quantity)")
          .in("visit_id", ids)
      : Promise.resolve({ data: [] }),
    ids.length
      ? supabase.from("visit_photos").select("visit_id, storage_path").in("visit_id", ids)
      : Promise.resolve({ data: [] }),
  ]);

  // The bucket is private, so each photo needs a short-lived signed URL.
  const signed = new Map<string, string[]>();
  for (const p of photos ?? []) {
    const { data } = await supabase.storage.from("visits").createSignedUrl(p.storage_path, 3600);
    if (data?.signedUrl) {
      signed.set(p.visit_id, [...(signed.get(p.visit_id) ?? []), data.signedUrl]);
    }
  }

  const byVisit = new Map<string, typeof records>();
  for (const r of records ?? []) {
    byVisit.set(r.visit_id, [...(byVisit.get(r.visit_id) ?? []), r]);
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Visits</h2>

      {next && (
        <p className="rounded-xl border border-line bg-leaf-soft/60 p-4 text-sm">
          Next visit {shortDate(next.scheduled_date)}.
        </p>
      )}

      {past.length === 0 ? (
        <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">
          No visits yet. After each one you will see what we found and a photo.
        </p>
      ) : (
        <ul className="space-y-3">
          {past.map((v) => {
            const rows = byVisit.get(v.id) ?? [];
            const images = signed.get(v.id) ?? [];
            return (
              <li key={v.id} className="space-y-3 rounded-xl border border-line bg-white p-4">
                <div className="flex items-center gap-3">
                  <p className="flex-1 font-semibold">{shortDate(v.scheduled_date)}</p>
                  {v.status === "missed" && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-800">
                      Could not be done
                    </span>
                  )}
                </div>

                {v.note && <p className="text-sm text-muted">{v.note}</p>}

                {rows.length > 0 && (
                  <ul className="space-y-1 text-sm">
                    {rows.map((r, i) => {
                      const line = r.subscription_lines as unknown as {
                        species_name: string; quantity: number;
                      } | null;
                      return (
                        <li key={i} className="flex items-center gap-2">
                          <span className="flex-1">
                            {line?.quantity} × {line?.species_name}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              CONDITION_STYLE[r.condition] ?? ""
                            }`}
                          >
                            {conditionLabel(r.condition as PlantCondition)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt={`Your plants on ${shortDate(v.scheduled_date)}`}
                        className="h-32 w-32 shrink-0 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
