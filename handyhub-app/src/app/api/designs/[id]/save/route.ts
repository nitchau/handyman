import { NextRequest, NextResponse } from "next/server";
import { designIdeas } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designs/[id]/save — Save to collection
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const idea = designIdeas.find((d) => d.id === id);
  if (!idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const collectionName = body.collection_name ?? "Saved";

  console.log("[mock] Saved design", id, "to collection:", collectionName);
  return NextResponse.json({
    data: {
      design_idea_id: id,
      collection_name: collectionName,
      saved: true,
      save_count: idea.save_count + 1,
    },
  });
}
