"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Article, ArticleType } from "@/types";
import { slugifyArticleTitle } from "@/lib/articles";

const inputClass =
  "mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-1 focus:ring-[#5c7a1f]";

export function ArticleForm({ article }: { article?: Article | null }) {
  const router = useRouter();
  const isEdit = Boolean(article);

  const [titre, setTitre] = useState(article?.titre ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [type, setType] = useState<ArticleType>(article?.type ?? "article");
  const [resume, setResume] = useState(article?.resume ?? "");
  const [contenu, setContenu] = useState(article?.contenu ?? "");
  const [imageUrl, setImageUrl] = useState(article?.image_url ?? "");
  const [publie, setPublie] = useState(article?.publie ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) {
      setSlug(slugifyArticleTitle(titre));
    }
  }, [titre, isEdit]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      titre: titre.trim(),
      slug: slug.trim(),
      type,
      resume: resume.trim() || null,
      contenu: contenu.trim(),
      image_url: imageUrl.trim() || null,
      publie,
    };

    try {
      const url = isEdit
        ? `/api/admin/articles/${article!.id}`
        : "/api/admin/articles";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'enregistrement.");
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {error ? (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Titre</span>
        <input
          className={`${inputClass} h-11`}
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Slug</span>
        <input
          className={`${inputClass} h-11`}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Type</span>
        <select
          className={`${inputClass} h-11`}
          value={type}
          onChange={(e) => setType(e.target.value as ArticleType)}
        >
          <option value="article">Article</option>
          <option value="expertise">Cas d&apos;expertise</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Résumé</span>
        <textarea
          className={`${inputClass} min-h-24 py-3`}
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={3}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Contenu</span>
        <textarea
          className={`${inputClass} min-h-56 py-3`}
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          required
          rows={12}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Image URL</span>
        <input
          className={`${inputClass} h-11`}
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </label>

      {imageUrl.trim() ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className="mb-2 text-xs font-medium text-gray-500">Aperçu</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Aperçu de couverture"
            className="max-h-56 w-full rounded-lg object-cover"
          />
        </div>
      ) : null}

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={publie}
          onChange={(e) => setPublie(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#5c7a1f] focus:ring-[#5c7a1f]"
        />
        <span className="text-sm font-medium text-gray-700">Publié</span>
        <span className="text-sm text-gray-500">
          {publie ? "Visible sur le site" : "Brouillon"}
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#5c7a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a6419] disabled:opacity-60"
        >
          {loading ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Link
          href="/admin/articles"
          className="inline-flex h-10 items-center rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
