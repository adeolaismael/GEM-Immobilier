const DEFAULT_SITE = "https://example.com";

/**
 * URL publique du site (env Vercel, etc.).
 * Accepte `https://domaine.ci` ou seulement `domaine.ci` — le préfixe https:// est ajouté si absent.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!raw) return DEFAULT_SITE;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}
