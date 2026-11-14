import { transporter } from "../config/nodemailer"
import { Request, Response } from "express"
import { contactSchema } from "../schemas/contactSchema"

export const sendContactMessage = async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Please check your details' })
    return
  }

  const d = parsed.data
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: d.email,
      subject: `Contact: ${d.subject}${d.orderNumber ? ` (${d.orderNumber})` : ''}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || '-'}\n\n${d.message}`,
    })
    res.status(201).json({ success: true, message: 'Message sent' })
  } catch (error) {
    console.error('Contact email failed:', error)
    res.status(500).json({ success: false, message: 'Unable to send your message right now' })
  }
}