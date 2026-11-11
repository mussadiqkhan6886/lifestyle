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