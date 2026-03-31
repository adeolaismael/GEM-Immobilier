import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, email, telephone, sujet, message, bien_id } = body;

    if (!nom?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("messages_contact")
      .insert({
        nom: String(nom).trim(),
        email: String(email).trim(),
        telephone: telephone ? String(telephone).trim() : null,
        sujet: sujet ? String(sujet).trim() : null,
        message: String(message).trim(),
        bien_id: bien_id && typeof bien_id === "string" ? bien_id : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[api/contact] POST error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id, success: true });
  } catch (err) {
    console.error("[api/contact] error", err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
