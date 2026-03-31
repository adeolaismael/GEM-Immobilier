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
  bien_id: string | null;
  lu: boolean | null;
  created_at: string;
}

