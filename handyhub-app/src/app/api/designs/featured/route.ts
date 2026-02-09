import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET /api/designs/featured — Featured/trending designs for homepage
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("design_ideas")
    .select(
      "*, designer:designer_profiles!designer_id(id, user_id, display_name, avatar_url, designer_tier, rating_avg, review_count)"
    )
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("view_count", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = (data ?? []).map((d) => ({ ...d, product_tags: [] }));
  return NextResponse.json({ data: results });
}
