import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { deletePhoto } from "@/lib/storage";

/** Définit cette photo comme couverture (les autres passent à non principales). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> },
) {
  const { id: bienId, photoId } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: bienMeta } = await supabase
    .from("biens")
    .select("deleted_at")
    .eq("id", bienId)
    .maybeSingle();

  if (bienMeta?.deleted_at) {
    return NextResponse.json(
      { error: "Ce bien est en corbeille. Restaurez-le pour modifier les photos." },
      { status: 400 }
    );
  }

  const { data: target, error: findErr } = await supabase
    .from("bien_photos")
    .select("id")
    .eq("id", photoId)
    .eq("bien_id", bienId)
    .maybeSingle();

  if (findErr || !target) {
    return NextResponse.json({ error: "Photo introuvable." }, { status: 404 });
  }

  const { error: clearErr } = await supabase
    .from("bien_photos")
    .update({ est_principale: false })
    .eq("bien_id", bienId);

  if (clearErr) {
    console.error("[api/admin/biens/photos] PATCH clear principale", clearErr);
    return NextResponse.json({ error: clearErr.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("bien_photos")
    .update({ est_principale: true })
    .eq("id", photoId)
    .eq("bien_id", bienId)
    .select()
    .single();

  if (error) {
    console.error("[api/admin/biens/photos] PATCH", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  const { id: bienId, photoId } = await params;

  const supabase = createSupabaseAdminClient();

  const { data: bienMeta } = await supabase
    .from("biens")
    .select("deleted_at")
    .eq("id", bienId)
    .maybeSingle();

  if (bienMeta?.deleted_at) {
    return NextResponse.json(
      { error: "Ce bien est en corbeille. Restaurez-le pour supprimer des photos." },
      { status: 400 }
    );
  }

  const { data: photo, error: fetchError } = await supabase
    .from("bien_photos")
    .select("url")
    .eq("id", photoId)
    .eq("bien_id", bienId)
    .single();

  if (fetchError || !photo) {
    return NextResponse.json(
      { error: "Photo introuvable." },
      { status: 404 }
    );
  }

  try {
    await deletePhoto(photo.url);
  } catch (err) {
    console.error("[api/admin/biens/photos] deletePhoto error", err);
    // Continue to delete from DB even if storage delete fails
  }

  const { error: deleteError } = await supabase
    .from("bien_photos")
    .delete()
    .eq("id", photoId)
    .eq("bien_id", bienId);

  if (deleteError) {
    console.error("[api/admin/biens/photos] DELETE error", deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
