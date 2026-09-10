import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function OpsHomePage() {
  const supabase = await createClient();

  const [{ count: speciesCount }, { data: variants }] = await Promise.all([
    supabase.from("plant_species").select("id", { count: "exact", head: true }),
    supabase.from("plant_variants").select("published, stock_available"),
  ]);

  const published = variants?.filter((v) => v.published).length ?? 0;
  const drafts = (variants?.length ?? 0) - published;
  const outOfStock =
    variants?.filter((v) => v.published && v.stock_available <= 0).length ?? 0;

  const stats = [
    { label: "Species", value: speciesCount ?? 0 },
    { label: "Published variants", value: published },
    { label: "Drafts", value: drafts },
    { label: "Published but out of stock", value: outOfStock },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Operations</h1>
        <p className="mt-1 text-muted">
          The catalog, its prices and the areas Planty serves.
        </p>
      </header>

      <dl className="grid gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">
              {s.label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/ops/catalog"
          className="rounded-lg bg-leaf px-5 py-3 font-medium text-white"
        >
          Manage catalog
        </Link>
        <Link
          href="/ops/zones"
          className="rounded-lg border border-line bg-white px-5 py-3 font-medium"
        >
          Service zones
        </Link>
      </div>
    </div>
  );
}
