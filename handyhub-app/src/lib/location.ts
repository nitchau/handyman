// ── Location Persistence Helpers ──────────────────────────────────────

import { supabaseAdmin } from "@/lib/supabase/server";

export async function updateUserLocation(
  userId: string,
  lat: number,
  lng: number
) {
  const { error } = await supabaseAdmin
    .from("users_profile")
    .update({ latitude: lat, longitude: lng })
    .eq("id", userId);

  if (error) {
    console.error("[location] Failed to update user location:", error);
  }
  return !error;
}

export async function updateContractorLocation(
  contractorId: string,
  lat: number,
  lng: number,
  serviceRadiusMiles?: number
) {
  const updates: Record<string, unknown> = {
    latitude: lat,
    longitude: lng,
  };
  if (serviceRadiusMiles !== undefined) {
    updates.service_radius_miles = serviceRadiusMiles;
  }

  const { error } = await supabaseAdmin
    .from("contractors")
    .update(updates)
    .eq("id", contractorId);

  if (error) {
    console.error("[location] Failed to update contractor location:", error);
  }
  return !error;
}
