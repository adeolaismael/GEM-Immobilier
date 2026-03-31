import type { Metadata } from "next";
import Link from "next/link";
import {
  SERVICE_ICONS,
  SERVICE_SLUGS,
} from "@/lib/services-catalog";
import { getMergedSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("services");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

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

      <div className="mt-12 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 md:flex md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold">{c.cta_title}</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{c.cta_body}</p>
        </div>
        <div className="mt-4 flex gap-3 md:mt-0">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
          >
            {c.cta_btn_contact}
          </Link>
          <Link
            href="/biens"
            className="inline-flex h-11 items-center justify-center rounded-full bg-white/10 px-5 text-sm font-medium ring-1 ring-white/15 hover:bg-white/15"
          >
            {c.cta_btn_biens}
          </Link>
        </div>
      </div>
    </main>
  );
}
