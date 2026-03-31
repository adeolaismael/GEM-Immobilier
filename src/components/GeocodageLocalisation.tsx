"use client";

import { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type GeocodingFeature = {
  place_name: string;
  geometry: { coordinates: [number, number] };
};

type GeocodingResponse = {
  features: GeocodingFeature[];
};

type Props = {
  adresse: string;
  ville: string;
  quartier: string;
  latitude: number | null;
  longitude: number | null;
  onLatLngChange: (lat: number, lng: number) => void;
};

export function GeocodageLocalisation({
  adresse,
  ville,
  quartier,
  latitude,
  longitude,
  onLatLngChange,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const hasCoords =
    latitude != null &&
    longitude != null &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  async function handleLocaliser() {
    setError(null);
    setPlaceName(null);

    const query = [adresse, ville, quartier, "Côte d'Ivoire"]
      .filter(Boolean)
      .join(", ");

    if (!query.trim() || query === "Côte d'Ivoire") {
      setError("Saisissez au moins une adresse, une ville ou un quartier.");
      return;
    }

    if (!token) {
      setError("NEXT_PUBLIC_MAPBOX_TOKEN n'est pas configuré.");
      return;
    }

    setLoading(true);
    try {
      const encoded = encodeURIComponent(query);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}&country=CI&limit=1`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Erreur API: ${res.status}`);
      }

      const data: GeocodingResponse = await res.json();

      if (!data.features || data.features.length === 0) {
        setError("Adresse non trouvée. Essayez avec une autre formulation.");
        return;
      }

      const feature = data.features[0];
      const [lng, lat] = feature.geometry.coordinates;

      onLatLngChange(lat, lng);
      setPlaceName(feature.place_name);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la localisation."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="mt-2 text-xs text-amber-600">
        Configurez NEXT_PUBLIC_MAPBOX_TOKEN pour activer la géocodification.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <button
        type="button"
        onClick={handleLocaliser}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-[#5c7a1f]/10 px-4 py-2 text-sm font-medium text-[#5c7a1f] transition-colors hover:bg-[#5c7a1f]/20 disabled:opacity-60"
      >
        <span>📍</span>
        {loading ? "Recherche en cours…" : "Localiser automatiquement"}
      </button>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      {placeName && hasCoords && (
        <p className="text-sm text-gray-600">
          📍 Adresse trouvée : {placeName}
        </p>
      )}

      {hasCoords && (
        <div
          className="overflow-hidden rounded-lg ring-1 ring-gray-200"
          style={{ height: 200 }}
        >
          <Map
            mapboxAccessToken={token}
            initialViewState={{
              longitude,
              latitude,
              zoom: 14,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
          >
            <Marker
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
              draggable
              onDragEnd={(e) => {
                const { lng, lat } = e.lngLat;
                onLatLngChange(lat, lng);
              }}
            >
              <div className="cursor-grab active:cursor-grabbing">
                <svg
                  width="32"
                  height="40"
                  viewBox="0 0 32 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-md"
                >
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z"
                    fill="#5c7a1f"
                  />
                  <circle cx="16" cy="16" r="6" fill="white" />
                </svg>
              </div>
            </Marker>
          </Map>
        </div>
      )}
    </div>
  );
}
