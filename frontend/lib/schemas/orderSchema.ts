import z from "zod";

export const checkoutSchema = z.object({
  customerName: z.string()
    .trim()
    .min(2, 'Please enter your full name')
    .max(100, 'Name is too long'),

  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),

  phone: z.string()
    .trim()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long')
    .regex(
      /^(?:03\d{9}|\+923\d{9}|00923\d{9})$/,
      "Enter a valid Pakistani mobile number, e.g. 03371234567 or +923371234567"
    ),

  addressLine1: z.string()
    .trim()
    .min(5, 'Please enter your complete street address')
    .max(200, 'Address is too long'),

  addressLine2: z.string()
    .trim()
    .max(200, 'Address is too long')
    .optional(),

  city: z.string()
    .trim()
    .min(2, 'Please enter your city')
    .max(100, 'City name is too long'),

  province: z.string()
    .trim()
    .min(2, 'Please select your province'),

  postalCode: z.string()
    .trim()
    .max(20, 'Postal code is too long')
    .optional(),

  customerNotes: z.string()
    .trim()
    .max(500, 'Maximum 500 characters allowed')
    .optional(),
})