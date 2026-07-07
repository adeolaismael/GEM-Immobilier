import { getMergedSiteContent } from "@/lib/site-content";

export type AgencyContact = {
  email: string;
  phones: { display: string; href: string }[];
  addressLines: string[];
  mapCenter: { lat: number; lng: number };
  mapSectionTitle: string;
  mapSectionIntro: string;
};

const DEFAULT_PHONES_BLOCK = [
  "+225 27 22 51 07 98",
  "+225 05 75 22 94 76",
  "+225 05 75 20 84 89",
  "+225 05 75 22 95 76",
].join("\n");

const DEFAULT_ADDRESS_BLOCK = [
  "Cocody, 2 plateaux AGHIEN",
  "Las Palmas",
  "Cité Sicogi Bâtiment C, porte 35",
].join("\n");

const DEFAULT_LAT = 5.3622;
const DEFAULT_LNG = -3.9937;

function parseMultiline(s: string): string[] {
  return s
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function phonesFromText(text: string): { display: string; href: string }[] {
  return parseMultiline(text).map((line) => {
    const display = line.trim();
    const compact = display.replace(/\s/g, "");
    const href = compact.startsWith("tel:") ? compact : `tel:${compact}`;
    return { display, href };
  });
}

function parseCoord(raw: string, fallback: number, isLat: boolean): number {
  const n = parseFloat(String(raw).replace(",", ".").trim());
  if (Number.isNaN(n)) return fallback;
  if (isLat && (n < -90 || n > 90)) return fallback;
  if (!isLat && (n < -180 || n > 180)) return fallback;
  return n;
}

/** À partir du contenu fusionné de la page CMS `coordonnees-agence`. */
export function parseAgencyContactFromMerged(
  raw: Record<string, string>,
): AgencyContact {
  const phonesText = raw.agency_phones?.trim() ?? "";
  let phones = phonesFromText(phonesText);
  if (phones.length === 0) phones = phonesFromText(DEFAULT_PHONES_BLOCK);

  const addrText = raw.agency_address?.trim() ?? "";
  let addressLines = parseMultiline(addrText);
  if (addressLines.length === 0) addressLines = parseMultiline(DEFAULT_ADDRESS_BLOCK);

  const email =
    raw.agency_email?.trim() || "gemimmobilier14@gmail.com";

  const lat = parseCoord(raw.agency_map_lat ?? "", DEFAULT_LAT, true);
  const lng = parseCoord(raw.agency_map_lng ?? "", DEFAULT_LNG, false);

  return {
    email,
    phones,
    addressLines,
    mapCenter: { lat, lng },
    mapSectionTitle: raw.agency_map_title?.trim() || "Notre adresse",
    mapSectionIntro:
      raw.agency_map_intro?.trim() ||
      "Venez nous rencontrer à notre siège à Cocody, 2 plateaux AGHIEN — Las Palmas.",
  };
}

export async function getAgencyContact(): Promise<AgencyContact> {
  const c = await getMergedSiteContent("coordonnees-agence");
  return parseAgencyContactFromMerged(c);
}
