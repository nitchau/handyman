import { NextRequest, NextResponse } from "next/server";
import { designerServices } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/designer/services/[id] — Update service
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const service = designerServices.find((s) => s.id === id);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = {
    ...service,
    ...body,
    id: service.id,
    designer_id: service.designer_id,
    updated_at: new Date().toISOString(),
  };

  console.log("[mock] Updated service:", id);
  return NextResponse.json({ data: updated });
}

// DELETE /api/designer/services/[id] — Remove service
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const service = designerServices.find((s) => s.id === id);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  console.log("[mock] Deleted service:", id);
  return NextResponse.json({ message: "Service deleted" });
}
