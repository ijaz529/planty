import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { shortDate } from "@/lib/visits";

export const metadata = { title: "Today — Planty" };

type Stop = {
  id: string;
  scheduled_date: string;
  status: string;
  sequence_no: number | null;
  sites: { label: string; building: string; unit: string | null; access_notes: string | null } | null;
};

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { data: isTechnician } = await supabase.rpc("is_technician");
  if (!isTechnician) notFound();

  const { date } = await searchParams;
  // Asia/Dubai is where the round happens; the technician's day is that day.
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(new Date());
  const day = date ?? today;

  const { data } = await supabase
    .from("visits")
    .select("id, scheduled_date, status, sequence_no, sites(label, building, unit, access_notes)")
    .eq("technician_id", user.id)
    .eq("scheduled_date", day)
    .order("sequence_no", { nullsFirst: false });

  const stops = (data ?? []) as unknown as Stop[];
  const remaining = stops.filter((s) => s.status === "planned").length;

  const { data: upcoming } = await supabase
    .from("visits")
    .select("scheduled_date")
    .eq("technician_id", user.id)
    .eq("status", "planned")
    .gt("scheduled_date", day)
    .order("scheduled_date")
    .limit(1);

  return (
    <main className="mx-auto w-full max-w-lg flex-1 space-y-5 p-5">
      <header className="space-y-1">
        <p className="text-sm text-muted">{shortDate(day)}</p>
        <h1 className="text-2xl font-semibold">
          {stops.length === 0
            ? "Nothing on today"
            : `${remaining} of ${stops.length} left`}
        </h1>
      </header>

      {stops.length === 0 ? (
        <div className="space-y-3 rounded-xl border border-line bg-white p-5">
          <p className="text-muted">No stops assigned for this day.</p>
          {upcoming?.[0] && (
            <p className="text-sm">
              Next round is{" "}
              <Link
                href={`/today?date=${upcoming[0].scheduled_date}`}
                className="text-leaf underline underline-offset-4"
              >
                {shortDate(upcoming[0].scheduled_date)}
              </Link>
              .
            </p>
          )}
        </div>
      ) : (
        <ol className="space-y-3">
          {stops.map((s, i) => {
            const done = s.status !== "planned";
            return (
              <li key={s.id}>
                <Link
                  href={`/today/${s.id}`}
                  className={`flex gap-3 rounded-xl border p-4 ${
                    done ? "border-line bg-leaf-soft/40" : "border-line bg-white"
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      done ? "bg-leaf text-white" : "bg-leaf-soft text-leaf"
                    }`}
                  >
                    {done ? "✓" : (s.sequence_no ?? i + 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{s.sites?.label}</p>
                    <p className="text-sm text-muted">
                      {s.sites?.building}
                      {s.sites?.unit ? `, ${s.sites.unit}` : ""}
                    </p>
                    {s.status === "missed" && (
                      <p className="text-sm text-red-700">Could not be done</p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
