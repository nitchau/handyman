import { NextRequest, NextResponse } from "next/server";
import { generatePreviewImage } from "@/lib/gemini-image";
import { buildPreviewPrompt } from "@/lib/prompts/preview-prompt";
import type { Content } from "@google/genai";

export const maxDuration = 120;

const MAX_PHOTOS = 5;

interface ConversationTurn {
  role: "user" | "model";
  text?: string;
  imageDataUrl?: string;
}

interface RequestBody {
  projectDescription: string;
  roomPhotos?: string[];
  history?: ConversationTurn[];
  feedback?: string;
}

function dataUrlToPart(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;
  return { inlineData: { mimeType: match[1], data: match[2] } };
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    if (!body.projectDescription) {
      return NextResponse.json(
        { error: "Missing projectDescription" },
        { status: 400 }
      );
    }

    const history = body.history || [];
    const isFirstCall = history.length === 0;

    let contents: Content[];

    if (isFirstCall) {
      // Build initial prompt with room photos
      const photos = (body.roomPhotos || []).slice(0, MAX_PHOTOS);
      const photoParts = photos
        .map(dataUrlToPart)
        .filter((p): p is NonNullable<typeof p> => p !== null);

      const prompt = buildPreviewPrompt(body.projectDescription);

      contents = [
        {
          role: "user",
          parts: [...photoParts, { text: prompt }],
        },
      ];
    } else {
      // Rebuild conversation from history, then append feedback
      contents = history.map((turn) => {
        const parts: Content["parts"] = [];
        if (turn.text) {
          parts.push({ text: turn.text });
        }
        if (turn.imageDataUrl) {
          const imgPart = dataUrlToPart(turn.imageDataUrl);
          if (imgPart) parts.push(imgPart);
        }
        return { role: turn.role, parts };
      });

      if (body.feedback) {
        contents.push({
          role: "user",
          parts: [
            {
              text: `Update the previous visualization with this feedback: ${body.feedback}. Generate a new image with the changes applied.`,
            },
          ],
        });
      }
    }

    let result;
    try {
      result = await generatePreviewImage(contents);
    } catch (err: unknown) {
      const raw =
        err instanceof Error ? err.message : "Gemini image API call failed";
      console.error("Gemini image API error:", raw);

      let friendly: string;
      if (raw.includes("429") || raw.includes("quota")) {
        friendly =
          "Handy is temporarily at capacity. Please wait a minute and try again.";
      } else if (raw.includes("401") || raw.includes("API_KEY")) {
        friendly =
          "Invalid or missing Gemini API key. Check your GEMINI_API_KEY in .env.local.";
      } else if (raw.includes("timeout") || raw.includes("ETIMEDOUT")) {
        friendly =
          "The request timed out. Try uploading fewer or smaller photos.";
      } else {
        friendly =
          "Handy's visualization service encountered an error. Please try again.";
      }

      return NextResponse.json({ error: friendly }, { status: 502 });
    }

    if (!result.imageBase64) {
      return NextResponse.json(
        { error: "Handy did not return an image. Please try again." },
        { status: 502 }
      );
    }

    const imageDataUrl = `data:${result.mimeType || "image/png"};base64,${result.imageBase64}`;

    return NextResponse.json({
      imageDataUrl,
      description: result.text || "Room visualization generated.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("generate-preview error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
