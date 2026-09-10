import { createClient } from "@/lib/supabase/server";

export default async function OpsWaitlistPage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("waitlist_entries")
    .select("id, area_note, created_at, profiles(display_name, phone)")
    .order("created_at", { ascending: false });

  const rows = (entries ?? []) as unknown as {
    id: string;
    area_note: string | null;
    created_at: string;
    profiles: { display_name: string | null; phone: string } | null;
  }[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Waitlist</h1>
        <p className="mt-1 text-muted">
          People who asked for a location outside every served zone. Enough
          requests in one area is the signal to draw a new zone.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">
          Nobody is waiting.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {rows.map((e) => (
            <li key={e.id} className="p-4">
              <p className="font-medium">
                {e.profiles?.display_name ?? "Someone"}
              </p>
              <p className="text-sm text-muted">
                {e.profiles?.phone}
                {e.area_note ? ` · ${e.area_note}` : ""}
              </p>
              <p className="mt-1 text-xs text-muted">
                Asked {new Date(e.created_at).toLocaleDateString("en-AE")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
