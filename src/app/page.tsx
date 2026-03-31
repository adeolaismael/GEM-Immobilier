import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBiensLatest } from "@/lib/biens";
import { getMergedSiteContent } from "@/lib/site-content";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeFeaturedCards } from "@/components/home/HomeFeaturedCards";
import { HomeContactForm } from "@/components/home/HomeContactForm";
import { AgenceMapbox } from "@/components/AgenceMapbox";
import { getAgencyContact } from "@/lib/agence-contact";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("accueil");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

export default async function Home() {
  const [biens, c, agency] = await Promise.all([
    getBiensLatest(6),
    getMergedSiteContent("accueil"),
    getAgencyContact(),
  ]);

  const testimonials = [
    {
      title: c.t1_title,
      body: c.t1_body,
      name: c.t1_name,
      city: c.t1_city,
    },
    {
      title: c.t2_title,
      body: c.t2_body,
      name: c.t2_name,
      city: c.t2_city,
    },
  ];

  return (
    <main>
      <HomeHero
        titleLine1={c.hero_title_line1}
        titleBrand={c.hero_title_brand}
        titleLine2={c.hero_title_line2}
        subtitle={c.hero_subtitle}
        ctaBiens={c.hero_cta_biens}
        ctaContact={c.hero_cta_contact}
        imageMainSrc={c.image_hero_main}
        imageSideSrc={c.image_hero_side}
      />
      <HomeFeaturedCards biens={biens} />

      <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="rounded-3xl bg-[#f3f4f6] p-3 shadow-soft">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-200">
              {c.image_about.trim() ? (
                <Image
                  src={c.image_about}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : null}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {c.about_title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[color:var(--muted)] md:text-base">
              {c.about_body}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-extrabold text-[color:var(--brand)]">
                  {c.stat_1_value}
                </div>
                <div className="mt-1 text-sm font-semibold">{c.stat_1_label}</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[color:var(--brand)]">
                  {c.stat_2_value}
                </div>
                <div className="mt-1 text-sm font-semibold">{c.stat_2_label}</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[color:var(--brand)]">
                  {c.stat_3_value}
                </div>
                <div className="mt-1 text-sm font-semibold">{c.stat_3_label}</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[color:var(--brand)]">
                  {c.stat_4_value}
                </div>
                <div className="mt-1 text-sm font-semibold">{c.stat_4_label}</div>
              </div>
            </div>
            <Link
              href="/a-propos"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg border border-[color:var(--brand)] bg-white px-5 text-sm font-semibold text-[color:var(--brand)] hover:bg-[color:var(--brand)] hover:text-white"
            >
              {c.about_cta}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {c.testimonials_heading}
            </h2>
          </div>
          <div className="grid gap-6">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className="rounded-2xl bg-white p-6 ring-1 ring-[color:var(--card-border)] shadow-soft"
              >
                <div className="flex gap-1 text-[color:var(--brand)]" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.3l-6.2 3.6 1.6-7.1L2 9.6l7.3-.6L12 2.5l2.7 6.5 7.3.6-5.4 4.2 1.6 7.1L12 17.3z" />
                    </svg>
                  ))}
                </div>
                <h3 className="mt-4 text-base font-extrabold">
                  &ldquo;{t.title}&rdquo;
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  {t.body}
                </p>
                <div className="mt-5 text-sm font-semibold">
                  {t.name}{" "}
                  <span className="text-[color:var(--muted)]">• {t.city}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:pb-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {c.cta_section_title}
            </h2>
            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--card-border)] shadow-soft">
                <div className="text-sm text-[color:var(--muted)]">{c.phone_label}</div>
                <ul className="mt-2 space-y-2">
                  {agency.phones.map((p) => (
                    <li key={p.href}>
                      <a
                        href={p.href}
                        className="block text-base font-extrabold text-[color:var(--foreground)] hover:text-[color:var(--brand)]"
                      >
                        {p.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-[color:var(--card-border)] shadow-soft">
                <div className="text-sm text-[color:var(--muted)]">{c.email_label}</div>
                <a
                  href={`mailto:${agency.email}`}
                  className="mt-1 inline-block text-base font-extrabold hover:text-[color:var(--brand)]"
                >
                  {agency.email}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 ring-1 ring-[color:var(--card-border)] shadow-soft">
            <HomeContactForm
              submitLabel={c.home_form_send}
              successMessage={c.home_form_success}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:pb-28">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {agency.mapSectionTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
          {agency.mapSectionIntro}
        </p>
        <address className="mt-4 not-italic text-sm font-medium text-[color:var(--foreground)] md:text-base">
          {agency.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <AgenceMapbox
          className="mt-8 w-full"
          height={400}
          latitude={agency.mapCenter.lat}
          longitude={agency.mapCenter.lng}
          addressLines={agency.addressLines}
        />
      </section>
    </main>
  );
}
