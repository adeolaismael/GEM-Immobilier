"use client";

import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

type Props = {
  latitude: number;
  longitude: number;
  addressLines: string[];
  className?: string;
  height?: number;
};

export function AgenceMapbox({
  latitude,
  longitude,
  addressLines,
  className = "",
  height = 380,
}: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [popupOpen, setPopupOpen] = useState(true);

  if (!token) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-[#f3f4f6] ring-1 ring-[color:var(--card-border)] ${className}`}
        style={{ height }}
      >
        <p className="max-w-sm px-4 text-center text-sm text-[color:var(--muted)]">
          Ajoutez <code className="rounded bg-black/5 px-1 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> dans
          votre fichier d’environnement pour afficher la carte.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl ring-1 ring-[color:var(--card-border)] shadow-soft ${className}`}
      style={{ height }}
    >
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude,
          latitude,
          zoom: 16,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
        attributionControl
      >
        <Marker
          longitude={longitude}
          latitude={latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupOpen(true);
          }}
        >
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0"
            aria-label="Afficher l’adresse de l’agence"
          >
            <svg
              width="36"
              height="44"
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
          </button>
        </Marker>

        {popupOpen && (
          <Popup
            longitude={longitude}
            latitude={latitude}
            anchor="top"
            onClose={() => setPopupOpen(false)}
            closeButton
            closeOnClick={false}
            offset={12}
          >
            <div className="max-w-[220px] p-1 text-[color:var(--foreground)]">
              <p className="text-sm font-bold">GEM Immobilier</p>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
