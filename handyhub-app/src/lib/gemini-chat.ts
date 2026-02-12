import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (genAIInstance) return genAIInstance;

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Get one at https://aistudio.google.com/apikey"
    );
  }

  genAIInstance = new GoogleGenerativeAI(key);
  return genAIInstance;
}

export function getChatModel(systemInstruction: string) {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });
}
