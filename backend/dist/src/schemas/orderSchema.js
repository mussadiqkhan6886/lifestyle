"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const pakistanPhoneSchema = zod_1.z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .refine((value) => /^(?:\+92|0092|0)?3\d{9}$/.test(value), "Enter a valid mobile number with 11 digits, e.g. 03001234567")
    .transform((value) => {
    if (value.startsWith("+92"))
        return value;
    if (value.startsWith("0092"))
        return `+92${value.slice(4)}`;
    if (value.startsWith("0"))
        return `+92${value.slice(1)}`;
    return `+92${value}`;
});
exports.createOrderSchema = zod_1.z.object({
    checkoutToken: zod_1.z.string().uuid(),
    customerName: zod_1.z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100),
    email: zod_1.z
        .string()
        .trim()
        .email("Enter a valid email address")
        .max(254)
        .optional()
        .or(zod_1.z.literal("")),
    phone: pakistanPhoneSchema,
    addressLine1: zod_1.z
        .string()
        .trim()
        .min(5, "Please enter a complete address")
        .max(200),
    addressLine2: zod_1.z
        .string()
        .trim()
        .max(200)
        .optional()
        .or(zod_1.z.literal("")),
    city: zod_1.z
        .string()
        .trim()
        .min(2)
        .max(80),
    province: zod_1.z
        .string()
        .trim()
        .min(2)
        .max(80),
    postalCode: zod_1.z
        .string()
        .trim()
        .max(20)
        .optional()
        .or(zod_1.z.literal("")),
    customerNotes: zod_1.z
        .string()
        .trim()
        .max(500)
        .optional()
        .or(zod_1.z.literal("")),
    items: zod_1.z
        .array(zod_1.z.object({
        sku: zod_1.z.string().trim().min(1).max(100),
        quantity: zod_1.z.number().int().min(1).max(20),
    }).strict())
        .min(1, "Your cart is empty")
        .max(20, "You can order up to 20 different variants at once"),
}).strict().superRefine((data, ctx) => {
    const quantities = new Map();
    for (const item of data.items) {
        const total = (quantities.get(item.sku) ?? 0) + item.quantity;
        quantities.set(item.sku, total);
        if (total > 20) {
            ctx.addIssue({
                code: "custom",
                message: `Maximum quantity for SKU ${item.sku} is 20`,
                path: ["items"],
            });
        }
    }
});
exports.updateOrderSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ]).optional(),
    paymentStatus: zod_1.z.enum([
        "UNPAID",
        "PAID",
    ]).optional(),
}).refine(data => data.status !== undefined || data.paymentStatus !== undefined, { message: "At least one field must be provided" });
