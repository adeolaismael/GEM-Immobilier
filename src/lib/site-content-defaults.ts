/** Slugs stockés en base ; chaque clé de contenu est fusionnée avec les défauts. */

export const SITE_PAGE_SLUGS = [
  "accueil",
  "a-propos",
  "a-propos-qui-sommes-nous",
  "a-propos-mission-valeurs",
  "a-propos-galerie",
  "services",
  "contact",
  "coordonnees-agence",
  "biens",
  "mentions-legales",
  "politique-confidentialite",
] as const;

export type SitePageSlug = (typeof SITE_PAGE_SLUGS)[number];

export function isSitePageSlug(s: string): s is SitePageSlug {
  return (SITE_PAGE_SLUGS as readonly string[]).includes(s);
}

const SERVICES_STRUCTURE = [
  {
    title: "Administration de biens",
    points: [
      "Suivi global des biens confiés en gestion.",
      "Gestion des relations avec les occupants et les prestataires.",
      "Reporting régulier au propriétaire.",
    ],
  },
  {
    title: "Suivi / gestion juridique et fiscale des biens",
    points: [
      "Prise en compte de la réglementation en vigueur.",
      "Accompagnement sur les aspects juridiques liés aux transactions.",
      "Prise en compte de la fiscalité immobilière.",
    ],
  },
  {
    title: "Recherche et mise à disposition de biens à acheter et à louer",
    points: [
      "Analyse du besoin et des critères de recherche.",
      "Sélection et proposition de biens adaptés.",
      "Organisation des visites et accompagnement jusqu’à la décision.",
    ],
  },
  {
    title: "Conciergerie et suivi des travaux",
    points: [
      "Coordination d’intervenants (travaux, maintenance, services).",
      "Suivi des prestations sur site.",
      "Remontée d’information au propriétaire.",
    ],
  },
  {
    title: "Estimation de bien immobilier",
    points: [
      "Analyse du marché local.",
      "Appréciation des caractéristiques du bien.",
      "Proposition de valeurs cohérentes avec le marché.",
    ],
  },
  {
    title: "Vente de biens immobiliers",
    points: [
      "Mise en avant des biens à vendre.",
      "Accompagnement des parties jusqu’à la signature.",
      "Suivi administratif des étapes de la transaction.",
    ],
  },
] as const;

function serviceFields(): Record<string, string> {
  const o: Record<string, string> = {};
  SERVICES_STRUCTURE.forEach((s, i) => {
    o[`service_${i}_title`] = s.title;
    s.points.forEach((p, j) => {
      o[`service_${i}_point_${j}`] = p;
    });
  });
  return o;
}

function serviceFieldOrder(): string[] {
  const keys: string[] = [];
  SERVICES_STRUCTURE.forEach((_, i) => {
    keys.push(`service_${i}_title`);
    for (let j = 0; j < 3; j += 1) keys.push(`service_${i}_point_${j}`);
  });
  return keys;
}

