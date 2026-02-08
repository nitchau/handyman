export function buildPreviewPrompt(description: string): string {
  return `You are a professional interior design visualizer.

Given the uploaded "before" photos and the project description below, generate a single photorealistic "after" image showing the completed renovation.

PROJECT DESCRIPTION:
${description}

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
