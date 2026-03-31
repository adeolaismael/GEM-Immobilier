import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/lib/services-catalog";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl().replace(/\/$/, "");
  const now = new Date();

  const routes = [
    "/",
    "/services",
    ...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
    "/biens",
    "/a-propos",
    "/contact",
    "/mentions-legales",
  ];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

