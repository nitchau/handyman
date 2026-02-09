import { NextResponse } from "next/server";
import { designIdeas } from "@/data/gallery-data";

// GET /api/designs/featured — Featured/trending designs for homepage
export async function GET() {
  const featured = designIdeas
    .filter((d) => d.is_published && d.is_featured)
    .sort((a, b) => b.view_count - a.view_count);

  return NextResponse.json({ data: featured });
}
