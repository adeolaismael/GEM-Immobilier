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
  deleted_at: string;
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

export function BiensSupprimesClient({ biens }: { biens: BienRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"restore" | "purge" | null>(null);

  async function restore(id: string) {
    setBusyId(id);
    setBusyAction("restore");
    try {
      const res = await fetch(`/api/admin/biens/${id}/restore`, { method: "POST" });
      if (res.ok) router.refresh();
      else {
        const data = await res.json();
        alert(data.error ?? "Erreur lors de la restauration.");
      }
    } catch {
      alert("Erreur lors de la restauration.");
    } finally {
      setBusyId(null);
      setBusyAction(null);
    }
  }

  async function purge(id: string, titre: string) {
    if (
      !confirm(
        `Supprimer définitivement « ${titre} » ? Cette action est irréversible (photos et fiche seront effacées de la base).`
      )
    )
      return;
    setBusyId(id);
    setBusyAction("purge");
    try {
      const res = await fetch(`/api/admin/biens/${id}?permanent=1`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else {
        const data = await res.json();
        alert(data.error ?? "Erreur lors de la suppression définitive.");
      }
    } catch {
      alert("Erreur lors de la suppression définitive.");
    } finally {
      setBusyId(null);
      setBusyAction(null);
    }
  }

  if (biens.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-black/5">
        <p className="text-gray-500">La corbeille est vide.</p>
        <Link
          href="/admin/biens"
          className="mt-4 inline-block text-sm font-semibold text-[#5c7a1f] hover:underline"
        >
          Retour aux biens actifs
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 bg-gray-50/80">
            <th className="px-6 py-3 font-semibold text-gray-700">Titre</th>
            <th className="px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">Mis en corbeille</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Type</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Prix</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Ville</th>
            <th className="px-6 py-3 text-right font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {biens.map((b, i) => (
            <tr
              key={b.id}
              className={`border-b border-black/5 last:border-0 ${i % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}
            >
              <td className="px-6 py-3 font-medium text-gray-900">{b.titre}</td>
              <td className="px-6 py-3 text-gray-500 text-xs whitespace-nowrap">
                {formatAdminDate(b.deleted_at)}
              </td>
              <td className="px-6 py-3 text-gray-600">{b.type === "location" ? "Location" : "Vente"}</td>
              <td className="px-6 py-3 text-gray-600">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                  maximumFractionDigits: 0,
                }).format(b.prix)}
              </td>
              <td className="px-6 py-3 text-gray-600">{b.ville ?? "—"}</td>
              <td className="px-6 py-3 text-right">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => restore(b.id)}
                    disabled={busyId === b.id}
                    className="inline-flex items-center rounded-lg bg-[#5c7a1f] px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#4a6419] disabled:opacity-50"
                  >
                    {busyId === b.id && busyAction === "restore" ? "…" : "Restaurer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => purge(b.id, b.titre)}
                    disabled={busyId === b.id}
                    className="inline-flex items-center rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    {busyId === b.id && busyAction === "purge" ? "…" : "Supprimer définitivement"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
