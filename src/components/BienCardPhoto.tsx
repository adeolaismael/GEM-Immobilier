"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { sortBienPhotos } from "@/lib/bien-photos";
import type { BienPhoto } from "@/types";

const INTERVAL_MS = 1500;

type Props = {
  photos: BienPhoto[];
  titre: string;
  imageContainerClass?: string;
  isHovered?: boolean;
};

export function BienCardPhoto({
  photos,
  titre,
  imageContainerClass = "relative h-44 w-full overflow-hidden rounded-t-2xl",
  isHovered: isHoveredProp,
}: Props) {
  const sorted = sortBienPhotos(photos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = isHoveredProp ?? internalHovered;

  const hasMultiple = sorted.length > 1;
  const currentPhoto = sorted[currentIndex];

  useEffect(() => {
    if (!hasMultiple || !isHovered) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sorted.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasMultiple, isHovered, sorted.length]);

  useEffect(() => {
    if (!isHovered) setCurrentIndex(0);
  }, [isHovered]);

  const handleMouseEnter = useCallback(() => setInternalHovered(true), []);
  const handleMouseLeave = useCallback(() => setInternalHovered(false), []);

  const needsOwnHover = isHoveredProp === undefined;

  if (sorted.length === 0) {
    return (
      <div
        className={imageContainerClass}
        onMouseEnter={needsOwnHover ? handleMouseEnter : undefined}
        onMouseLeave={needsOwnHover ? handleMouseLeave : undefined}
      >
        <div className="flex h-full items-center justify-center bg-[#f3f4f6] text-xs text-[color:var(--muted)]">
          Aucune photo
        </div>
      </div>
    );
  }

  return (
    <div
      className={imageContainerClass}
      onMouseEnter={needsOwnHover ? handleMouseEnter : undefined}
      onMouseLeave={needsOwnHover ? handleMouseLeave : undefined}
    >
      <div className="relative h-full w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={currentPhoto.url}
              alt={titre}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
