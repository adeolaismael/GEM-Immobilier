import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { BiensSupprimesClient } from "./BiensSupprimesClient";

export default async function AdminBiensSupprimesPage() {
  const supabase = createSupabaseAdminClient();
  const { data: biens } = await supabase
    .from("biens")
    .select("id, titre, type, statut, prix, ville, deleted_at")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/admin/biens" className="text-sm font-medium text-gray-600 hover:text-[#5c7a1f]">
          ← Biens actifs
        </Link>
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">Corbeille</h1>
        <p className="mt-1 text-sm text-gray-500">
          Biens retirés du site. Restaurez-les pour les rééditer et les republier, ou supprimez-les
          définitivement.
        </p>
      </div>
      <BiensSupprimesClient biens={biens ?? []} />
    </div>
  );
}
