import { NextRequest, NextResponse } from "next/server";
import { designerServices } from "@/data/gallery-data";

// POST /api/designer/orders — Client places an order
export async function POST(req: NextRequest) {
  const body = await req.json();

  const service = designerServices.find((s) => s.id === body.service_id);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const priceAgreed = service.price;
  const platformFee = 0; // 0% at launch
  const designerPayout = priceAgreed - platformFee;

  const newOrder = {
    id: crypto.randomUUID(),
    service_id: service.id,
    designer_id: service.designer_id,
    client_id: body.client_id ?? "current_user",
    status: "requested",
    price_agreed: priceAgreed,
    platform_fee: platformFee,
    designer_payout: designerPayout,
    client_notes: body.client_notes ?? "",
    client_photos: body.client_photos ?? [],
    room_dimensions: body.room_dimensions ?? null,
    deliverables: null,
    revision_count: 0,
    max_revisions: service.max_revisions,
    rating: null,
    review_text: null,
    linked_bom_id: null,
    linked_project_id: null,
    stripe_payment_intent_id: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log("[mock] Created order:", newOrder.id, "for service:", service.id);
  return NextResponse.json({ data: newOrder }, { status: 201 });
}
