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

interface BomPromptParams {
  category_slug: string;
  space_type: string;
  description: string;
  dimensions: { length_ft: number; width_ft: number; height_ft: number } | null;
  designReference?: DesignReferencePrompt | null;
}

export function buildBomPrompt(params: BomPromptParams): string {
  const { category_slug, space_type, description, dimensions, designReference } = params;

  const dimText = dimensions
    ? `Room dimensions: ${dimensions.length_ft}ft L × ${dimensions.width_ft}ft W × ${dimensions.height_ft}ft H (${(dimensions.length_ft * dimensions.width_ft).toFixed(0)} sq ft)`
    : "Room dimensions: not provided — estimate from photos.";

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
- ${dimText}
${designBlock}

INSTRUCTIONS:
1. Study the photos carefully to assess the current state of the room/space.
2. Based on the project description and photos, list every material, consumable, and safety item needed.
3. Provide realistic retail prices from Home Depot, Lowes, and Amazon.
4. Estimate labor hours and cost ranges for a DIY homeowner.
5. Include safety items (goggles, gloves, masks, etc.) when relevant.
6. Set a confidence score (0.0–1.0) for each item based on how certain you are about the quantity and specification.
7. Rate the overall project difficulty as "easy", "moderate", or "hard".

Return ONLY valid JSON matching this exact schema:

{
  "title": "string — short project title",
  "category_slug": "string — the project category",
  "space_type": "string — one of: bathroom, kitchen, bedroom, living_room, garage, basement, attic, outdoor, laundry, other",
  "description": "string — brief project description",
  "confidence_tier": "ai_estimate",
  "confidence_score": "number 0.0–1.0 — overall confidence",
  "items": [
    {
      "name": "string — product name",
      "type": "string — one of: material, tool, safety, consumable",
      "quantity": "number",
      "unit": "string — e.g. sq ft, each, gallon, roll, box",
      "confidence": "number 0.0–1.0",
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
- Use realistic 2024/2025 retail prices.
- Every item must have at least one price entry.
- Do NOT include any text outside the JSON object.`;
}
