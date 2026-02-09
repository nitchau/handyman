import { NextRequest, NextResponse } from "next/server";

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

// PATCH /api/designer/orders/[id] — Update order status (accept, deliver, etc.)
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();
  const newStatus = body.status;

  // Mock: we don't have a real order store, so we simulate a transition
  const currentStatus = body._current_status ?? "requested";

  if (!newStatus) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Cannot transition from '${currentStatus}' to '${newStatus}'` },
      { status: 422 }
    );
  }

  const updated = {
    id,
    status: newStatus,
    deliverables: body.deliverables ?? null,
    completed_at: newStatus === "completed" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  console.log("[mock] Updated order", id, "status:", currentStatus, "→", newStatus);
  return NextResponse.json({ data: updated });
}
