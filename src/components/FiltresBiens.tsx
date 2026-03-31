"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { motion } from "framer-motion";

const TYPES = [
  { value: "", label: "Tous" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
] as const;

const STATUTS = [
  { value: "", label: "Tous" },
  { value: "disponible", label: "Disponible" },
  { value: "sous_compromis", label: "Sous compromis" },
  { value: "vendu_loue", label: "Vendu / Loué" },
] as const;

const NB_PIECES = [
  { value: "", label: "Tous" },
  { value: "1", label: "1 min" },
  { value: "2", label: "2 min" },
  { value: "3", label: "3 min" },
  { value: "4", label: "4 min" },
  { value: "5", label: "5+" },
] as const;

export function FiltresBiens() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rechercheParam = searchParams.get("recherche") ?? "";
  const [recherche, setRecherche] = useState(rechercheParam);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRecherche(rechercheParam);
  }, [rechercheParam]);

  const type = searchParams.get("type") ?? "";
  const statut = searchParams.get("statut") ?? "";
  const prix_min = searchParams.get("prix_min") ?? "";
  const prix_max = searchParams.get("prix_max") ?? "";
  const nb_pieces = searchParams.get("nb_pieces") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      startTransition(() => {
        router.push(`/biens?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const handleRecherche = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setRecherche(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ recherche: v });
      debounceRef.current = null;
    }, 300);
  };

  const handleRechercheSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateParams({ recherche });
  };

  const handleType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ type: e.target.value });
  };

  const handleStatut = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ statut: e.target.value });
  };

  const handlePrixMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ prix_min: e.target.value });
  };

  const handlePrixMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ prix_max: e.target.value });
  };

  const handleNbPieces = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ nb_pieces: e.target.value });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push("/biens", { scroll: false });
    });
  };

  const hasActiveFilters =
    recherche || type || statut || prix_min || prix_max || nb_pieces;

  const inputClass =
    "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[color:var(--foreground)] focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/20";
  const selectClass =
    "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[color:var(--foreground)] focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/20";

  return (
    <motion.div
      className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-[color:var(--card-border)] shadow-soft"
      initial={false}
      animate={{ opacity: isPending ? 0.85 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleRechercheSubmit} className="space-y-4">
        {/* Recherche */}
        <div>
          <label
            htmlFor="recherche"
            className="mb-1.5 block text-sm font-medium text-[color:var(--foreground)]"
          >
            Recherche
          </label>
          <input
            id="recherche"
            name="recherche"
            type="text"
            placeholder="Titre ou ville..."
            value={recherche}
            onChange={handleRecherche}
            className={`w-full ${inputClass}`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="mb-1.5 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={handleType}
              className={`w-full ${selectClass}`}
            >
              {TYPES.map((t) => (
                <option key={t.value || "all"} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label
              htmlFor="statut"
              className="mb-1.5 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Statut
            </label>
            <select
              id="statut"
              value={statut}
              onChange={handleStatut}
              className={`w-full ${selectClass}`}
            >
              {STATUTS.map((s) => (
                <option key={s.value || "all"} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prix min */}
          <div>
            <label
              htmlFor="prix_min"
              className="mb-1.5 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Prix min (F CFA)
            </label>
            <input
              id="prix_min"
              type="number"
              min={0}
              placeholder="0"
              value={prix_min}
              onChange={handlePrixMin}
              className={`w-full ${inputClass}`}
            />
          </div>

          {/* Prix max */}
          <div>
            <label
              htmlFor="prix_max"
              className="mb-1.5 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Prix max (F CFA)
            </label>
            <input
              id="prix_max"
              type="number"
              min={0}
              placeholder="—"
              value={prix_max}
              onChange={handlePrixMax}
              className={`w-full ${inputClass}`}
            />
          </div>

          {/* Nb pièces */}
          <div>
            <label
              htmlFor="nb_pieces"
              className="mb-1.5 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Pièces min
            </label>
            <select
              id="nb_pieces"
              value={nb_pieces}
              onChange={handleNbPieces}
              className={`w-full ${selectClass}`}
            >
              {NB_PIECES.map((n) => (
                <option key={n.value || "all"} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-[color:var(--muted)] underline underline-offset-4 hover:text-[color:var(--foreground)]"
          >
            Réinitialiser les filtres
          </button>
        )}

        {isPending && (
          <span className="ml-2 text-xs text-[color:var(--muted)]">
            Chargement…
          </span>
        )}
      </form>
    </motion.div>
  );
}
