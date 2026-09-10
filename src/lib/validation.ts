import { z } from "zod";

/**
 * Form schemas. These exist for the person filling in the form; the database
 * constraints and RLS policies are the actual boundary (constitution VI).
 */

const optionalText = z.string().trim().optional().or(z.literal(""));

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, "Enter at least two characters")
    .max(80, "That name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export { optionalText };

export const speciesSchema = z.object({
  common_name: z
    .string()
    .trim()
    .min(2, "Enter the common name")
    .max(80, "That name is too long"),
  botanical_name: z
    .string()
    .trim()
    .min(2, "Enter the botanical name")
    .max(120, "That name is too long"),
  light_requirement: z.enum(["low", "medium", "bright"], {
    message: "Choose a light requirement",
  }),
  watering_interval_days: z.coerce
    .number()
    .int("Use whole days")
    .min(1, "At least one day")
    .max(60, "At most 60 days"),
  pet_safe: z.boolean(),
  description: optionalText,
});
export type SpeciesInput = z.infer<typeof speciesSchema>;

export const variantSchema = z.object({
  size_tier: z.enum(["desk", "floor", "statement"], {
    message: "Choose a size tier",
  }),
  height_min_cm: z.coerce
    .number()
    .int("Use whole centimetres")
    .min(5, "That is too short")
    .max(400, "That is too tall"),
  height_max_cm: z.coerce
    .number()
    .int("Use whole centimetres")
    .min(5, "That is too short")
    .max(400, "That is too tall"),
  price_aed: z.coerce
    .number()
    .min(1, "A monthly price is required")
    .max(10000, "That price looks wrong"),
  stock_total: z.coerce
    .number()
    .int("Use whole plants")
    .min(0, "Stock cannot be negative")
    .max(10000, "That is a lot of plants"),
}).refine((v) => v.height_max_cm >= v.height_min_cm, {
  message: "The tallest height must be at least the shortest",
  path: ["height_max_cm"],
});
export type VariantInput = z.infer<typeof variantSchema>;
