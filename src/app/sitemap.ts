import type { MetadataRoute } from "next";
import { getBiensPourSitemap } from "@/lib/biens";
import { SERVICE_SLUGS } from "@/lib/services-catalog";
import { getSiteUrl } from "@/lib/site-url";

/** Régénère le sitemap au plus toutes les heures (évite le conflit no-store au build). */
export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/biens", priority: 0.7 },
  { path: "/services", priority: 0.7 },
  ...SERVICE_SLUGS.map((slug) => ({
    path: `/services/${slug}`,
    priority: 0.7,
  })),
  { path: "/a-propos", priority: 0.7 },
  { path: "/a-propos/qui-sommes-nous", priority: 0.7 },
  { path: "/a-propos/mission-valeurs", priority: 0.7 },
  { path: "/contact", priority: 0.7 },
  { path: "/conseils", priority: 0.7 },
  { path: "/mentions-legales", priority: 0.7 },
  { path: "/politique-confidentialite", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl().replace(/\/$/, "");
  const biens = await getBiensPourSitemap();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority,
    })
  );

  const bienEntries: MetadataRoute.Sitemap = biens.map((bien) => ({
    url: `${baseUrl}/biens/${bien.slug}`,
    lastModified: new Date(bien.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...bienEntries];
}
