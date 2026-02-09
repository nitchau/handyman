import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designer/orders/[id]/review — Client submits review
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();

  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: "rating (1-5) is required" }, { status: 400 });
  }

  // Verify order exists and is completed
  const { data: order, error: orderError } = await supabaseAdmin
    .from("designer_orders")
    .select("id, status, designer_id")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "completed") {
    return NextResponse.json({ error: "Can only review completed orders" }, { status: 422 });
  }

  const { data, error } = await supabaseAdmin
    .from("designer_orders")
    .update({
      rating: body.rating,
      review_text: body.review_text ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
