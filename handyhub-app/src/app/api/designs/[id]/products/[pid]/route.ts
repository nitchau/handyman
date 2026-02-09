import { NextRequest, NextResponse } from "next/server";
import { designIdeas } from "@/data/gallery-data";

interface RouteContext {
  params: Promise<{ id: string; pid: string }>;
}

// DELETE /api/designs/[id]/products/[pid] — Remove product tag
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id, pid } = await params;
  const idea = designIdeas.find((d) => d.id === id);
  if (!idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  const tag = idea.product_tags.find((t) => t.id === pid);
  if (!tag) {
    return NextResponse.json({ error: "Product tag not found" }, { status: 404 });
  }

  console.log("[mock] Removed product tag", pid, "from design", id);
  return NextResponse.json({ message: "Product tag removed" });
}
