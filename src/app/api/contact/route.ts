import { NextResponse } from "next/server";
import { Resend } from "resend";
import { insertAnalyticsEvent } from "@/lib/analytics-server";
import { buildContactEmailHtml } from "@/lib/contact-email";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

type ContactPayload = {
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string | null;
  message: string;
  service: string | null;
  bien_id: string | null;
  bienTitre: string | null;
};

async function sendContactEmail(data: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;

  if (!apiKey || !from || !to) {
    console.warn("[api/contact] Resend non configuré, email non envoyé.");
    return;
  }

  const resend = new Resend(apiKey);
  const subject = `Nouveau message - ${data.sujet?.trim() || "Sans sujet"}`;
  const receivedAt = new Date().toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject,
    html: buildContactEmailHtml({
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      sujet: data.sujet,
      message: data.message,
      service: data.service,
      bienTitre: data.bienTitre,
      receivedAt,
    }),
  });

  if (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, email, telephone, sujet, message, service, bien_id } = body;

    if (!nom?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const bienId =
      bien_id && typeof bien_id === "string" ? bien_id : null;

    let bienTitre: string | null = null;
    if (bienId) {
      const { data: bien } = await supabase
        .from("biens")
        .select("titre")
        .eq("id", bienId)
        .maybeSingle();
      bienTitre = bien?.titre ?? null;
    }

    const { data, error } = await supabase
      .from("messages_contact")
      .insert({
        nom: String(nom).trim(),
        email: String(email).trim(),
        telephone: telephone ? String(telephone).trim() : null,
        sujet: sujet ? String(sujet).trim() : null,
        message: String(message).trim(),
        service: service ? String(service).trim() : null,
        bien_id: bienId,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[api/contact] POST error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      await sendContactEmail({
        nom: String(nom).trim(),
        email: String(email).trim(),
        telephone: telephone ? String(telephone).trim() : null,
        sujet: sujet ? String(sujet).trim() : null,
        message: String(message).trim(),
        service: service ? String(service).trim() : null,
        bien_id: bienId,
        bienTitre,
      });
    } catch (emailErr) {
      console.error("[api/contact] email error", emailErr);
    }

    try {
      await insertAnalyticsEvent({
        type: "formulaire_soumis",
        bien_id: bienId,
        metadata: {
          message_id: data?.id ?? null,
          has_service: Boolean(service),
        },
      });
    } catch (analyticsErr) {
      console.error("[api/contact] analytics error", analyticsErr);
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