export const SITE_CONTENT_DEFAULTS: Record<SitePageSlug, Record<string, string>> = {
  accueil: {
    meta_title: "GEM Immobilier",
    meta_description:
      "GEM Immobilier accompagne vos projets immobiliers : conseil, estimation, vente, achat et investissement.",
    hero_title_line1: "Gem",
    hero_title_brand: "Immobilier",
    hero_title_line2: "votre agence de référence.",
    hero_subtitle: "Le partenaire qui sécurise vos biens et optimise vos investissements.",
    hero_cta_biens: "Découvrir les biens",
    hero_cta_contact: "Prendre rendez-vous",
    image_hero_main: "/placeholders/hero-main.svg",
    image_hero_side: "/placeholders/hero-side.svg",
    image_about: "",
    about_title: "Qui nous sommes?",
    about_body:
      "GEM Immobilier est une agence immobilière créée en 2014 et spécialisée dans la gestion, la vente et la location de biens immobiliers.",
    stat_1_value: "+10 ans",
    stat_1_label: "d'expérience",
    stat_2_value: "+100",
    stat_2_label: "bien gérés et suivis",
    stat_3_value: "2014",
    stat_3_label: "agence créée",
    stat_4_value: "3M FCFA",
    stat_4_label: "capital",
    about_cta: "En savoir plus",
    testimonials_heading:
      "Des clients satisfaits qui nous ont fait confiance pour réaliser leur projet immobilier.",
    t1_title:
      "Grâce à GEM IMMOBILIER, je n’ai plus aucun souci de gestion. Mes loyers sont toujours payés à temps et mon bien est parfaitement entretenu. Un vrai partenaire de confiance !",
    t1_body: "",
    t1_name: "M. Timi",
    t1_city: "Montréal — Propriétaire",
    t2_title:
      "Professionnalisme, réactivité et transparence : GEM IMMOBILIER a complètement changé mon expérience de bailleur. Je recommande sans hésiter.",
    t2_body: "",
    t2_name: "Mme Kouadio",
    t2_city: "Bruxelles — Propriétaire",
    t3_title:
      "Je n’ai plus à me soucier ni de la gestion de mes biens, ni de mes impôts : GEM Immobilier, c’est une équipe vraiment efficace !",
    t3_body: "",
    t3_name: "M. Bri",
    t3_city: "Abidjan — Propriétaire",
    t4_title:
      "Une prise en charge irréprochable, avec une écoute attentive à chaque étape. GEM Immobilier offre un accompagnement de grande qualité.",
    t4_body: "",
    t4_name: "",
    t4_city: "",
    t5_title:
      "Un service à la fois humain et hautement professionnel. L’équipe a su comprendre mes attentes avec finesse et m’accompagner avec élégance.",
    t5_body: "",
    t5_name: "",
    t5_city: "",
    cta_section_title: "Cherchez-vous à acheter ou vendre une propriété?",
    phone_label: "Appelez-nous",
    email_label: "Envoyez-nous un courriel",
    home_form_send: "Envoyer le message",
    home_form_success: "Message envoyé. Nous vous répondrons rapidement.",
  },
  "coordonnees-agence": {
    meta_title: "Coordonnées agence — réglages site",
    meta_description:
      "Ces informations sont affichées sur le pied de page, la page d’accueil (contact + carte) et le bloc coordonnées de la page Contact. Ce n’est pas une page publique.",
    agency_email: "gemimmobilier14@gmail.com",
    agency_phones: [
      "+225 27 22 51 07 98",
      "+225 05 75 22 94 76",
      "+225 05 75 20 84 89",
      "+225 05 75 22 95 76",
    ].join("\n"),
    agency_address: [
      "Cocody, 2 plateaux AGHIEN",
      "Las Palmas",
      "Cité Sicogi Bâtiment C, porte 35",
    ].join("\n"),
    agency_map_lat: "5.3622",
    agency_map_lng: "-3.9937",
    agency_map_title: "Notre adresse",
    agency_map_intro:
      "Venez nous rencontrer à notre siège à Cocody, 2 plateaux AGHIEN — Las Palmas.",
  },
  "a-propos": {
    meta_title: "À propos",
    meta_description:
      "GEM IMMOBILIER est une agence agréée spécialisée dans la gestion et les transactions immobilières à Abidjan.",
    eyebrow: "À propos",
    h1: "À propos de GEM Immobilier",
    intro:
      "GEM IMMOBILIER est une agence agréée spécialisée dans la gestion et les transactions immobilières à Abidjan.",
    card_qui_title: "Qui sommes-nous ?",
    card_qui_desc: "Notre histoire, notre statut juridique et nos agréments.",
    card_mission_title: "MISSION - VISION - VALEURS",
    card_mission_desc: "Mission, vision et valeurs qui nous guident.",
    card_galerie_title: "Galerie photos",
    card_galerie_desc: "L'agence en images (hors annonces).",
    card_link: "En savoir plus",
  },
  "a-propos-qui-sommes-nous": {
    meta_title: "Qui sommes-nous ?",
    meta_description:
      "GEM IMMOBILIER est une agence immobilière créée en 2014, agréée par le Ministère de la Construction, membre de la CDAIM et de la CCIF-CI.",
    back_link: "← Retour à propos",
    h1: "Qui sommes-nous ?",
    hero_sub: "Une agence immobilière de confiance, au service de vos projets depuis 2014.",
    histoire_h2: "Notre histoire",
    histoire_p1:
      "GEM IMMOBILIER est une agence immobilière créée en 2014 sous forme d'une Société à Responsabilité Limitée (SARL), au capital de trois millions de francs CFA (3 000 000 F CFA), immatriculée au registre de commerce et de Crédit immobilier (RCCM: CI-ABJ-03-2014-B13-04343).",
    histoire_p2:
      "Depuis 2014, elle est agréée par le Ministère de la Construction, du Logement et de l'Urbanisme par arrêté ministériel n°14-0018 du 20 juin 2014.",
    histoire_p3:
      "GEM IMMOBILIER est membre de la Chambre du Droit des Affaires et de l'Immobilier en Côte d'Ivoire (CDAIM) et également de la Chambre de Commerce et de l'Industrie Française en Côte d'Ivoire (CCIF-CI).",
    figure_caption: "Agence GEM Immobilier",
    chiffre_1: "Créée en 2014",
    chiffre_2: "Agréée par le Ministère",
    chiffre_3: "Membre CDAIM & CCIF-CI",
    image_histoire: "",
  },
  "a-propos-mission-valeurs": {
    meta_title: "Mission — Vision — Valeurs",
    meta_description:
      "Mission, vision 2030 et valeurs de GEM IMMOBILIER : sécuriser vos biens, optimiser vos investissements, agence de référence.",
    back_link: "← Retour à propos",
    h1: "MISSION - VISION - VALEURS",
    hero_sub:
      "Notre raison d’être, notre ambition et les principes qui fondent la confiance de nos clients et partenaires.",
    mission_h2: "Notre mission",
    mission_body:
      "Sécuriser vos biens et\noptimiser vos investissements\nen vous accompagnant autrement.",
    vision_h2: "Notre vision",
    vision_body:
      "Nous voulons, à l’horizon 2030,\nêtre une agence de référence\nperformante et attractive, capable d’offrir\nà chacun selon ses besoins les meilleurs\nservices immobiliers.",
    valeurs_h2: "Nos valeurs",
    valeurs_intro:
      "Depuis 10 ans GEM IMMOBILIER cultive\ndes valeurs de référence\nqui lui ont permis de gagner la confiance\nde ses clients et partenaires.",
    valeur_0_title: "Responsabilité",
    valeur_0_desc: "Assumer nos engagements envers clients, partenaires et parties prenantes.",
    valeur_1_title: "Satisfaction client",
    valeur_1_desc: "Placer l’écoute et la qualité de service au centre de chaque relation.",
    valeur_2_title: "Confidentialité",
    valeur_2_desc: "Protéger vos informations et la discrétion de vos dossiers.",
    valeur_3_title: "Esprit d’équipe",
    valeur_3_desc: "Fédérer les compétences pour des réponses coordonnées et efficaces.",
    valeur_4_title: "Ponctualité",
    valeur_4_desc: "Respecter les délais et les rendez-vous qui vous sont promis.",
  },
  "a-propos-galerie": {
    meta_title: "Galerie photos",
    meta_description: "Photos de l'agence GEM IMMOBILIER — à distinguer des annonces publiées dans Nos offres.",
    back_link: "← Retour à propos",
    h1: "Galerie photos",
    intro: "Images liées à l'agence uniquement. Les photos des biens à vendre ou à louer se trouvent dans Nos offres.",
    galerie_organigramme_heading: "Équipe de gestion de GEM IMMOBILIER",
    galerie_organigramme_image: "/galerie-photos/organigramme/organigramme-gem.png",
    galerie_album_heading: "Photos",
    galerie_images_json: "[]",
  },
  services: {
    meta_title: "Services",
    meta_description:
      "GEM IMMOBILIER intervient dans l’administration de biens, la gestion juridique et fiscale, la recherche et mise à disposition de biens, la conciergerie, l’estimation et la vente de biens immobiliers.",
    eyebrow: "Services",
    h1: "GEM Prestations : des services immobiliers complets.",
    intro:
      "GEM IMMOBILIER intervient dans l’administration et la gestion de biens, la recherche de logements à louer ou à acheter, l’estimation et la vente, ainsi que la conciergerie et le suivi de travaux.",
    ...serviceFields(),
    cta_title: "Parlons de ton projet",
    cta_body:
      "Décris ton besoin en 2 minutes, je te réponds avec une proposition claire.",
    cta_btn_contact: "Contacter GEM",
    cta_btn_biens: "Voir les biens",
  },
  contact: {
    meta_title: "Contact",
    meta_description:
      "Contactez GEM Immobilier : estimation, vente, achat, investissement. Réponse rapide.",
    eyebrow: "Contact",
    h1: "Dis-moi où tu en es, je te réponds clairement.",
    intro:
      "Cette page est volontairement “robuste” : accessible, champs propres, messages d’aide. On peut brancher l’envoi sur EmailJS, Formspree, ou une route API Next.js selon ton hébergement.",
    coords_title: "Coordonnées",
    tel_dt: "Téléphone",
    email_dt: "Email",
    zone_dt: "Adresse",
    form_title: "Formulaire",
    form_intro: "Envoyez-nous votre message, nous vous répondrons rapidement.",
    form_concern_prefix: "Votre demande concerne :",
    form_success: "Message envoyé avec succès. Nous vous répondrons rapidement.",
    label_nom: "Nom",
    placeholder_nom: "Votre nom",
    label_email: "Email",
    placeholder_email: "vous@exemple.com",
    label_tel: "Téléphone",
    placeholder_tel: "+225 00 00 00 00 00",
    label_sujet: "Sujet",
    placeholder_sujet: "Sujet de votre message",
    label_message: "Message",
    placeholder_message:
      "Décris ton besoin (type de bien, localisation, délai, budget, etc.)",
    form_submit: "Envoyer",
    form_submit_loading: "Envoi en cours…",
  },
  biens: {
    meta_title: "Biens",
    meta_description:
      "Sélection de biens et projets : annonces claires, critères essentiels, et prise de contact rapide.",
    eyebrow: "Biens",
    h1: "Une sélection lisible, des infos utiles, sans perte de temps.",
    intro:
      "Cette page est prête à être connectée à tes vraies annonces (ou à un outil). Pour l’instant, elle montre une structure robuste : cards, tags, CTA, et parcours contact.",
    empty_before:
      "Aucun bien n’est disponible pour le moment. Revenez bientôt ou ",
    empty_link: "contactez-nous",
    empty_after: " pour nous parler de votre projet.",
    cta_title: "Tu veux intégrer tes annonces automatiquement ?",
    cta_body:
      "Je peux brancher cette page à un JSON, un CMS (Sanity/Strapi), ou un export depuis ton outil.",
    cta_btn: "En discuter",
  },
  "mentions-legales": {
    meta_title: "Mentions légales",
    meta_description: "Mentions légales du site GEM Immobilier.",
    eyebrow: "Mentions légales",
    h1: "Mentions légales",
    ml_editeur_h2: "Éditeur du site",
    ml_editeur_strong: "GEM Immobilier",
    ml_editeur_adresse:
      "Adresse : Cocody, 2 plateaux AGHIEN, Las Palmas, Cité Sicogi Bâtiment C, porte 35, Abidjan (Côte d'Ivoire)",
    ml_editeur_tel:
      "Téléphone : +225 27 22 51 07 98, +225 05 75 22 94 76, +225 05 75 20 84 89, +225 05 75 22 95 76",
    ml_editeur_email: "Email : gemimmobilier14@gmail.com",
    ml_hebergement_h2: "Hébergement",
    ml_hebergement_p: "À renseigner (ex : Vercel, OVH, etc.).",
    ml_pi_h2: "Propriété intellectuelle",
    ml_pi_p:
      "Les éléments graphiques, textes et contenus du site sont la propriété de GEM Immobilier (sauf mention contraire). Toute reproduction est interdite sans autorisation.",
    ml_donnees_h2: "Données personnelles",
    ml_donnees_p:
      "Lorsque le formulaire de contact est activé, les données transmises sont utilisées uniquement pour répondre à la demande. Les modalités RGPD (finalités, durée, droits) seront renseignées selon l’outil d’envoi retenu.",
  },
  "politique-confidentialite": {
    meta_title: "Politique de confidentialité",
    meta_description:
      "Politique de confidentialité et protection des données de GEM Immobilier.",
    back_link: "← Retour à l'accueil",
    h1: "Politique de confidentialité",
    intro_note_prefix: "Dernière mise à jour :",
    p1:
      "GEM Immobilier s'engage à protéger la vie privée des utilisateurs de son site. Les données collectées via les formulaires de contact sont utilisées uniquement pour répondre à vos demandes et ne sont pas transmises à des tiers.",
    p2:
      "Pour toute question relative à vos données personnelles, contactez-nous à l'adresse indiquée sur notre page Contact.",
  },
};

