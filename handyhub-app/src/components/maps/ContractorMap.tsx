"use client";

import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps";

interface ContractorPin {
  id: string;
  lat: number;
  lng: number;
  hourlyRate: number | null;
  displayName: string;
}

interface ContractorMapProps {
  contractors: ContractorPin[];
  center?: { lat: number; lng: number };
  zoom?: number;
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

export function ContractorMap({
  contractors,
  center = GOOGLE_MAPS_CONFIG.defaultCenter,
  zoom = GOOGLE_MAPS_CONFIG.defaultZoom,
  selectedId,
  onMarkerClick,
  className = "",
}: ContractorMapProps) {
  return (
    <div className={`w-full h-full min-h-[400px] rounded-xl overflow-hidden ${className}`}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId={GOOGLE_MAPS_CONFIG.mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="w-full h-full"
      >
        {contractors.map((c) => (
          <AdvancedMarker
            key={c.id}
            position={{ lat: c.lat, lng: c.lng }}
            onClick={() => onMarkerClick?.(c.id)}
          >
            <div
              className={`
                flex items-center justify-center rounded-full px-2 py-1
                text-xs font-bold shadow-lg cursor-pointer transition-transform
                ${
                  selectedId === c.id
                    ? "bg-blue-600 text-white scale-125 z-10"
                    : "bg-white text-slate-900 border border-slate-200 hover:scale-110"
                }
              `}
            >
              {c.hourlyRate ? `$${c.hourlyRate}` : c.displayName.charAt(0)}
            </div>
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
}
