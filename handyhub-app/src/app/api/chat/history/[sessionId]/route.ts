import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;

  try {
    // Verify session belongs to the user
    const { data: session, error: sessErr } = await supabaseAdmin
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("clerk_id", userId)
      .single();

    if (sessErr || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Fetch all messages in order
    const { data: messages, error: msgErr } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (msgErr) throw msgErr;

    return NextResponse.json({ session, messages: messages || [] });
  } catch (err) {
    console.error("Chat session fetch error:", err);
    return NextResponse.json(
      { error: "Failed to load chat session" },
      { status: 500 }
    );
  }
}
