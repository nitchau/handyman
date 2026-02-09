import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designs/[id]/save — Toggle save to collection
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const userId = body.user_id;
  const collectionName = body.collection_name ?? "Saved";

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  // Check if design exists
  const { data: idea, error: ideaError } = await supabaseAdmin
    .from("design_ideas")
    .select("id, save_count")
    .eq("id", id)
    .single();

  if (ideaError || !idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  // Check if already saved
  const { data: existing } = await supabaseAdmin
    .from("design_idea_saves")
    .select("user_id")
    .eq("user_id", userId)
    .eq("design_idea_id", id)
    .maybeSingle();

  let saved: boolean;
  let newCount: number;

  if (existing) {
    // Unsave
    await supabaseAdmin
      .from("design_idea_saves")
      .delete()
      .eq("user_id", userId)
      .eq("design_idea_id", id);

    newCount = Math.max(0, idea.save_count - 1);
    saved = false;
  } else {
    // Save
    await supabaseAdmin
      .from("design_idea_saves")
      .insert({ user_id: userId, design_idea_id: id, collection_name: collectionName });

    newCount = idea.save_count + 1;
    saved = true;
  }

  // Update count on design_ideas
  await supabaseAdmin
    .from("design_ideas")
    .update({ save_count: newCount })
    .eq("id", id);

  return NextResponse.json({
    data: { design_idea_id: id, collection_name: collectionName, saved, save_count: newCount },
  });
}
