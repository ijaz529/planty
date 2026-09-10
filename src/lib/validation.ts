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
