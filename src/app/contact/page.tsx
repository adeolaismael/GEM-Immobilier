import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { getAgencyContact } from "@/lib/agence-contact";
import { getMergedSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getMergedSiteContent("contact");
  return {
    title: c.meta_title,
    description: c.meta_description,
  };
}

export default async function ContactPage() {
  const [c, agency] = await Promise.all([
    getMergedSiteContent("contact"),
    getAgencyContact(),
  ]);

  const formTexts = {
    form_title: c.form_title,
    form_intro: c.form_intro,
    form_concern_prefix: c.form_concern_prefix,
    form_success: c.form_success,
    label_nom: c.label_nom,
    placeholder_nom: c.placeholder_nom,
    label_email: c.label_email,
    placeholder_email: c.placeholder_email,
    label_tel: c.label_tel,
    placeholder_tel: c.placeholder_tel,
    label_sujet: c.label_sujet,
    placeholder_sujet: c.placeholder_sujet,
    label_message: c.label_message,
    placeholder_message: c.placeholder_message,
    form_submit: c.form_submit,
    form_submit_loading: c.form_submit_loading,
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <div className="max-w-xl">
          <p className="text-sm text-[color:var(--muted)]">{c.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {c.h1}
          </h1>
          <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">{c.intro}</p>

          <div className="mt-8 rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-[color:var(--card-border)]">
            <h2 className="text-base font-semibold">{c.coords_title}</h2>
            <dl className="mt-4 space-y-4 text-sm text-[color:var(--muted)]">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0">{c.tel_dt}</dt>
                <dd className="text-foreground sm:text-right">
                  <ul className="space-y-1">
                    {agency.phones.map((p) => (
                      <li key={p.href}>
                        <a className="font-medium hover:text-[color:var(--brand)]" href={p.href}>
                          {p.display}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0">{c.email_dt}</dt>
                <dd className="text-foreground sm:text-right">
                  <a className="font-medium hover:text-[color:var(--brand)]" href={`mailto:${agency.email}`}>
                    {agency.email}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="shrink-0">{c.zone_dt}</dt>
                <dd className="text-foreground sm:text-right">
                  {agency.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <ContactForm texts={formTexts} />
      </div>
    </main>
  );
}
