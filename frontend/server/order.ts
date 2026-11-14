import { fetchHelper } from "@/lib/helpers/fetchHelper"
import { fetchHelperNoCookies } from "@/lib/helpers/fetchHelperNoCookies"
import { CreateOrderInput, Order, OrderStatus } from "@/types"

export const getAllOrders = async () : Promise<Order[]> => {
    const res = await fetchHelper<{ success: boolean, orders: Order[]}>("orders", {
        method: "GET",
    })

    return res.orders
}

export type CreateOrderResponse = {
  success: boolean
  order: {
    orderNumber: string
    total: number
    status: string
  }
}

export const createNewOrder = async (payload: CreateOrderInput) => {
    const res = await fetchHelperNoCookies<CreateOrderResponse>("orders", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {"Content-Type": "application/json"}
    })
    return res.order
}

export const getSingleOrder = async (id: number) => {
    const res = await fetchHelperNoCookies<{success:boolean, order:Order}>(`orders/${id}`, {method: "GET"})
    return res.order
}

export type PaymentStatus = "UNPAID" | "PAID"

type UpdateOrderPayload = {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
}

export const updateOrder = async (id:number, payload: UpdateOrderPayload) => {
    const res = await fetchHelper<{success:boolean, order:Order}>(`orders/${id}`, 
        {
            method: "PATCH", 
            body: JSON.stringify(payload), 
            headers: {"Content-Type": "application/json"
            }})

    return res.order
}