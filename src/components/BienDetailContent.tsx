"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CarteMapbox } from "./CarteMapbox";
import { sortBienPhotos } from "@/lib/bien-photos";
import type { Bien, BienPhoto } from "@/types";

function StatutBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; className: string }> = {
    disponible: {
      label: "Disponible",
      className: "bg-emerald-100 text-emerald-800",
    },
    sous_compromis: {
      label: "Sous compromis",
      className: "bg-amber-100 text-amber-800",
    },
    vendu: { label: "Vendu", className: "bg-red-100 text-red-800" },
    loue: { label: "Loué", className: "bg-red-100 text-red-800" },
  };
  const { label, className } =
    config[statut] ?? {
      label: statut.replace("_", " "),
      className: "bg-gray-100 text-gray-700",
    };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

type Props = {
  bien: Bien;
};

export function BienDetailContent({ bien }: Props) {
  const reduceMotion = useReducedMotion();
  const photos = useMemo(
    () => sortBienPhotos(bien.bien_photos ?? []),
    [bien.bien_photos, bien.id],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [bien.id, photos.length]);

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? photos.length - 1 : i - 1));
  }, [photos.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= photos.length - 1 ? 0 : i + 1));
  }, [photos.length]);

  function scrollThumbs(dir: -1 | 1) {
    stripRef.current?.scrollBy({
      left: dir * Math.min(280, stripRef.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  }

  const photo = photos[activeIndex];
  const localisation =
    bien.adresse ??
    [bien.ville, bien.quartier].filter(Boolean).join(" • ");
  const hasCoords =
    bien.latitude != null &&
    bien.longitude != null &&
    !Number.isNaN(bien.latitude) &&
    !Number.isNaN(bien.longitude);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/biens"
        className="mb-6 inline-block text-sm text-[color:var(--muted)] transition-colors hover:text-foreground"
      >
        ← Retour aux biens
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div
          className="flex min-w-0 flex-col gap-3"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="group relative h-[320px] w-full max-w-full overflow-hidden rounded-xl bg-gray-100 outline-none ring-[color:var(--brand)] focus-visible:ring-2 md:h-[420px]"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null || photos.length < 2) return;
              const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
              const dx = endX - touchStartX.current;
              if (dx > 56) goPrev();
              else if (dx < -56) goNext();
              touchStartX.current = null;
            }}
            onKeyDown={(e) => {
              if (photos.length < 2) return;
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
              }
              if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
              }
            }}
            role={photos.length > 1 ? "region" : undefined}
            aria-roledescription={photos.length > 1 ? "Galerie photos" : undefined}
            aria-label={photos.length > 1 ? "Photos du bien : tabulation puis flèches, ou glisser" : undefined}
            tabIndex={photos.length > 1 ? 0 : undefined}
          >
            {photo ? (
              <Image
                key={photo.id}
                src={photo.url}
                alt={bien.titre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[color:var(--muted)]">
                Aucune photo disponible
              </div>
            )}

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-80 shadow-md backdrop-blur-sm transition-opacity hover:opacity-100 md:left-3 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Photo précédente"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-80 shadow-md backdrop-blur-sm transition-opacity hover:opacity-100 md:right-3 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Photo suivante"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {activeIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>

          {photos.length > 1 && (
            <div className="relative min-w-0">
              <button
                type="button"
                onClick={() => scrollThumbs(-1)}
                className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-md ring-1 ring-black/10 sm:flex"
                aria-label="Faire défiler les miniatures vers la gauche"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollThumbs(1)}
                className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-md ring-1 ring-black/10 sm:flex"
                aria-label="Faire défiler les miniatures vers la droite"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div
                ref={stripRef}
                className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-1 pb-2 pt-1 [scrollbar-width:thin] sm:px-10"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {photos.map((p, idx) => (
                  <button
                    key={p.id}
                    ref={(el) => {
                      thumbRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative h-16 w-[5.5rem] shrink-0 snap-center snap-always overflow-hidden rounded-lg ring-2 transition-shadow ${
                      idx === activeIndex
                        ? "ring-[color:var(--brand)]"
                        : "ring-transparent hover:ring-black/20"
                    } ${p.est_principale ? "ring-offset-2 ring-offset-amber-100/50" : ""}`}
                    aria-label={`Photo ${idx + 1}${p.est_principale ? ", couverture" : ""}`}
                    aria-current={idx === activeIndex ? "true" : undefined}
                  >
                    <Image
                      src={p.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="88px"
                    />
                  </button>
                ))}
              </div>
              <p className="mt-1 text-center text-xs text-[color:var(--muted)] sm:hidden">
                Faites défiler les vignettes · glissez sur la grande photo
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="flex min-w-0 flex-col"
          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-xl font-bold md:text-2xl">{bien.titre}</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {localisation || "Localisation à préciser"}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <StatutBadge statut={bien.statut} />
            {(bien.type !== "location" || bien.statut !== "loue") && (
              <span className="text-sm text-[color:var(--muted)]">
                {bien.type === "location" ? "À louer" : "À vendre"}
              </span>
            )}
          </div>
          <p className="mt-4 text-2xl font-bold text-[color:var(--brand)]">
            {bien.prix === 0
              ? "Prix sur demande"
              : new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                  maximumFractionDigits: 0,
                }).format(bien.prix)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {bien.surface != null && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-sm">
                {bien.surface} m²
              </span>
            )}
            {bien.nb_pieces != null && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-sm">
                {bien.nb_pieces} pièces
              </span>
            )}
            {bien.nb_chambres != null && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-sm">
                {bien.nb_chambres} chambres
              </span>
            )}
            {bien.nb_salles_de_bain != null && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-sm">
                {bien.nb_salles_de_bain} SdB
              </span>
            )}
          </div>
          {bien.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-[color:var(--muted)]">
                Description
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {bien.description}
              </p>
            </div>
          )}
          <Link
            href={`/contact?bien_id=${bien.id}&titre=${encodeURIComponent(bien.titre)}`}
            className="group relative mt-8 inline-flex h-11 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--brand)] px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Nous contacter pour ce bien</span>
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0.5 }}
              whileHover={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ borderRadius: "9999px" }}
            />
          </Link>
        </motion.div>
      </div>

      {hasCoords && (
        <motion.section
          className="mt-12"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="mb-4 text-base font-semibold">Localisation</h2>
          <CarteMapbox
            biens={[bien]}
            center={{ lng: bien.longitude!, lat: bien.latitude! }}
            zoom={14}
            height={250}
            single
          />
        </motion.section>
      )}
    </main>
  );
}
