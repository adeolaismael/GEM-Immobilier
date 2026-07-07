"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  orderedContentKeys,
  siteContentFieldLabel,
  SITE_CONTENT_DEFAULTS,
  isSiteContentGalleryJsonField,
  isSiteContentSingleImageField,
  type SitePageSlug,
} from "@/lib/site-content-defaults";
import { SiteContentGalleryField } from "./SiteContentGalleryField";
import { SiteContentImageField } from "./SiteContentImageField";

type Props = {
  slug: SitePageSlug;
};

function preferTextarea(key: string, sample: string): boolean {
  if (/^agency_(phones|address|map_intro)$/.test(key)) return true;
  if (sample.length > 120) return true;
  if (/desc|description|intro|body|_p[0-9]?$|histoire_p|mission_body|ml_.*_p$|point_|empty_|cta_body|about_body|t[12]_body|form_intro|^p[12]$|valeur_[0-9]_desc|hero_subtitle|card_.*_desc|coords|placeholder_message/i.test(key)) {
    return true;
  }
  return false;
}

export function SiteContentEditor({ slug }: Props) {
  const keys = orderedContentKeys(slug);
  const [values, setValues] = useState<Record<string, string>>(
    () => ({ ...SITE_CONTENT_DEFAULTS[slug] }),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const def = SITE_CONTENT_DEFAULTS[slug];
    try {
      const res = await fetch(`/api/admin/site-pages/${slug}`, {
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = [data.error, data.hint].filter(Boolean).join(" — ");
        setError(msg || "Chargement impossible.");
        setValues({ ...def });
        return;
      }
      if (data.content && typeof data.content === "object") {
        setValues({ ...def, ...data.content });
      }
    } catch {
      setError("Erreur réseau.");
      setValues({ ...def });
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/site-pages/${slug}`, {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: values }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = [data.error, data.hint].filter(Boolean).join(" — ");
        setError(msg || "Enregistrement impossible.");
        return;
      }
      setValues(data.content ?? values);
      setMessage("Modifications enregistrées.");
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl bg-gray-100" aria-hidden />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#5c7a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a6419] disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-black/10 hover:bg-gray-50"
        >
          Recharger depuis le serveur
        </button>
        <Link
          href="/admin/contenu"
          className="text-sm font-medium text-[#5c7a1f] hover:underline"
        >
          ← Autres pages
        </Link>
      </div>

      {message && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <div className="space-y-6">
        {keys.map((key) => {
          const label = siteContentFieldLabel(slug, key);
          const v = values[key] ?? "";
          if (isSiteContentGalleryJsonField(slug, key)) {
            return (
              <div key={key} className="block">
                <span className="text-sm font-medium text-gray-800">{label}</span>
                <span className="mt-0.5 block font-mono text-xs text-gray-400">
                  {key}
                </span>
                <SiteContentGalleryField
                  slug="a-propos-galerie"
                  value={v}
                  onChange={(json) =>
                    setValues((s) => ({ ...s, [key]: json }))
                  }
                />
              </div>
            );
          }
          if (isSiteContentSingleImageField(slug, key)) {
            return (
              <div key={key} className="block">
                <span className="text-sm font-medium text-gray-800">{label}</span>
                <span className="mt-0.5 block font-mono text-xs text-gray-400">
                  {key}
                </span>
                <SiteContentImageField
                  slug={slug}
                  fieldKey={key}
                  value={v}
                  onChange={(url) =>
                    setValues((s) => ({ ...s, [key]: url }))
                  }
                />
              </div>
            );
          }
          const multiline = preferTextarea(
            key,
            SITE_CONTENT_DEFAULTS[slug][key] ?? v,
          );
          return (
            <label key={key} className="block">
              <span className="text-sm font-medium text-gray-800">{label}</span>
              <span className="mt-0.5 block font-mono text-xs text-gray-400">
                {key}
              </span>
              {multiline ? (
                <textarea
                  name={key}
                  value={v}
                  onChange={(e) =>
                    setValues((s) => ({ ...s, [key]: e.target.value }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-2 focus:ring-[#5c7a1f]/20"
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={v}
                  onChange={(e) =>
                    setValues((s) => ({ ...s, [key]: e.target.value }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-2 focus:ring-[#5c7a1f]/20"
                />
              )}
            </label>
          );
        })}
      </div>
    </form>
  );
}
