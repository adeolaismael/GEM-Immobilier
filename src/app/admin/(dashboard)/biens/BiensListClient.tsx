"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BienRow = {
  id: string;
  titre: string;
  type: string;
  statut: string;
  prix: number;
  ville: string | null;
  created_at: string;
};

function formatAdminDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatutBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; className: string }> = {
    disponible: { label: "Disponible", className: "bg-emerald-100 text-emerald-800" },
    sous_compromis: { label: "Sous compromis", className: "bg-amber-100 text-amber-800" },
    vendu: { label: "Vendu", className: "bg-red-100 text-red-800" },
    loue: { label: "Loué", className: "bg-red-100 text-red-800" },
  };
  const { label, className } = config[statut] ?? {
    label: statut.replace("_", " "),
    className: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

const STATUT_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "disponible", label: "Disponible" },
  { value: "sous_compromis", label: "Sous compromis" },
  { value: "vendu", label: "Vendu" },
  { value: "loue", label: "Loué" },
] as const;

export function BiensListClient({ biens }: { biens: BienRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statutFilter, setStatutFilter] = useState<string>("");

  const filteredBiens =
    statutFilter === ""
      ? biens
      : biens.filter((b) => b.statut === statutFilter);

  async function handleDelete(id: string, titre: string) {
    if (
      !confirm(
        `Mettre le bien « ${titre} » à la corbeille ? Il pourra être restauré depuis la page Corbeille.`
      )
    )
      return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/biens/${id}`, { method: "DELETE" });
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="statut-filter" className="text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            id="statut-filter"
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-1 focus:ring-[#5c7a1f]"
          >
            {STATUT_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {filteredBiens.length} bien{filteredBiens.length !== 1 ? "s" : ""} affiché{filteredBiens.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {filteredBiens.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-gray-500">
            {biens.length === 0
              ? "Aucun bien pour le moment."
              : "Aucun bien ne correspond au filtre."}
          </p>
          <Link href="/admin/biens/nouveau" className="mt-4 inline-block text-sm font-semibold text-[#5c7a1f] hover:underline">
            Ajouter un bien
          </Link>
        </div>
      ) : (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 bg-gray-50/80">
            <th className="px-6 py-3 font-semibold text-gray-700">Titre</th>
            <th className="px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">Ajout</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Type</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Statut</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Prix</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Ville</th>
            <th className="px-6 py-3 text-right font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBiens.map((b, i) => (
            <tr
              key={b.id}
              className={`border-b border-black/5 last:border-0 ${i % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}
            >
              <td className="px-6 py-3 font-medium text-gray-900">{b.titre}</td>
              <td className="px-6 py-3 text-gray-500 text-xs whitespace-nowrap">
                {formatAdminDate(b.created_at)}
              </td>
              <td className="px-6 py-3 text-gray-600">{b.type === "location" ? "Location" : "Vente"}</td>
              <td className="px-6 py-3">
                <StatutBadge statut={b.statut} />
              </td>
              <td className="px-6 py-3 text-gray-600">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                  maximumFractionDigits: 0,
                }).format(b.prix)}
              </td>
              <td className="px-6 py-3 text-gray-600">{b.ville ?? "—"}</td>
              <td className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/biens/${b.id}/modifier`}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id, b.titre)}
                    disabled={deletingId === b.id}
                    className="inline-flex items-center rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === b.id ? "…" : "Corbeille"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      )}
    </div>
  );
}
