import type { Metadata } from "next";
import { getMergedSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("mentions-legales");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

export default async function MentionsLegalesPage() {
  const c = await getMergedSiteContent("mentions-legales");

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <p className="text-sm text-[color:var(--muted)]">{c.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{c.h1}</h1>

      <div className="prose prose-invert mt-8 max-w-none">
        <div className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-[color:var(--card-border)]">
          <h2>{c.ml_editeur_h2}</h2>
          <p>
            <strong>{c.ml_editeur_strong}</strong>
            <br />
            {c.ml_editeur_adresse}
            <br />
            {c.ml_editeur_tel}
            <br />
            {c.ml_editeur_email}
          </p>

          <h2>{c.ml_hebergement_h2}</h2>
          <p>{c.ml_hebergement_p}</p>

          <h2>{c.ml_pi_h2}</h2>
          <p>{c.ml_pi_p}</p>

          <h2>{c.ml_donnees_h2}</h2>
          <p>{c.ml_donnees_p}</p>
        </div>
      </div>
    </main>
  );
}
