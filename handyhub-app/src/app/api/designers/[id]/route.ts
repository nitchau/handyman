import { NextRequest, NextResponse } from "next/server";
import { designers, designIdeas, designerServices } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/designers/[id] — Get designer profile + portfolio
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const designer = designers.find((d) => d.id === id);
  if (!designer) {
    return NextResponse.json({ error: "Designer not found" }, { status: 404 });
  }

  const portfolio = designIdeas.filter(
    (d) => d.designer_id === id && d.is_published
  );
  const services = designerServices.filter((s) => s.designer_id === id && s.is_active);

  return NextResponse.json({
    data: {
      ...designer,
      portfolio,
      services,
    },
  });
}

// PATCH /api/designers/[id] — Update designer profile
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const designer = designers.find((d) => d.id === id);
  if (!designer) {
    return NextResponse.json({ error: "Designer not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = {
    ...designer,
    ...body,
    id: designer.id,
    user_id: designer.user_id,
    updated_at: new Date().toISOString(),
  };

  console.log("[mock] Updated designer profile:", id);
  return NextResponse.json({ data: updated });
}
