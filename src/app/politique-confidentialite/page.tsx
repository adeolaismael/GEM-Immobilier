import type { Metadata } from "next";
import Link from "next/link";
import { getMergedSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("politique-confidentialite");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

export default async function PolitiqueConfidentialitePage() {
  const c = await getMergedSiteContent("politique-confidentialite");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-foreground"
      >
        {c.back_link}
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{c.h1}</h1>
      <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
        {c.intro_note_prefix} {new Date().toLocaleDateString("fr-FR")}
      </p>

      <div className="mt-10 space-y-6 text-base leading-7">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
      </div>
    </main>
  );
}
