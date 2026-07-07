import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  getMergedSiteContent,
  normalizeSiteContentFromAdmin,
} from "@/lib/site-content";
import { isSitePageSlug } from "@/lib/site-content-defaults";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isSitePageSlug(slug)) {
    return NextResponse.json({ error: "Page inconnue." }, { status: 404 });
  }

  const content = await getMergedSiteContent(slug);
  return NextResponse.json({ slug, content });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isSitePageSlug(slug)) {
    return NextResponse.json({ error: "Page inconnue." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const normalized = normalizeSiteContentFromAdmin(slug, body);
  if (!normalized) {
    return NextResponse.json(
      { error: "Corps invalide : attendu { content: { ... } }." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("site_pages").upsert(
    {
      slug,
      content: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );

  if (error) {
    console.error("[api/admin/site-pages] PUT", error);
    const hintFr =
      error.code === "PGRST205" || /site_pages/i.test(String(error.message))
        ? "Créez la table dans Supabase : SQL Editor → coller le fichier supabase/migrations/20260329120000_site_pages.sql (après schema.sql si besoin)."
        : undefined;
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        hint: hintFr,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ slug, content: normalized });
}
