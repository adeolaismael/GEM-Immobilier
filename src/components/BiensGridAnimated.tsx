"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { BienCardPhoto } from "./BienCardPhoto";
import type { Bien } from "@/types";

function BiensGridCardItem({
  bien,
  idx,
  reduceMotion,
}: {
  bien: Bien;
  idx: number;
  reduceMotion: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const photos = bien.bien_photos ?? [];
  const villeQuartier = [bien.ville, bien.quartier].filter(Boolean).join(" • ");

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={reduceMotion ? false : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: idx * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-[color:var(--card-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-40 overflow-hidden rounded-xl bg-[#f3f4f6] ring-1 ring-black/5 shadow-soft">
        <BienCardPhoto
          photos={photos}
          titre={bien.titre}
          isHovered={isHovered}
          imageContainerClass="absolute inset-0 h-full w-full"
        />
      </div>
      <h2 className="mt-5 text-lg font-semibold">{bien.titre}</h2>
      <p className="mt-1 text-sm text-[color:var(--muted)]">
        {villeQuartier || "Localisation à préciser"}
      </p>
      <p className="mt-4 text-sm font-medium text-[color:var(--brand)]">
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XOF",
          maximumFractionDigits: 0,
        }).format(bien.prix)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
        <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
          {bien.type === "location" ? "À louer" : "À vendre"}
        </span>
        <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
          Statut : {bien.statut.replace("_", " ")}
        </span>
        {bien.surface && (
          <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            {bien.surface} m²
          </span>
        )}
        {bien.nb_pieces && (
          <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            {bien.nb_pieces} pièces
          </span>
        )}
      </div>
      <Link
        href={`/biens/${bien.slug}`}
        className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-white/50"
      >
        Voir le détail
      </Link>
    </motion.article>
  );
}

type Props = {
  biens: Bien[];
};

export function BiensGridAnimated({ biens }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {biens.map((bien, idx) => (
        <BiensGridCardItem
          key={bien.id}
          bien={bien}
          idx={idx}
          reduceMotion={reduceMotion ?? false}
        />
      ))}
    </div>
  );
}
