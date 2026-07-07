import type { BienPhoto } from "@/types";

/** Couverture d’abord, puis ordre croissant. */
export function sortBienPhotos(photos: BienPhoto[]): BienPhoto[] {
  return [...photos].sort((a, b) => {
    const ap = Boolean(a.est_principale);
    const bp = Boolean(b.est_principale);
    if (ap !== bp) return ap ? -1 : 1;
    return (a.ordre ?? 0) - (b.ordre ?? 0);
  });
}
