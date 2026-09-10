import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatPrecise } from "@/lib/pricing";
import { requireUser } from "@/lib/supabase/server";
import { StatusBadge } from "./status-badge";

export const metadata = { title: "Your subscriptions — Planty" };

export default async function SubscriptionsPage() {
  const { supabase } = await requireUser();
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, status, payment_reference, monthly_total_aed, installation_date, sites(label)")
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Your subscriptions</h1>
        {!subs || subs.length === 0 ? (
          <p className="rounded-xl border border-line bg-white p-5 text-sm text-muted">
            None yet. <Link href="/" className="underline underline-offset-4">Pick some plants</Link>.
          </p>
        ) : (
          <ul className="space-y-3">
            {subs.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/subscriptions/${s.id}`}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4"
                >
                  <div className="flex-1">
                    <p className="font-semibold">
                      {(s.sites as unknown as { label: string } | null)?.label ?? "Site"}
                    </p>
                    <p className="text-sm text-muted">
                      {s.payment_reference} · installs{" "}
                      {new Date(s.installation_date).toLocaleDateString("en-AE", {
                        day: "numeric", month: "short",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                  <p className="font-semibold">{formatPrecise(Number(s.monthly_total_aed))}<span className="text-sm font-normal text-muted">/mo</span></p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
