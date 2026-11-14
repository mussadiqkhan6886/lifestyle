
import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { createOrderSchema, updateOrderSchema} from "../schemas/orderSchema"
import { generateOrderNumber } from "../lib/helpers/index";
import { transporter } from "../config/nodemailer";
import { createAdminEmail, createCustomerEmail } from "../lib/helpers/orderEmail";
import { orderVariantMap, VariantInput } from "../types/global";

class CheckoutError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = "CheckoutError"
  }
}


export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const parsed = createOrderSchema.safeParse(req.body)

  if (!parsed.success) {
    console.log(
    "Checkout validation errors:",
    parsed.error.flatten()
  )
    res.status(400).json({
      success: false,
      message: "Please check your checkout information",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const data = parsed.data

  try {
    // Return the existing order if the same checkout request is retried.
    const existingOrder = await prisma.order.findUnique({
      where: { checkoutToken: data.checkoutToken },
      include: { items: true },
    })

    if (existingOrder) {
      res.status(200).json({
        success: true,
        message: "Order already created",
        order: existingOrder,
      })
      return
    }

    // Combine duplicate SKUs before checking stock.
    const quantityBySku = new Map<string, number>()

    for (const item of data.items) {
      quantityBySku.set(
        item.sku,
        (quantityBySku.get(item.sku) ?? 0) + item.quantity
      )
    }

    const requestedItems = Array.from(quantityBySku, ([sku, quantity]) => ({
      sku,
      quantity,
    }))

    const order = await prisma.$transaction(async (tx:any) => {
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
      })

      // Reject SKUs that do not exist.
      if (variants.length !== requestedItems.length) {
        throw new CheckoutError(
            400,
            "One or more selected product variants do not exist"
        )
      }

      const variantMap = new Map(
        variants.map((variant:any) => [variant.sku, variant])
      )

      let subtotal = 0

      const orderItems = requestedItems.map((requested) => {
  const variant = variantMap.get(requested.sku) as orderVariantMap

  if (!variant) {
    throw new CheckoutError(
      400,
      `Variant with SKU ${requested.sku} does not exist`
    )
  }

  if (Number(variant.stock) < requested.quantity) {
    throw new CheckoutError(
      409,
      `(${variant.label}) has only ${variant.stock} item(s) available`
    )
  }

  const unitPrice =
    variant.onSale && variant.salePrice !== null
      ? variant.salePrice
      : variant.price

  if (!Number.isSafeInteger(unitPrice) || unitPrice as number < 0) {
    throw new Error("Invalid product price")
  }

  const lineTotal = unitPrice as number * requested.quantity

  if (!Number.isSafeInteger(lineTotal)) {
  throw new CheckoutError(400, "Order amount is too large")
}

  subtotal += lineTotal

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
  }
})
     if (!Number.isSafeInteger(subtotal)) {
        throw new CheckoutError(400, "Order amount is too large")
        }

      const shippingCost = data.city.toLowerCase() === "lahore" ? 400 : 450
      const total = subtotal + shippingCost

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
        })

        if (stockUpdate.count !== 1) {
            throw new CheckoutError(
                409,
                "Stock changed while placing your order. Please review your cart."
            )
            }
      }

      const order = await  tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
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
      })
      return order
    })
    const emailTasks = [
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Order: ${order.orderNumber}`,
            html: createAdminEmail(order),
        }),
        ]

        if (order.email) {
        emailTasks.push(
            transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: order.email,
            subject: `Order Confirmation: ${order.orderNumber}`,
            html: createCustomerEmail(order),
            })
        )
        }

        const emailResults = await Promise.allSettled(emailTasks)

        emailResults.forEach((result) => {
        if (result.status === "rejected") {
            console.error("Email sending failed:", result.reason)
        }
        })
    res.status(201).json({
      success: true,
      message: "Your order has been placed successfully",
      order,
    })
  } catch (error: unknown) {
    // A second request with the same token may arrive simultaneously.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const existingOrder = await prisma.order.findUnique({
        where: { checkoutToken: data.checkoutToken },
        include: { items: true },
      })

      if (existingOrder) {
        res.status(200).json({
          success: true,
          message: "Order already created",
          order: existingOrder,
        })
        return
      }
    }

    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
      return
    }

    console.error("Create order error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to place your order right now. Please try again.",
    })
  }
}

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.status(200).json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Get all orders error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    })
  }
}

export const getSingleOrder = async (req:Request, res:Response) :Promise<void> => {
  const id = String(req.params.id)

  if(!id){
    res.status(400).json({success:false, message: "Id is required"})
    return
  }

  const order = await prisma.order.findFirst({where: {orderNumber: id}, include: {
    items:true
  }})

  if(!order){
    res.status(404).json({success:false, message: "order not found with this id"})
    return
  }

  res.status(200).json({
    success:true,
    order
  })
}

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id)

    if (!Number.isSafeInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      })
      return
    }

    const parsed = updateOrderSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid order update",
        errors: parsed.error.flatten(),
      })
      return
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: parsed.data,
      include: {
        items: true,
      },
    })

    res.status(200).json({
      success: true,
      order: updatedOrder,
    })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      })
      return
    }

    console.error("Update order error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update order",
    })
  }
}