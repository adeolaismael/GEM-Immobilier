import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { uploadPhoto } from "@/lib/storage";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bienId } = await params;

  const formData = await request.formData();
  const file = formData.get("file");
  const ordre = formData.get("ordre");
  const estPrincipale = formData.get("est_principale") === "true";

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: "Fichier requis." },
      { status: 400 }
    );
  }

  const mime = file.type;
  if (!ALLOWED_TYPES.includes(mime)) {
    return NextResponse.json(
      { error: "Format non accepté. Utilisez jpg, png ou webp." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fichier trop volumineux. Maximum 5 Mo." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: bienRow } = await supabase
    .from("biens")
    .select("deleted_at")
    .eq("id", bienId)
    .maybeSingle();

  if (!bienRow) {
    return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
  }
  if (bienRow.deleted_at) {
    return NextResponse.json(
      { error: "Ce bien est en corbeille. Restaurez-le pour ajouter des photos." },
      { status: 400 }
    );
  }

  try {
    const url = await uploadPhoto(file, bienId);
    const { data, error } = await supabase
      .from("bien_photos")
      .insert({
        bien_id: bienId,
        url,
        ordre: ordre != null ? Number(ordre) : 0,
        est_principale: estPrincipale,
      })
      .select()
      .single();

    if (error) {
      console.error("[api/admin/biens/photos] POST error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de l'upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
