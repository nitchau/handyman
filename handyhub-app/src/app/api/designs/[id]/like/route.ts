import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designs/[id]/like — Toggle like
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const userId = body.user_id;

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  // Check if design exists
  const { data: idea, error: ideaError } = await supabaseAdmin
    .from("design_ideas")
    .select("id, like_count")
    .eq("id", id)
    .single();

  if (ideaError || !idea) {
    return NextResponse.json({ error: "Design idea not found" }, { status: 404 });
  }

  // Check if already liked
  const { data: existing } = await supabaseAdmin
    .from("design_idea_likes")
    .select("user_id")
    .eq("user_id", userId)
    .eq("design_idea_id", id)
    .maybeSingle();

  let liked: boolean;
  let newCount: number;

  if (existing) {
    // Unlike: remove row and decrement
    await supabaseAdmin
      .from("design_idea_likes")
      .delete()
      .eq("user_id", userId)
      .eq("design_idea_id", id);

    newCount = Math.max(0, idea.like_count - 1);
    liked = false;
  } else {
    // Like: insert row and increment
    await supabaseAdmin
      .from("design_idea_likes")
      .insert({ user_id: userId, design_idea_id: id });

    newCount = idea.like_count + 1;
    liked = true;
  }

  // Update count on design_ideas
  await supabaseAdmin
    .from("design_ideas")
    .update({ like_count: newCount })
    .eq("id", id);

  return NextResponse.json({
    data: { design_idea_id: id, liked, like_count: newCount },
  });
}
