"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { profileSchema } from "@/lib/validation";

export function ProfileForm({
  displayName,
  email,
  phone,
}: {
  displayName: string;
  email: string;
  phone: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [mail, setMail] = useState(email);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(false);

    const parsed = profileSchema.safeParse({ display_name: name, email: mail });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: parsed.data.display_name,
        email: parsed.data.email || null,
      })
      .eq("id", (await supabase.auth.getUser()).data.user!.id);
    setBusy(false);

    if (error) {
      setErrors({ form: "We could not save that. Please try again." });
      return;
    }
    setSaved(true);
    router.refresh();
  }

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="display_name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="display_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.display_name ? true : undefined}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/30"
        />
        {errors.display_name && (
          <p role="alert" className="text-sm text-red-700">
            {errors.display_name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/30"
        />
        {errors.email && (
          <p role="alert" className="text-sm text-red-700">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium">
          Mobile number
        </label>
        <input
          id="phone"
          value={phone}
          readOnly
          aria-describedby="phone-note"
          className="w-full rounded-lg border border-line bg-leaf-soft/50 px-4 py-3 text-muted"
        />
        <p id="phone-note" className="text-xs text-muted">
          Verified, and used to reach you about deliveries and visits. Contact us
          to change it.
        </p>
      </div>

      {errors.form && (
        <p role="alert" className="text-sm text-red-700">
          {errors.form}
        </p>
      )}
      {saved && <p className="text-sm text-leaf">Saved.</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-leaf px-5 py-3 font-medium text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-lg border border-line px-5 py-3 font-medium"
        >
          Sign out
        </button>
      </div>
    </form>
  );
}
