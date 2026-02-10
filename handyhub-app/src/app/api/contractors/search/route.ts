import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocoding";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  // Parse coordinates or address
  let lat = params.get("lat") ? parseFloat(params.get("lat")!) : null;
  let lng = params.get("lng") ? parseFloat(params.get("lng")!) : null;
  const address = params.get("address");

  // If only address provided, geocode it
  if ((!lat || !lng) && address) {
    const geo = await geocodeAddress(address);
    if (geo) {
      lat = geo.lat;
      lng = geo.lng;
    }
  }

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Provide lat/lng or a valid address" },
      { status: 400 }
    );
  }

  const radius = parseInt(params.get("radius") ?? "25", 10);
  const category = params.get("category") || null;
  const minRating = parseFloat(params.get("min_rating") ?? "0");
  const sort = params.get("sort") ?? "distance";
  const verifiedOnly = params.get("verified_only") === "true";
  const page = parseInt(params.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(params.get("limit") ?? "20", 10), 50);
  const offset = (page - 1) * limit;

  const { data, error } = await supabaseAdmin.rpc("nearby_contractors", {
    search_lat: lat,
    search_lng: lng,
    radius_miles: radius,
    category_slug: category,
    min_rating: minRating,
    sort_by: sort,
    page_limit: limit,
    page_offset: offset,
  });

  if (error) {
    console.error("[search] RPC error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }

  let results = data ?? [];

  // Filter verified-only client-side (simpler than adding to RPC)
  if (verifiedOnly) {
    results = results.filter(
      (r: Record<string, unknown>) => r.verification_tier !== "new"
    );
  }

  const totalCount = verifiedOnly
    ? results.length
    : results.length > 0
      ? Number(results[0].total_count)
      : 0;

  return NextResponse.json({
    results: results.map((r: Record<string, unknown>) => ({
      id: r.id,
      user_id: r.user_id,
      business_name: r.business_name,
      bio: r.bio,
      years_experience: r.years_experience,
      hourly_rate: r.hourly_rate,
      service_radius_miles: r.service_radius_miles,
      verification_tier: r.verification_tier,
      license_number: r.license_number,
      insurance_verified: r.insurance_verified,
      rating_avg: r.rating_avg,
      review_count: r.review_count,
      latitude: r.latitude,
      longitude: r.longitude,
      distance_miles: r.distance_miles,
      display_name: r.display_name,
      avatar_url: r.avatar_url,
      categories: r.categories,
    })),
    meta: {
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      center: { lat, lng },
    },
  });
}
