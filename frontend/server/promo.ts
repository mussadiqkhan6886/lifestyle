import { fetchHelperNoCookies } from "@/lib/helpers/fetchHelperNoCookies";

export type VerifyPromoResponse = {
  success: boolean;
  message: string;
  promo?: {
    id: number;
    code: string;
    discount: number;
  };
};

export const verifyPromoCode = async (code: string): Promise<VerifyPromoResponse> => {
  return await fetchHelperNoCookies<VerifyPromoResponse>("promos/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
};
