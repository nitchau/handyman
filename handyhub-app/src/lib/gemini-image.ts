import { GoogleGenAI, type Content } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (client) return client;

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Get one at https://aistudio.google.com/apikey"
    );
  }

  client = new GoogleGenAI({ apiKey: key });
  return client;
}

export interface PreviewImageResult {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
}

export async function generatePreviewImage(
  contents: Content[]
): Promise<PreviewImageResult> {
  const ai = getClient();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        abortSignal: controller.signal,
      },
    });
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("timeout: Image generation timed out after 90 seconds");
    }
    throw err;
  }
  clearTimeout(timeout);

  const result: PreviewImageResult = {};

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("No content in Gemini response");
  }

  for (const part of parts) {
    if (part.text) {
      result.text = part.text;
    }
    if (part.inlineData) {
      result.imageBase64 = part.inlineData.data;
      result.mimeType = part.inlineData.mimeType;
    }
  }

  return result;
}
