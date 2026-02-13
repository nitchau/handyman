import type { FurniturePreferences } from "@/types";

interface PreviewPromptParams {
  description: string;
  furniturePreferences?: FurniturePreferences | null;
  hasInspirationPhotos?: boolean;
}

export function buildPreviewPrompt(
  descriptionOrParams: string | PreviewPromptParams
): string {
  // Support both old signature (string) and new (object)
  const params: PreviewPromptParams =
    typeof descriptionOrParams === "string"
      ? { description: descriptionOrParams }
      : descriptionOrParams;

  const { description, furniturePreferences, hasInspirationPhotos } = params;

  let furnitureBlock = "";
  if (furniturePreferences) {
    const lines: string[] = [];
    if (furniturePreferences.keepFurniture) {
      lines.push("- Keep all existing furniture in place.");
    } else {
      lines.push("- Remove all existing furniture from the design.");
    }
    if (furniturePreferences.keepKitchenItems) {
      lines.push("- Keep kitchen appliances and items in place.");
    } else {
      lines.push("- Remove kitchen appliances and items from the design.");
    }
    if (furniturePreferences.keepDecor) {
      lines.push("- Keep wall decor and accessories in place.");
    } else {
      lines.push("- Remove wall decor and accessories from the design.");
    }
    if (furniturePreferences.notes.trim()) {
      lines.push(`- User notes: ${furniturePreferences.notes.trim()}`);
    }
    furnitureBlock = `\nFURNITURE & ITEM PREFERENCES:\n${lines.join("\n")}`;
  }

  const inspirationBlock = hasInspirationPhotos
    ? "\n\nINSPIRATION REFERENCE:\nDesign inspiration photos have been provided — use them as style, color, and aesthetic reference when generating the visualization."
    : "";

  return `You are a professional interior design visualizer.

Given the uploaded "before" photos and the project description below, generate a single photorealistic "after" image showing the completed renovation.

PROJECT DESCRIPTION:
${description}
${furnitureBlock}${inspirationBlock}

INSTRUCTIONS:
1. Study the uploaded photos to understand the current room layout, lighting, and proportions.
2. Generate one photorealistic image of the same room after the described renovation is complete.
3. Maintain the same camera angle and room geometry as the primary photo.
4. Use realistic materials, colors, and lighting that match the renovation description.
5. Include a brief one-sentence description of what you visualized.

IMPORTANT:
- The image should look like a real photograph, not a rendering or sketch.
- Keep architectural elements (windows, doors, room shape) consistent with the originals.
- Apply the renovation changes described above naturally and realistically.`;
}
