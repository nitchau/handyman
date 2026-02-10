"use client";

import { useCallback, useEffect, useRef } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps";
import { Search } from "lucide-react";

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
  userLocation?: { lat: number; lng: number } | null;
  onMarkerClick?: (id: string) => void;
  onMarkerHover?: (id: string | null) => void;
  onCenterChanged?: (center: { lat: number; lng: number }) => void;
  onSearchThisArea?: () => void;
  showSearchAreaButton?: boolean;
  className?: string;
}

export function ContractorMap({
  contractors,
  center = GOOGLE_MAPS_CONFIG.defaultCenter,
  zoom = GOOGLE_MAPS_CONFIG.defaultZoom,
  selectedId,
  userLocation,
  onMarkerClick,
  onMarkerHover,
  onCenterChanged,
  onSearchThisArea,
  showSearchAreaButton = false,
  className = "",
}: ContractorMapProps) {
  const map = useMap();
  const hasInitialFit = useRef(false);

  // Auto-fit bounds to show all contractors
  useEffect(() => {
    if (!map || contractors.length === 0 || hasInitialFit.current) return;
    hasInitialFit.current = true;

    const bounds = new google.maps.LatLngBounds();
    contractors.forEach((c) => bounds.extend({ lat: c.lat, lng: c.lng }));
    if (userLocation) {
      bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
    }
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, contractors, userLocation]);

  // Reset fit flag when contractors change significantly
  useEffect(() => {
    hasInitialFit.current = false;
  }, [contractors.length]);

  const handleCameraChanged = useCallback(
    (ev: { detail: { center: { lat: number; lng: number } } }) => {
      onCenterChanged?.({
        lat: ev.detail.center.lat,
        lng: ev.detail.center.lng,
      });
    },
    [onCenterChanged]
  );

  return (
    <div
      className={`relative w-full h-full min-h-[400px] rounded-xl overflow-hidden ${className}`}
    >
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId={GOOGLE_MAPS_CONFIG.mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="w-full h-full"
        onCameraChanged={handleCameraChanged}
      >
        {/* User location blue dot */}
        {userLocation && (
          <AdvancedMarker
            position={{ lat: userLocation.lat, lng: userLocation.lng }}
          >
            <div className="relative">
              <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
              <div className="absolute inset-0 h-4 w-4 rounded-full bg-blue-500 animate-ping opacity-30" />
            </div>
          </AdvancedMarker>
        )}

        {/* Contractor pins */}
        {contractors.map((c) => (
          <AdvancedMarker
            key={c.id}
            position={{ lat: c.lat, lng: c.lng }}
            onClick={() => onMarkerClick?.(c.id)}
          >
            <div
              onMouseEnter={() => onMarkerHover?.(c.id)}
              onMouseLeave={() => onMarkerHover?.(null)}
              className={`
                flex items-center justify-center rounded-full px-2.5 py-1
                text-xs font-bold shadow-lg cursor-pointer transition-all duration-150
                ${
                  selectedId === c.id
                    ? "bg-emerald-600 text-white scale-125 z-10 ring-2 ring-emerald-300"
                    : "bg-white text-slate-900 border border-slate-200 hover:scale-110 hover:shadow-xl"
                }
              `}
            >
              {c.hourlyRate ? `$${c.hourlyRate}` : c.displayName.charAt(0)}
            </div>
          </AdvancedMarker>
        ))}
      </Map>

      {/* Search this area button */}
      {showSearchAreaButton && (
        <button
          onClick={onSearchThisArea}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          Search this area
        </button>
      )}
    </div>
  );
}
