import { NextResponse } from "next/server";
import {
  insertAnalyticsEvent,
  validateAnalyticsPayload,
} from "@/lib/analytics-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateAnalyticsPayload(body);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    await insertAnalyticsEvent({
      type: parsed.type,
      bien_id: parsed.bien_id,
      metadata: parsed.metadata,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/analytics] POST error", err);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de l'événement." },
      { status: 500 }
    );
  }
}
