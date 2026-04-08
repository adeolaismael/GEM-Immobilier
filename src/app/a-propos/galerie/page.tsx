import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";
import { galerieAgenceFromSiteContent } from "@/lib/site-galerie";
import { getMergedSiteContent } from "@/lib/site-content";
import { GaleriePhotos } from "@/components/GaleriePhotos";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("a-propos-galerie");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

const DEF = SITE_CONTENT_DEFAULTS["a-propos-galerie"];

export default async function GaleriePage() {
  const c = await getMergedSiteContent("a-propos-galerie");
  const organigrammeUrl = (
    c.galerie_organigramme_image.trim() || DEF.galerie_organigramme_image
  ).trim();
  const photos = galerieAgenceFromSiteContent(c.galerie_images_json).filter(
    (p) => !organigrammeUrl || p.url.trim() !== organigrammeUrl,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Link
        href="/a-propos"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition-colors hover:text-foreground"
      >
        {c.back_link}
      </Link>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color:var(--brand)]/5 via-transparent to-[color:var(--brand)]/10 py-12 md:py-16">
        <div className="px-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{c.h1}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">{c.intro}</p>
        </div>
      </section>

      {organigrammeUrl ? (
        <section className="mt-12" aria-labelledby="galerie-organigramme-heading">
          {(c.galerie_organigramme_heading.trim() || DEF.galerie_organigramme_heading) ? (
            <h2
              id="galerie-organigramme-heading"
              className="text-2xl font-bold tracking-tight text-[color:var(--foreground)] md:text-3xl"
            >
              {c.galerie_organigramme_heading.trim() || DEF.galerie_organigramme_heading}
            </h2>
          ) : null}
          <div
            className={`w-full overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-[color:var(--card-border)] shadow-soft md:p-6 ${
              c.galerie_organigramme_heading.trim() || DEF.galerie_organigramme_heading
                ? "mt-6"
                : ""
            }`}
          >
            {/* img : URLs locales / Supabase sans contrainte Next/Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={organigrammeUrl}
              alt={
                c.galerie_organigramme_heading.trim() ||
                DEF.galerie_organigramme_heading ||
                "Organigramme GEM IMMOBILIER"
              }
              className="mx-auto max-h-[min(85vh,56rem)] w-auto max-w-full object-contain"
              width={1200}
              height={750}
            />
          </div>
        </section>
      ) : null}

      {(c.galerie_album_heading.trim() || DEF.galerie_album_heading) ? (
        <h2
          className={`text-2xl font-bold tracking-tight text-[color:var(--foreground)] md:text-3xl ${
            organigrammeUrl ? "mt-16" : "mt-12"
          }`}
        >
          {c.galerie_album_heading.trim() || DEF.galerie_album_heading}
        </h2>
      ) : null}

      <GaleriePhotos photos={photos} />
    </main>
  );
}
