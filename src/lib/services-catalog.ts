import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Scale,
  Search,
  Wrench,
  Calculator,
  Handshake,
} from "lucide-react";

/** Ordre identique à la page Services (grille). */
export const SERVICE_SLUGS = [
  "administration-de-biens",
  "gestion-juridique-fiscale",
  "recherche-biens",
  "conciergerie-travaux",
  "estimation-immobilier",
  "vente-biens",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export function isServiceSlug(s: string): s is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(s);
}

export const SERVICE_ICONS: Record<ServiceSlug, LucideIcon> = {
  "administration-de-biens": Building2,
  "gestion-juridique-fiscale": Scale,
  "recherche-biens": Search,
  "conciergerie-travaux": Wrench,
  "estimation-immobilier": Calculator,
  "vente-biens": Handshake,
};
