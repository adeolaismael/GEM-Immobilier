"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Photo = { id: string; url: string; bien_id: string };

type Props = {
  photos: Photo[];
};

export function GaleriePhotos({ photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--brand)]/5 to-[color:var(--brand)]/10 ring-1 ring-[color:var(--card-border)]"
          >
            <span className="text-4xl text-[color:var(--brand)]/30">—</span>
          </div>
        ))}
        <p className="col-span-full mt-6 text-center text-sm text-[color:var(--muted)]">
          Photos bientôt disponibles
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {photos.map((photo, idx) => (
          <motion.button
            key={photo.id}
            type="button"
            onClick={() => setLightboxIndex(idx)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-[color:var(--card-border)] transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Image
              src={photo.url}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fermer"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div
              className="relative h-[90vh] w-[90vw] max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[lightboxIndex].url}
                alt=""
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/70">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
