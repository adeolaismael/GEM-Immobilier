import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getBiens } from "@/lib/biens";
import { getMergedSiteContent } from "@/lib/site-content";
import { SEO_PAGES } from "@/lib/seo";
import { FiltresBiens } from "@/components/FiltresBiens";
import { BiensListeCarteToggle } from "@/components/BiensListeCarteToggle";

export const metadata: Metadata = {
  title: { absolute: SEO_PAGES.biens.title },
  description: SEO_PAGES.biens.description,
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BiensPage({ searchParams }: Props) {
  const [params, c] = await Promise.all([searchParams, getMergedSiteContent("biens")]);

  const filtres = {
    recherche: typeof params.recherche === "string" ? params.recherche : undefined,
    type: typeof params.type === "string" ? params.type : undefined,
    statut: typeof params.statut === "string" ? params.statut : undefined,
    prix_min: typeof params.prix_min === "string" ? params.prix_min : undefined,
    prix_max: typeof params.prix_max === "string" ? params.prix_max : undefined,
    nb_pieces: typeof params.nb_pieces === "string" ? params.nb_pieces : undefined,
  };
  const biens = await getBiens(filtres);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="max-w-2xl">
        <p className="text-sm text-[color:var(--muted)]">{c.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{c.h1}</h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">{c.intro}</p>
      </div>

      <Suspense fallback={<div className="mt-10 h-32 animate-pulse rounded-2xl bg-gray-100" />}>
        <div className="mt-10">
          <FiltresBiens />
        </div>
      </Suspense>

      <p className="mt-6 text-sm text-[color:var(--muted)]">
        {biens.length > 0 &&
          `${biens.length} bien${biens.length > 1 ? "s" : ""} trouvé${biens.length > 1 ? "s" : ""}`}
      </p>

      {biens.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white/50 p-8 text-center ring-1 ring-[color:var(--card-border)]">
          <p className="text-base font-medium text-foreground">
            Aucun bien ne correspond à votre recherche.
          </p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Contactez-nous pour nous parler de votre projet.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--brand)] px-6 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-95"
          >
            Nous contacter
          </Link>
        </div>
      ) : (
        <BiensListeCarteToggle biens={biens} resultsKey={JSON.stringify(filtres)} />
      )}
    </main>
  );
}
