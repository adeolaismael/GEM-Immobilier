"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

const services = [
  "SUIVI / GESTION JURIDIQUE ET FISCALE DES BIENS",
  "RECHERCHE ET MISE À DISPOSITION DE BIENS À ACHETER ET À LOUER",
  "ADMINISTRATIONS DE BIENS",
  "ESTIMATION DE BIEN IMMOBILIER",
  "VENTE DE BIENS IMMOBILIERS",
  "CONCIERGERIE ET SUIVI DES TRAVAUX",
];

export function HomeServicesCards() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s, idx) => (
          <motion.article
            key={`${s}-${idx}`}
            initial={
              reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={reduceMotion ? undefined : { once: true, margin: "-50px" }}
            transition={{
              duration: reduceMotion ? 0 : 0.4,
              delay: reduceMotion ? 0 : idx * 0.06,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-[color:var(--card-border)] shadow-soft"
          >
            <div className="relative h-44">
              <Image
                src={`/placeholders/listing-${(idx % 3) + 1}.svg`}
                alt={`Illustration fictive: ${s}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wide">
                {s}
              </h3>
              <Link
                href="/services"
                className="inline-flex h-7 items-center justify-center rounded-full bg-[#1f2937] px-3 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Voir plus
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
