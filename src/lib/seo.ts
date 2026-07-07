import { sortBienPhotos } from "@/lib/bien-photos";
import { getSiteUrl } from "@/lib/site-url";
import type { Bien } from "@/types";

export const SEO_PAGES = {
  accueil: {
    title: "GEM Immobilier | Agence immobilière agréée à Abidjan depuis 2014",
    description:
      "GEM Immobilier, agence agréée à Abidjan depuis 2014. Achat, vente, location, administration de biens et gestion locative en Côte d'Ivoire. Contactez-nous.",
  },
  biens: {
    title: "Nos offres immobilières | GEM Immobilier Abidjan",
    description:
      "Découvrez nos biens disponibles à Abidjan et en Côte d'Ivoire : appartements, villas, terrains à vendre ou à louer. GEM Immobilier, agence agréée depuis 2014.",
  },
  services: {
    title: "Nos services | GEM Immobilier Abidjan",
    description:
      "Administration de biens, gestion locative, estimation immobilière, vente et location à Abidjan. GEM Immobilier vous accompagne dans tous vos projets immobiliers en Côte d'Ivoire.",
  },
  contact: {
    title: "Nous contacter | GEM Immobilier Abidjan",
    description:
      "Contactez GEM Immobilier à Abidjan pour toute demande d'information sur nos biens, notre gestion locative ou administration de biens en Côte d'Ivoire.",
  },
  aPropos: {
    title: "À propos | GEM Immobilier Abidjan",
    description:
      "GEM Immobilier, agence immobilière agréée par le Ministère de la Construction en Côte d'Ivoire depuis 2014. Membre CDAIM et CCIF-CI.",
  },
  quiSommesNous: {
    title: "Qui sommes-nous | GEM Immobilier Abidjan",
    description:
      "Découvrez GEM Immobilier, agence agréée à Abidjan depuis 2014. Administration de biens, gestion locative et transactions immobilières en Côte d'Ivoire.",
  },
  missionValeurs: {
    title: "Mission & Valeurs | GEM Immobilier Abidjan",
    description:
      "Clarté, efficacité et sécurité : les valeurs de GEM Immobilier, votre partenaire de confiance pour l'administration de biens et la gestion locative à Abidjan.",
  },
  conseils: {
    title: "Conseils & Expertise | GEM Immobilier Abidjan",
    description:
      "Articles et cas d'expertise immobilière par GEM Immobilier : conseils achat, vente, location et gestion de biens à Abidjan et en Côte d'Ivoire.",
  },
} as const;

export function truncateText(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function getBienPrincipalePhotoUrl(bien: Bien): string | undefined {
  const photos = sortBienPhotos(bien.bien_photos ?? []);
  const url = photos[0]?.url;
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, getSiteUrl()).toString();
}

export function buildBienSeoDescription(bien: Bien): string {
  const fallback = `Bien immobilier ${bien.type === "location" ? "à louer" : "à vendre"}${
    bien.ville ? ` à ${bien.ville}` : ""
  }`;
  const source = bien.description?.trim() || fallback;
  const truncated = truncateText(source, 155);
  return `${truncated} - GEM Immobilier, agence agréée à Abidjan, Côte d'Ivoire.`;
}

export function buildBienSeoTitle(titre: string): string {
  return `${titre} | GEM Immobilier Abidjan`;
}
