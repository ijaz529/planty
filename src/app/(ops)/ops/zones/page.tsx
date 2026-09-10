import { createClient } from "@/lib/supabase/server";
import { serviceDaysPhrase, serviceDaysShort } from "@/lib/zones";

type ReviewRow = {
  id: string;
  label: string;
  building: string;
  zone_name: string;
  zone_active: boolean;
  outside_boundary: boolean;
};

export default async function OpsZonesPage() {
  const supabase = await createClient();

  const [{ data: zones }, { data: review }, { data: siteCounts }] =
    await Promise.all([
      supabase
        .from("service_zones")
        .select("id, name, service_weekdays, active")
        .order("name"),
      supabase.from("sites_needing_zone_review").select("*"),
      supabase.from("sites").select("zone_id"),
    ]);

  const perZone = new Map<string, number>();
  for (const s of siteCounts ?? []) {
    perZone.set(s.zone_id, (perZone.get(s.zone_id) ?? 0) + 1);
  }

  const needsReview = (review ?? []) as ReviewRow[];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Service zones</h1>
        <p className="mt-1 text-muted">
          A site can only exist inside an active zone. Keeping zones tight is
          what keeps a technician&apos;s day full of paying stops.
        </p>
      </header>

      <ul className="space-y-3">
        {(zones ?? []).map((z) => (
          <li
            key={z.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4"
          >
            <div className="flex-1">
              <p className="font-semibold">
                {z.name}
                {!z.active && (
                  <span className="ml-2 rounded-full bg-line px-2 py-0.5 text-xs font-normal">
                    Retired
                  </span>
                )}
              </p>
              <p className="text-sm text-muted">
                Visits {serviceDaysPhrase(z.service_weekdays)}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-mono">{serviceDaysShort(z.service_weekdays)}</p>
              <p className="text-muted">
                {perZone.get(z.id) ?? 0}{" "}
                {(perZone.get(z.id) ?? 0) === 1 ? "site" : "sites"}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sites needing a look</h2>
        {needsReview.length === 0 ? (
          <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">
            Every site sits inside an active zone.
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {needsReview.map((s) => (
              <li key={s.id} className="p-4">
                <p className="font-medium">{s.label}</p>
                <p className="text-sm text-muted">{s.building}</p>
                <p className="mt-1 text-sm text-red-700">
                  {!s.zone_active
                    ? `Its zone (${s.zone_name}) has been retired.`
                    : `Its pin now falls outside ${s.zone_name}.`}{" "}
                  The site still works; decide whether to keep serving it.
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
