import { z } from "zod";

// ── BOM Project Schema ────────────────────────────────────────────────

export const bomProjectSchema = z.object({
  category_slug: z.string().min(1, "Please select a category"),
  space_type: z.enum(
    [
      "bathroom",
      "kitchen",
      "bedroom",
      "living_room",
      "garage",
      "basement",
      "attic",
      "outdoor",
      "laundry",
      "other",
    ],
    { message: "Please select a space type" }
  ),
  description: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(2000, "Description must be 2000 characters or less"),
});

export type BomProjectValues = z.infer<typeof bomProjectSchema>;

// ── Room Dimensions Schema ────────────────────────────────────────────

export const bomDimensionsSchema = z.object({
  length_ft: z
    .number({ error: "Length is required" })
    .min(1, "Must be at least 1 ft")
    .max(200, "Must be 200 ft or less"),
  width_ft: z
    .number({ error: "Width is required" })
    .min(1, "Must be at least 1 ft")
    .max(200, "Must be 200 ft or less"),
  height_ft: z
    .number({ error: "Height is required" })
    .min(1, "Must be at least 1 ft")
    .max(50, "Must be 50 ft or less"),
});

export type BomDimensionsValues = z.infer<typeof bomDimensionsSchema>;

// ── Media Constraints ─────────────────────────────────────────────────

export const MEDIA_CONSTRAINTS = {
  minFiles: 1,
  maxFiles: 20,
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
} as const;
