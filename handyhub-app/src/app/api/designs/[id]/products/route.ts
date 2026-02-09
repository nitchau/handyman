import { NextRequest, NextResponse } from "next/server";
import { designIdeas } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designs/[id]/products — Add product tag to design idea
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idea = designIdeas.find((d) => d.id === id);
  if (!idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  const body = await req.json();
  const newTag = {
    id: crypto.randomUUID(),
    design_idea_id: id,
    product_name: body.product_name ?? "",
    product_brand: body.product_brand ?? null,
    product_category: body.product_category ?? "other",
    estimated_price: body.estimated_price ?? 0,
    retailer_name: body.retailer_name ?? null,
    product_url: body.product_url ?? null,
    product_image_url: body.product_image_url ?? null,
    quantity_needed: body.quantity_needed ?? null,
    notes: body.notes ?? null,
    position_x: body.position_x ?? null,
    position_y: body.position_y ?? null,
    sort_order: body.sort_order ?? 0,
    created_at: new Date().toISOString(),
  };

  console.log("[mock] Added product tag to design", id, ":", newTag.id);
  return NextResponse.json({ data: newTag }, { status: 201 });
}
