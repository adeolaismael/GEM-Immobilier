import type { Metadata } from "next";
import Link from "next/link";
import {
  SERVICE_ICONS,
  SERVICE_SLUGS,
} from "@/lib/services-catalog";
import { getMergedSiteContent } from "@/lib/site-content";
import { SEO_PAGES } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: SEO_PAGES.services.title },
  description: SEO_PAGES.services.description,
};

export default async function ServicesPage() {
  const c = await getMergedSiteContent("services");

  const services = SERVICE_SLUGS.map((slug, i) => ({
    slug,
    icon: SERVICE_ICONS[slug],
    title: c[`service_${i}_title`],
    points: [0, 1, 2].map((j) => c[`service_${i}_point_${j}`]),
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="max-w-2xl">
        <p className="text-sm text-[color:var(--muted)]">{c.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{c.h1}</h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">{c.intro}</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <section
              key={s.slug}
              className="flex flex-col rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-[color:var(--card-border)]"
            >
              <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)]/15">
                <Icon
                  className="h-7 w-7 text-[color:var(--brand)]"
                  strokeWidth={1.75}
                />
              </div>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-[color:var(--muted)]">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${s.slug}`}
                className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[color:var(--brand)] bg-transparent text-sm font-semibold text-[color:var(--brand)] transition-colors hover:bg-[color:var(--brand)] hover:text-white"
              >
                Détail
              </Link>
            </section>
          );
        })}
      </div>
    </main>
  );
}
