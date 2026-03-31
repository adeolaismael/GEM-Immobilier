"use client";

import { useMemo, useState } from "react";
import { parseSiteGalleryJson } from "@/lib/site-galerie";

type Props = {
  value: string;
  onChange: (json: string) => void;
  slug: "a-propos-galerie";
};

export function SiteContentGalleryField({ value, onChange, slug }: Props) {
  const items = useMemo(() => parseSiteGalleryJson(value), [value]);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function commit(next: typeof items) {
    onChange(JSON.stringify(next));
  }

  function remove(id: string) {
    commit(items.filter((p) => p.id !== id));
  }

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
      if (typeof data.url === "string") {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `site-${Date.now()}`;
        commit([...items, { id, url: data.url }]);
      }
    } catch {
      setErr("Erreur réseau.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-2 space-y-4">
      <p className="text-xs text-gray-500">
        Uniquement la galerie « À propos » (agence). Les photos des biens se gèrent dans Biens, pas ici.
      </p>
      {err && <p className="text-sm text-red-600">{err}</p>}

      {items.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex gap-3 rounded-xl bg-gray-50 p-3 ring-1 ring-black/5"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs text-gray-600">{p.url}</p>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="mt-2 text-xs font-medium text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#5c7a1f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6419] disabled:opacity-50">
        {uploading ? "Envoi…" : "Ajouter une photo"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => void onFile(e)}
        />
      </label>
    </div>
  );
}
