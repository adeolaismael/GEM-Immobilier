import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Sparkles,
  Scale,
  Heart,
  Lock,
  Users,
  Clock,
} from "lucide-react";
import { getMergedSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("a-propos-mission-valeurs");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

export default async function MissionValeursPage() {
  const c = await getMergedSiteContent("a-propos-mission-valeurs");

  const valeurs = [
    { title: c.valeur_0_title, desc: c.valeur_0_desc, icon: Scale },
    { title: c.valeur_1_title, desc: c.valeur_1_desc, icon: Heart },
    { title: c.valeur_2_title, desc: c.valeur_2_desc, icon: Lock },
    { title: c.valeur_3_title, desc: c.valeur_3_desc, icon: Users },
    { title: c.valeur_4_title, desc: c.valeur_4_desc, icon: Clock },
  ];

  const bandeauClass =
    "rounded-3xl bg-[#FCFAF2] p-10 text-center shadow-soft ring-1 ring-[color:var(--card-border)] md:p-16";

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-[color:var(--brand)]/5 via-transparent to-[color:var(--brand)]/10 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Link
            href="/a-propos"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition-colors hover:text-foreground"
          >
            {c.back_link}
          </Link>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{c.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-[color:var(--muted)]">{c.hero_sub}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className={bandeauClass}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--brand)]/20">
            <Target className="h-8 w-8 text-[color:var(--brand)]" strokeWidth={1.75} />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">{c.mission_h2}</h2>
          <p className="mx-auto mt-4 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-[color:var(--foreground)]">
            {c.mission_body}
          </p>
        </div>

        <div className={`${bandeauClass} mt-12 md:mt-16`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--brand)]/20">
            <Sparkles className="h-8 w-8 text-[color:var(--brand)]" strokeWidth={1.75} />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">{c.vision_h2}</h2>
          <p className="mx-auto mt-4 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-[color:var(--foreground)]">
            {c.vision_body}
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">{c.valeurs_h2}</h2>
          <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-7 text-[color:var(--foreground)]">
            {c.valeurs_intro}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {valeurs.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-[color:var(--card-border)] transition-shadow hover:shadow-lg"
                >
                  <div className="h-1 w-16 rounded-full bg-[color:var(--brand)]" />
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--brand)]/15">
                    <Icon className="h-6 w-6 text-[color:var(--brand)]" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[color:var(--foreground)]">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
