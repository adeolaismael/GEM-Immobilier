"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export type ContactFormTexts = {
  form_title: string;
  form_intro: string;
  form_concern_prefix: string;
  form_success: string;
  label_nom: string;
  placeholder_nom: string;
  label_email: string;
  placeholder_email: string;
  label_tel: string;
  placeholder_tel: string;
  label_sujet: string;
  placeholder_sujet: string;
  label_message: string;
  placeholder_message: string;
  form_submit: string;
  form_submit_loading: string;
};

function ContactFormInner({ texts }: { texts: ContactFormTexts }) {
  const searchParams = useSearchParams();
  const bienId = searchParams.get("bien_id");
  const titre = searchParams.get("titre");
  const [sujet, setSujet] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bienId && titre) {
      setSujet(`Demande d'information - ${decodeURIComponent(titre)}`);
    }
  }, [bienId, titre]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const nom = formData.get("nom") as string;
    const email = formData.get("email") as string;
    const telephone = formData.get("telephone") as string;
    const sujetVal = formData.get("sujet") as string;
    const message = formData.get("message") as string;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom?.trim(),
          email: email?.trim(),
          telephone: telephone?.trim() || null,
          sujet: sujetVal?.trim() || null,
          message: message?.trim(),
          bien_id: bienId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'envoi.");
        return;
      }

      setSent(true);
      form.reset();
      if (bienId && titre) {
        setSujet(`Demande d'information - ${decodeURIComponent(titre)}`);
      }
    } catch {
      setError("Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <h2 className="text-base font-semibold">{texts.form_title}</h2>
      <p className="mt-1 text-sm text-[color:var(--muted)]">{texts.form_intro}</p>

      {bienId && titre && (
        <div className="mt-4 rounded-xl bg-[color:var(--brand)]/10 px-4 py-3 ring-1 ring-[color:var(--brand)]/20">
          <p className="text-sm font-medium text-[color:var(--foreground)]">
            {texts.form_concern_prefix}{" "}
            <span className="font-semibold">
              {decodeURIComponent(titre)}
            </span>
          </p>
        </div>
      )}

      {sent && (
        <div className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-500/20">
          {texts.form_success}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-[color:var(--muted)]">{texts.label_nom}</span>
            <input
              className="mt-2 h-11 w-full rounded-xl bg-[color:var(--card)] px-4 text-sm text-foreground ring-1 ring-[color:var(--card-border)] placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/60"
              name="nom"
              placeholder={texts.placeholder_nom}
              autoComplete="name"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-[color:var(--muted)]">{texts.label_email}</span>
            <input
              className="mt-2 h-11 w-full rounded-xl bg-[color:var(--card)] px-4 text-sm text-foreground ring-1 ring-[color:var(--card-border)] placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/60"
              type="email"
              name="email"
              placeholder={texts.placeholder_email}
              autoComplete="email"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-[color:var(--muted)]">{texts.label_tel}</span>
          <input
            className="mt-2 h-11 w-full rounded-xl bg-[color:var(--card)] px-4 text-sm text-foreground ring-1 ring-[color:var(--card-border)] placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/60"
            type="tel"
            name="telephone"
            placeholder={texts.placeholder_tel}
            autoComplete="tel"
          />
        </label>

        <label className="block">
          <span className="text-sm text-[color:var(--muted)]">{texts.label_sujet}</span>
          <input
            className="mt-2 h-11 w-full rounded-xl bg-[color:var(--card)] px-4 text-sm text-foreground ring-1 ring-[color:var(--card-border)] placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/60"
            type="text"
            name="sujet"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            placeholder={texts.placeholder_sujet}
          />
        </label>

        <label className="block">
          <span className="text-sm text-[color:var(--muted)]">{texts.label_message}</span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-xl bg-[color:var(--card)] px-4 py-3 text-sm text-foreground ring-1 ring-[color:var(--card-border)] placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/60"
            name="message"
            placeholder={texts.placeholder_message}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? texts.form_submit_loading : texts.form_submit}
        </button>
      </form>
    </section>
  );
}

export function ContactForm({ texts }: { texts: ContactFormTexts }) {
  return (
    <Suspense
      fallback={
        <div className="h-96 animate-pulse rounded-2xl bg-white/5 ring-1 ring-white/10" />
      }
    >
      <ContactFormInner texts={texts} />
    </Suspense>
  );
}
