"use client"

import { useMemo, useState, Fragment } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Search,
  ShoppingBag,
  RefreshCw,
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  CreditCard,
} from "lucide-react"
import { toast } from "sonner"

import { getAllOrders, PaymentStatus, updateOrder } from "@/server/order"
import type { Order, OrderStatus } from "@/types"
import StatCard from "@/components/admin/StatCard"
import OrderDetails from "@/components/admin/OrderDetails"

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

const paymentStatuses : PaymentStatus[] = [
  "UNPAID",
  "PAID",
]

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
}

const paymentStyles: Record<PaymentStatus, string> = {
  UNPAID: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
}

export const formatPrice = (price: number) =>
  `PKR ${price.toLocaleString("en-PK")}`

export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

const OrdersPage = () => {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload}: {
      id: number
      payload: {
        status?: OrderStatus
        paymentStatus?: PaymentStatus
      }
    }) => updateOrder(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      })

      toast.success("Order updated successfully")
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order")
    },
  })

  const filteredOrders = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return orders.filter((order: Order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.phone.toLowerCase().includes(searchTerm) ||
        (order.email ?? "").toLowerCase().includes(searchTerm)

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  const handleStatusChange = (
    orderId: number,
    status: OrderStatus
  ) => {
    updateMutation.mutate({
      id: orderId,
      payload: { status },
    })
  }

  const handlePaymentChange = (
    orderId: number,
    paymentStatus: PaymentStatus
  ) => {
    updateMutation.mutate({
      id: orderId,
      payload: { paymentStatus },
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <RefreshCw className="animate-spin" size={25} />
        <span className="ml-3 text-sm text-neutral-500">
          Loading orders...
        </span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-600">
          Failed to load orders. Please try again.
        </p>

        <button
          onClick={() => refetch()}
          className="rounded-lg bg-black px-5 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <main className="space-y-7 p-5 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage customer orders, deliveries and payments.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={<ShoppingBag size={20} />}
        />

        <StatCard
          title="Pending Orders"
          value={orders.filter(o => o.status === "PENDING").length}
          icon={<Package size={20} />}
        />

        <StatCard
          title="Delivered Orders"
          value={orders.filter(o => o.status === "DELIVERED").length}
          icon={<Truck size={20} />}
        />

        <StatCard
          title="Collected Revenue"
          value={formatPrice(
            orders
              .filter(o => o.paymentStatus === "PAID")
              .reduce((total, order) => total + order.total, 0)
          )}
          icon={<CreditCard size={20} />}
        />
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search order, customer, phone or email..."
            className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="ALL">All statuses</option>

          {statuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="font-semibold text-neutral-900">
            All Orders
          </h2>

          <span className="text-sm text-neutral-500">
            {filteredOrders.length} orders
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <ShoppingBag size={35} className="text-neutral-300" />

            <p className="font-medium text-neutral-700">
              No orders found
            </p>

            <p className="text-sm text-neutral-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Products</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Order Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map(order => (
                  <Fragment key={order.id} >
                    <tr
                      
                      className="transition hover:bg-neutral-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-neutral-900">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          ID: {order.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-neutral-800">
                          {order.customerName}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {order.phone}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {order.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map(item => (
                            <div key={item.id} className="flex items-center gap-2">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="h-10 w-10 rounded-md border border-neutral-200 object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100">
                                  <Package size={16} className="text-neutral-400" />
                                </div>
                              )}

                              <div>
                                <p className="max-w-48 truncate text-sm font-medium text-neutral-800">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {item.variantLabel} × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}

                          {order.items.length > 2 && (
                            <p className="text-xs text-neutral-400">
                              +{order.items.length - 2} more products
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-semibold text-neutral-900">
                        {formatPrice(order.total)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="mb-2 text-xs text-neutral-500">
                          {order.paymentMethod.replaceAll("_", " ")}
                        </p>

                        <select
                          value={order.paymentStatus}
                          disabled={updateMutation.isPending}
                          onChange={e =>
                            handlePaymentChange(
                              order.id,
                              e.target.value as PaymentStatus
                            )
                          }
                          className={`rounded-md border-0 px-2 py-1.5 text-xs font-semibold outline-none disabled:opacity-50 ${paymentStyles[order.paymentStatus]}`}
                        >
                          {paymentStatuses.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          disabled={updateMutation.isPending}
                          onChange={e =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`rounded-md border-0 px-2 py-1.5 text-xs font-semibold outline-none disabled:opacity-50 ${statusStyles[order.status]}`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-500">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id
                            )
                          }
                          className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-black"
                        >
                          {expandedOrder === order.id ? (
                            <>
                              Close <ChevronUp size={16} />
                            </>
                          ) : (
                            <>
                              View <ChevronDown size={16} />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {expandedOrder === order.id && (
                      <tr key={`${order.id}-details`}>
                        <td colSpan={8} className="bg-neutral-50 px-5 py-6">
                          <OrderDetails order={order} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}



export const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-center gap-3">
    <span className="text-neutral-400">{icon}</span>
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm text-neutral-800">{value}</p>
    </div>
  </div>
)

export const TotalRow = ({
  label,
  value,
}: {
  label: string
  value: string
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-neutral-500">{label}</span>
    <span className="font-medium text-neutral-800">{value}</span>
  </div>
)



export default OrdersPage