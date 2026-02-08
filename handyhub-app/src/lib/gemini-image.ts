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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents,
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

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
