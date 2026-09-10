"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatUaePhone, normalizeUaePhone } from "@/lib/phone";
import { createClient } from "@/lib/supabase/client";
import type { Invite, Member } from "./page";

export function MembersManager({
  organizationId,
  isOwner,
  currentAccountId,
  members,
  invites,
}: {
  organizationId: string;
  isOwner: boolean;
  currentAccountId: string;
  members: Member[];
  invites: Invite[];
}) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function invite(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const parsed = normalizeUaePhone(phone);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error: dbError } = await supabase.rpc("invite_to_organization", {
      target_organization_id: organizationId,
      invite_phone: parsed.e164,
      invite_role: "member",
    });
    setBusy(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    setPhone("");
    setNotice(
      "Invited. If they have not used Planty before, they join the moment they sign in."
    );
    router.refresh();
  }

  /**
   * The database refuses to leave an organization without an owner, and we
   * show its message rather than pre-guessing the rule in the UI.
   */
  async function remove(accountId: string) {
    setError(null);
    setNotice(null);
    setBusy(true);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", organizationId)
      .eq("account_id", accountId);
    setBusy(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  }

  async function withdraw(inviteId: string) {
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("organization_invites")
      .delete()
      .eq("id", inviteId);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">People</h2>

      <ul className="divide-y divide-line rounded-xl border border-line bg-white">
        {members.map((m) => (
          <li key={m.account_id} className="flex items-center gap-3 p-4">
            <div className="flex-1">
              <p className="font-medium">
                {m.profiles?.display_name ?? "Waiting for first sign-in"}
                {m.account_id === currentAccountId && (
                  <span className="text-muted"> (you)</span>
                )}
              </p>
              <p className="text-sm text-muted">
                {m.profiles ? formatUaePhone(m.profiles.phone) : ""} ·{" "}
                {m.role === "owner" ? "Owner" : "Member"}
              </p>
            </div>
            {isOwner && (
              <button
                onClick={() => remove(m.account_id)}
                disabled={busy}
                className="text-sm text-muted underline underline-offset-4 disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {invites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Invited, not yet signed in</h3>
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {invites.map((i) => (
              <li key={i.id} className="flex items-center gap-3 p-4">
                <p className="flex-1 text-sm">{formatUaePhone(i.phone)}</p>
                {isOwner && (
                  <button
                    onClick={() => withdraw(i.id)}
                    className="text-sm text-muted underline underline-offset-4"
                  >
                    Withdraw
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOwner && (
        <form
          onSubmit={invite}
          className="space-y-3 rounded-xl border border-line bg-white p-5"
        >
          <label htmlFor="invite" className="block text-sm font-medium">
            Invite a colleague by mobile number
          </label>
          <div className="flex gap-2">
            <input
              id="invite"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050 123 4567"
              className="flex-1 rounded-lg border border-line px-4 py-3"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-leaf px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              Invite
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          {notice && <p className="text-sm text-leaf">{notice}</p>}
        </form>
      )}

      {!isOwner && error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
