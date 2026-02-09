import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string; pid: string }>;
}

// PATCH /api/designs/[id]/products/[pid] — Update product tag
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id, pid } = await params;
  const body = await req.json();

  const { id: _id, design_idea_id: _did, created_at: _ca, ...updates } = body;

  const { data, error } = await supabaseAdmin
    .from("design_idea_products")
    .update(updates)
    .eq("id", pid)
    .eq("design_idea_id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === "PGRST116" ? 404 : 500 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/designs/[id]/products/[pid] — Delete product tag
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id, pid } = await params;

  const { error } = await supabaseAdmin
    .from("design_idea_products")
    .delete()
    .eq("id", pid)
    .eq("design_idea_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Product tag deleted" });
}