export const SITE_CONTENT_PAGE_LABELS: Record<SitePageSlug, string> = {
  accueil: "Accueil",
  "a-propos": "À propos (accueil rubrique)",
  "a-propos-qui-sommes-nous": "À propos — Qui sommes-nous",
  "a-propos-mission-valeurs": "À propos — Mission, vision & valeurs",
  "a-propos-galerie": "À propos — Galerie",
  services: "Services",
  contact: "Contact",
  "coordonnees-agence": "Coordonnées agence (footer, accueil, carte)",
  biens: "Biens (liste)",
  "mentions-legales": "Mentions légales",
  "politique-confidentialite": "Politique de confidentialité",
};

export const SITE_CONTENT_GALLERY_JSON_KEY = "galerie_images_json" as const;

/** Champs dont la valeur est une URL d’image (upload dans l’admin). */
export const SITE_CONTENT_SINGLE_IMAGE_FIELDS: Partial<
  Record<SitePageSlug, readonly string[]>
> = {
  accueil: ["image_hero_main", "image_hero_side", "image_about"],
  "a-propos-qui-sommes-nous": ["image_histoire"],
  "a-propos-galerie": ["galerie_organigramme_image"],
};

export function isSiteContentSingleImageField(
  slug: SitePageSlug,
  key: string,
): boolean {
  return Boolean(SITE_CONTENT_SINGLE_IMAGE_FIELDS[slug]?.includes(key));
}

