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

export type checkoutItem = {
  slug: string
  name: string
  price: number
  onSale: boolean
  salePrice: number
  finalPrice: number
  quantity: number
  image: string
  variant: string
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  onSale: boolean
  salePrice: number | null
  finalPrice: number
  quantity: number
  image: string
  variant: string
}

export type OrderUserDetails = {
  fullName: string
  phone: string
  email?: string
}

export type ShippingAddress = {
  city?: string
  postalCode?: string
  address: string
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type PaymentMethod = "cod" | "bank"


export type Order = {
  _id: string
  orderId: string
  items: OrderItem[]

  totalPrice: number
  shippingCost: number

  userDetails: OrderUserDetails
  notes?: string

  status: OrderStatus

  shippingAddress: ShippingAddress

  paymentMethod: PaymentMethod
  paymentProof?: string

  createdAt: Date
  updatedAt: Date
}