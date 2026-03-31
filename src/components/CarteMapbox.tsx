"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import type { Bien } from "@/types";
import "mapbox-gl/dist/mapbox-gl.css";

const ABIDJAN_CENTER = { lng: -4.0083, lat: 5.36 } as const;
const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

type Props = {
  biens: Bien[];
  center?: { lng: number; lat: number };
  zoom?: number;
  height?: number;
  single?: boolean;
};

function formatPrix(prix: number): string {
  if (prix === 0) return "Prix sur demande";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(prix);
}

export function CarteMapbox({
  biens,
  center = ABIDJAN_CENTER,
  zoom = 11,
  height = 500,
  single = false,
}: Props) {
  const mapRef = useRef<React.ComponentRef<typeof Map>>(null);
  const [popupBien, setPopupBien] = useState<Bien | null>(null);

  const biensAvecCoords = biens.filter(
    (b) =>
      b.latitude != null &&
      b.longitude != null &&
      !Number.isNaN(b.latitude) &&
      !Number.isNaN(b.longitude)
  );

  const fitBounds = useCallback(() => {
    if (biensAvecCoords.length === 0 || !mapRef.current) return;
    const map = mapRef.current.getMap();
    if (!map) return;

    const bounds = biensAvecCoords.reduce(
      (acc, b) => {
        acc.minLng = Math.min(acc.minLng, b.longitude!);
        acc.maxLng = Math.max(acc.maxLng, b.longitude!);
        acc.minLat = Math.min(acc.minLat, b.latitude!);
        acc.maxLat = Math.max(acc.maxLat, b.latitude!);
        return acc;
      },
      {
        minLng: Infinity,
        maxLng: -Infinity,
        minLat: Infinity,
        maxLat: -Infinity,
      }
    );

    if (bounds.minLng === Infinity) return;

    map.fitBounds(
      [
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
      ],
      { padding: 50, maxZoom: 14 }
    );
  }, [biensAvecCoords]);

  useEffect(() => {
    if (!single && biensAvecCoords.length > 1) {
      fitBounds();
    }
  }, [biensAvecCoords.length, single, fitBounds]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gray-100 ring-1 ring-[color:var(--card-border)]"
        style={{ height }}
      >
        <p className="text-sm text-[color:var(--muted)]">
          Configurez NEXT_PUBLIC_MAPBOX_TOKEN pour afficher la carte
        </p>
      </div>
    );
  }

  if (biensAvecCoords.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gray-100 ring-1 ring-[color:var(--card-border)]"
        style={{ height }}
      >
        <p className="text-sm text-[color:var(--muted)]">
          Aucun bien avec localisation disponible
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl ring-1 ring-[color:var(--card-border)]"
      style={{ height }}
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: single ? 14 : zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
      >
        {biensAvecCoords.map((bien) => (
          <Marker
            key={bien.id}
            longitude={bien.longitude!}
            latitude={bien.latitude!}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupBien(bien);
            }}
          >
            <div className="cursor-pointer">
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
                  fill="#8a8f00"
                />
                <circle cx="16" cy="16" r="6" fill="white" />
              </svg>
            </div>
          </Marker>
        ))}

        {popupBien && (
          <Popup
            longitude={popupBien.longitude!}
            latitude={popupBien.latitude!}
            anchor="bottom"
            onClose={() => setPopupBien(null)}
            closeButton
            closeOnClick={false}
          >
            <div className="min-w-[200px] p-1">
              <h3 className="font-semibold text-[color:var(--foreground)]">
                {popupBien.titre}
              </h3>
              <p className="mt-1 text-sm font-medium text-[color:var(--brand)]">
                {formatPrix(popupBien.prix)}
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                {[popupBien.ville, popupBien.quartier]
                  .filter(Boolean)
                  .join(" • ") || "—"}
              </p>
              <a
                href={`/biens/${popupBien.slug}`}
                className="mt-2 inline-block text-xs font-medium text-[color:var(--brand)] underline underline-offset-2 hover:no-underline"
              >
                Voir le détail
              </a>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
