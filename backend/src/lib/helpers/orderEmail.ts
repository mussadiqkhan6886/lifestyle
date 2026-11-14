// Escape HTML to prevent customer-provided content from injecting HTML.
const escapeHtml = (value: string | number): string =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }

    return entities[character]
  })

const formatPKR = (amount: number): string =>
  `PKR ${amount.toLocaleString("en-PK")}`

// Generate HTML rows for all ordered products.
const getOrderItemsHtml = (order: any): string =>
  order.items
    .map(
      (item: any) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">
            <strong>${escapeHtml(item.productName)}</strong>
            <br />
            <span style="color:#777;font-size:13px;">
              ${escapeHtml(item.variantLabel)} · SKU: ${escapeHtml(item.variantSku)}
            </span>
          </td>

          <td style="padding:12px;text-align:center;border-bottom:1px solid #eee;">
            ${item.quantity}
          </td>

          <td style="padding:12px;text-align:right;border-bottom:1px solid #eee;">
            ${formatPKR(item.unitPrice)}
          </td>

          <td style="padding:12px;text-align:right;border-bottom:1px solid #eee;">
            <strong>${formatPKR(item.lineTotal)}</strong>
          </td>
        </tr>
      `
    )
    .join("")

// Generate the order summary table.
const getOrderSummaryHtml = (order: any): string => `
  <table style="width:100%;border-collapse:collapse;margin-top:20px;">
    <thead>
      <tr style="background:#f5f5f5;text-align:left;">
        <th style="padding:12px;">Product</th>
        <th style="padding:12px;text-align:center;">Qty</th>
        <th style="padding:12px;text-align:right;">Price</th>
        <th style="padding:12px;text-align:right;">Total</th>
      </tr>
    </thead>

    <tbody>
      ${getOrderItemsHtml(order)}
    </tbody>
  </table>

  <div style="margin-top:20px;text-align:right;">
    <p>Subtotal: <strong>${formatPKR(order.subtotal)}</strong></p>
    <p>Delivery: <strong>FREE</strong></p>
    <h2>Total: ${formatPKR(order.total)}</h2>
  </div>
`

// Reusable email layout.
const getEmailLayout = (content: string): string => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(process.env.STORE_NAME || "Lifestyle Store")}</title>
    </head>

    <body style="margin:0;padding:30px 10px;background:#f5f5f5;font-family:Arial,sans-serif;color:#222;">

      <div style="max-width:650px;margin:auto;background:white;padding:30px;">

        <h1 style="margin-top:0;font-size:26px;">
          ${escapeHtml(process.env.STORE_NAME || "Lifestyle Store")}
        </h1>

        ${content}

        <div style="border-top:1px solid #eee;margin-top:30px;padding-top:20px;color:#777;font-size:12px;">
          Thank you for shopping with us.
        </div>

      </div>
    </body>
  </html>
`

// ADMIN EMAIL
export const createAdminEmail = (order: any): string =>
  getEmailLayout(`
    <h2>New Order Received!</h2>

    <p>A customer has placed a new order on your store.</p>

    <h3>Order Information</h3>

    <p><strong>Order Number:</strong> ${escapeHtml(order.orderNumber)}</p>
    <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(order.email || "Not provided")}</p>

    <h3>Delivery Address</h3>

    <p>
      ${escapeHtml(order.addressLine1)}
      ${order.addressLine2 ? `<br />${escapeHtml(order.addressLine2)}` : ""}
      <br />
      ${escapeHtml(order.city)}, ${escapeHtml(order.province)}
      ${order.postalCode ? ` - ${escapeHtml(order.postalCode)}` : ""}
    </p>

    <p>
      <strong>Customer Notes:</strong>
      ${escapeHtml(order.customerNotes || "None")}
    </p>

    <h3>Ordered Products</h3>

    ${getOrderSummaryHtml(order)}

    <p><strong>Payment:</strong> Cash on Delivery</p>
    <p><strong>Order Status:</strong> ${escapeHtml(order.status)}</p>
  `)

// CUSTOMER EMAIL
export const createCustomerEmail = (order: any): string =>
  getEmailLayout(`
    <h2>Thank you for your order, ${escapeHtml(order.customerName)}!</h2>

    <p>
      Your order has been received successfully.
      We will contact you regarding delivery.
    </p>

    <div style="background:#f5f5f5;padding:18px;margin:20px 0;">

      <p style="margin:0;color:#777;font-size:13px;">
        YOUR ORDER NUMBER
      </p>

      <h2 style="margin:8px 0;">
        ${escapeHtml(order.orderNumber)}
      </h2>

      <p style="margin:0;">
        Status: ${escapeHtml(order.status)}
      </p>

    </div>

    <h3>Order Details</h3>

    ${getOrderSummaryHtml(order)}

    <div style="background:#f5f5f5;padding:18px;margin-top:20px;">

      <p><strong>Payment:</strong> Cash on Delivery</p>
      <p><strong>Delivery:</strong> FREE</p>

      <p>
        <strong>Total to pay on delivery:</strong>
        ${formatPKR(order.total)}
      </p>

    </div>

    <p>We appreciate your trust in us!</p>
  `)
