import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
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

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("biens")
    .insert({
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
    })
    .select()
    .single();

  if (error) {
    console.error("[api/admin/biens] POST error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
