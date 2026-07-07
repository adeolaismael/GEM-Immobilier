import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { BienForm } from "../../BienForm";

export default async function AdminBiensModifierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: bien, error } = await supabase
    .from("biens")
    .select("*, bien_photos(*)")
    .eq("id", id)
    .single();

  if (error || !bien) {
    notFound();
  }

  if (bien.deleted_at) {
    redirect("/admin/biens/supprimes");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/biens" className="text-sm font-medium text-gray-600 hover:text-[#5c7a1f]">
          ← Retour aux biens
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <BienForm bien={bien} />
      </div>
    </div>
  );
}
