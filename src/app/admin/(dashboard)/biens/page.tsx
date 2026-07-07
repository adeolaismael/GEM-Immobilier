import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { BiensListClient } from "./BiensListClient";

export default async function AdminBiensPage() {
  const supabase = createSupabaseAdminClient();
  const { data: biens } = await supabase
    .from("biens")
    .select("id, titre, type, statut, prix, ville, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Link
          href="/admin/biens/supprimes"
          className="mr-auto text-sm font-medium text-gray-600 hover:text-[#5c7a1f]"
        >
          Corbeille (biens supprimés)
        </Link>
        <Link
          href="/admin/biens/nouveau"
          className="rounded-xl bg-[#5c7a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a6419]"
        >
          Ajouter un bien
        </Link>
      </div>
      <BiensListClient biens={biens ?? []} />
    </div>
  );
}
