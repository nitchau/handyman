import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET /api/designers — Browse/search designers
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.toLowerCase();
  const specialty = searchParams.get("specialty");
  const tier = searchParams.get("tier");
  const accepting = searchParams.get("accepting_clients");

  let query = supabaseAdmin.from("designer_profiles").select("*", { count: "exact" });

  if (tier) {
    query = query.eq("designer_tier", tier);
  }
  if (accepting === "true") {
    query = query.eq("is_accepting_clients", true);
  }
  if (specialty) {
    query = query.contains("specialties", [specialty]);
  }
  if (q) {
    query = query.or(`display_name.ilike.%${q}%,bio.ilike.%${q}%`);
  }

  query = query.order("rating_avg", { ascending: false });

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], meta: { total: count ?? 0 } });
}
