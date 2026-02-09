import { NextRequest, NextResponse } from "next/server";
import { designIdeas } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/designs/[id] — Get single design idea with products
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idea = designIdeas.find((d) => d.id === id);
  if (!idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }
  return NextResponse.json({ data: idea });
}

// PATCH /api/designs/[id] — Update design idea
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idea = designIdeas.find((d) => d.id === id);
  if (!idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = {
    ...idea,
    ...body,
    id: idea.id,
    designer_id: idea.designer_id,
    updated_at: new Date().toISOString(),
  };

  console.log("[mock] Updated design idea:", id);
  return NextResponse.json({ data: updated });
}

// DELETE /api/designs/[id] — Delete design idea
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idea = designIdeas.find((d) => d.id === id);
  if (!idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  console.log("[mock] Deleted design idea:", id);
  return NextResponse.json({ message: "Design idea deleted" });
}