export function isSiteContentGalleryJsonField(
  slug: SitePageSlug,
  key: string,
): boolean {
  return slug === "a-propos-galerie" && key === SITE_CONTENT_GALLERY_JSON_KEY;
}

/** Si vide après saisie, rétablit le placeholder SVG (accueil seulement). */
export const SITE_CONTENT_HERO_IMAGE_FALLBACK_KEYS: Partial<
  Record<SitePageSlug, readonly string[]>
> = {
  accueil: ["image_hero_main", "image_hero_side"],
};

/** Si chaînes vides en base (anciennes sauvegardes), rétablit titres + image organigramme / album. */
export const SITE_CONTENT_GALERIE_FALLBACK_KEYS: Partial<
  Record<SitePageSlug, readonly string[]>
> = {
  "a-propos-galerie": [
    "galerie_organigramme_image",
    "galerie_organigramme_heading",
    "galerie_album_heading",
  ],
};

/** Ordre d’affichage des champs dans l’admin (clés omises sont ajoutées à la fin). */
export const SITE_CONTENT_FIELD_ORDER: Record<SitePageSlug, string[]> = {
  accueil: [
    "meta_title",
    "meta_description",
    "hero_title_line1",
    "hero_title_brand",
    "hero_title_line2",
    "hero_subtitle",
    "hero_cta_biens",
    "hero_cta_contact",
    "image_hero_main",
    "image_hero_side",
    "about_title",
    "about_body",
    "image_about",
    "stat_1_value",
    "stat_1_label",
    "stat_2_value",
    "stat_2_label",
    "stat_3_value",
    "stat_3_label",
    "stat_4_value",
    "stat_4_label",
    "about_cta",
    "testimonials_heading",
    "t1_title",
    "t1_body",
    "t1_name",
    "t1_city",
    "t2_title",
    "t2_body",
    "t2_name",
    "t2_city",
    "t3_title",
    "t3_body",
    "t3_name",
    "t3_city",
    "t4_title",
    "t4_body",
    "t4_name",
    "t4_city",
    "t5_title",
    "t5_body",
    "t5_name",
    "t5_city",
    "cta_section_title",
    "phone_label",
    "email_label",
    "home_form_send",
    "home_form_success",
  ],
  "a-propos": [
    "meta_title",
    "meta_description",
    "eyebrow",
    "h1",
    "intro",
    "card_qui_title",
    "card_qui_desc",
    "card_mission_title",
    "card_mission_desc",
    "card_galerie_title",
    "card_galerie_desc",
    "card_link",
  ],
  "a-propos-qui-sommes-nous": [
    "meta_title",
    "meta_description",
    "back_link",
    "h1",
    "hero_sub",
    "histoire_h2",
    "histoire_p1",
    "histoire_p2",
    "histoire_p3",
    "figure_caption",
    "image_histoire",
    "chiffre_1",
    "chiffre_2",
    "chiffre_3",
  ],
  "a-propos-mission-valeurs": [
    "meta_title",
    "meta_description",
    "back_link",
    "h1",
    "hero_sub",
    "mission_h2",
    "mission_body",
    "vision_h2",
    "vision_body",
    "valeurs_h2",
    "valeurs_intro",
    "valeur_0_title",
    "valeur_0_desc",
    "valeur_1_title",
    "valeur_1_desc",
    "valeur_2_title",
    "valeur_2_desc",
    "valeur_3_title",
    "valeur_3_desc",
    "valeur_4_title",
    "valeur_4_desc",
  ],
  "a-propos-galerie": [
    "meta_title",
    "meta_description",
    "back_link",
    "h1",
    "intro",
    "galerie_organigramme_heading",
    "galerie_organigramme_image",
    "galerie_album_heading",
    "galerie_images_json",
  ],
  services: [
    "meta_title",
    "meta_description",
    "eyebrow",
    "h1",
    "intro",
    ...serviceFieldOrder(),
    "cta_title",
    "cta_body",
    "cta_btn_contact",
    "cta_btn_biens",
  ],
  contact: [
    "meta_title",
    "meta_description",
    "eyebrow",
    "h1",
    "intro",
    "coords_title",
    "tel_dt",
    "email_dt",
    "zone_dt",
    "form_title",
    "form_intro",
    "form_concern_prefix",
    "form_success",
    "label_nom",
    "placeholder_nom",
    "label_email",
    "placeholder_email",
    "label_tel",
    "placeholder_tel",
    "label_sujet",
    "placeholder_sujet",
    "label_message",
    "placeholder_message",
    "form_submit",
    "form_submit_loading",
  ],
  "coordonnees-agence": [
    "meta_title",
    "meta_description",
    "agency_email",
    "agency_phones",
    "agency_address",
    "agency_map_lat",
    "agency_map_lng",
    "agency_map_title",
    "agency_map_intro",
  ],
  biens: [
    "meta_title",
    "meta_description",
    "eyebrow",
    "h1",
    "intro",
    "empty_before",
    "empty_link",
    "empty_after",
    "cta_title",
    "cta_body",
    "cta_btn",
  ],
  "mentions-legales": [
    "meta_title",
    "meta_description",
    "eyebrow",
    "h1",
    "ml_editeur_h2",
    "ml_editeur_strong",
    "ml_editeur_adresse",
    "ml_editeur_tel",
    "ml_editeur_email",
    "ml_hebergement_h2",
    "ml_hebergement_p",
    "ml_pi_h2",
    "ml_pi_p",
    "ml_donnees_h2",
    "ml_donnees_p",
  ],
  "politique-confidentialite": [
    "meta_title",
    "meta_description",
    "back_link",
    "h1",
    "intro_note_prefix",
    "p1",
    "p2",
  ],
};

