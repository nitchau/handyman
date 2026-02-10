import { z } from "zod";

export const TIMELINE_OPTIONS = [
  "ASAP",
  "Within 2 weeks",
  "1-3 months",
  "Flexible",
] as const;

export const quoteRequestSchema = z.object({
  description: z
    .string()
    .min(10, "Please describe your project (at least 10 characters)")
    .max(2000, "Description must be 2000 characters or less"),
  timeline: z.enum(TIMELINE_OPTIONS, {
    message: "Please select a timeline",
  }),
  zip_code: z
    .string()
    .regex(/^\d{5}$/, "Please enter a valid 5-digit ZIP code"),
  sender_name: z
    .string()
    .max(100, "Name must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  sender_email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
});

export type QuoteRequestValues = z.infer<typeof quoteRequestSchema>;
