import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { slugifyArticleTitle } from "@/lib/articles";

function normalizeSlug(slug: string): string {
  return slugifyArticleTitle(slug);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { titre, slug, type, resume, contenu, image_url, publie } = body;

  if (!titre?.trim() || !slug?.trim() || !contenu?.trim()) {
    return NextResponse.json(
      { error: "Titre, slug et contenu sont requis." },
      { status: 400 }
    );
  }

  if (type !== "article" && type !== "expertise") {
    return NextResponse.json({ error: "Type invalide." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: existing, error: fetchError } = await supabase
    .from("articles")
    .select("published_at, publie")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.error("[api/admin/articles] PUT fetch error", fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  const isPublished = Boolean(publie);
  const publishedAt =
    isPublished
      ? existing.published_at ?? new Date().toISOString()
      : null;

  const { data, error } = await supabase
    .from("articles")
    .update({
      titre: String(titre).trim(),
      slug: normalizeSlug(String(slug)),
      type,
      resume: resume ? String(resume).trim() : null,
      contenu: String(contenu).trim(),
      image_url: image_url ? String(image_url).trim() : null,
      publie: isPublished,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[api/admin/articles] PUT error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("[api/admin/articles] DELETE error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
