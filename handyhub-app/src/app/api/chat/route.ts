import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getChatModel } from "@/lib/gemini-chat";
import { buildHandyPrompt } from "@/lib/prompts/handy-prompt";
import { supabaseAdmin } from "@/lib/supabase/server";

export const maxDuration = 30;

const MAX_MESSAGES_PER_DAY = 20;

interface ChatRequestBody {
  messages: { role: "user" | "model"; content: string }[];
  currentPage: string;
  userRole: string;
  sessionId?: string;
}

async function getClerkId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { messages, currentPage, userRole, sessionId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const clerkId = await getClerkId();
    const lastMessage = messages[messages.length - 1];

    // ── Server-side rate limiting for authenticated users ──
    if (clerkId) {
      const { data: countData, error: rlError } = await supabaseAdmin.rpc(
        "increment_chat_rate_limit",
        { p_clerk_id: clerkId }
      );

      if (rlError) {
        console.error("Rate limit check error:", rlError.message);
      } else if (countData > MAX_MESSAGES_PER_DAY) {
        return new Response(
          JSON.stringify({
            error:
              "You've reached your daily message limit. Please try again tomorrow!",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }

      // ── Persist session + user message ──
      if (sessionId) {
        // Upsert session (lazy creation on first message)
        const title = lastMessage.content.slice(0, 80);
        await supabaseAdmin.from("chat_sessions").upsert(
          {
            id: sessionId,
            clerk_id: clerkId,
            title,
          },
          { onConflict: "id", ignoreDuplicates: true }
        );

        // Insert the user message
        await supabaseAdmin.from("chat_messages").insert({
          session_id: sessionId,
          role: "user",
          content: lastMessage.content,
        });
      }
    }

    // ── Gemini streaming (unchanged) ──
    const systemInstruction = buildHandyPrompt({
      currentPage: currentPage || "/",
      userRole: userRole || "visitor",
    });

    const model = getChatModel(systemInstruction);

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    // Create SSE stream, accumulating full response for DB persistence
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              fullResponse += text;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ token: text })}\n\n`
                )
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

          // ── Persist model response after stream completes ──
          if (clerkId && sessionId && fullResponse) {
            await supabaseAdmin.from("chat_messages").insert({
              session_id: sessionId,
              role: "model",
              content: fullResponse,
            });
            await supabaseAdmin.rpc("update_chat_session_count", {
              p_session_id: sessionId,
            });
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream error";
          console.error("Chat stream error:", message);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Handy encountered an error. Please try again." })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("chat route error:", message);

    let friendly: string;
    if (message.includes("429") || message.includes("quota")) {
      friendly =
        "Handy is temporarily at capacity. Please wait a minute and try again.";
    } else if (message.includes("401") || message.includes("API_KEY")) {
      friendly =
        "Invalid or missing Gemini API key. Check your GEMINI_API_KEY in .env.local.";
    } else {
      friendly = "Handy encountered an error. Please try again.";
    }

    return new Response(JSON.stringify({ error: friendly }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
