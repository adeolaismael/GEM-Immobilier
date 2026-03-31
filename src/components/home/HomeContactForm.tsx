"use client";

import { useState } from "react";

type Props = {
  submitLabel: string;
  successMessage: string;
};

export function HomeContactForm({ submitLabel, successMessage }: Props) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSent(false);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const nom = (formData.get("nom") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const telephone = (formData.get("telephone") as string)?.trim();
    const type = (formData.get("type") as string)?.trim();
    const date = (formData.get("date") as string)?.trim();
    const time = (formData.get("time") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();

    if (!nom || !email || !message) {
      setError("Le nom, l’e-mail et le message sont requis.");
      setLoading(false);
      return;
    }

    const sujetParts = [
      type && `Type : ${type}`,
      date && `Date : ${date}`,
      time && `Horaire : ${time}`,
    ].filter(Boolean);
    const sujet = sujetParts.length ? sujetParts.join(" · ") : null;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email,
          telephone: telephone || null,
          sujet,
          message,
          bien_id: null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l’envoi.");
        return;
      }

      setSent(true);
      form.reset();
    } catch {
      setError("Erreur lors de l’envoi du message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {sent && (
        <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-500/20">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-800 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={(ev) => void handleSubmit(ev)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { ph: "Nom et Prénom", name: "nom" },
            { ph: "Email", name: "email", type: "email" as const },
            { ph: "Téléphone", name: "telephone", type: "tel" as const },
            { ph: "Type d'appartement", name: "type" },
            { ph: "Date", name: "date" },
            { ph: "Horaire", name: "time" },
          ].map((f) => (
            <input
              key={f.name}
              type={f.type ?? "text"}
              name={f.name}
              placeholder={f.ph}
              autoComplete={f.name === "email" ? "email" : f.name === "nom" ? "name" : undefined}
              className="h-11 w-full rounded-xl bg-[#f3f4f6] px-4 text-sm ring-1 ring-black/5 placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/50"
            />
          ))}
        </div>
        <textarea
          name="message"
          required
          placeholder="Veuillez écrire toute note supplémentaire…"
          className="min-h-28 w-full rounded-xl bg-[#f3f4f6] px-4 py-3 text-sm ring-1 ring-black/5 placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[color:var(--brand)] px-6 text-sm font-semibold text-white shadow-soft hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Envoi…" : submitLabel}
        </button>
      </form>
    </div>
  );
}
