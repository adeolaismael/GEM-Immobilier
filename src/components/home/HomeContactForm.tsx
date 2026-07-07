"use client";

import { useState } from "react";
import {
  HOME_BUDGETS,
  HOME_PROPERTY_TYPES,
  HOME_TRANSACTION_TYPES,
} from "@/lib/contact-constants";

type Props = {
  submitLabel: string;
  successMessage: string;
};

const inputClassName =
  "h-11 w-full rounded-xl bg-[#f3f4f6] px-4 text-sm ring-1 ring-black/5 placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/50";

const selectClassName =
  "h-11 w-full rounded-xl bg-[#f3f4f6] px-4 text-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/50";

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
    const typeBien = (formData.get("type_bien") as string)?.trim();
    const transaction = (formData.get("transaction") as string)?.trim();
    const budget = (formData.get("budget") as string)?.trim();
    const zone = (formData.get("zone") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();

    if (!nom || !email || !message) {
      setError("Le nom, l'e-mail et le message sont requis.");
      setLoading(false);
      return;
    }

    const sujetParts = [
      typeBien && `Type : ${typeBien}`,
      transaction && transaction,
    ].filter(Boolean);
    const sujet = sujetParts.length
      ? `Demande accueil — ${sujetParts.join(" · ")}`
      : "Demande accueil";

    const messageLines = [
      budget ? `Budget : ${budget}` : null,
      zone ? `Zone/Quartier souhaité : ${zone}` : null,
      "",
      message,
    ].filter((line) => line !== null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email,
          telephone: telephone || null,
          sujet,
          message: messageLines.join("\n"),
          bien_id: null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'envoi.");
        return;
      }

      setSent(true);
      form.reset();
    } catch {
      setError("Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center pb-2">
        <div
          className="text-center text-sm font-semibold leading-tight tracking-wide text-[color:var(--brand)]"
          aria-label="GEM Immobilier"
        >
          GEM
          <br />
          IMMOBILIER
        </div>
      </div>

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
          <label className="block sm:col-span-2">
            <span className="sr-only">Nom et Prénom</span>
            <input
              type="text"
              name="nom"
              placeholder="Nom et Prénom"
              autoComplete="name"
              required
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              required
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="sr-only">Téléphone</span>
            <input
              type="tel"
              name="telephone"
              placeholder="Téléphone"
              autoComplete="tel"
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="sr-only">Type de bien recherché</span>
            <select name="type_bien" className={selectClassName} defaultValue="">
              <option value="" disabled>
                Type de bien recherché
              </option>
              {HOME_PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Achat ou Location</span>
            <select name="transaction" className={selectClassName} defaultValue="">
              <option value="" disabled>
                Achat ou Location
              </option>
              {HOME_TRANSACTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="sr-only">Budget</span>
            <select name="budget" className={selectClassName} defaultValue="">
              <option value="" disabled>
                Budget
              </option>
              {HOME_BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="sr-only">Zone/Quartier souhaité</span>
            <input
              type="text"
              name="zone"
              placeholder="Zone/Quartier souhaité"
              className={inputClassName}
            />
          </label>
        </div>
        <label className="block">
          <span className="sr-only">Message</span>
          <textarea
            name="message"
            required
            placeholder="Votre message…"
            className="min-h-28 w-full rounded-xl bg-[#f3f4f6] px-4 py-3 text-sm ring-1 ring-black/5 placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/50"
          />
        </label>
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
