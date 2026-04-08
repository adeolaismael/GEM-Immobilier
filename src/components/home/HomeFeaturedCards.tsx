"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type { Bien } from "@/types";

function getPrincipalePhotoUrl(bien: Bien): string | null {
  const photos = bien.bien_photos ?? [];
  const principale =
    photos.find((p) => p.est_principale) ??
    photos.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))[0];
  return principale?.url ?? null;
}

function formatPrix(prix: number): string {
  if (prix === 0) return "Prix sur demande";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(prix);
}

type Props = {
  biens: Bien[];
};

export function HomeFeaturedCards({ biens }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Offres à la une
        </h2>
        <Link
          href="/biens"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[color:var(--brand)] px-5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-[0.98] md:inline-flex"
        >
          Parcourir toutes les propriétés
        </Link>
      </div>

      {biens.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white/50 p-8 text-center ring-1 ring-[color:var(--card-border)]">
          <p className="text-sm text-[color:var(--muted)]">
            Aucun bien à afficher pour le moment.
          </p>
          <Link
            href="/biens"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-[color:var(--brand)] px-5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02]"
          >
            Voir tous les biens
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {biens.map((bien, idx) => {
            const photoUrl = getPrincipalePhotoUrl(bien);
            const villeQuartier = [bien.ville, bien.quartier]
              .filter(Boolean)
              .join(" • ");

            return (
              <motion.article
                key={bien.id}
                initial={
                  reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : idx * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group rounded-2xl bg-white ring-1 ring-[color:var(--card-border)] shadow-soft transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/biens/${bien.slug}`}>
                  <div className="relative">
                    <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={bien.titre}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#f3f4f6] text-xs text-[color:var(--muted)]">
                          Aucune photo
                        </div>
                      )}
                    </div>
                    <span className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--muted)] shadow-soft">
                      {bien.statut === "loue"
                        ? "Indisponible"
                        : bien.type === "location"
                          ? "À louer"
                          : "À vendre"}
                    </span>
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold">{bien.titre}</h3>
                    <div className="text-sm font-bold text-[color:var(--brand)]">
                      {formatPrix(bien.prix)}
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
                    {villeQuartier || "Localisation à préciser"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                    {bien.surface && (
                      <span className="inline-flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 20V10l8-6 8 6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {bien.surface} m²
                      </span>
                    )}
                    {bien.nb_pieces != null && (
                      <span className="inline-flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {bien.nb_pieces} pièces
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/biens/${bien.slug}`}
                    className="mt-4 inline-flex text-sm font-medium text-[color:var(--foreground)] underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-[color:var(--brand)]"
                  >
                    Voir le détail
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {biens.length > 0 && (
        <div className="mt-8 md:hidden">
          <Link
            href="/biens"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[color:var(--brand)] px-5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Parcourir toutes les propriétés
          </Link>
        </div>
      )}
    </section>
  );
}
