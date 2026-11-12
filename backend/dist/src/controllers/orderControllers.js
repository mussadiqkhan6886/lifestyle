"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.getSingleOrder = exports.getAllOrders = exports.createOrder = void 0;
const prisma_1 = require("../config/prisma");
const orderSchema_1 = require("../schemas/orderSchema");
const index_1 = require("../lib/helpers/index");
const nodemailer_1 = require("../config/nodemailer");
const orderEmail_1 = require("../lib/helpers/orderEmail");
class CheckoutError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "CheckoutError";
    }
}
const createOrder = async (req, res) => {
    const parsed = orderSchema_1.createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
        console.log("Checkout validation errors:", parsed.error.flatten());
        res.status(400).json({
            success: false,
            message: "Please check your checkout information",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }
    const data = parsed.data;
    try {
        // Return the existing order if the same checkout request is retried.
        const existingOrder = await prisma_1.prisma.order.findUnique({
            where: { checkoutToken: data.checkoutToken },
            include: { items: true },
        });
        if (existingOrder) {
            res.status(200).json({
                success: true,
                message: "Order already created",
                order: existingOrder,
            });
            return;
        }
        // Combine duplicate SKUs before checking stock.
        const quantityBySku = new Map();
        for (const item of data.items) {
            quantityBySku.set(item.sku, (quantityBySku.get(item.sku) ?? 0) + item.quantity);
        }
        const requestedItems = Array.from(quantityBySku, ([sku, quantity]) => ({
            sku,
            quantity,
        }));
        const order = await prisma_1.prisma.$transaction(async (tx) => {
            const variants = await tx.variant.findMany({
                where: {
                    sku: {
                        in: requestedItems.map((item) => item.sku),
                    },
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            });
            // Reject SKUs that do not exist.
            if (variants.length !== requestedItems.length) {
                throw new CheckoutError(400, "One or more selected product variants do not exist");
            }
            const variantMap = new Map(variants.map((variant) => [variant.sku, variant]));
            let subtotal = 0;
            const orderItems = requestedItems.map((requested) => {
                const variant = variantMap.get(requested.sku);
                if (!variant) {
                    throw new CheckoutError(400, `Variant with SKU ${requested.sku} does not exist`);
                }
                if (Number(variant.stock) < requested.quantity) {
                    throw new CheckoutError(409, `(${variant.label}) has only ${variant.stock} item(s) available`);
                }
                const unitPrice = variant.onSale && variant.salePrice !== null
                    ? variant.salePrice
                    : variant.price;
                if (!Number.isSafeInteger(unitPrice) || unitPrice < 0) {
                    throw new Error("Invalid product price");
                }
                const lineTotal = unitPrice * requested.quantity;
                if (!Number.isSafeInteger(lineTotal)) {
                    throw new CheckoutError(400, "Order amount is too large");
                }
                subtotal += lineTotal;
                return {
                    productId: variant.product.id,
                    productName: variant.product.name,
                    productSlug: variant.product.slug,
                    variantSku: variant.sku,
                    variantLabel: variant.label,
                    image: variant.images[0] ?? null,
                    unitPrice,
                    quantity: requested.quantity,
                    lineTotal,
                };
            });
            if (!Number.isSafeInteger(subtotal)) {
                throw new CheckoutError(400, "Order amount is too large");
            }
            // Free delivery is determined by the backend, never by the client.
            const shippingCost = 0;
            const total = subtotal + shippingCost;
            for (const item of requestedItems) {
                const stockUpdate = await tx.variant.updateMany({
                    where: {
                        sku: item.sku,
                        stock: {
                            gte: item.quantity,
                        },
                    },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
                if (stockUpdate.count !== 1) {
                    throw new CheckoutError(409, "Stock changed while placing your order. Please review your cart.");
                }
            }
            const order = await tx.order.create({
                data: {
                    orderNumber: (0, index_1.generateOrderNumber)(),
                    checkoutToken: data.checkoutToken,
                    customerName: data.customerName,
                    email: data.email || null,
                    phone: data.phone,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2 || null,
                    city: data.city,
                    province: data.province,
                    postalCode: data.postalCode || null,
                    customerNotes: data.customerNotes || null,
                    paymentMethod: "CASH_ON_DELIVERY",
                    paymentStatus: "UNPAID",
                    status: "PENDING",
                    subtotal,
                    shippingCost,
                    total,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: true,
                },
            });
            return order;
        });
        const emailTasks = [
            nodemailer_1.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: `New Order: ${order.orderNumber}`,
                html: (0, orderEmail_1.createAdminEmail)(order),
            }),
        ];
        if (order.email) {
            emailTasks.push(nodemailer_1.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: order.email,
                subject: `Order Confirmation: ${order.orderNumber}`,
                html: (0, orderEmail_1.createCustomerEmail)(order),
            }));
        }
        const emailResults = await Promise.allSettled(emailTasks);
        emailResults.forEach((result) => {
            if (result.status === "rejected") {
                console.error("Email sending failed:", result.reason);
            }
        });
        res.status(201).json({
            success: true,
            message: "Your order has been placed successfully",
            order,
        });
    }
    catch (error) {
        // A second request with the same token may arrive simultaneously.
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002") {
            const existingOrder = await prisma_1.prisma.order.findUnique({
                where: { checkoutToken: data.checkoutToken },
                include: { items: true },
            });
            if (existingOrder) {
                res.status(200).json({
                    success: true,
                    message: "Order already created",
                    order: existingOrder,
                });
                return;
            }
        }
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
            return;
        }
        console.error("Create order error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to place your order right now. Please try again.",
        });
    }
};
exports.createOrder = createOrder;
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma_1.prisma.order.findMany({
            include: {
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch orders",
        });
    }
};
exports.getAllOrders = getAllOrders;
const getSingleOrder = async (req, res) => {
    const id = String(req.params.id);
    if (!id) {
        res.status(400).json({ success: false, message: "Id is required" });
        return;
    }
    const order = await prisma_1.prisma.order.findFirst({ where: { orderNumber: id }, include: {
            items: true
        } });
    if (!order) {
        res.status(404).json({ success: false, message: "order not found with this id" });
        return;
    }
    res.status(200).json({
        success: true,
        order
    });
};
exports.getSingleOrder = getSingleOrder;
const updateOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isSafeInteger(id) || id <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
            return;
        }
        const parsed = orderSchema_1.updateOrderSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid order update",
                errors: parsed.error.flatten(),
            });
            return;
        }
        const updatedOrder = await prisma_1.prisma.order.update({
            where: { id },
            data: parsed.data,
            include: {
                items: true,
            },
        });
        res.status(200).json({
            success: true,
            order: updatedOrder,
        });
    }
    catch (error) {
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2025") {
            res.status(404).json({
                success: false,
                message: "Order not found",
            });
            return;
        }
        console.error("Update order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order",
        });
    }
};
exports.updateOrder = updateOrder;
