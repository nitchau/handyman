import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET /api/designer/orders — List orders for current designer
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const designerId = searchParams.get("designer_id");

  if (!designerId) {
    return NextResponse.json({ error: "designer_id query param is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("designer_orders")
    .select("*, service:designer_services!service_id(title, service_type)")
    .eq("designer_id", designerId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

// POST /api/designer/orders — Client places an order
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.service_id || !body.client_id) {
    return NextResponse.json({ error: "service_id and client_id are required" }, { status: 400 });
  }

  // Fetch the service to get price info
  const { data: service, error: serviceError } = await supabaseAdmin
    .from("designer_services")
    .select("*")
    .eq("id", body.service_id)
    .single();

  if (serviceError || !service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const priceAgreed = service.price;
  const platformFee = 0; // 0% at launch
  const designerPayout = priceAgreed - platformFee;

  const { data, error } = await supabaseAdmin
    .from("designer_orders")
    .insert({
      service_id: service.id,
      designer_id: service.designer_id,
      client_id: body.client_id,
      status: "requested",
      price_agreed: priceAgreed,
      platform_fee: platformFee,
      designer_payout: designerPayout,
      client_notes: body.client_notes ?? "",
      client_photos: body.client_photos ?? [],
      room_dimensions: body.room_dimensions ?? null,
      max_revisions: service.max_revisions,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
