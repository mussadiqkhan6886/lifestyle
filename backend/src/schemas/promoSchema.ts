
import { z } from "zod";

export const createPromoSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Promo code is required")
    .transform((value) => value.toUpperCase()),

  discount: z.coerce
    .number()
    .int("Discount must be an integer")
    .min(1, "Discount must be at least 1")
    .max(100, "Discount cannot exceed 100%"),
});

export const updatePromoSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Promo code is required")
    .transform((value) => value.toUpperCase())
    .optional(),

  discount: z.coerce
    .number()
    .int("Discount must be an integer")
    .min(1, "Discount must be at least 1")
    .max(100, "Discount cannot exceed 100%")
    .optional(),
}).refine(
  (data) => data.code !== undefined || data.discount !== undefined,
  {
    message: "Provide at least one field to update",
  }
);

export type CreatePromoInput = z.infer<typeof createPromoSchema>;
export type UpdatePromoInput = z.infer<typeof updatePromoSchema>;
