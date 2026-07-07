/** Stockage Supabase : sous-dossier pour l’organigramme (hors album). */
export const GALERIE_ORGANIGRAMME_STORAGE_FOLDER = "organigramme";

/** Stockage Supabase : toutes les autres photos de la galerie (hors organigramme). */
export const GALERIE_ALBUM_STORAGE_FOLDER = "galerie-album";

export type GaleriePhotoRow = { id: string; url: string; bien_id: string };

export type SiteGalleryEntry = { id: string; url: string };

export function parseSiteGalleryJson(jsonStr: string): SiteGalleryEntry[] {
  try {
    const raw = JSON.parse(jsonStr || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((x) => x && typeof x.url === "string" && x.url.trim())
      .map((x, i) => ({
        id:
          typeof x.id === "string" && x.id
            ? x.id
            : `site-${i}-${String(x.url).slice(-24)}`,
        url: String(x.url).trim(),
      }));
  } catch {
    return [];
  }
}

export function normalizeSiteGalleryJsonString(input: string): string {
  const list = parseSiteGalleryJson(input);
  return JSON.stringify(list);
}

/** Galerie « À propos » : uniquement les images définies dans le contenu du site (admin), pas les biens. */
export function galerieAgenceFromSiteContent(jsonStr: string): GaleriePhotoRow[] {
  return parseSiteGalleryJson(jsonStr).map((p) => ({
    id: p.id,
    url: p.url,
    bien_id: "agence",
  }));
}
