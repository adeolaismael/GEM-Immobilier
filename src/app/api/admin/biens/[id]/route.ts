import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase0 = createSupabaseAdminClient();
  const { data: existing } = await supabase0
    .from("biens")
    .select("deleted_at")
    .eq("id", id)
    .maybeSingle();

  if (existing?.deleted_at) {
    return NextResponse.json(
      { error: "Ce bien est dans la corbeille. Restaurez-le pour le modifier." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const {
    titre,
    slug,
    description,
    type,
    statut,
    prix,
    surface,
    nb_pieces,
    nb_chambres,
    nb_salles_de_bain,
    adresse,
    ville,
    quartier,
    latitude,
    longitude,
    featured,
  } = body;

  if (!titre || !slug || type == null || statut == null || prix == null) {
    return NextResponse.json(
      { error: "Titre, slug, type, statut et prix requis." },
      { status: 400 }
    );
  }

  const supabase = supabase0;
  const { data, error } = await supabase
    .from("biens")
    .update({
      titre,
      slug: String(slug).trim().toLowerCase().replace(/\s+/g, "-"),
      description: description || null,
      type,
      statut,
      prix: Number(prix),
      surface: surface != null && surface !== "" ? Number(surface) : null,
      nb_pieces: nb_pieces != null && nb_pieces !== "" ? Number(nb_pieces) : null,
      nb_chambres: nb_chambres != null && nb_chambres !== "" ? Number(nb_chambres) : null,
      nb_salles_de_bain: nb_salles_de_bain != null && nb_salles_de_bain !== "" ? Number(nb_salles_de_bain) : null,
      adresse: adresse || null,
      ville: ville || null,
      quartier: quartier || null,
      latitude:
        latitude != null && latitude !== ""
          ? Number(latitude)
          : null,
      longitude:
        longitude != null && longitude !== ""
          ? Number(longitude)
          : null,
      featured: Boolean(featured),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[api/admin/biens] PUT error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const permanent = new URL(request.url).searchParams.get("permanent") === "1";

  const supabase = createSupabaseAdminClient();

  if (permanent) {
    const { data: row, error: fetchErr } = await supabase
      .from("biens")
      .select("deleted_at")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) {
      console.error("[api/admin/biens] DELETE permanent fetch", fetchErr);
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }
    if (!row) {
      return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }
    if (!row.deleted_at) {
      return NextResponse.json(
        { error: "Mettez d'abord le bien à la corbeille avant une suppression définitive." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("biens").delete().eq("id", id);
    if (error) {
      console.error("[api/admin/biens] DELETE permanent error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("biens")
    .update({ deleted_at: now, updated_at: now })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    console.error("[api/admin/biens] DELETE soft error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
