import type { Metadata } from "next";
import Link from "next/link";
import { getMergedSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("a-propos");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

export default async function AproposPage() {
  const c = await getMergedSiteContent("a-propos");

  const cards = [
    {
      href: "/a-propos/qui-sommes-nous",
      title: c.card_qui_title,
      description: c.card_qui_desc,
    },
    {
      href: "/a-propos/mission-valeurs",
      title: c.card_mission_title,
      description: c.card_mission_desc,
    },
    {
      href: "/a-propos/galerie",
      title: c.card_galerie_title,
      description: c.card_galerie_desc,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="text-sm text-[color:var(--muted)]">{c.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{c.h1}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">{c.intro}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-[color:var(--card-border)] shadow-soft transition-shadow hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--brand)]">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{card.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--brand)]">
              {c.card_link}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
