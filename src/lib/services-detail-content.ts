import type { ServiceSlug } from "./services-catalog";

export type ServiceDetailBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h3"; text: string };

export type ServiceDetailDefinition = {
  title: string;
  metaDescription: string;
  figureCaption: string;
  blocks: ServiceDetailBlock[];
};

export const SERVICE_DETAILS: Record<ServiceSlug, ServiceDetailDefinition> = {
  "administration-de-biens": {
    title: "Administration de biens",
    metaDescription:
      "Gestion locative complète : locataires, loyers, quittances, états de gestion, recouvrement, baux, représentation. GEM Immobilier.",
    figureCaption: "Administration de biens",
    blocks: [
      {
        type: "ul",
        items: [
          "entretenir le lien avec les locataires ;",
          "encaisser les loyers, charges ;",
          "délivrer quittances loyers ;",
          "rendre compte de la gestion mensuelle ou trimestriellement en un état détaillé appuyé des justificatifs, permettant au propriétaire d’avoir une bonne compréhension de l’état de gestion qui lui sera remis et reverser au propriétaire sa quote-part ; à défaut de paiement des loyers ou charges comme en cas d’autres contestations, exercer les poursuites qui seront nécessaires : mise en demeure, recouvrement amiable, recouvrement par voie judiciaire, procédure d’expulsion ;",
          "effectuer toutes locations pour la durée et aux prix, charges et conditions que le mandataire avisera en respectant strictement les conditions fixées par la Loi, tout ou partie de l’immeuble ;",
          "passer et renouveler tous baux, faire dresser tous états des lieux, donner et accepter tous congés, résilier lesdits baux ;",
          "procéder à la recherche de locataire, la rédaction du contrat de location ;",
          "représenter le mandant devant toute administration.",
        ],
      },
    ],
  },

  "gestion-juridique-fiscale": {
    title: "Suivi / gestion juridique et fiscale des biens",
    metaDescription:
      "Impôts fonciers, déclarations, contentieux fiscal et accompagnement juridique (baux, mises en demeure). GEM Immobilier.",
    figureCaption: "Gestion juridique & fiscale",
    blocks: [
      {
        type: "p",
        text: "Pour le suivi et la gestion de vos dossiers fiscaux (impôts fonciers), GEM IMMOBILIER propose un service personnalisé et discret à ses clients :",
      },
      {
        type: "ul",
        items: [
          "établir pour le client un calendrier de déclarations et de paiements d’impôts fonciers ;",
          "déclaration et paiement d’impôts fonciers ;",
          "déclaration et paiement d’acompte d’impôt sur le revenu locatif (acompte 15 % ou 12 %) ;",
          "conseils en matière d’impôts fonciers ;",
          "gestion des contentieux en matière d’impôts fonciers devant l’administration fiscale.",
        ],
      },
      {
        type: "p",
        text: "GEM IMMOBILIER vous propose également des services juridiques en matière immobilière :",
      },
      {
        type: "ul",
        items: [
          "rédaction de contrat de bail ;",
          "analyse de contrat de bail ;",
          "formation sur le bail commercial ou d’habitation ;",
          "rédaction de mise en demeure ;",
          "conseils en matière de baux.",
        ],
      },
    ],
  },

  "recherche-biens": {
    title: "Recherche et mise à disposition de biens à acheter et à louer",
    metaDescription:
      "Sélection de biens selon vos critères, conseils et alertes personnalisées. GEM Immobilier.",
    figureCaption: "Recherche de biens",
    blocks: [
      {
        type: "p",
        text: "Lorsque vous manifestez le besoin de louer ou d’acheter un bien immobilier, nous mettons à votre disposition une liste de biens répondant à vos critères en assurant la qualité des offres. Dans l’hypothèse où vous n’auriez pas de critères particuliers, nos conseils, en fonction de vos besoins, vous orienteront dans vos choix. Aussi, lorsque nos offres disponibles ne correspondent pas à vos critères recherchés, ou lorsque votre budget est en dessous du prix du bien disponible, nous nous proposons, avec votre accord, de rechercher et de vous proposer des biens à acheter ou à louer selon votre choix préalablement précisé dans le formulaire d’alerte.",
      },
    ],
  },

  "conciergerie-travaux": {
    title: "Conciergerie et suivi des travaux",
    metaDescription:
      "CIE, SODECI, concierges, travaux, petit bricolage, formation de gardiens. GEM Immobilier.",
    figureCaption: "Conciergerie & travaux",
    blocks: [
      {
        type: "p",
        text: "GEM IMMOBILIER vous propose les services ci-dessous :",
      },
      {
        type: "ul",
        items: [
          "les formalités d’électricité (CIE) et l’eau (SODECI), telles que des abonnements, réabonnements, mutations et installation ;",
          "proposition de concierges d’immeubles ;",
          "installation de surpresseur et réserve d’eau ;",
          "suivi des travaux à la charge du propriétaire ;",
          "les petits travaux de plomberie, d’électricité, de peinture, de menuiserie, de carrelage… ;",
          "formation et mise à disposition de concierges professionnels ou gardiens d’immeubles (stage pratique, immersion sur le site).",
        ],
      },
    ],
  },

  "estimation-immobilier": {
    title: "Estimation de bien immobilier",
    metaDescription:
      "Estimation de valeur, prix de marché, loyers, attestations pour dossiers bancaires. GEM Immobilier.",
    figureCaption: "Estimation immobilière",
    blocks: [
      {
        type: "p",
        text: "Chaque bien immobilier est unique, ne serait-ce que par son emplacement. Il existe donc plusieurs critères à étudier pour établir la véritable valeur d’un immeuble, d’un appartement, d’un studio ou un terrain. Lorsque vous désirez vendre votre bien immobilier, la détermination du prix est très importante, parce que si vous demandez un prix trop élevé, vous ne vendrez qu’après de très longs mois d’attente, voire jamais. Il est primordial de bien fixer son prix de vente par rapport au prix du marché immobilier actuel. Dès lors, faire évaluer la valeur de son bien immobilier est une étape cruciale pour réussir sa vente.",
      },
      {
        type: "p",
        text: "GEM IMMOBILIER vous offre des services d’estimations de biens pour optimiser votre vente.",
      },
      {
        type: "p",
        text: "Aussi, pour vos investissements immobiliers, GEM IMMOBILIER vous oriente sur :",
      },
      {
        type: "ul",
        items: [
          "le type de bien à réaliser ou à acheter par rapport à la situation géographique ;",
          "le prix des loyers à fixer par rapport au montant des loyers dans la zone.",
        ],
      },
      {
        type: "p",
        text: "Enfin, pour vos dossiers bancaires, GEM IMMOBILIER vous délivre les attestations de valeur locative.",
      },
    ],
  },

  "vente-biens": {
    title: "Vente de biens immobiliers",
    metaDescription:
      "Mise en vente de villas, appartements et terrains : annonce à la signature chez le notaire. GEM Immobilier.",
    figureCaption: "Vente de biens",
    blocks: [
      {
        type: "h3",
        text: "Villas — Appartements — Terrains",
      },
      {
        type: "p",
        text: "Vendre votre bien par l’agence GEM IMMOBILIER vous apporte de nombreux avantages :",
      },
      {
        type: "p",
        text: "VOUS NE VOUS OCCUPEZ DE RIEN ! De la rédaction de l’annonce à la publicité et à la gestion des visites en passant par les nombreuses formalités qu’il faut effectuer entre l’avant-contrat et la signature de l’acte définitif (chez le notaire).",
      },
      {
        type: "p",
        text: "Assistance jusqu’à la vente de votre bien pour la constitution du dossier vente (rédaction du mandat de vente, diagnostic technique, estimation de prix, visites commerciales, rencontre du notaire, etc.).",
      },
      {
        type: "p",
        text: "Pour tout type de bien, GEM IMMOBILIER concentre toutes les compétences et les outils nécessaires à la satisfaction du client.",
      },
      {
        type: "p",
        text: "Quelques astuces « pour créer un coup de cœur » auprès des potentiels acquéreurs :",
      },
      {
        type: "ol",
        items: [
          "Fixer le bon prix pour votre bien immobilier",
          "Soigner l’apparence de votre bien",
          "Faire les travaux nécessaires et réparer les dégâts",
          "Préparer en amont tous les documents nécessaires pour la vente",
        ],
      },
    ],
  },
};
