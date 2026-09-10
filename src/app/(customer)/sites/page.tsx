import { SiteHeader } from "@/components/site-header";
import { getUserContext } from "@/lib/roles";
import { requireUser } from "@/lib/supabase/server";
import { serviceDaysPhrase } from "@/lib/zones";
import { NewSiteForm } from "./new-site-form";

type SiteRow = {
  id: string;
  label: string;
  building: string;
  unit: string | null;
  organization_id: string | null;
  service_zones: { name: string; service_weekdays: number[] } | null;
};

export default async function SitesPage() {
  const { supabase } = await requireUser();
  const ctx = await getUserContext(supabase);

  const [{ data: sites }, { data: zones }] = await Promise.all([
    supabase
      .from("sites")
      .select(
        "id, label, building, unit, organization_id, service_zones(name, service_weekdays)"
      )
      .order("created_at"),
    supabase
      .from("service_zones")
      .select("id, name, service_weekdays")
      .order("name"),
  ]);

  const rows = (sites ?? []) as unknown as SiteRow[];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 space-y-6 p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Your sites</h1>
          <p className="text-sm text-muted">
            A site is where the plants live. We visit it on the days we already
            drive that area.
          </p>
        </header>

        {rows.length > 0 ? (
          <ul className="space-y-3">
            {rows.map((s) => (
              <li key={s.id} className="rounded-xl border border-line bg-white p-4">
                <p className="font-semibold">{s.label}</p>
                <p className="text-sm text-muted">
                  {s.building}
                  {s.unit ? `, ${s.unit}` : ""}
                </p>
                {s.service_zones && (
                  <p className="mt-2 text-sm text-leaf">
                    {s.service_zones.name} · visits{" "}
                    {serviceDaysPhrase(s.service_zones.service_weekdays)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-line bg-white p-5 text-sm text-muted">
            No sites yet. Add the place your plants should live.
          </p>
        )}

        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="font-semibold">Where we currently serve</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {(zones ?? []).map((z) => (
              <li key={z.id}>
                {z.name} — {serviceDaysPhrase(z.service_weekdays)}
              </li>
            ))}
          </ul>
        </section>

        <NewSiteForm
          organizations={ctx.memberships.map((m) => ({
            id: m.organization_id,
            name: m.organization_name,
          }))}
        />
      </main>
    </>
  );
}
