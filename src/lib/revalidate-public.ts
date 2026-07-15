import { revalidatePath } from "next/cache";
import type { SitePageSlug } from "@/lib/site-content-defaults";

const SITE_PAGE_PATHS: Record<SitePageSlug, string | string[]> = {
  accueil: "/",
  biens: "/biens",
  services: "/services",
  contact: "/contact",
  "a-propos": "/a-propos",
  "a-propos-qui-sommes-nous": "/a-propos/qui-sommes-nous",
  "a-propos-mission-valeurs": "/a-propos/mission-valeurs",
  "a-propos-galerie": "/a-propos/galerie",
  "mentions-legales": "/mentions-legales",
  "politique-confidentialite": "/politique-confidentialite",
  // Affiché dans le footer / accueil / contact sur tout le site
  "coordonnees-agence": "/",
};

/** Invalide le cache des pages publiques après une modification admin. */
export function revalidatePublicSite(): void {
  revalidatePath("/", "layout");
}

export function revalidateSitePage(slug: SitePageSlug): void {
  const paths = SITE_PAGE_PATHS[slug];
  const list = Array.isArray(paths) ? paths : [paths];
  for (const path of list) {
    revalidatePath(path);
  }
  // Footer / header partagés
  if (slug === "coordonnees-agence") {
    revalidatePath("/", "layout");
  }
}

export function revalidateBiensPublic(): void {
  revalidatePath("/");
  revalidatePath("/biens", "layout");
  revalidatePath("/sitemap.xml");
}

export function revalidateArticlesPublic(): void {
  revalidatePath("/");
  revalidatePath("/conseils", "layout");
  revalidatePath("/sitemap.xml");
}
