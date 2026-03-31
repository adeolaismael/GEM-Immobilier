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
