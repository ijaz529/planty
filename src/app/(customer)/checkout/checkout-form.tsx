"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useBasket } from "@/components/basket/basket-provider";
import { tierLabel, type SizeTier } from "@/lib/catalog";
import {
  formatInstallationDay,
  installationCandidates,
  toDateString,
} from "@/lib/installation";
import { formatPrecise, type Quote } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/client";
import { serviceDaysPhrase } from "@/lib/zones";

export type CheckoutConfig = {
  sites: {
    id: string;
    label: string;
    building: string;
    zone_name: string;
    zone_active: boolean;
    service_weekdays: number[];
    default_email: string;
  }[];
  terms: { id: string; months: number; label: string }[];
  cadences: { id: string; code: string; label: string }[];
};

export function CheckoutForm({ config }: { config: CheckoutConfig }) {
  const router = useRouter();
  const { basket, ready, setSite, clear } = useBasket();

  const site = config.sites.find((s) => s.id === basket.site_id) ?? null;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [installDate, setInstallDate] = useState<string>("");
  // Derived from the site until the customer edits it; no effect needed.
  const [emailOverride, setEmailOverride] = useState<string | null>(null);
  const email = emailOverride ?? site?.default_email ?? "";
  const [error, setError] = useState<string | null>(null);
  const [changedTotal, setChangedTotal] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const candidates = useMemo(
    () => (site ? installationCandidates(site.service_weekdays, new Date(), 6) : []),
    [site]
  );

  // The authoritative quote for this site: what the customer is agreeing to.
  useEffect(() => {
    if (!ready || !site) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.rpc("price_basket", {
        p_items: basket.lines,
        p_term_id: basket.term_id,
        p_cadence_id: basket.cadence_id,
        p_site_id: site.id,
      });
      if (!cancelled) setQuote((data as Quote) ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, site, basket.lines, basket.term_id, basket.cadence_id]);

  async function placeOrder(expected: number | null) {
    if (!site || !quote) return;
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { data, error: dbError } = await supabase.rpc("create_subscription", {
      p_items: basket.lines,
      p_term_id: basket.term_id,
      p_cadence_id: basket.cadence_id,
      p_site_id: site.id,
      p_installation_date: installDate,
      p_billing_email: email || null,
      p_expected_total: expected,
    });
    setBusy(false);

    if (dbError) {
      // FR-004: the price moved between basket and order. Show it and ask.
      const m = /price changed: now AED ([\d.]+)/.exec(dbError.message);
      if (m) {
        setChangedTotal(Number(m[1]));
        return;
      }
      setError(dbError.message);
      return;
    }
    clear();
    router.push(`/subscriptions/${data}`);
  }

  if (!ready) return <main className="mx-auto w-full max-w-2xl p-6" />;

  if (basket.lines.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Nothing to order yet</h1>
        <Link href="/" className="text-leaf underline underline-offset-4">
          Browse plants
        </Link>
      </main>
    );
  }

  const priceable = quote?.lines.filter((l) => l.status !== "unavailable") ?? [];
  const dropped = quote?.lines.filter((l) => l.status === "unavailable") ?? [];
  const capped = quote?.lines.filter((l) => l.status === "capped") ?? [];
  const canOrder =
    site && site.zone_active && quote && quote.meets_minimum && priceable.length > 0 && installDate && email;

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Confirm your order</h1>
        <p className="text-sm text-muted">
          Nothing is charged online. You will get an invoice to pay by bank
          transfer, and we reserve your plants for seven days while it clears.
        </p>
      </header>

      {/* Site */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Where the plants will live</h2>
        <select
          value={basket.site_id ?? ""}
          onChange={(e) => {
            setSite(e.target.value || null);
            setInstallDate("");
            setEmailOverride(null);
          }}
          className="w-full rounded-lg border border-line bg-white px-4 py-3"
          aria-label="Site"
        >
          <option value="">Choose a site…</option>
          {config.sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — {s.building}
            </option>
          ))}
        </select>
        {site && !site.zone_active && (
          <p role="alert" className="text-sm text-red-700">
            We no longer serve {site.zone_name}. Choose another site.
          </p>
        )}
        {site && site.zone_active && (
          <p className="text-sm text-leaf">
            {site.zone_name} · we visit {serviceDaysPhrase(site.service_weekdays)}
          </p>
        )}
      </section>

      {/* What is being ordered */}
      {quote && site && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Your plants</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {priceable.map((l) => (
              <li key={l.variant_id} className="flex justify-between p-4 text-sm">
                <span>
                  {l.quantity} × {l.species_name}
                  {l.size_tier && (
                    <span className="text-muted"> · {tierLabel(l.size_tier as SizeTier)}</span>
                  )}
                  {l.status === "capped" && (
                    <span className="block text-red-700">
                      Only {l.quantity} left, so we can supply {l.quantity} of the{" "}
                      {l.requested_quantity} you asked for.
                    </span>
                  )}
                </span>
                <span className="font-medium">{formatPrecise(l.line_total_aed)}</span>
              </li>
            ))}
          </ul>
          {dropped.length > 0 && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              Not in this order because they are out of stock:{" "}
              {dropped.map((l) => l.species_name).join(", ")}.
            </p>
          )}
          {capped.length > 0 && (
            <p className="text-sm text-muted">
              Quantities above have been reduced to what we can supply.
            </p>
          )}
          <dl className="space-y-1 rounded-xl border border-line bg-white p-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Plants</dt><dd>{formatPrecise(quote.plants_subtotal_aed)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Visits — {quote.cadence.label.toLowerCase()}</dt><dd>{formatPrecise(quote.service_fee_aed)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Term</dt><dd>{quote.term.label}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Every month</dt><dd>{formatPrecise(quote.monthly_total_aed)}</dd></div>
          </dl>
          {!quote.meets_minimum && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              This site needs at least {formatPrecise(quote.minimum_monthly_aed)} a
              month; you are {formatPrecise(quote.shortfall_aed)} short.{" "}
              <Link href="/basket" className="underline underline-offset-4">
                Add a few more plants
              </Link>
              .
            </p>
          )}
        </section>
      )}

      {/* Installation day */}
      {site && site.zone_active && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Installation day</h2>
          <p className="text-sm text-muted">
            The first visit is the install. These are the next days we are in{" "}
            {site.zone_name}.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {candidates.map((d) => {
              const v = toDateString(d);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setInstallDate(v)}
                  aria-pressed={installDate === v}
                  className={`rounded-lg border p-3 text-left text-sm ${
                    installDate === v ? "border-leaf bg-leaf-soft" : "border-line bg-white"
                  }`}
                >
                  {formatInstallationDay(d)}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Billing */}
      {site && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Where to send the invoice</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmailOverride(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-3"
            aria-label="Billing email"
          />
        </section>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>
      )}

      {changedTotal !== null && (
        <div role="alert" className="space-y-3 rounded-xl border border-leaf bg-leaf-soft p-4">
          <p className="font-medium">The price has changed since you built your basket.</p>
          <p className="text-sm">
            It is now {formatPrecise(changedTotal)} a month. Place the order at this
            price?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => placeOrder(changedTotal)}
              disabled={busy}
              className="rounded-lg bg-leaf px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              Yes, place order at {formatPrecise(changedTotal)}
            </button>
            <Link href="/basket" className="rounded-lg border border-line bg-white px-5 py-3 font-medium">
              Back to basket
            </Link>
          </div>
        </div>
      )}

      {changedTotal === null && (
        <button
          onClick={() => placeOrder(quote?.monthly_total_aed ?? null)}
          disabled={!canOrder || busy}
          className="w-full rounded-lg bg-leaf px-5 py-4 text-lg font-medium text-white disabled:opacity-50"
        >
          {busy ? "Placing order…" : "Place order"}
        </button>
      )}
    </main>
  );
}
