import Link from "next/link";
import { byTier, formatAed, publishGaps, type SizeTier } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { NewSpeciesForm } from "./new-species-form";

type Variant = {
  id: string;
  size_tier: SizeTier | null;
  price_aed: string | number | null;
  stock_available: number;
  photo_path: string | null;
  height_min_cm: number | null;
  height_max_cm: number | null;
  published: boolean;
};

export default async function OpsCatalogPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("plant_species")
    .select(
      "id, common_name, botanical_name, plant_variants(id, size_tier, price_aed, stock_available, photo_path, height_min_cm, height_max_cm, published)"
    )
    .order("common_name");

  const species = data ?? [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Catalog</h1>
        <p className="mt-1 text-muted">
          Prices here are what customers see. Changes take effect immediately.
        </p>
      </header>

      <NewSpeciesForm />

      <ul className="space-y-3">
        {species.map((s) => {
          const variants = [...((s.plant_variants ?? []) as Variant[])].sort(
            byTier
          );
          const published = variants.filter((v) => v.published).length;
          return (
            <li key={s.id} className="rounded-xl border border-line bg-white">
              <Link
                href={`/ops/catalog/${s.id}`}
                className="flex items-center gap-4 p-4"
              >
                <div className="flex-1">
                  <p className="font-semibold">{s.common_name}</p>
                  <p className="text-xs italic text-muted">{s.botanical_name}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted">
                    {published} of {variants.length} published
                  </p>
                  <p className="text-muted">
                    {variants
                      .filter((v) => v.price_aed !== null)
                      .map((v) => formatAed(v.price_aed!))
                      .join(" · ") || "No prices set"}
                  </p>
                </div>
              </Link>
              {variants.some((v) => !v.published && publishGaps(v).length > 0) && (
                <p className="border-t border-line px-4 py-2 text-xs text-muted">
                  {variants.filter((v) => !v.published).length === 1
                    ? "1 draft variant still incomplete"
                    : `${variants.filter((v) => !v.published).length} draft variants still incomplete`}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
