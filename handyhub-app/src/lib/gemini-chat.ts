import { GoogleGenerativeAI } from "@google/generative-ai";

let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

export function getChatModel() {
  if (model) return model;

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Get one at https://aistudio.google.com/apikey"
    );
  }

  const genAI = new GoogleGenerativeAI(key);
  model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  return model;
}
