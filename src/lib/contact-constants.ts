export const CONTACT_SERVICES = [
  "Administration de biens",
  "Suivi juridique et fiscal",
  "Recherche de biens",
  "Conciergerie et travaux",
  "Estimation immobilière",
  "Vente de biens",
  "Autre",
] as const;

export type ContactService = (typeof CONTACT_SERVICES)[number];

export const HOME_PROPERTY_TYPES = [
  "Appartement",
  "Villa",
  "Terrain",
  "Bureau",
  "Autre",
] as const;

export const HOME_TRANSACTION_TYPES = ["Achat", "Location"] as const;

export const HOME_BUDGETS = [
  "Moins de 50M",
  "50M-100M",
  "100M-300M",
  "300M-500M",
  "Plus de 500M F CFA",
] as const;
