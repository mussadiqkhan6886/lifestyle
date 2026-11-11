import { formatDate, formatPrice, InfoRow, TotalRow } from "@/app/(admin)/admin/orders/page"
import { Order } from "@/types"
import { CalendarDays, Mail, MapPin, Package, Phone, ShoppingBag } from "lucide-react"

const OrderDetails = ({ order }: { order: Order }) => {
  return (
    <div className="grid gap-7 lg:grid-cols-2">
      {/* Customer and delivery information */}
      <section className="space-y-4">
        <h3 className="font-semibold text-neutral-900">
          Customer & Delivery Information
        </h3>

        <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
          <InfoRow icon={<ShoppingBag size={16} />} label="Customer" value={order.customerName} />
          <InfoRow icon={<Mail size={16} />} label="Email" value={order.email || "Not provided"} />
          <InfoRow icon={<Phone size={16} />} label="Phone" value={order.phone} />

          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-1 shrink-0 text-neutral-400" />

            <div>
              <p className="text-xs text-neutral-500">Delivery address</p>
              <p className="mt-1 text-sm text-neutral-800">
                {order.addressLine1}
                {order.addressLine2 && `, ${order.addressLine2}`}
                {`, ${order.city}, ${order.province}`}
                {order.postalCode && `, ${order.postalCode}`}
                {`, ${order.country}`}
              </p>
            </div>
          </div>

          <InfoRow
            icon={<CalendarDays size={16} />}
            label="Order placed"
            value={formatDate(order.createdAt)}
          />

          <InfoRow
            icon={<CalendarDays size={16} />}
            label="Last updated"
            value={formatDate(order.updatedAt)}
          />

          {order.customerNotes && (
            <div className="border-t border-neutral-100 pt-3">
              <p className="text-xs text-neutral-500">Customer notes</p>
              <p className="mt-1 text-sm text-neutral-800">
                {order.customerNotes}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="space-y-4">
        <h3 className="font-semibold text-neutral-900">
          Ordered Products ({order.items.length})
        </h3>

        <div className="space-y-3">
          {order.items.map(item => (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-3"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.productName}
                  className="h-20 w-20 shrink-0 rounded-md border border-neutral-200 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-neutral-100">
                  <Package className="text-neutral-400" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-900">
                  {item.productName}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Variant: {item.variantLabel}
                </p>

                <p className="text-xs text-neutral-400">
                  SKU: {item.variantSku}
                </p>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-neutral-600">
                    {formatPrice(item.unitPrice)} × {item.quantity}
                  </p>

                  <p className="font-semibold text-neutral-900">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order totals */}
        <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-4">
          <TotalRow label="Subtotal" value={formatPrice(order.subtotal)} />
          <TotalRow label="Shipping" value={formatPrice(order.shippingCost)} />

          <div className="flex justify-between border-t border-neutral-200 pt-3 font-semibold text-neutral-900">
            <span>Grand Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>

          <p className="pt-1 text-xs text-neutral-400">
            Currency: {order.currency}
          </p>
        </div>
      </section>
    </div>
  )
}

export default OrderDetails