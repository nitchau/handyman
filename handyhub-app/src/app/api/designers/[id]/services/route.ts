import { NextRequest, NextResponse } from "next/server";
import { designers, designerServices } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/designers/[id]/services — List designer's services
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const designer = designers.find((d) => d.id === id);
  if (!designer) {
    return NextResponse.json({ error: "Designer not found" }, { status: 404 });
  }

  const services = designerServices.filter(
    (s) => s.designer_id === id && s.is_active
  );

  return NextResponse.json({ data: services });
}
