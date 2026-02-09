import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/designers/[id] — Get designer profile + portfolio + services
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const { data: designer, error } = await supabaseAdmin
    .from("designer_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !designer) {
    return NextResponse.json({ error: "Designer not found" }, { status: 404 });
  }

  // Fetch portfolio (published design ideas)
  const { data: portfolio } = await supabaseAdmin
    .from("design_ideas")
    .select("*, designer:designer_profiles!designer_id(id, user_id, display_name, avatar_url, designer_tier, rating_avg, review_count)")
    .eq("designer_id", id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // Fetch active services
  const { data: services } = await supabaseAdmin
    .from("designer_services")
    .select("*")
    .eq("designer_id", id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return NextResponse.json({
    data: {
      ...designer,
      portfolio: (portfolio ?? []).map((d) => ({ ...d, product_tags: [] })),
      services: services ?? [],
    },
  });
}

// PATCH /api/designers/[id] — Update designer profile
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();

  const { id: _id, user_id: _uid, created_at: _ca, ...updates } = body;

  const { data, error } = await supabaseAdmin
    .from("designer_profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === "PGRST116" ? 404 : 500 });
  }

  return NextResponse.json({ data });
}
