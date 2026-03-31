"use client";

import { useState } from "react";
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_HERO_IMAGE_FALLBACK_KEYS,
  type SitePageSlug,
} from "@/lib/site-content-defaults";

type Props = {
  slug: SitePageSlug;
  fieldKey: string;
  value: string;
  onChange: (url: string) => void;
};

export function SiteContentImageField({ slug, fieldKey, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const def = SITE_CONTENT_DEFAULTS[slug][fieldKey] ?? "";

  const heroFallbackKeys = SITE_CONTENT_HERO_IMAGE_FALLBACK_KEYS[slug] ?? [];
  const useHeroReset = heroFallbackKeys.includes(fieldKey);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", slug);
      const res = await fetch("/api/admin/site-content/upload", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "Échec de l’upload.");
        return;
      }
      if (typeof data.url === "string") onChange(data.url);
    } catch {
      setErr("Erreur réseau.");
    } finally {
      setUploading(false);
    }
  }

  function reset() {
    if (useHeroReset) onChange(def);
    else onChange("");
  }

  const showPreview = value.trim().length > 0;

  return (
    <div className="mt-2 space-y-3">
      {err && (
        <p className="text-sm text-red-600">{err}</p>
      )}
      {showPreview && (
        <div className="relative h-40 max-w-md overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-contain" />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#5c7a1f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6419] disabled:opacity-50">
          {uploading ? "Envoi…" : "Choisir une image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => void onFile(e)}
          />
        </label>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-black/10 hover:bg-gray-50"
        >
          {useHeroReset ? "Image par défaut" : "Retirer la photo"}
        </button>
      </div>
      {value ? (
        <input
          type="text"
          readOnly
          value={value}
          className="w-full truncate rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600 ring-1 ring-black/5"
        />
      ) : (
        <p className="text-xs text-gray-500">
          {useHeroReset
            ? "Aucune URL : à l’enregistrement, les placeholders SVG seront utilisés."
            : "Aucune image : la zone reste un fond ou le visuel par défaut."}
        </p>
      )}
    </div>
  );
}
