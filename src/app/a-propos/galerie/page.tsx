import type { Metadata } from "next";
import Link from "next/link";
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

export default async function GaleriePage() {
  const c = await getMergedSiteContent("a-propos-galerie");
  const photos = galerieAgenceFromSiteContent(c.galerie_images_json);

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

      <GaleriePhotos photos={photos} />
    </main>
  );
}
