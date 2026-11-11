import { z } from "zod";
const pakistanPhoneSchema = z
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
export const createOrderSchema = z.object({
    checkoutToken: z.string().uuid(),
    customerName: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100),
    email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .max(254)
        .optional()
        .or(z.literal("")),
    phone: pakistanPhoneSchema,
    addressLine1: z
        .string()
        .trim()
        .min(5, "Please enter a complete address")
        .max(200),
    addressLine2: z
        .string()
        .trim()
        .max(200)
        .optional()
        .or(z.literal("")),
    city: z
        .string()
        .trim()
        .min(2)
        .max(80),
    province: z
        .string()
        .trim()
        .min(2)
        .max(80),
    postalCode: z
        .string()
        .trim()
        .max(20)
        .optional()
        .or(z.literal("")),
    customerNotes: z
        .string()
        .trim()
        .max(500)
        .optional()
        .or(z.literal("")),
    items: z
        .array(z.object({
        sku: z.string().trim().min(1).max(100),
        quantity: z.number().int().min(1).max(20),
    }).strict())
        .min(1, "Your cart is empty")
        .max(20, "You can order up to 20 different variants at once"),
}).strict().superRefine((data, ctx) => {
    var _a;
    const quantities = new Map();
    for (const item of data.items) {
        const total = ((_a = quantities.get(item.sku)) !== null && _a !== void 0 ? _a : 0) + item.quantity;
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
export const updateOrderSchema = z.object({
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ]).optional(),
    paymentStatus: z.enum([
        "UNPAID",
        "PAID",
    ]).optional(),
}).refine(data => data.status !== undefined || data.paymentStatus !== undefined, { message: "At least one field must be provided" });
