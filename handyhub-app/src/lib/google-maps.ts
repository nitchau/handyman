// ── Google Maps Configuration ─────────────────────────────────────────

export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID",
  defaultCenter: { lat: 37.7749, lng: -122.4194 }, // San Francisco
  defaultZoom: 12,
} as const;

/** Haversine distance between two lat/lng pairs, in miles. */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Compute google.maps.LatLngBounds from a center + radius in miles. */
export function boundsFromRadius(
  center: { lat: number; lng: number },
  radiusMiles: number
): { north: number; south: number; east: number; west: number } {
  const latDelta = radiusMiles / 69.0;
  const lngDelta = radiusMiles / (69.0 * Math.cos(toRad(center.lat)));
  return {
    north: center.lat + latDelta,
    south: center.lat - latDelta,
    east: center.lng + lngDelta,
    west: center.lng - lngDelta,
  };
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
