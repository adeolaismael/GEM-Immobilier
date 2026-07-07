import type { BienStatut } from "@/types";

export function isBienIndisponible(statut: BienStatut | string): boolean {
  return statut === "vendu" || statut === "loue";
}

export function getStatutFiligraneLabel(
  statut: BienStatut | string
): "VENDU" | "LOUÉ" | null {
  if (statut === "vendu") return "VENDU";
  if (statut === "loue") return "LOUÉ";
  return null;
}
