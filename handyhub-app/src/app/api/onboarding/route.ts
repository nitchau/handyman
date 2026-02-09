import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

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

    // 2. If contractor, create contractor profile
    if (role === "contractor" && extra.business_name) {
      const { error: contractorError } = await supabaseAdmin
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
          },
          { onConflict: "user_id", ignoreDuplicates: false }
        );

      if (contractorError) {
        console.error("[onboarding] Contractor insert error:", contractorError);
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
