import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designer/orders/[id]/revision — Client requests revision
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  // Fetch order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("designer_orders")
    .select("id, status, revision_count, max_revisions, client_notes")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "delivered") {
    return NextResponse.json({ error: "Can only request revision on delivered orders" }, { status: 422 });
  }

  if (order.revision_count >= order.max_revisions) {
    return NextResponse.json({ error: "Maximum revisions reached" }, { status: 422 });
  }

  const { data, error } = await supabaseAdmin
    .from("designer_orders")
    .update({
      status: "revision_requested",
      revision_count: order.revision_count + 1,
      client_notes: body.notes ?? order.client_notes,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
