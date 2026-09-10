"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Term = {
  id: string;
  months: number;
  label: string;
  price_multiplier: number;
  is_default: boolean;
  active: boolean;
};
type Cadence = {
  id: string;
  code: string;
  label: string;
  visits_per_month: number;
  monthly_fee_aed: number;
  is_default: boolean;
  active: boolean;
};
type Zone = {
  id: string;
  name: string;
  minimum_monthly_aed: number;
  active: boolean;
};

export function PricingEditor({
  terms,
  cadences,
  zones,
}: {
  terms: Term[];
  cadences: Cadence[];
  zones: Zone[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function save(
    table: "rental_terms" | "service_cadences" | "service_zones",
    id: string,
    patch: Record<string, number>,
    what: string
  ) {
    setError(null);
    setSaved(null);
    const supabase = createClient();
    const { error: dbError } = await supabase.from(table).update(patch).eq("id", id);
    if (dbError) {
      // The database owns the rules here — for example that exactly one term
      // may be the active default — so its message is the honest one.
      setError(dbError.message);
      return;
    }
    setSaved(`${what} saved. Customer prices have changed.`);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {saved && <p className="text-sm text-leaf">{saved}</p>}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Rental terms</h2>
        <p className="text-sm text-muted">
          The multiplier applies to the whole monthly bill. The cheapest term is
          the anchor, so shorter terms read to a customer as the price of
          flexibility.
        </p>
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {terms.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="flex-1">
                <p className="font-medium">
                  {t.label}
                  {t.is_default && (
                    <span className="ml-2 rounded-full bg-leaf-soft px-2 py-0.5 text-xs font-normal text-leaf">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted">{t.months} months</p>
              </div>
              <NumberSave
                label="Multiplier"
                defaultValue={t.price_multiplier}
                step="0.0001"
                onSave={(v) =>
                  save("rental_terms", t.id, { price_multiplier: v }, t.label)
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Visit cadences</h2>
        <p className="text-sm text-muted">
          The monthly fee covers the visits themselves, per site.
        </p>
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {cadences.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="flex-1">
                <p className="font-medium">
                  {c.label}
                  {c.is_default && (
                    <span className="ml-2 rounded-full bg-leaf-soft px-2 py-0.5 text-xs font-normal text-leaf">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted">
                  {c.visits_per_month} visits a month
                </p>
              </div>
              <NumberSave
                label="AED / month"
                defaultValue={c.monthly_fee_aed}
                step="1"
                onSave={(v) =>
                  save("service_cadences", c.id, { monthly_fee_aed: v }, c.label)
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Zone minimums</h2>
        <p className="text-sm text-muted">
          The smallest monthly value worth sending a technician for. This is the
          single number that protects route density.
        </p>
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {zones.map((z) => (
            <li key={z.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="flex-1">
                <p className="font-medium">
                  {z.name}
                  {!z.active && (
                    <span className="ml-2 rounded-full bg-line px-2 py-0.5 text-xs font-normal">
                      Retired
                    </span>
                  )}
                </p>
              </div>
              <NumberSave
                label="Minimum AED / month"
                defaultValue={z.minimum_monthly_aed}
                step="1"
                onSave={(v) =>
                  save("service_zones", z.id, { minimum_monthly_aed: v }, z.name)
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function NumberSave({
  label,
  defaultValue,
  step,
  onSave,
}: {
  label: string;
  defaultValue: number;
  step: string;
  onSave: (value: number) => void;
}) {
  const [value, setValue] = useState(String(defaultValue));
  const dirty = Number(value) !== defaultValue;

  return (
    <label className="flex items-end gap-2 text-sm">
      <span className="flex flex-col">
        <span className="mb-1 text-xs text-muted">{label}</span>
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-32 rounded-lg border border-line px-3 py-2"
        />
      </span>
      <button
        type="button"
        disabled={!dirty || !Number.isFinite(Number(value))}
        onClick={() => onSave(Number(value))}
        className="rounded-lg bg-leaf px-4 py-2 font-medium text-white disabled:opacity-40"
      >
        Save
      </button>
    </label>
  );
}
