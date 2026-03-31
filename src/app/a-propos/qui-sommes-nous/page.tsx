import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Award, Users } from "lucide-react";
import { getMergedSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("a-propos-qui-sommes-nous");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

export default async function QuiSommesNousPage() {
  const c = await getMergedSiteContent("a-propos-qui-sommes-nous");

  const chiffres = [
    { label: c.chiffre_1, icon: Calendar },
    { label: c.chiffre_2, icon: Award },
    { label: c.chiffre_3, icon: Users },
  ];

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
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{c.histoire_h2}</h2>
            <div className="mt-6 space-y-6 text-base leading-7 text-[color:var(--foreground)]">
              <p>{c.histoire_p1}</p>
              <p>{c.histoire_p2}</p>
              <p>{c.histoire_p3}</p>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[color:var(--brand)]/10 to-[color:var(--brand)]/5 shadow-lg ring-1 ring-[color:var(--card-border)]">
              {c.image_histoire.trim() ? (
                <>
                  <Image
                    src={c.image_histoire}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <p className="absolute bottom-0 left-0 right-0 bg-black/45 px-4 py-2 text-center text-sm text-white">
                    {c.figure_caption}
                  </p>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--brand)]/15">
                      <span className="text-4xl font-bold text-[color:var(--brand)]">GEM</span>
                    </div>
                    <p className="mt-4 text-sm text-[color:var(--muted)]">{c.figure_caption}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {chiffres.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-[color:var(--card-border)] transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--brand)]/15">
                  <Icon className="h-6 w-6 text-[color:var(--brand)]" strokeWidth={1.75} />
                </div>
                <p className="mt-4 font-semibold text-[color:var(--foreground)]">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
