import { NextRequest, NextResponse } from "next/server";
import { designers } from "@/data/gallery-data";

// GET /api/designers — Browse/search designers
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.toLowerCase();
  const specialty = searchParams.get("specialty");
  const tier = searchParams.get("tier");
  const accepting = searchParams.get("accepting_clients");

  let results = [...designers];

  if (q) {
    results = results.filter(
      (d) =>
        d.display_name.toLowerCase().includes(q) ||
        (d.bio?.toLowerCase().includes(q) ?? false) ||
        d.style_tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (specialty) {
    results = results.filter((d) =>
      d.specialties.some((s) => s === specialty)
    );
  }
  if (tier) {
    results = results.filter((d) => d.designer_tier === tier);
  }
  if (accepting === "true") {
    results = results.filter((d) => d.is_accepting_clients);
  }

  return NextResponse.json({ data: results, meta: { total: results.length } });
}
