import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { tierLabel, type SizeTier } from "@/lib/catalog";
import type { Quote } from "@/lib/pricing";
import { UseBundle } from "./use-bundle";

export const metadata = {
  title: "Starter bundles — Planty",
  description:
    "If you do not know how many plants an office needs, start from a bundle. Every price is what you would pay.",
};

type BundleItem = {
  variant_id: string;
  quantity: number;
  plant_variants: {
    size_tier: SizeTier | null;
    plant_species: { common_name: string } | null;
  } | null;
};

export default async function BundlesPage() {
  const supabase = await createClient();

  const { data: bundles } = await supabase
    .from("bundles")
    .select(
      "id, name, suits, description, bundle_items(variant_id, quantity, plant_variants(size_tier, plant_species(common_name)))"
    )
    .order("sort_order");

  // A bundle has no stored price: it is priced from its contents through the
  // same function everything else uses, so it cannot advertise a number its
  // contents do not produce.
  const priced = await Promise.all(
    (bundles ?? []).map(async (b) => {
      const { data } = await supabase.rpc("bundle_price", { p_bundle_id: b.id });
      return { bundle: b, quote: (data as Quote) ?? null };
    })
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 p-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Not sure how many plants?
          </h1>
          <p className="max-w-xl text-muted">
            Start from one of these and change anything you like. The price shown
            is the price you would pay, at a 12-month term with a visit every two
            weeks.
          </p>
        </header>

        <ul className="grid gap-5 sm:grid-cols-2">
          {priced.map(({ bundle, quote }) => {
            const items = (bundle.bundle_items ?? []) as unknown as BundleItem[];
            const unavailable = quote?.has_unavailable_lines ?? false;
            const count = items.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <li
                key={bundle.id}
                className="flex flex-col rounded-xl border border-line bg-white p-5"
              >
                <h2 className="text-lg font-semibold">{bundle.name}</h2>
                <p className="text-sm text-leaf">{bundle.suits}</p>
                {bundle.description && (
                  <p className="mt-2 text-sm text-muted">{bundle.description}</p>
                )}

                <ul className="mt-4 space-y-1 text-sm text-muted">
                  {items.map((i) => (
                    <li key={i.variant_id}>
                      {i.quantity} ×{" "}
                      {i.plant_variants?.plant_species?.common_name ?? "Plant"}
                      {i.plant_variants?.size_tier && (
                        <> ({tierLabel(i.plant_variants.size_tier).toLowerCase()})</>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  {unavailable ? (
                    <>
                      <p className="font-medium text-muted">
                        Temporarily unavailable
                      </p>
                      <p className="text-sm text-muted">
                        One of these plants is out of stock. It will be back.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <span className="text-2xl font-semibold">
                          AED {Math.round(quote?.monthly_total_aed ?? 0).toLocaleString("en-AE")}
                        </span>
                        <span className="text-muted"> / month</span>
                      </p>
                      <p className="text-sm text-muted">
                        {count} plants, everything included
                      </p>
                      <UseBundle
                        bundleId={bundle.id}
                        name={bundle.name}
                        lines={items.map((i) => ({
                          variant_id: i.variant_id,
                          quantity: i.quantity,
                        }))}
                      />
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-sm text-muted">
          Rather pick plant by plant?{" "}
          <Link href="/" className="text-leaf underline underline-offset-4">
            Browse the catalog
          </Link>
          .
        </p>
      </main>
    </>
  );
}
