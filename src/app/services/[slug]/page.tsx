import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceDetailBlocks } from "@/components/ServiceDetailBlocks";
import {
  SERVICE_ICONS,
  SERVICE_SLUGS,
  isServiceSlug,
  type ServiceSlug,
} from "@/lib/services-catalog";
import { SERVICE_DETAILS } from "@/lib/services-detail-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  if (!isServiceSlug(raw)) {
    return { title: "Service introuvable" };
  }
  const d = SERVICE_DETAILS[raw];
  return {
    title: d.title,
    description: d.metaDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug: raw } = await params;
  if (!isServiceSlug(raw)) notFound();

  const slug: ServiceSlug = raw;
  const detail = SERVICE_DETAILS[slug];
  const Icon = SERVICE_ICONS[slug];

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-[color:var(--brand)]/5 via-transparent to-[color:var(--brand)]/10 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Link
            href="/services"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition-colors hover:text-foreground"
          >
            ← Retour aux services
          </Link>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{detail.title}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Détail des prestations</h2>
            <ServiceDetailBlocks blocks={detail.blocks} />
          </div>
          <div className="relative md:sticky md:top-24">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[color:var(--brand)]/10 to-[color:var(--brand)]/5 shadow-lg ring-1 ring-[color:var(--card-border)]">
              <div className="flex h-full min-h-[240px] items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[color:var(--brand)]/15">
                    <Icon
                      className="h-14 w-14 text-[color:var(--brand)]"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-6 text-sm font-medium text-[color:var(--muted)]">
                    {detail.figureCaption}
                  </p>
                  <p className="mt-2 text-xs text-[color:var(--muted)]">GEM Immobilier</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--brand)] px-8 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-95"
          >
            Nous contacter pour ce service
          </Link>
        </div>
      </section>
    </main>
  );
}
