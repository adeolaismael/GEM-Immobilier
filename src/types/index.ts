export type BienType = "vente" | "location";

export type BienStatut = "disponible" | "sous_compromis" | "vendu" | "loue";

export interface BienPhoto {
  id: string;
  bien_id: string;
  url: string;
  ordre: number | null;
  est_principale: boolean | null;
}

export interface Bien {
  id: string;
  slug: string;
  titre: string;
  description: string | null;
  type: BienType;
  statut: BienStatut;
  prix: number;
  surface: number | null;
  nb_pieces: number | null;
  nb_chambres: number | null;
  nb_salles_de_bain: number | null;
  adresse: string | null;
  ville: string | null;
  quartier: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  bien_photos?: BienPhoto[];
}

export interface Agent {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  photo_url: string | null;
  bio: string | null;
}

export interface MessageContact {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string | null;
  message: string;
  service: string | null;
  bien_id: string | null;
  lu: boolean | null;
  created_at: string;
}

export type ArticleType = "article" | "expertise";

export type AnalyticsEventType =
  | "vue_bien"
  | "clic_contact"
  | "formulaire_soumis";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType | string;
  bien_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type KpiPeriod = "7" | "30" | "90" | "all";

export interface KpiTopBienRow {
  bien_id: string;
  titre: string;
  ville: string | null;
  type: string;
  vues: number;
  clics_contact: number;
}

export interface KpiRecentEvent {
  id: string;
  type: string;
  bien_id: string | null;
  bien_titre: string | null;
  created_at: string;
}

export interface KpiDashboardData {
  total_vues: number;
  total_clics_contact: number;
  total_formulaires: number;
  taux_conversion: number;
  top_biens: KpiTopBienRow[];
  recent_events: KpiRecentEvent[];
}

export interface Article {
  id: string;
  slug: string;
  titre: string;
  type: ArticleType;
  resume: string | null;
  contenu: string;
  image_url: string | null;
  publie: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

