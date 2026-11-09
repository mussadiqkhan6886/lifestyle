import { fetchHelper } from "@/lib/helpers/fetchHelper";
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

export const getAllProducts = async (): Promise<productType[]> => {
  const res = await fetchHelper<{success:boolean, products:productType[]}>(`products`, { method: 'GET' })
  return res.products
}
 
export const deleteProduct = async (id: string) => {
  await fetchHelper(`products/${id}`, {
    method: 'DELETE',
  })
}

export const getProductById = async (id: string): Promise<productType> => {
  const res = await fetchHelper<{success:boolean, product:productType}>(`products/${id}`, { method: 'GET' })
  return res.product
}

export const updateProduct = async (id: string, formData: FormData) => {
  const res = await fetchHelper<{success: boolean, product:productType}>(`products/${id}`, {
    method: 'PATCH',
    body: formData,
  })
  return res.product
}