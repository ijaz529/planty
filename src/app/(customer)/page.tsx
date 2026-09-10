import Link from "next/link";
import { PlantPhoto } from "@/components/plant-photo";
import {
  availabilityLabel,
  byTier,
  formatAed,
  isAvailable,
  lightLabel,
  type LightRequirement,
  type SizeTier,
} from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";

type Variant = {
  id: string;
  size_tier: SizeTier | null;
  price_aed: string | number | null;
  stock_available: number;
  photo_path: string | null;
};

type Species = {
  id: string;
  common_name: string;
  botanical_name: string;
  light_requirement: LightRequirement;
  pet_safe: boolean;
  description: string | null;
  plant_variants: Variant[];
};

export default async function CatalogPage() {
  const supabase = await createClient();

  // No auth call, no gate: the price list is the product (constitution III).
  const { data } = await supabase
    .from("plant_species")
    .select(
      "id, common_name, botanical_name, light_requirement, pet_safe, description, plant_variants(id, size_tier, price_aed, stock_available, photo_path)"
    )
    .order("common_name");

  const species = (data ?? []) as Species[];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16">
        <section className="py-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Rent plants. We keep them alive.
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            Delivered and installed across Dubai, then looked after every week by
            someone who knows what they are doing. Plants that decline get
            replaced, not invoiced.
          </p>
          <p className="mt-4 text-sm font-medium text-leaf">
            Every price below is the price you pay. No site visit needed to see it.
          </p>
        </section>

        {species.length === 0 ? (
          <p className="rounded-lg border border-line bg-white p-6 text-muted">
            The catalog is being planted. Check back shortly.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {species.map((s) => {
              const variants = [...s.plant_variants].sort(byTier);
              const cheapest = variants
                .filter((v) => v.price_aed !== null)
                .map((v) => Number(v.price_aed))
                .sort((a, b) => a - b)[0];
              const anyAvailable = variants.some((v) =>
                isAvailable(v.stock_available)
              );

              return (
                <li
                  key={s.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-line bg-white"
                >
                  <Link href={`/plants/${s.id}`} className="flex flex-1 flex-col">
                    <PlantPhoto
                      path={variants[0]?.photo_path ?? null}
                      name={s.common_name}
                      className="aspect-[4/3] w-full rounded-none"
                    />
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div>
                        <h2 className="font-semibold">{s.common_name}</h2>
                        <p className="text-xs italic text-muted">
                          {s.botanical_name}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        <span className="rounded-full bg-leaf-soft px-2 py-0.5 text-leaf">
                          {lightLabel(s.light_requirement)}
                        </span>
                        {s.pet_safe && (
                          <span className="rounded-full bg-leaf-soft px-2 py-0.5 text-leaf">
                            Pet safe
                          </span>
                        )}
                      </div>
                      <p className="mt-auto pt-2 text-sm">
                        {cheapest !== undefined ? (
                          <>
                            <span className="font-semibold">
                              {formatAed(cheapest)}
                            </span>
                            <span className="text-muted"> / month</span>
                            {variants.length > 1 && (
                              <span className="text-muted">
                                {" "}
                                · {variants.length} sizes
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-muted">Price coming soon</span>
                        )}
                      </p>
                      {!anyAvailable && (
                        <p className="text-xs text-muted">
                          {availabilityLabel(0)}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <section className="mt-12 rounded-xl border border-line bg-white p-6">
          <h2 className="font-semibold">What the monthly price covers</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Delivery, planter and installation, at no extra charge.</li>
            <li>A maintenance visit every week: watering, pruning, pest checks.</li>
            <li>A photo and condition note after every visit.</li>
            <li>Any plant that declines is replaced, not billed.</li>
          </ul>
        </section>
      </main>
    </>
  );
}

export const metadata = {
  title: "Plant rental prices in Dubai — Planty",
  description:
    "Every plant we rent, with its monthly price in AED. Weekly maintenance and free replacements included. No sales call to see a price.",
};