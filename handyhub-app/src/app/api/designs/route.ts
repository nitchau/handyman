import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET /api/designs — Browse/search design ideas (filterable)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const room = searchParams.get("room");
  const style = searchParams.get("style");
  const budget = searchParams.get("budget");
  const sort = searchParams.get("sort") ?? "trending";
  const q = searchParams.get("q")?.toLowerCase();
  const diy = searchParams.get("diy");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("design_ideas")
    .select(
      "*, designer:designer_profiles!designer_id(id, user_id, display_name, avatar_url, designer_tier, rating_avg, review_count, specialties, location_city, location_state, is_accepting_clients)",
      { count: "exact" }
    )
    .eq("is_published", true);

  if (room && room !== "all") {
    query = query.eq("room_type", room);
  }
  if (style && style !== "all") {
    query = query.eq("style", style);
  }
  if (diy === "true") {
    query = query.eq("is_diy_friendly", true);
  }
  if (budget && budget !== "all") {
    const budgetMap: Record<string, string> = {
      "under1k": "budget_under_1000",
      "1k-5k": "mid_1000_5000",
      "5k-15k": "premium_5000_15000",
      "15k+": "luxury_15000_plus",
    };
    const tier = budgetMap[budget];
    if (tier) {
      query = query.eq("budget_tier", tier);
    }
  }
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // Sort
  switch (sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "most_liked":
      query = query.order("like_count", { ascending: false });
      break;
    case "most_saved":
      query = query.order("save_count", { ascending: false });
      break;
    default: // trending — by view_count
      query = query.order("view_count", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch product tags for each design
  const ids = (data ?? []).map((d) => d.id);
  let products: Record<string, unknown[]> = {};
  if (ids.length > 0) {
    const { data: productRows } = await supabaseAdmin
      .from("design_idea_products")
      .select("*")
      .in("design_idea_id", ids)
      .order("sort_order", { ascending: true });

    if (productRows) {
      for (const p of productRows) {
        if (!products[p.design_idea_id]) products[p.design_idea_id] = [];
        products[p.design_idea_id].push(p);
      }
    }
  }

  const results = (data ?? []).map((d) => ({
    ...d,
    product_tags: products[d.id] ?? [],
  }));

  const total = count ?? 0;
  return NextResponse.json({
    data: results,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/designs — Create new design idea (designer)
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("design_ideas")
    .insert({
      designer_id: body.designer_id,
      title: body.title ?? "",
      description: body.description ?? "",
      room_type: body.room_type ?? "living_room",
      style: body.style ?? "modern",
      budget_tier: body.budget_tier ?? "mid_1000_5000",
      estimated_cost: body.estimated_cost ?? null,
      difficulty_level: body.difficulty_level ?? "beginner",
      is_diy_friendly: body.is_diy_friendly ?? true,
      media_urls: body.media_urls ?? [],
      primary_photo_url: body.primary_photo_url ?? "",
      before_photo_url: body.before_photo_url ?? null,
      tags: body.tags ?? [],
      is_published: body.is_published ?? false,
      is_featured: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
