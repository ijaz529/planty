import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";

export default async function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase } = await requireUser();
  const { data: isOperator } = await supabase.rpc("is_operator");

  // notFound(), not a permission error: an internal area should not confirm
  // to a stranger that it exists.
  if (!isOperator) notFound();

  return (
    <>
      <header className="border-b border-line bg-foreground text-white">
        <nav className="mx-auto flex w-full max-w-4xl items-center gap-5 px-6 py-4 text-sm">
          <Link href="/ops" className="font-semibold">
            Planty operations
          </Link>
          <Link href="/ops/catalog" className="opacity-80 hover:opacity-100">
            Catalog
          </Link>
          <Link href="/ops/pricing" className="opacity-80 hover:opacity-100">
            Pricing
          </Link>
          <Link href="/ops/zones" className="opacity-80 hover:opacity-100">
            Zones
          </Link>
          <Link href="/ops/waitlist" className="opacity-80 hover:opacity-100">
            Waitlist
          </Link>
          <Link href="/" className="ml-auto opacity-80 hover:opacity-100">
            Customer view
          </Link>
        </nav>
      </header>
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">{children}</div>
    </>
  );
}
