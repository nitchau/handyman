import { NextRequest, NextResponse } from "next/server";
import { designIdeas } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/designs/[id]/similar — AI-recommended similar designs (mock)
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idea = designIdeas.find((d) => d.id === id);
  if (!idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  // Mock: return designs that share the same style or room type, excluding the current one
  const similar = designIdeas
    .filter(
      (d) =>
        d.id !== id &&
        d.is_published &&
        (d.style === idea.style || d.room_type === idea.room_type)
    )
    .slice(0, 6);

  return NextResponse.json({ data: similar });
}
