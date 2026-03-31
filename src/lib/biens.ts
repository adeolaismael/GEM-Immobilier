import { createServerSupabaseClient } from "@/lib/supabase";
import type { Agent, Bien } from "@/types";

export interface FiltresBiensParams {
  recherche?: string;
  type?: string;
  statut?: string;
  prix_min?: string;
  prix_max?: string;
  nb_pieces?: string;
}

export async function getBiens(filtres?: FiltresBiensParams): Promise<Bien[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from("biens")
    .select("*, bien_photos(*)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filtres?.type && (filtres.type === "vente" || filtres.type === "location")) {
    query = query.eq("type", filtres.type);
  }

  if (filtres?.statut) {
    if (filtres.statut === "vendu_loue") {
      query = query.in("statut", ["vendu", "loue"]);
    } else if (
      ["disponible", "sous_compromis", "vendu", "loue"].includes(filtres.statut)
    ) {
      query = query.eq("statut", filtres.statut);
    }
  }

  const prixMin = filtres?.prix_min ? parseInt(filtres.prix_min, 10) : NaN;
  if (!isNaN(prixMin) && prixMin > 0) {
    query = query.gte("prix", prixMin);
  }

  const prixMax = filtres?.prix_max ? parseInt(filtres.prix_max, 10) : NaN;
  if (!isNaN(prixMax) && prixMax > 0) {
    query = query.lte("prix", prixMax);
  }

  const nbPieces = filtres?.nb_pieces ? parseInt(filtres.nb_pieces, 10) : NaN;
  if (!isNaN(nbPieces) && nbPieces >= 1) {
    if (nbPieces >= 5) {
      query = query.gte("nb_pieces", 5);
    } else {
      query = query.gte("nb_pieces", nbPieces);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getBiens] error", error);
    return [];
  }

  let biens = (data ?? []) as Bien[];

  if (filtres?.recherche?.trim()) {
    const q = filtres.recherche.trim().toLowerCase();
    biens = biens.filter(
      (b) =>
        b.titre?.toLowerCase().includes(q) ||
        b.ville?.toLowerCase().includes(q) ||
        b.quartier?.toLowerCase().includes(q) ||
        b.adresse?.toLowerCase().includes(q)
    );
  }

  return biens;
}

export async function getBienBySlug(slug: string): Promise<Bien | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("biens")
    .select("*, bien_photos(*)")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("[getBienBySlug] error", error);
    return null;
  }

  return data as Bien;
}

export async function getBiensLatest(limit = 6): Promise<Bien[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("biens")
    .select("*, bien_photos(*)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getBiensLatest] error", error);
    return [];
  }

  return (data ?? []) as Bien[];
}

export async function getBiensFeatured(): Promise<Bien[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("biens")
    .select("*, bien_photos(*)")
    .eq("featured", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getBiensFeatured] error", error);
    return [];
  }

  return (data ?? []) as Bien[];
}

export async function getBiensExcluding(excludeId: string, limit = 3): Promise<Bien[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("biens")
    .select("*, bien_photos(*)")
    .neq("id", excludeId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getBiensExcluding] error", error);
    return [];
  }
  return (data ?? []) as Bien[];
}

export async function getAgents(): Promise<Agent[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("nom", { ascending: true });

  if (error) {
    console.error("[getAgents] error", error);
    return [];
  }

  return (data ?? []) as Agent[];
}

