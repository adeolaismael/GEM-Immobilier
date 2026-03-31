"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GeocodageLocalisation } from "@/components/GeocodageLocalisation";
import { sortBienPhotos } from "@/lib/bien-photos";
import type { Bien, BienPhoto } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputClass =
  "mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-1 focus:ring-[#5c7a1f]";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function isValidFile(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SIZE;
}

export function BienForm({ bien }: { bien?: Bien | null }) {
  const router = useRouter();
  const isEdit = Boolean(bien);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titre, setTitre] = useState(bien?.titre ?? "");
  const [slug, setSlug] = useState(bien?.slug ?? "");
  const [description, setDescription] = useState(bien?.description ?? "");
  const [type, setType] = useState<"vente" | "location">(bien?.type ?? "vente");
  const [statut, setStatut] = useState(bien?.statut ?? "disponible");
  const [prix, setPrix] = useState(String(bien?.prix ?? ""));
  const [surface, setSurface] = useState(String(bien?.surface ?? ""));
  const [nb_pieces, setNbPieces] = useState(String(bien?.nb_pieces ?? ""));
  const [nb_chambres, setNbChambres] = useState(String(bien?.nb_chambres ?? ""));
  const [nb_salles_de_bain, setNbSallesDeBain] = useState(String(bien?.nb_salles_de_bain ?? ""));
  const [adresse, setAdresse] = useState(bien?.adresse ?? "");
  const [ville, setVille] = useState(bien?.ville ?? "");
  const [quartier, setQuartier] = useState(bien?.quartier ?? "");
  const [latitude, setLatitude] = useState<number | null>(
    bien?.latitude != null && !Number.isNaN(bien.latitude) ? bien.latitude : null
  );
  const [longitude, setLongitude] = useState<number | null>(
    bien?.longitude != null && !Number.isNaN(bien.longitude)
      ? bien.longitude
      : null
  );
  const [featured, setFeatured] = useState(bien?.featured ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<BienPhoto[]>(
    sortBienPhotos(bien?.bien_photos ?? []),
  );
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!isEdit) setSlug(slugify(titre));
  }, [titre, isEdit]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter(isValidFile);
    const invalid = files.filter((f) => !isValidFile(f));
    if (invalid.length > 0) {
      setError(
        `${invalid.length} fichier(s) ignoré(s). Formats acceptés : jpg, png, webp. Max 5 Mo.`
      );
    }
    setSelectedFiles((prev) => [...prev, ...valid]);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    const valid = files.filter(isValidFile);
    setSelectedFiles((prev) => [...prev, ...valid]);
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function setPhotoCouverture(photo: BienPhoto) {
    if (!bien) return;
    try {
      const res = await fetch(`/api/admin/biens/${bien.id}/photos/${photo.id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Impossible de définir la couverture.");
        return;
      }
      setExistingPhotos((prev) =>
        sortBienPhotos(
          prev.map((p) => ({
            ...p,
            est_principale: p.id === photo.id,
          })),
        ),
      );
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    }
  }

  async function removeExistingPhoto(photo: BienPhoto) {
    if (!bien) return;
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      const res = await fetch(`/api/admin/biens/${bien.id}/photos/${photo.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExistingPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Erreur lors de la suppression.");
      }
    } catch {
      setError("Erreur lors de la suppression.");
    }
  }

  async function uploadPhotos(bienId: string) {
    const hasExistingPrincipal = existingPhotos.some((p) => p.est_principale);
    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append("file", selectedFiles[i]);
      formData.append("ordre", String(existingPhotos.length + i));
      formData.append("est_principale", String(!hasExistingPrincipal && i === 0));

      const res = await fetch(`/api/admin/biens/${bienId}/photos`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur lors de l'upload.");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        titre,
        slug: slug || slugify(titre),
        description: description || null,
        type,
        statut,
        prix: Number(prix) || 0,
        surface: surface ? Number(surface) : null,
        nb_pieces: nb_pieces ? Number(nb_pieces) : null,
        nb_chambres: nb_chambres ? Number(nb_chambres) : null,
        nb_salles_de_bain: nb_salles_de_bain ? Number(nb_salles_de_bain) : null,
        adresse: adresse || null,
        ville: ville || null,
        quartier: quartier || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        featured,
      };

      const url = isEdit ? `/api/admin/biens/${bien!.id}` : "/api/admin/biens";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur.");
        return;
      }

      const bienId = data.id as string;

      if (selectedFiles.length > 0) {
        await uploadPhotos(bienId);
      }

      router.push("/admin/biens");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="max-w-2xl space-y-8" onSubmit={handleSubmit}>
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Infos principales</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre *</label>
            <input className={inputClass} value={titre} onChange={(e) => setTitre(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Auto-généré depuis le titre" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-1 focus:ring-[#5c7a1f]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type *</label>
              <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as "vente" | "location")}>
                <option value="vente">Vente</option>
                <option value="location">Location</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut *</label>
              <select className={inputClass} value={statut} onChange={(e) => setStatut(e.target.value as "disponible" | "sous_compromis" | "vendu" | "loue")}>
                <option value="disponible">Disponible</option>
                <option value="sous_compromis">Sous compromis</option>
                <option value="vendu">Vendu</option>
                <option value="loue">Loué</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix (FCFA) *</label>
            <input type="number" className={inputClass} value={prix} onChange={(e) => setPrix(e.target.value)} required min={0} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Détails</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
            <input type="number" className={inputClass} value={surface} onChange={(e) => setSurface(e.target.value)} min={0} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pièces</label>
            <input type="number" className={inputClass} value={nb_pieces} onChange={(e) => setNbPieces(e.target.value)} min={0} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chambres</label>
            <input type="number" className={inputClass} value={nb_chambres} onChange={(e) => setNbChambres(e.target.value)} min={0} />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Salles de bain</label>
          <input type="number" className={inputClass} value={nb_salles_de_bain} onChange={(e) => setNbSallesDeBain(e.target.value)} min={0} />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#5c7a1f] focus:ring-[#5c7a1f]/50" />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mettre en avant (featured)</label>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Localisation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input className={inputClass} value={adresse} onChange={(e) => setAdresse(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <input className={inputClass} value={ville} onChange={(e) => setVille(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quartier</label>
              <input className={inputClass} value={quartier} onChange={(e) => setQuartier(e.target.value)} />
            </div>
          </div>

          <GeocodageLocalisation
            adresse={adresse}
            ville={ville}
            quartier={quartier}
            latitude={latitude}
            longitude={longitude}
            onLatLngChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Photos</h3>
        <p className="mb-4 text-xs text-gray-500">
          JPG, PNG ou WebP. Maximum 5 Mo par photo. La{" "}
          <strong>couverture</strong> s’affiche en premier (liste, fiche). Cliquez sur « Définir comme couverture » sous une vignette.
        </p>

        {/* Photos existantes */}
        {existingPhotos.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-gray-700">Photos existantes</p>
            <div className="flex flex-wrap gap-4">
              {existingPhotos.map((photo) => (
                <div key={photo.id} className="group flex w-28 flex-col gap-1.5">
                  <div className="relative">
                    <img
                      src={photo.url}
                      alt=""
                      className="h-24 w-full rounded-lg object-cover ring-1 ring-black/10"
                    />
                    {photo.est_principale && (
                      <span className="absolute left-1 top-1 rounded bg-[#5c7a1f] px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Couverture
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(photo)}
                      className="absolute right-1 top-1 rounded bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                      title="Supprimer"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {isEdit && (
                    <button
                      type="button"
                      onClick={() => void setPhotoCouverture(photo)}
                      disabled={Boolean(photo.est_principale)}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-center text-[11px] font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-default disabled:border-[#5c7a1f]/40 disabled:bg-[#5c7a1f]/10 disabled:text-[#5c7a1f]"
                    >
                      {photo.est_principale ? "Couverture actuelle" : "Définir comme couverture"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zone de drop / sélection */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? "border-[#5c7a1f] bg-[#5c7a1f]/5" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <p className="text-sm text-gray-600">
            Glissez des images ici ou cliquez pour sélectionner
          </p>
        </div>

        {/* Aperçu des photos sélectionnées */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Nouvelles photos ({selectedFiles.length})
            </p>
            <div className="flex flex-wrap gap-3">
              {selectedFiles.map((file, i) => (
                <div key={`${file.name}-${i}`} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-24 w-24 rounded-lg object-cover ring-1 ring-black/10"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeSelectedFile(i);
                    }}
                    className="absolute right-1 top-1 rounded bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                    title="Retirer"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-xl bg-[#5c7a1f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a6419] disabled:opacity-60">
          {loading ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Link href="/admin/biens" className="rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-black/10 transition-colors hover:bg-gray-50">
          Annuler
        </Link>
      </div>
    </form>
  );
}
