import { fetchHelper } from "@/lib/helpers/fetchHelper";
import { fetchHelperNoCookies } from "@/lib/helpers/fetchHelperNoCookies";
import { productType } from "@/types";

export const createProduct = async (formData: FormData) => {
  const response = await fetchHelper<{
    success: boolean,
    product: productType,
    message: string
  }>(`products`, {
    method: "POST",
    body: formData,
  });
  return response;
}

interface ReturnProductsT {
    products:productType[],
    hasMore: boolean,
    currentPage: number,
    success: boolean
}
interface ReturnProductsT {
  products: productType[];
  hasMore: boolean;
  currentPage: number;
  success: boolean;
}

export const getAllProducts = async (
  limit?: number,
  q?: string,
  category?: string,
  page?: number,
  sort?: string
): Promise<ReturnProductsT> => {
  const params = new URLSearchParams();

  if (limit) params.append("limit", String(limit));
  if (q?.trim()) params.append("q", q.trim());
  if (category) params.append("category", category);
  if (page) params.append("page", String(page));
  if (sort) params.append("sort", sort);

  const queryString = params.toString();

  const res = await fetchHelperNoCookies<ReturnProductsT>(
    `products${queryString ? `?${queryString}` : ""}`,
    { method: "GET" }
  );

  return res;
};
 
export const deleteProduct = async (id: string) => {
  await fetchHelper(`products/${id}`, {
    method: 'DELETE',
  })
}

export const getProductById = async (id: string): Promise<productType> => {
  const res = await fetchHelperNoCookies<{success:boolean, product:productType}>(`products/${id}`, { method: 'GET' })
  return res.product
}

export const updateProduct = async (id: string, formData: FormData) => {
  const res = await fetchHelper<{success: boolean, product:productType}>(`products/${id}`, {
    method: 'PATCH',
    body: formData,
  })
  return res.product
}

export const getHotSellerProducts = async () => {
    const res = await fetchHelperNoCookies<{success:boolean, products: productType[]}>("products/hot-sellers");

    return res.products;
};
export const getNewArrivals = async () => {
    const res = await fetchHelperNoCookies<{success:boolean, products: productType[]}>("products/new-arrivals");

    return res.products;
};