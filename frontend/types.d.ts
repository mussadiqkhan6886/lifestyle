export interface Variant {
  label: string;
  sku: string;
  stock: number;
  price: number;
  onSale: boolean;
  salePrice?: number;
  images: string[]
}

export interface productType {
  id: string;
  name: string;
  slug: string;
  hotSeller: boolean;
  category: string;
  description: string;
  variants: Variant[];
  createdAt: number
  updatedAt: number
}

export interface ProductCardT {
  name: string;
  category: string;
  slug: string;
  variants: Variant[];
  tag: "row" | "col"
}

export interface ReviewT {
  id: number
  name: string
  comment: string
  rating: number
  title:string
}

export type CartItem = {
  productId: string
  name: string
  slug: string

  image: string

  variant: {
    variantId: string
    label: string
    stock: number
    price: number        
    salePrice: number | null
    onSale: boolean
  }
  
  quantity: number
}


export type OrderItem = {
  id: number
  orderId: number
  productId: number
  productName: string
  productSlug: string
  variantSku: string
  variantLabel: string
  image: string | null
  unitPrice: number
  quantity: number
  lineTotal: number
  createdAt: Date
}

export type OrderStatus =  "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"

export type Order = {
  id: number
  orderNumber: string
  checkoutToken: string | null

  customerName: string
  email: string | null
  phone: string

  addressLine1: string
  addressLine2: string | null
  city: string
  province: string
  postalCode: string | null
  country: string
  customerNotes: string | null

  paymentMethod: "CASH_ON_DELIVERY"
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED"
  status: OrderStatus

  currency: string
  subtotal: number
  shippingCost: number
  discount: number
  total: number

  items: OrderItem[]

  createdAt: Date
  updatedAt: Date
}

export type CreateOrderInput = {
  checkoutToken: string
  customerName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  province: string
  postalCode?: string
  customerNotes?: string
  items: {
    sku: string
    quantity: number
  }[]
}

