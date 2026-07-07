"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ArticleType } from "@/types";

type ArticleRow = {
  id: string;
  titre: string;
  type: ArticleType;
  publie: boolean;
  published_at: string | null;
  created_at: string;
};

function formatAdminDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TYPE_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "article", label: "Articles" },
  { value: "expertise", label: "Cas d'expertise" },
] as const;

export function ArticlesListClient({ articles }: { articles: ArticleRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("");

  const filteredArticles =
    typeFilter === ""
      ? articles
      : articles.filter((article) => article.type === typeFilter);

  async function handleDelete(id: string, titre: string) {
    if (!confirm(`Supprimer l'article « ${titre} » ?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Erreur lors de la suppression.");
      }
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="type-filter" className="text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          id="type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-1 focus:ring-[#5c7a1f]"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Titre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Statut</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    Aucun article.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-medium text-gray-900">{article.titre}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {article.type === "expertise" ? "Cas d'expertise" : "Article"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          article.publie
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {article.publie ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatAdminDate(article.published_at ?? article.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/modifier`}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Modifier
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleDelete(article.id, article.titre)}
                          disabled={deletingId === article.id}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          {deletingId === article.id ? "…" : "Supprimer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
