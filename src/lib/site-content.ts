import { createServerSupabaseClient } from "@/lib/supabase";
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_GALLERY_JSON_KEY,
  SITE_CONTENT_HERO_IMAGE_FALLBACK_KEYS,
  type SitePageSlug,
} from "@/lib/site-content-defaults";
import { normalizeSiteGalleryJsonString } from "@/lib/site-galerie";

export type { SitePageSlug } from "@/lib/site-content-defaults";
export { isSitePageSlug } from "@/lib/site-content-defaults";

export function mergeSiteContent(
  slug: SitePageSlug,
  stored: Record<string, unknown> | null | undefined,
): Record<string, string> {
  const defaults = SITE_CONTENT_DEFAULTS[slug];
  const out: Record<string, string> = { ...defaults };
  if (!stored || typeof stored !== "object") return out;
  for (const k of Object.keys(defaults)) {
    const v = stored[k];
    if (typeof v === "string") out[k] = v;
  }
  for (const key of SITE_CONTENT_HERO_IMAGE_FALLBACK_KEYS[slug] ?? []) {
    if (!out[key]?.trim()) out[key] = defaults[key];
  }
  if (slug === "a-propos-galerie" && out[SITE_CONTENT_GALLERY_JSON_KEY]) {
    out[SITE_CONTENT_GALLERY_JSON_KEY] = normalizeSiteGalleryJsonString(
      out[SITE_CONTENT_GALLERY_JSON_KEY],
    );
  }
  return out;
}

export async function getMergedSiteContent(
  slug: SitePageSlug,
): Promise<Record<string, string>> {
  const defaults = SITE_CONTENT_DEFAULTS[slug];
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("site_pages")
      .select("content")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[site-content] fetch", slug, error.message);
      return { ...defaults };
    }
    return mergeSiteContent(
      slug,
      (data?.content as Record<string, unknown>) ?? undefined,
    );
  } catch (e) {
    console.error("[site-content] fetch", slug, e);
    return { ...defaults };
  }
}

/** Normalise le corps admin : une entrée string par clé connue, sinon défaut. */
export function normalizeSiteContentFromAdmin(
  slug: SitePageSlug,
  body: unknown,
): Record<string, string> | null {
  if (!body || typeof body !== "object") return null;
  const content = (body as { content?: unknown }).content;
  if (!content || typeof content !== "object") return null;

  const defaults = SITE_CONTENT_DEFAULTS[slug];
  const c = content as Record<string, unknown>;
  const out: Record<string, string> = {};

  for (const key of Object.keys(defaults)) {
    const v = c[key];
    out[key] = typeof v === "string" ? v : defaults[key];
  }

  for (const key of SITE_CONTENT_HERO_IMAGE_FALLBACK_KEYS[slug] ?? []) {
    if (!out[key]?.trim()) out[key] = defaults[key];
  }

  if (slug === "a-propos-galerie") {
    out[SITE_CONTENT_GALLERY_JSON_KEY] = normalizeSiteGalleryJsonString(
      out[SITE_CONTENT_GALLERY_JSON_KEY],
    );
  }

  return out;
}
