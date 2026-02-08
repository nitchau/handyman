import { NextRequest, NextResponse } from "next/server";
import { getBomModel } from "@/lib/gemini";
import { buildBomPrompt } from "@/lib/prompts/bom-prompt";
import type { BomProject, RoomDimensions } from "@/types";
import {
  ConfidenceTier,
  SpaceType,
  VerificationStatus,
  BomItemType,
  Retailer,
} from "@/types";
import crypto from "crypto";

export const maxDuration = 60;

const MAX_IMAGES = 20;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Parse project data
    const projectDataRaw = formData.get("projectData");
    if (!projectDataRaw || typeof projectDataRaw !== "string") {
      return NextResponse.json(
        { error: "Missing projectData field" },
        { status: 400 }
      );
    }

    let projectData: {
      category_slug: string;
      space_type: string;
      description: string;
    };
    try {
      projectData = JSON.parse(projectDataRaw);
    } catch {
      return NextResponse.json(
        { error: "Invalid projectData JSON" },
        { status: 400 }
      );
    }

    // Parse optional dimensions
    let dimensions: RoomDimensions | null = null;
    const dimensionsRaw = formData.get("dimensions");
    if (dimensionsRaw && typeof dimensionsRaw === "string") {
      try {
        dimensions = JSON.parse(dimensionsRaw);
      } catch {
        // Ignore invalid dimensions — they're optional
      }
    }

    // Collect images
    const images: File[] = [];
    for (const [, value] of formData.entries()) {
      if (value instanceof File && ALLOWED_TYPES.includes(value.type)) {
        images.push(value);
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: "At least 1 photo is required" },
        { status: 400 }
      );
    }

    if (images.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_IMAGES} photos allowed` },
        { status: 400 }
      );
    }

    // Validate image sizes
    for (const img of images) {
      if (img.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: `Image "${img.name}" exceeds 10 MB limit` },
          { status: 400 }
        );
      }
    }

    // Convert images to base64 inline data parts for Gemini
    const imageParts = await Promise.all(
      images.map(async (img) => {
        const buffer = await img.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return {
          inlineData: {
            mimeType: img.type,
            data: base64,
          },
        };
      })
    );

    // Build prompt
    const prompt = buildBomPrompt({
      category_slug: projectData.category_slug,
      space_type: projectData.space_type,
      description: projectData.description,
      dimensions,
    });

    // Call Gemini
    let geminiResponse;
    try {
      const model = getBomModel();
      const result = await model.generateContent([prompt, ...imageParts]);
      geminiResponse = result.response.text();
    } catch (err: unknown) {
      const raw =
        err instanceof Error ? err.message : "Gemini API call failed";
      console.error("Gemini API error:", raw);

      // Return a concise, user-friendly message
      let friendly: string;
      if (raw.includes("429") || raw.includes("quota")) {
        friendly =
          "The AI service is temporarily at capacity. Please wait a minute and try again.";
      } else if (raw.includes("401") || raw.includes("API_KEY")) {
        friendly =
          "Invalid or missing Gemini API key. Check your GEMINI_API_KEY in .env.local.";
      } else if (raw.includes("timeout") || raw.includes("ETIMEDOUT")) {
        friendly =
          "The request timed out. Try uploading fewer or smaller photos.";
      } else {
        friendly = "The AI service encountered an error. Please try again.";
      }

      return NextResponse.json({ error: friendly }, { status: 502 });
    }

    // Parse Gemini JSON response
    let parsed;
    try {
      parsed = JSON.parse(geminiResponse);
    } catch {
      console.error("Failed to parse Gemini response as JSON:", geminiResponse);
      return NextResponse.json(
        { error: "AI returned an invalid response. Please try again." },
        { status: 502 }
      );
    }

    // Build complete BomProject with IDs and timestamps
    const now = new Date().toISOString();
    const bomProject: BomProject = {
      id: crypto.randomUUID(),
      title: parsed.title || "Untitled Project",
      category_slug: parsed.category_slug || projectData.category_slug,
      space_type: (parsed.space_type as SpaceType) || SpaceType.OTHER,
      description: parsed.description || projectData.description,
      dimensions,
      photo_urls: [],
      confidence_tier: ConfidenceTier.AI_ESTIMATE,
      confidence_score: parsed.confidence_score ?? 0.7,
      items: (parsed.items || []).map(
        (item: {
          name?: string;
          type?: string;
          quantity?: number;
          unit?: string;
          confidence?: number;
          prices?: {
            retailer?: string;
            price?: number;
            url?: string;
            in_stock?: boolean;
          }[];
          notes?: string | null;
        }) => ({
          id: crypto.randomUUID(),
          name: item.name || "Unknown Item",
          type: (item.type as BomItemType) || BomItemType.MATERIAL,
          quantity: item.quantity ?? 1,
          unit: item.unit || "each",
          confidence: item.confidence ?? 0.7,
          prices: (item.prices || []).map(
            (p: {
              retailer?: string;
              price?: number;
              url?: string;
              in_stock?: boolean;
            }) => ({
              retailer: (p.retailer as Retailer) || Retailer.HOME_DEPOT,
              price: p.price ?? 0,
              url: p.url || "",
              in_stock: p.in_stock ?? true,
            })
          ),
          notes: item.notes || null,
        })
      ),
      tools: (parsed.tools || []).map(
        (tool: {
          name?: string;
          owned?: boolean;
          rental_price_per_day?: number | null;
          purchase_price?: number | null;
        }) => ({
          id: crypto.randomUUID(),
          name: tool.name || "Unknown Tool",
          owned: tool.owned ?? false,
          rental_price_per_day: tool.rental_price_per_day ?? null,
          purchase_price: tool.purchase_price ?? null,
        })
      ),
      labor_hours_min: parsed.labor_hours_min ?? 0,
      labor_hours_max: parsed.labor_hours_max ?? 0,
      labor_cost_min: parsed.labor_cost_min ?? 0,
      labor_cost_max: parsed.labor_cost_max ?? 0,
      difficulty: parsed.difficulty || "moderate",
      verification: {
        status: VerificationStatus.UNVERIFIED,
        verified_by: null,
        verified_at: null,
        notes: null,
      },
      created_at: now,
      updated_at: now,
    };

    return NextResponse.json(bomProject);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("generate-bom error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
