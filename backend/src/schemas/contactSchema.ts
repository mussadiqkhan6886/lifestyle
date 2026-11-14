import z from "zod"


export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  orderNumber: z.string().trim().max(50).optional().or(z.literal('')),
  subject: z.string().trim().max(100),
  message: z.string().trim().min(10).max(2000),
})