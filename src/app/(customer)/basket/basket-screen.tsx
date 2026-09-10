"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useBasket } from "@/components/basket/basket-provider";
import { tierLabel, type SizeTier } from "@/lib/catalog";
import {
  formatMonthly,
  formatPrecise,
  priceBasket,
  type PriceableVariant,
  type Quote,
  type RentalTerm,
  type ServiceCadence,
} from "@/lib/pricing";
import { createClient } from "@/lib/supabase/client";
import { serviceDaysPhrase } from "@/lib/zones";

export type PricingConfig = {
  terms: RentalTerm[];
  cadences: ServiceCadence[];
  catalog: PriceableVariant[];
  sites: {
    id: string;
    label: string;
    building: string;
    zone_name: string | null;
    service_weekdays: number[];
    minimum_monthly_aed: number;
  }[];
  signedIn: boolean;
};

export function BasketScreen({ config }: { config: PricingConfig }) {
  const { basket, ready, setQuantity, remove, setTerm, setCadence, setSite, clear } =
    useBasket();

  const term =
    config.terms.find((t) => t.id === basket.term_id) ??
    config.terms.find((t) => Number(t.price_multiplier) === 1) ??
    config.terms[0];
  const cadence =
    config.cadences.find((c) => c.id === basket.cadence_id) ?? config.cadences[0];
  const site = config.sites.find((s) => s.id === basket.site_id) ?? null;

  const cheapestMultiplier = useMemo(
    () => Math.min(...config.terms.map((t) => Number(t.price_multiplier))),
    [config.terms]
  );

  // The mirror answers instantly so the total never lags a tap.
  const local = useMemo(() => {
    if (!term || !cadence) return null;
    return priceBasket(basket.lines, config.catalog, term, cadence, {
      cheapestMultiplier,
      minimumMonthlyAed: site?.minimum_monthly_aed ?? 0,
      siteApplied: Boolean(site),
    });
  }, [basket.lines, config.catalog, term, cadence, cheapestMultiplier, site]);

  // …then the database, which is what would actually be charged.
  const [authoritative, setAuthoritative] = useState<Quote | null>(null);
  const [pricing, setPricing] = useState(false);

  useEffect(() => {
    if (!ready || !term || !cadence) return;
    let cancelled = false;

    const timer = setTimeout(async () => {
      if (cancelled) return;
      setPricing(true);
      const supabase = createClient();
      const { data } = await supabase.rpc("price_basket", {
        p_items: basket.lines.map((l) => ({
          variant_id: l.variant_id,
          quantity: l.quantity,
        })),
        p_term_id: term.id,
        p_cadence_id: cadence.id,
        p_site_id: basket.site_id,
      });
      if (!cancelled) {
        setAuthoritative((data as Quote) ?? null);
        setPricing(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ready, basket.lines, basket.site_id, term, cadence]);

  // Prefer the database's numbers whenever they have arrived.
  const quote = authoritative ?? local;

  if (!ready) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 p-6">
        <div className="h-40 animate-pulse rounded-xl bg-leaf-soft/60" />
      </main>
    );
  }

  if (basket.lines.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Your basket is empty</h1>
        <p className="text-muted">
          Add plants from the catalog, or start from a bundle if you would rather
          not count desks.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg bg-leaf px-5 py-3 font-medium text-white">
            Browse plants
          </Link>
          <Link href="/bundles" className="rounded-lg border border-line px-5 py-3 font-medium">
            See bundles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-8 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Your basket</h1>
        <p className="text-sm text-muted">
          Everything below is included: the planter, delivery, installation,
          maintenance visits and free replacement.
        </p>
      </header>

      {/* Lines */}
      <ul className="divide-y divide-line rounded-xl border border-line bg-white">
        {quote?.lines.map((line) => {
          const unavailable = line.status === "unavailable";
          return (
            <li key={line.variant_id} className="space-y-3 p-4">
              <div className="min-w-0">
                <p className={`font-medium ${unavailable ? "text-muted" : ""}`}>
                  {line.species_name}
                  {line.size_tier && (
                    <span className="font-normal text-muted">
                      {" "}
                      · {tierLabel(line.size_tier as SizeTier)}
                    </span>
                  )}
                </p>
                {unavailable ? (
                  <p className="text-sm text-red-700">
                    Out of stock, so it is not in the total. Remove it or leave
                    it and we will tell you when it is back.
                  </p>
                ) : line.status === "capped" ? (
                  <p className="text-sm text-red-700">
                    Only {line.quantity} left, so we have priced{" "}
                    {line.quantity} of the {line.requested_quantity} you asked
                    for.
                  </p>
                ) : (
                  <p className="text-sm text-muted">
                    {formatPrecise(line.unit_price_aed)} each per month
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setQuantity(line.variant_id, line.requested_quantity - 1)
                    }
                    aria-label={`One fewer ${line.species_name}`}
                    className="size-9 rounded-lg border border-line text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold">
                    {line.requested_quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(line.variant_id, line.requested_quantity + 1)
                    }
                    aria-label={`One more ${line.species_name}`}
                    className="size-9 rounded-lg border border-line text-lg leading-none"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => remove(line.variant_id)}
                  className="text-sm text-muted underline underline-offset-4"
                >
                  Remove
                </button>

                <p className="ml-auto font-semibold">
                  {unavailable ? "—" : formatPrecise(line.line_total_aed)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Term */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How long do you want them?</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {config.terms.map((t) => (
            <button
              key={t.id}
              onClick={() => setTerm(t.id)}
              aria-pressed={t.id === term?.id}
              className={`rounded-xl border p-4 text-left ${
                t.id === term?.id
                  ? "border-leaf bg-leaf-soft"
                  : "border-line bg-white"
              }`}
            >
              <span className="block font-medium">{t.label}</span>
              <span className="block text-sm text-muted">
                {Number(t.price_multiplier) === cheapestMultiplier
                  ? "Best monthly price"
                  : `+${Math.round(
                      (Number(t.price_multiplier) / cheapestMultiplier - 1) * 100
                    )}% a month`}
              </span>
            </button>
          ))}
        </div>
        {quote && quote.flexibility_cost_aed > 0 && (
          <p className="text-sm text-muted">
            This term costs {formatPrecise(quote.flexibility_cost_aed)} more each
            month than the longest one. That is what the flexibility is worth.
          </p>
        )}
      </section>

      {/* Cadence */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How often should we visit?</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {config.cadences.map((c) => (
            <button
              key={c.id}
              onClick={() => setCadence(c.id)}
              aria-pressed={c.id === cadence?.id}
              className={`rounded-xl border p-4 text-left ${
                c.id === cadence?.id
                  ? "border-leaf bg-leaf-soft"
                  : "border-line bg-white"
              }`}
            >
              <span className="block font-medium">{c.label}</span>
              <span className="block text-sm text-muted">
                {formatMonthly(Number(c.monthly_fee_aed))} a month for the visits
              </span>
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">
          Changing this changes the visit fee. Your plant prices stay the same.
        </p>
      </section>

      {/* Site */}
      {config.signedIn && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Where will they live?</h2>
          {config.sites.length === 0 ? (
            <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">
              You have no sites yet.{" "}
              <Link href="/sites" className="underline underline-offset-4">
                Add one
              </Link>{" "}
              so we can check we serve the area.
            </p>
          ) : (
            <>
              <select
                value={basket.site_id ?? ""}
                onChange={(e) => setSite(e.target.value || null)}
                className="w-full rounded-lg border border-line bg-white px-4 py-3"
                aria-label="Site for this basket"
              >
                <option value="">Choose a site…</option>
                {config.sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} — {s.building}
                  </option>
                ))}
              </select>
              {site && (
                <p className="text-sm text-leaf">
                  {site.zone_name} · we visit{" "}
                  {serviceDaysPhrase(site.service_weekdays)}
                </p>
              )}
            </>
          )}
        </section>
      )}

      {/* Total */}
      {quote && (
        <section className="space-y-3 rounded-xl border border-line bg-white p-5">
          <h2 className="text-lg font-semibold">Monthly total</h2>

          <dl className="space-y-2 text-sm">
            <Row label="Plants" value={formatPrecise(quote.plants_subtotal_aed)} />
            <Row
              label={`Visits — ${quote.cadence.label.toLowerCase()}`}
              value={formatPrecise(quote.service_fee_aed)}
            />
            {quote.flexibility_cost_aed > 0 && (
              <Row
                label={`${quote.term.label} term`}
                value={`+ ${formatPrecise(quote.flexibility_cost_aed)}`}
              />
            )}
          </dl>

          <p className="flex items-baseline justify-between border-t border-line pt-3">
            <span className="font-semibold">Every month</span>
            <span className="text-2xl font-semibold">
              {formatPrecise(quote.monthly_total_aed)}
            </span>
          </p>

          {pricing && (
            <p className="text-xs text-muted" aria-live="polite">
              Checking this price…
            </p>
          )}

          {quote.has_unavailable_lines && (
            <p className="text-sm text-muted">
              Plants that are out of stock are not included in this total.
            </p>
          )}

          {quote.site_applied && !quote.meets_minimum && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              This site has a minimum of{" "}
              {formatMonthly(quote.minimum_monthly_aed)} a month, so we can keep
              a technician on the road there. Add about{" "}
              {formatPrecise(quote.shortfall_aed)} more a month — roughly two or
              three more desk plants — and you are there.
            </p>
          )}

          {!quote.site_applied && quote.minimum_monthly_aed > 0 && (
            <p className="text-sm text-muted">
              Our smallest plan is {formatMonthly(quote.minimum_monthly_aed)} a
              month. Choose a site to see the minimum for that area.
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {config.signedIn ? (
              <Link
                href={quote.site_applied && quote.meets_minimum ? "/checkout" : "#"}
                aria-disabled={!(quote.site_applied && quote.meets_minimum)}
                className={`rounded-lg bg-leaf px-5 py-3 font-medium text-white ${
                  quote.site_applied && quote.meets_minimum ? "" : "pointer-events-none opacity-50"
                }`}
              >
                Continue
              </Link>
            ) : (
              <Link href="/auth" className="rounded-lg bg-leaf px-5 py-3 font-medium text-white">
                Sign in to order
              </Link>
            )}
            <button
              onClick={clear}
              className="rounded-lg border border-line px-5 py-3 font-medium"
            >
              Empty basket
            </button>
          </div>
          {config.signedIn && !quote.site_applied && (
            <p className="text-xs text-muted">Choose a site above to continue.</p>
          )}
        </section>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
