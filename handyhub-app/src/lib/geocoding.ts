// ── Server-side Geocoding (Google Geocoding REST API) ─────────────────

const API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ??
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
  "";

interface GeocodingResult {
  address: string;
  lat: number;
  lng: number;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  if (!API_KEY) {
    console.warn("[geocoding] No API key configured");
    return null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("components", "country:US");

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = await res.json();
  if (data.status !== "OK" || !data.results?.length) return null;

  const result = data.results[0];
  const loc = result.geometry.location;

  return {
    address: result.formatted_address,
    lat: loc.lat,
    lng: loc.lng,
    city: extractComponent(result, "locality"),
    state: extractComponent(result, "administrative_area_level_1", true),
    zip: extractComponent(result, "postal_code"),
  };
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodingResult | null> {
  if (!API_KEY) {
    console.warn("[geocoding] No API key configured");
    return null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("latlng", `${lat},${lng}`);
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = await res.json();
  if (data.status !== "OK" || !data.results?.length) return null;

  const result = data.results[0];

  return {
    address: result.formatted_address,
    lat,
    lng,
    city: extractComponent(result, "locality"),
    state: extractComponent(result, "administrative_area_level_1", true),
    zip: extractComponent(result, "postal_code"),
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractComponent(
  result: any,
  type: string,
  shortName = false
): string | null {
  const comp = result.address_components?.find((c: any) =>
    c.types.includes(type)
  );
  return comp ? (shortName ? comp.short_name : comp.long_name) : null;
}
