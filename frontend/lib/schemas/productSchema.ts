import z from "zod"

const imageItem = z.union([z.string(), z.instanceof(File)])

const variantSchema = z
  .object({
    label: z.string().trim().min(1, "Variant label is required"),

    sku: z.string().optional(),

    stock: z
      .number()
      .finite("Enter a valid stock quantity")
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative"),

    price: z
      .number()
      .finite("Enter a valid price")
      .min(0, "Price cannot be negative"),

    onSale: z.boolean(),

    salePrice: z.number().finite().min(0).optional(),

    images: z.array(imageItem).min(1, "Please add atleast 1 image"),
  })
  .superRefine((variant, ctx) => {
    if (variant.onSale && variant.salePrice === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["salePrice"],
        message: "Sale price is required",
      });
    }

    if (
      variant.onSale &&
      variant.salePrice !== undefined &&
      variant.salePrice >= variant.price
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salePrice"],
        message: "Sale price must be lower than regular price",
      });
    }
  });

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),

  slug: z.string().optional(),

  category: z.string().trim().min(1, "Category is required"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  hotSeller: z.boolean(),

  variants: z
    .array(variantSchema)
    .min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;