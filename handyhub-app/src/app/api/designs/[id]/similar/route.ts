import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/designs/[id]/similar — Similar designs by room_type or style
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  // Fetch the current design to get its room_type and style
  const { data: idea, error: ideaError } = await supabaseAdmin
    .from("design_ideas")
    .select("id, room_type, style")
    .eq("id", id)
    .single();

  if (ideaError || !idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  // Query designs that share room_type or style, excluding current
  const { data, error } = await supabaseAdmin
    .from("design_ideas")
    .select(
      "*, designer:designer_profiles!designer_id(id, user_id, display_name, avatar_url, designer_tier, rating_avg, review_count)"
    )
    .eq("is_published", true)
    .neq("id", id)
    .or(`room_type.eq.${idea.room_type},style.eq.${idea.style}`)
    .order("view_count", { ascending: false })
    .limit(6);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add empty product_tags for consistency
  const results = (data ?? []).map((d) => ({ ...d, product_tags: [] }));

  return NextResponse.json({ data: results });
}
