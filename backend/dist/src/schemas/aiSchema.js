import z from "zod";
export const aiSchema = z.object({
    productName: z.string().optional(),
    description: z.string().optional(),
});
