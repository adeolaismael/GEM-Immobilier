import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("messages_contact")
    .update({ lu: true })
    .eq("id", id);

  if (error) {
    console.error("[api/admin/messages] PATCH error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
