interface DesignReferencePrompt {
  designTitle: string;
  designStyle: string;
  budgetTier: string;
  estimatedCost: number | null;
  productTags: Array<{
    productName: string;
    productBrand: string | null;
    productCategory: string;
    estimatedPrice: number;
    retailerName: string | null;
    quantityNeeded: string | null;
  }>;
}

interface WallDimensionInput {
  name: string;
  width_ft: number;
  height_ft: number;
}

interface BomPromptParams {
  category_slug: string;
  space_type: string;
  description: string;
  dimensions: { length_ft: number; width_ft: number; height_ft: number } | null;
  roomDescription?: string | null;
  dimensionMode?: "room" | "wall";
  wallDimensions?: WallDimensionInput[] | null;
  hasInspirationPhotos?: boolean;
  designReference?: DesignReferencePrompt | null;
}

export function buildBomPrompt(params: BomPromptParams): string {
  const {
    category_slug,
    space_type,
    description,
    dimensions,
    roomDescription,
    dimensionMode,
    wallDimensions,
    hasInspirationPhotos,
    designReference,
  } = params;

  let dimText: string;
  if (dimensionMode === "wall" && wallDimensions && wallDimensions.length > 0) {
    const wallLines = wallDimensions
      .map((w) => `  - ${w.name || "Unnamed wall"}: ${w.width_ft}ft W × ${w.height_ft}ft H`)
      .join("\n");
    dimText = `Room dimensions (wall-by-wall):\n${wallLines}`;
  } else if (dimensions) {
    dimText = `Room dimensions: ${dimensions.length_ft}ft L × ${dimensions.width_ft}ft W × ${dimensions.height_ft}ft H (${(dimensions.length_ft * dimensions.width_ft).toFixed(0)} sq ft)`;
  } else {
    dimText = "Room dimensions: not provided — estimate from photos.";
  }

  const roomDescBlock = roomDescription
    ? `\nROOM DESCRIPTION: ${roomDescription}`
    : "";

  const inspirationBlock = hasInspirationPhotos
    ? "\nDESIGN INSPIRATION PHOTOS have been provided separately — use them as style and aesthetic reference for material choices."
    : "";

  let designBlock = "";
  if (designReference) {
    const costText = designReference.estimatedCost
      ? `$${designReference.estimatedCost.toLocaleString()}`
      : "not specified";

    const productLines = designReference.productTags
      .map((p) => {
        const brand = p.productBrand ? ` by ${p.productBrand}` : "";
        const retailer = p.retailerName ? ` from ${p.retailerName}` : "";
        const qty = p.quantityNeeded ? `, qty: ${p.quantityNeeded}` : "";
        return `- ${p.productName}${brand} (${p.productCategory}) — ~$${p.estimatedPrice}${retailer}${qty}`;
      })
      .join("\n");

    designBlock = `

DESIGN REFERENCE:
You are generating a BOM to recreate this design: "${designReference.designTitle}" (style: ${designReference.designStyle})
Budget tier: ${designReference.budgetTier}, estimated cost: ${costText}

PRODUCTS FROM THE REFERENCE DESIGN:
${productLines || "No specific products listed."}

DESIGN MATCHING INSTRUCTIONS:
1. Use reference products as PRIMARY guide for material selection.
2. Match the ${designReference.designStyle} aesthetic in all material choices.
3. Include listed products with accurate current pricing.
4. For unlisted products, choose materials matching same style/quality tier.
5. Size quantities to USER'S room (from their photos), not the reference.`;
  }

  return `You are a professional home improvement estimator with 20+ years of experience.
Analyze the uploaded photos and generate a detailed Bill of Materials (BOM) for this project.

PROJECT DETAILS:
- Category: ${category_slug}
- Space type: ${space_type}
- Description: ${description}
- ${dimText}${roomDescBlock}${inspirationBlock}
${designBlock}

INSTRUCTIONS:
1. Study the photos carefully to assess the current state of the room/space.
2. REFERENCE OBJECT DETECTION: Look for known-size objects in the photos (letter-size paper, credit cards, rulers, tape measures, soda cans, or other standard-size items). Set "reference_object_detected" to true if you find one. If a reference object IS detected, set overall confidence_score to 0.80 or higher. If NO reference object is found, cap confidence_score at 0.70.
3. GROUP ITEMS BY TASK: Organize all materials into logical construction tasks (e.g. "Demolition", "Framing", "Drywall", "Painting", "Flooring", "Plumbing", "Electrical", "Finishing"). Output a "tasks" array with each task name and sort order. Each item must reference its parent task via the "task" field.
4. WASTE FACTORS: Each material item must include a "waste_factor" (0.05–0.25 depending on material type — e.g. 0.10 for paint, 0.10–0.15 for drywall, 0.10 for lumber, 0.15 for tile, 0.05 for fasteners) and "quantity_with_waste" = quantity * (1 + waste_factor).
5. Provide realistic retail prices from Home Depot, Lowes, and Amazon.
6. Estimate labor hours and cost ranges for a DIY homeowner.
7. Include safety items (goggles, gloves, masks, etc.) when relevant.
8. Set a confidence score (0–100) for each item based on how certain you are about the quantity and specification.
9. Rate the overall project difficulty as "easy", "moderate", or "hard".

Return ONLY valid JSON matching this exact schema:

{
  "title": "string — short project title",
  "category_slug": "string — the project category",
  "space_type": "string — one of: bathroom, kitchen, bedroom, living_room, garage, basement, attic, outdoor, laundry, other",
  "description": "string — brief project description",
  "confidence_tier": "ai_estimate",
  "confidence_score": "number 0.0–1.0 — overall confidence",
  "reference_object_detected": "boolean — true if a known-size reference object was found in photos",
  "tasks": [
    {
      "name": "string — task name (e.g. Demolition, Framing, Drywall)",
      "sortOrder": "number — order of execution starting at 1"
    }
  ],
  "items": [
    {
      "name": "string — product name",
      "type": "string — one of: material, tool, safety, consumable",
      "task": "string — task name matching a tasks entry",
      "quantity": "number — exact calculated quantity",
      "waste_factor": "number — 0.0 to 0.25",
      "quantity_with_waste": "number — quantity * (1 + waste_factor)",
      "unit": "string — e.g. sq ft, each, gallon, roll, box",
      "confidence": "number 0–100",
      "prices": [
        {
          "retailer": "string — one of: home_depot, lowes, amazon",
          "price": "number — unit price in USD",
          "url": "string — empty string",
          "in_stock": true
        }
      ],
      "notes": "string | null — optional sizing or application notes"
    }
  ],
  "tools": [
    {
      "name": "string — tool name",
      "owned": false,
      "rental_price_per_day": "number | null — daily rental cost if applicable",
      "purchase_price": "number | null — purchase price"
    }
  ],
  "labor_hours_min": "number — minimum estimated hours for DIY",
  "labor_hours_max": "number — maximum estimated hours for DIY",
  "labor_cost_min": "number — minimum labor cost if hiring a pro (USD)",
  "labor_cost_max": "number — maximum labor cost if hiring a pro (USD)",
  "difficulty": "string — one of: easy, moderate, hard"
}

IMPORTANT:
- Include at least 2 retailer price comparisons per item when possible.
- Use realistic 2025/2026 retail prices.
- Every item must have at least one price entry.
- Every item MUST include waste_factor and quantity_with_waste.
- Every item MUST reference a valid task name from the tasks array.
- Do NOT include any text outside the JSON object.`;
}
