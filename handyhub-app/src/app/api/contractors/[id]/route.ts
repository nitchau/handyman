import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  // Fetch contractor + joined user profile
  const { data: contractor, error } = await supabaseAdmin
    .from("contractors")
    .select(
      `
      id,
      user_id,
      business_name,
      bio,
      years_experience,
      hourly_rate,
      service_radius_miles,
      verification_tier,
      license_number,
      insurance_verified,
      rating_avg,
      review_count,
      latitude,
      longitude,
      created_at,
      users_profile!contractors_user_id_fkey (
        first_name,
        last_name,
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !contractor) {
    return NextResponse.json(
      { error: "Contractor not found" },
      { status: 404 }
    );
  }

  // Fetch category skills
  const { data: skills } = await supabaseAdmin
    .from("contractor_skills")
    .select(
      `
      categories!contractor_skills_category_id_fkey (
        name,
        slug
      )
    `
    )
    .eq("contractor_id", id);

  const categories = (skills ?? []).map((s: Record<string, unknown>) => {
    const cat = s.categories as { name: string; slug: string };
    return { name: cat.name, slug: cat.slug };
  });

  const profile = contractor.users_profile as unknown as {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };

  return NextResponse.json({
    id: contractor.id,
    user_id: contractor.user_id,
    business_name: contractor.business_name,
    display_name: `${profile.first_name} ${profile.last_name}`,
    avatar_url: profile.avatar_url,
    bio: contractor.bio,
    years_experience: contractor.years_experience,
    hourly_rate: contractor.hourly_rate,
    service_radius_miles: contractor.service_radius_miles,
    verification_tier: contractor.verification_tier,
    license_number: contractor.license_number,
    insurance_verified: contractor.insurance_verified,
    rating_avg: contractor.rating_avg,
    review_count: contractor.review_count,
    latitude: contractor.latitude,
    longitude: contractor.longitude,
    created_at: contractor.created_at,
    categories,
  });
}
