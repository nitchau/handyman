import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designer/orders/[id]/revision — Client requests revision
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();

  const revision = {
    order_id: id,
    status: "revision_requested",
    revision_notes: body.notes ?? "",
    revision_count: (body._current_revision_count ?? 0) + 1,
    updated_at: new Date().toISOString(),
  };

  console.log("[mock] Revision requested for order", id);
  return NextResponse.json({ data: revision });
}
