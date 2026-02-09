import { NextRequest, NextResponse } from "next/server";
import { designIdeas } from "@/data/gallery-data";

// GET /api/designs — Browse/search design ideas (filterable)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const room = searchParams.get("room");
  const style = searchParams.get("style");
  const budget = searchParams.get("budget");
  const sort = searchParams.get("sort") ?? "trending";
  const q = searchParams.get("q")?.toLowerCase();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);

  let results = designIdeas.filter((d) => d.is_published);

  if (room && room !== "all") {
    results = results.filter((d) => d.room_type === room);
  }
  if (style && style !== "all") {
    results = results.filter((d) => d.style === style);
  }
  if (budget && budget !== "all") {
    const budgetMap: Record<string, [number, number]> = {
      "under1k": [0, 1000],
      "1k-5k": [1000, 5000],
      "5k-15k": [5000, 15000],
      "15k+": [15000, Infinity],
    };
    const range = budgetMap[budget];
    if (range) {
      results = results.filter(
        (d) => d.estimated_cost !== null && d.estimated_cost >= range[0] && d.estimated_cost < range[1]
      );
    }
  }
  if (q) {
    results = results.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort
  const sorted = [...results];
  switch (sort) {
    case "newest":
      sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
      break;
    case "most_liked":
      sorted.sort((a, b) => b.like_count - a.like_count);
      break;
    case "most_saved":
      sorted.sort((a, b) => b.save_count - a.save_count);
      break;
    default: // trending — by view_count
      sorted.sort((a, b) => b.view_count - a.view_count);
  }

  const total = sorted.length;
  const start = (page - 1) * limit;
  const paginated = sorted.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/designs — Create new design idea (designer)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newIdea = {
    id: crypto.randomUUID(),
    designer_id: "current_user",
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
    product_tags: [],
    linked_bom_id: null,
    view_count: 0,
    like_count: 0,
    save_count: 0,
    share_count: 0,
    is_published: body.is_published ?? false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log("[mock] Created design idea:", newIdea.id);
  return NextResponse.json({ data: newIdea }, { status: 201 });
}
