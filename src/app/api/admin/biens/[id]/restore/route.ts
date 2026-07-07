import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("biens")
    .update({ deleted_at: null, updated_at: now })
    .eq("id", id)
    .not("deleted_at", "is", null)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[api/admin/biens/restore] error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Bien introuvable ou déjà actif." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
