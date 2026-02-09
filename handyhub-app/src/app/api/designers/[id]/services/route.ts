import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/designers/[id]/services — List designer's active services
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  // Verify designer exists
  const { data: designer, error: designerError } = await supabaseAdmin
    .from("designer_profiles")
    .select("id")
    .eq("id", id)
    .single();

  if (designerError || !designer) {
    return NextResponse.json({ error: "Designer not found" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("designer_services")
    .select("*")
    .eq("designer_id", id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
