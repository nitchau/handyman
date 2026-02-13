import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;

  try {
    if (q) {
      // Search messages, return deduplicated sessions
      const { data: matchedMessages, error: searchErr } = await supabaseAdmin
        .from("chat_messages")
        .select("session_id")
        .ilike("content", `%${q}%`)
        .order("created_at", { ascending: false });

      if (searchErr) throw searchErr;

      // Deduplicate session IDs preserving order
      const sessionIds = [...new Set(matchedMessages?.map((m) => m.session_id) || [])];

      if (sessionIds.length === 0) {
        return NextResponse.json({ data: [], meta: { total: 0, page, limit } });
      }

      // Filter to sessions belonging to this user
      const paginatedIds = sessionIds.slice(offset, offset + limit);

      const { data: sessions, error: sessErr } = await supabaseAdmin
        .from("chat_sessions")
        .select("*")
        .eq("clerk_id", userId)
        .in("id", paginatedIds)
        .gt("message_count", 0)
        .order("created_at", { ascending: false });

      if (sessErr) throw sessErr;

      // Re-sort to match the original order from search results
      const orderMap = new Map(paginatedIds.map((id, i) => [id, i]));
      sessions?.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));

      return NextResponse.json({
        data: sessions || [],
        meta: { total: sessionIds.length, page, limit },
      });
    }

    // No query: return user's sessions (newest first)
    const { data: sessions, error, count } = await supabaseAdmin
      .from("chat_sessions")
      .select("*", { count: "exact" })
      .eq("clerk_id", userId)
      .gt("message_count", 0)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      data: sessions || [],
      meta: { total: count || 0, page, limit },
    });
  } catch (err) {
    console.error("Chat history error:", err);
    return NextResponse.json(
      { error: "Failed to load chat history" },
      { status: 500 }
    );
  }
}
