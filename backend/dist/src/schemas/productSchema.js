import z from "zod";
// Convert multipart numeric values into numbers.
// Empty strings become NaN, so they fail validation instead of becoming 0.
const numberFromForm = z.preprocess((value) => typeof value === "string" && value.trim() !== ""
    ? Number(value)
    : value, z.number().finite());
const booleanFromForm = z.preprocess((value) => {
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    return value;
}, z.boolean());
const variantSchema = z.object({
    id: numberFromForm.pipe(z.number().int().positive()).optional(),
    label: z.string()
        .trim()
        .min(1, "Variant label is required"),
    sku: z.string().trim().optional(),
    stock: numberFromForm
        .pipe(z.number().int("Stock must be a whole number").min(0)),
    price: numberFromForm
        .pipe(z.number().int("Price must be a whole number").min(0)),
    onSale: booleanFromForm,
    salePrice: z.preprocess((value) => value === "" || value === null || value === undefined
        ? undefined
        : typeof value === "string"
            ? Number(value)
            : value, z.number().finite().int().min(0).optional()),
    // These are existing image URLs, not newly uploaded File objects.
    existingImages: z.array(z.string().url()).optional(),
}).superRefine((variant, ctx) => {
    if (variant.onSale && variant.salePrice === undefined) {
        ctx.addIssue({
            code: "custom",
            path: ["salePrice"],
            message: "Sale price is required",
        });
    }
    if (variant.onSale &&
        variant.salePrice !== undefined &&
        variant.salePrice >= variant.price) {
        ctx.addIssue({
            code: "custom",
            path: ["salePrice"],
            message: "Sale price must be lower than regular price",
        });
    }
});
const productFields = {
    name: z.string().trim().min(1, "Product name is required"),
    slug: z.string().trim().optional(),
    category: z.string().trim().min(1, "Category is required"),
    description: z.string().trim().min(1, "Description is required"),
    hotSeller: booleanFromForm,
};
export const createProductSchema = z.object({
    ...productFields,
    variants: z.array(variantSchema)
        .min(1, "At least one variant is required"),
});
export const updateProductSchema = z.object({
    name: productFields.name.optional(),
    slug: productFields.slug,
    category: productFields.category.optional(),
    description: productFields.description.optional(),
    hotSeller: booleanFromForm.optional(),
    variants: z.array(variantSchema)
        .min(1, "At least one variant is required")
        .optional(),
});
