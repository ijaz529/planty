"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { organizationSchema } from "@/lib/validation";

export function NewOrganizationForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const parsed = organizationSchema.safeParse({
      name: form.get("name"),
      billing_email: form.get("billing_email"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data, error: dbError } = await supabase.rpc("create_organization", {
      org_name: parsed.data.name,
      org_billing_email: parsed.data.billing_email,
    });
    setBusy(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.push(`/organizations/${data}`);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-leaf px-5 py-3 font-medium text-white"
      >
        Create an organization
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-line bg-white p-5"
    >
      <h2 className="font-semibold">New organization</h2>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Company name
        </label>
        <input
          id="name"
          name="name"
          placeholder="Northwind Labs"
          className="w-full rounded-lg border border-line px-4 py-3"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="billing_email" className="block text-sm font-medium">
          Billing email
        </label>
        <input
          id="billing_email"
          name="billing_email"
          type="email"
          placeholder="accounts@northwind.example"
          className="w-full rounded-lg border border-line px-4 py-3"
        />
        <p className="text-xs text-muted">Invoices and receipts go here.</p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-leaf px-5 py-3 font-medium text-white disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-line px-5 py-3 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
