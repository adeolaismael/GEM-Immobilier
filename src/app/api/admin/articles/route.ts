import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { slugifyArticleTitle } from "@/lib/articles";
import { revalidateArticlesPublic } from "@/lib/revalidate-public";

function normalizeSlug(slug: string): string {
  return slugifyArticleTitle(slug);
}

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/admin/articles] GET error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data ?? [] });
}

export async function POST(request: Request) {
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

  const isPublished = Boolean(publie);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      titre: String(titre).trim(),
      slug: normalizeSlug(String(slug)),
      type,
      resume: resume ? String(resume).trim() : null,
      contenu: String(contenu).trim(),
      image_url: image_url ? String(image_url).trim() : null,
      publie: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    console.error("[api/admin/articles] POST error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateArticlesPublic();
  return NextResponse.json(data);
}
