import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// POST /api/designer/services — Create service offering
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.designer_id) {
    return NextResponse.json({ error: "designer_id is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("designer_services")
    .insert({
      designer_id: body.designer_id,
      service_type: body.service_type ?? "custom",
      title: body.title ?? "",
      description: body.description ?? "",
      price: body.price ?? 0,
      price_type: body.price_type ?? "fixed",
      estimated_delivery_days: body.estimated_delivery_days ?? 7,
      max_revisions: body.max_revisions ?? 1,
      is_virtual: body.is_virtual ?? true,
      includes_shopping_list: body.includes_shopping_list ?? false,
      includes_bom: body.includes_bom ?? false,
      is_active: true,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
