import type { ContactService } from "@/lib/contact-constants";
import type { ServiceSlug } from "@/lib/services-catalog";

/** Libellé formulaire contact pour chaque page détail service. */
export const SERVICE_CONTACT_LABELS: Record<ServiceSlug, ContactService> = {
  "administration-de-biens": "Administration de biens",
  "gestion-juridique-fiscale": "Suivi juridique et fiscal",
  "recherche-biens": "Recherche de biens",
  "conciergerie-travaux": "Conciergerie et travaux",
  "estimation-immobilier": "Estimation immobilière",
  "vente-biens": "Vente de biens",
};

export function getServiceContactLabel(slug: ServiceSlug): ContactService {
  return SERVICE_CONTACT_LABELS[slug];
}

export function buildServiceContactUrl(slug: ServiceSlug, titre: string): string {
  const service = getServiceContactLabel(slug);
  const params = new URLSearchParams({
    service,
    titre,
  });
  return `/contact?${params.toString()}`;
}
