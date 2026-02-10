import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocoding";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { role, first_name, last_name, phone, zip_code, ...extra } = body;

  if (!role || !first_name || !last_name || !zip_code) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // 1. Upsert users_profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users_profile")
      .upsert(
        {
          clerk_id: userId,
          email: body.email ?? "",
          first_name,
          last_name,
          phone: phone || null,
          zip_code,
          role,
          onboarding_completed: true,
        },
        { onConflict: "clerk_id" }
      )
      .select()
      .single();

    if (profileError) throw profileError;

    // 1b. Geocode zip code → store lat/lng on user profile
    let geoLat: number | null = null;
    let geoLng: number | null = null;
    if (zip_code) {
      const geo = await geocodeAddress(zip_code);
      if (geo) {
        geoLat = geo.lat;
        geoLng = geo.lng;
        await supabaseAdmin
          .from("users_profile")
          .update({ latitude: geoLat, longitude: geoLng })
          .eq("id", profile.id);
      }
    }

    // 2. If contractor, create contractor profile
    if (role === "contractor" && extra.business_name) {
      const { data: contractor, error: contractorError } = await supabaseAdmin
        .from("contractors")
        .upsert(
          {
            user_id: profile.id,
            business_name: extra.business_name,
            bio: extra.bio || null,
            years_experience: extra.years_experience ?? 0,
            hourly_rate: extra.hourly_rate ?? null,
            service_radius_miles: extra.service_radius_miles ?? 25,
            verification_tier: "new",
            rating_avg: 0,
            review_count: 0,
            latitude: geoLat,
            longitude: geoLng,
          },
          { onConflict: "user_id", ignoreDuplicates: false }
        )
        .select()
        .single();

      if (contractorError) {
        console.error("[onboarding] Contractor insert error:", contractorError);
      }

      // 2b. Insert contractor_skills from selected categories
      if (contractor && extra.categories?.length) {
        const { data: catRows } = await supabaseAdmin
          .from("categories")
          .select("id, slug")
          .in("slug", extra.categories);

        if (catRows?.length) {
          const skills = catRows.map((cat: { id: string }) => ({
            contractor_id: contractor.id,
            category_id: cat.id,
          }));
          const { error: skillsError } = await supabaseAdmin
            .from("contractor_skills")
            .upsert(skills, {
              onConflict: "contractor_id,category_id",
              ignoreDuplicates: true,
            });
          if (skillsError) {
            console.error("[onboarding] Skills insert error:", skillsError);
          }
        }
      }
    }

    // 3. If designer, create designer_profiles row
    if (role === "designer") {
      const { error: designerError } = await supabaseAdmin
        .from("designer_profiles")
        .upsert(
          {
            user_id: profile.id,
            display_name: `${first_name} ${last_name}`,
            bio: extra.bio || null,
            designer_tier: "community_creator",
          },
          { onConflict: "user_id", ignoreDuplicates: false }
        );

      if (designerError) {
        console.error("[onboarding] Designer profile insert error:", designerError);
      }
    }

    // 4. Sync role to Clerk publicMetadata so middleware can read it
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ data: profile });
  } catch (err) {
    console.error("[onboarding] Error:", err);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
