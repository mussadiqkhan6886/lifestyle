"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// Convert multipart numeric values into numbers.
// Empty strings become NaN, so they fail validation instead of becoming 0.
const numberFromForm = zod_1.default.preprocess((value) => typeof value === "string" && value.trim() !== ""
    ? Number(value)
    : value, zod_1.default.number().finite());
const booleanFromForm = zod_1.default.preprocess((value) => {
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    return value;
}, zod_1.default.boolean());
const variantSchema = zod_1.default.object({
    id: numberFromForm.pipe(zod_1.default.number().int().positive()).optional(),
    label: zod_1.default.string()
        .trim()
        .min(1, "Variant label is required"),
    sku: zod_1.default.string().trim().optional(),
    stock: numberFromForm
        .pipe(zod_1.default.number().int("Stock must be a whole number").min(0)),
    price: numberFromForm
        .pipe(zod_1.default.number().int("Price must be a whole number").min(0)),
    onSale: booleanFromForm,
    salePrice: zod_1.default.preprocess((value) => value === "" || value === null || value === undefined
        ? undefined
        : typeof value === "string"
            ? Number(value)
            : value, zod_1.default.number().finite().int().min(0).optional()),
    // These are existing image URLs, not newly uploaded File objects.
    existingImages: zod_1.default.array(zod_1.default.string().url()).optional(),
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
    name: zod_1.default.string().trim().min(1, "Product name is required"),
    slug: zod_1.default.string().trim().optional(),
    category: zod_1.default.string().trim().min(1, "Category is required"),
    description: zod_1.default.string().trim().min(1, "Description is required"),
    hotSeller: booleanFromForm,
};
exports.createProductSchema = zod_1.default.object({
    ...productFields,
    variants: zod_1.default.array(variantSchema)
        .min(1, "At least one variant is required"),
});
exports.updateProductSchema = zod_1.default.object({
    name: productFields.name.optional(),
    slug: productFields.slug,
    category: productFields.category.optional(),
    description: productFields.description.optional(),
    hotSeller: booleanFromForm.optional(),
    variants: zod_1.default.array(variantSchema)
        .min(1, "At least one variant is required")
        .optional(),
});
