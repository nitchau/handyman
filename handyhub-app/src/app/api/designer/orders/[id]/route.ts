import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  requested: ["accepted", "cancelled"],
  accepted: ["in_progress", "cancelled"],
  in_progress: ["delivered", "cancelled"],
  delivered: ["completed", "revision_requested", "disputed"],
  revision_requested: ["in_progress"],
  disputed: ["refunded", "completed"],
  completed: [],
  cancelled: [],
  refunded: [],
};

// GET /api/designer/orders/[id] — Single order detail
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("designer_orders")
    .select("*, service:designer_services!service_id(title, service_type, description)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

// PATCH /api/designer/orders/[id] — Update order status
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();
  const newStatus = body.status;

  if (!newStatus) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  // Fetch current order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("designer_orders")
    .select("id, status")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const allowed = VALID_TRANSITIONS[order.status];
  if (!allowed || !allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Cannot transition from '${order.status}' to '${newStatus}'` },
      { status: 422 }
    );
  }

  const updates: Record<string, unknown> = { status: newStatus };
  if (body.deliverables) updates.deliverables = body.deliverables;
  if (newStatus === "completed") updates.completed_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("designer_orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
