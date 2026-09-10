import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";

export default async function TechLayout({ children }: { children: React.ReactNode }) {
  const { supabase } = await requireUser();
  const { data: isTechnician } = await supabase.rpc("is_technician");
  if (!isTechnician) notFound();

  return (
    <>
      <header className="border-b border-line bg-foreground text-white">
        <nav className="mx-auto flex w-full max-w-lg items-center gap-4 px-5 py-3 text-sm">
          <Link href="/today" className="font-semibold">Planty round</Link>
          <Link href="/" className="ml-auto opacity-80 hover:opacity-100">Catalog</Link>
          <Link href="/profile" className="opacity-80 hover:opacity-100">Profile</Link>
        </nav>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
