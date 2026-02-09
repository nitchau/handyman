import { NextRequest, NextResponse } from "next/server";
import { designIdeas } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designs/[id]/like — Toggle like
export async function POST(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idea = designIdeas.find((d) => d.id === id);
  if (!idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  // Mock: toggle — always returns "liked" with incremented count
  console.log("[mock] Toggled like on design:", id);
  return NextResponse.json({
    data: {
      design_idea_id: id,
      liked: true,
      like_count: idea.like_count + 1,
    },
  });
}
