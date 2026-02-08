import { z } from "zod";

// ── Role Selection ─────────────────────────────────────────────────────

export const roleSelectionSchema = z.object({
  role: z.enum(["diy_user", "homeowner", "contractor"], {
    message: "Please select a role",
  }),
});

export type RoleSelectionValues = z.infer<typeof roleSelectionSchema>;

// ── Base Profile ───────────────────────────────────────────────────────

export const baseProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),
  phone: z
    .string()
    .regex(/^\+?[\d\s()-]{7,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  zip_code: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
});

export type BaseProfileValues = z.infer<typeof baseProfileSchema>;

// ── Contractor Profile ─────────────────────────────────────────────────

export const contractorProfileSchema = baseProfileSchema.extend({
  business_name: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name must be 100 characters or less"),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  years_experience: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(60, "Must be 60 or less"),
  hourly_rate: z.coerce
    .number()
    .min(1, "Rate must be at least $1")
    .max(500, "Rate must be $500 or less")
    .optional(),
  service_radius_miles: z.coerce
    .number()
    .min(1, "Radius must be at least 1 mile")
    .max(100, "Radius must be 100 miles or less"),
  categories: z
    .array(z.string())
    .min(1, "Select at least one category"),
});

export type ContractorProfileValues = z.infer<typeof contractorProfileSchema>;

// ── Project Post ───────────────────────────────────────────────────────

export const projectPostSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(20, "Please provide more detail (at least 20 characters)")
    .max(2000, "Description must be 2000 characters or less"),
  category_id: z.string().min(1, "Please select a category"),
  budget_min: z.coerce.number().min(0).optional(),
  budget_max: z.coerce.number().min(0).optional(),
  zip_code: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
});

export type ProjectPostValues = z.infer<typeof projectPostSchema>;