function defaultFieldLabel(key: string): string {
  return key.replace(/_/g, " ");
}

export function siteContentFieldLabel(slug: SitePageSlug, key: string): string {
  const custom: Partial<Record<SitePageSlug, Record<string, string>>> = {
    accueil: {
      meta_title: "SEO — Titre",
      meta_description: "SEO — Description",
      hero_title_line1: "Accroche — Ligne 1",
      hero_title_brand: "Accroche — Mot mis en avant",
      hero_title_line2: "Accroche — Ligne 2",
      hero_subtitle: "Sous-titre hero",
      hero_cta_biens: "Bouton — Découvrir les biens",
      hero_cta_contact: "Bouton — Prendre rendez-vous",
      image_hero_main: "Photo — Hero principale",
      image_hero_side: "Photo — Hero encadré",
      image_about: "Photo — Bloc « Qui nous sommes » (vide = fond uni)",
      about_title: "Bloc « Qui nous sommes » — Titre",
      about_body: "Bloc « Qui nous sommes » — Texte",
      stat_1_value: "Chiffre 1 — Valeur",
      stat_1_label: "Chiffre 1 — Libellé",
      stat_2_value: "Chiffre 2 — Valeur",
      stat_2_label: "Chiffre 2 — Libellé",
      stat_3_value: "Chiffre 3 — Valeur",
      stat_3_label: "Chiffre 3 — Libellé",
      stat_4_value: "Chiffre 4 — Valeur",
      stat_4_label: "Chiffre 4 — Libellé",
      about_cta: "Lien — En savoir plus",
      testimonials_heading: "Témoignages — Titre de section",
      t1_title: "Témoignage 1 — Titre",
      t1_body: "Témoignage 1 — Texte",
      t1_name: "Témoignage 1 — Nom",
      t1_city: "Témoignage 1 — Ville",
      t2_title: "Témoignage 2 — Titre",
      t2_body: "Témoignage 2 — Texte",
      t2_name: "Témoignage 2 — Nom",
      t2_city: "Témoignage 2 — Ville",
      t3_title: "Témoignage 3 — Titre",
      t3_body: "Témoignage 3 — Texte",
      t3_name: "Témoignage 3 — Nom",
      t3_city: "Témoignage 3 — Ville",
      t4_title: "Témoignage 4 — Titre",
      t4_body: "Témoignage 4 — Texte",
      t4_name: "Témoignage 4 — Nom",
      t4_city: "Témoignage 4 — Ville",
      t5_title: "Témoignage 5 — Titre",
      t5_body: "Témoignage 5 — Texte",
      t5_name: "Témoignage 5 — Nom",
      t5_city: "Témoignage 5 — Ville",
      cta_section_title: "Bas de page — Titre",
      phone_label:
        "Bas de page — Libellé téléphone (les numéros viennent de « Coordonnées agence »)",
      email_label:
        "Bas de page — Libellé email (l’adresse mail vient de « Coordonnées agence »)",
      home_form_send: "Bouton envoi formulaire (section bas de page)",
      home_form_success: "Message affiché après envoi réussi du formulaire accueil",
    },
    contact: {
      tel_dt: "Coordonnées — Libellé « Téléphone » (liste depuis Coordonnées agence)",
      email_dt: "Coordonnées — Libellé « Email »",
      zone_dt: "Coordonnées — Libellé « Adresse »",
    },
    "coordonnees-agence": {
      meta_title: "SEO (non utilisé sur une page)",
      meta_description: "Note (non affichée sur le site)",
      agency_email: "Email affiché (footer, accueil, contact)",
      agency_phones: "Téléphones — un numéro par ligne (liens d’appel automatiques)",
      agency_address: "Adresse postale — une ligne par ligne (footer, carte, contact)",
      agency_map_lat: "Carte Mapbox — latitude (ex. 5.3622)",
      agency_map_lng: "Carte Mapbox — longitude (ex. -3.9937)",
      agency_map_title: "Accueil — titre au-dessus de la carte",
      agency_map_intro: "Accueil — texte d’intro sous le titre",
    },
    "a-propos-qui-sommes-nous": {
      image_histoire: "Photo — Encadré « Notre histoire » (vide = visuel GEM)",
    },
    "a-propos-galerie": {
      galerie_organigramme_heading: "Titre au-dessus de l’organigramme (séparé des autres photos)",
      galerie_organigramme_image:
        "Image organigramme (fichier statique possible dans /public/galerie-photos/organigramme/)",
      galerie_album_heading: "Titre au-dessus de la grille des autres photos",
      galerie_images_json:
        "Toutes les autres photos de la galerie — uploadées dans le dossier « galerie-album » du stockage",
    },
    "a-propos-mission-valeurs": {
      mission_h2: "Bloc — Titre mission",
      mission_body: "Bloc — Texte mission (sauts de ligne possibles)",
      vision_h2: "Bloc — Titre vision",
      vision_body: "Bloc — Texte vision (sauts de ligne possibles)",
      valeurs_h2: "Titre section valeurs",
      valeurs_intro: "Texte d’introduction avant les cartes",
      valeur_0_title: "Valeur 1 — Titre",
      valeur_0_desc: "Valeur 1 — Description",
      valeur_1_title: "Valeur 2 — Titre",
      valeur_1_desc: "Valeur 2 — Description",
      valeur_2_title: "Valeur 3 — Titre",
      valeur_2_desc: "Valeur 3 — Description",
      valeur_3_title: "Valeur 4 — Titre",
      valeur_3_desc: "Valeur 4 — Description",
      valeur_4_title: "Valeur 5 — Titre",
      valeur_4_desc: "Valeur 5 — Description",
    },
  };
  return custom[slug]?.[key] ?? defaultFieldLabel(key);
}

export function orderedContentKeys(slug: SitePageSlug): string[] {
  const defaults = SITE_CONTENT_DEFAULTS[slug];
  const order = SITE_CONTENT_FIELD_ORDER[slug];
  const rest = Object.keys(defaults).filter((k) => !order.includes(k));
  return [...order, ...rest];
}
