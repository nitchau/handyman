import { NextRequest, NextResponse } from "next/server";

// POST /api/designer/services — Create service offering
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newService = {
    id: crypto.randomUUID(),
    designer_id: "current_user",
    service_type: body.service_type ?? "custom",
    title: body.title ?? "",
    description: body.description ?? "",
    price: body.price ?? 0,
    price_type: body.price_type ?? "fixed",
    estimated_delivery_days: body.estimated_delivery_days ?? 7,
    max_revisions: body.max_revisions ?? 1,
    is_virtual: body.is_virtual ?? true,
    includes_shopping_list: body.includes_shopping_list ?? false,
    includes_bom: body.includes_bom ?? false,
    is_active: true,
    sort_order: body.sort_order ?? 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log("[mock] Created service:", newService.id);
  return NextResponse.json({ data: newService }, { status: 201 });
}
