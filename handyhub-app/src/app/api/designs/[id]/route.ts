import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/designs/[id] — Get single design idea with products
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const { data: idea, error } = await supabaseAdmin
    .from("design_ideas")
    .select(
      "*, designer:designer_profiles!designer_id(id, user_id, display_name, avatar_url, cover_photo_url, designer_tier, rating_avg, review_count, specialties, room_types, style_tags, bio, location_city, location_state, is_accepting_clients, years_experience, credentials, credential_verified, instagram_handle, tiktok_handle, pinterest_handle, response_time_hours, total_ideas_posted, total_likes, accepts_remote_clients)"
    )
    .eq("id", id)
    .single();

  if (error || !idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  // Fetch product tags
  const { data: productTags } = await supabaseAdmin
    .from("design_idea_products")
    .select("*")
    .eq("design_idea_id", id)
    .order("sort_order", { ascending: true });

  return NextResponse.json({
    data: { ...idea, product_tags: productTags ?? [] },
  });
}

// PATCH /api/designs/[id] — Update design idea
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();

  // Remove fields that shouldn't be updated directly
  const { id: _id, designer_id: _did, created_at: _ca, designer: _d, product_tags: _pt, ...updates } = body;

  const { data, error } = await supabaseAdmin
    .from("design_ideas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === "PGRST116" ? 404 : 500 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/designs/[id] — Delete design idea
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("design_ideas")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Design idea deleted" });
}
