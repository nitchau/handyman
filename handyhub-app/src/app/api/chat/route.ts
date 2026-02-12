import { NextRequest } from "next/server";
import { getChatModel } from "@/lib/gemini-chat";
import { buildHandyPrompt } from "@/lib/prompts/handy-prompt";

export const maxDuration = 30;

interface ChatRequestBody {
  messages: { role: "user" | "model"; content: string }[];
  currentPage: string;
  userRole: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { messages, currentPage, userRole } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemInstruction = buildHandyPrompt({
      currentPage: currentPage || "/",
      userRole: userRole || "visitor",
    });

    const model = getChatModel();

    // Build Gemini chat history (all messages except the last one)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history,
      systemInstruction: { role: "user", parts: [{ text: systemInstruction }] },
    });

    const result = await chat.sendMessageStream(lastMessage.content);

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
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
