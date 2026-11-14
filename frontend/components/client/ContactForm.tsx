'use client'

import { aire } from '@/lib/fonts'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sendContact } from '@/server/contact'
import { ContactPayload } from '@/types'

const initialData: ContactPayload = {
  name: '',
  email: '',
  phone: '',
  orderNumber: '',
  subject: 'General Query',
  message: '',
}

const inputClass =
  'w-full bg-light-beige border border-black/15 rounded-lg px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors'

const ContactForm = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState<ContactPayload>(initialData)

  const sendMessage = useMutation({
    mutationFn: (data: ContactPayload) => sendContact(data),
    onSuccess: () => {
      setFormData(initialData)
      setFormSubmitted(true)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Unable to send your message')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (sendMessage.isPending) return
    sendMessage.mutate(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="lg:col-span-7 bg-contrast-beige/40 border border-black/10 rounded-2xl p-6 sm:p-10 space-y-6">
      <div className="space-y-2 border-b border-black/10 pb-6">
        <h2 className={`${aire.className} text-2xl sm:text-3xl text-neutral-900 tracking-wide`}>
          Send Us a Message
        </h2>
        <p className="text-xs text-neutral-600">
          Fill out the form below and an advisor will contact you shortly.
        </p>
      </div>

      {formSubmitted ? (
        <div className="bg-emerald-900/5 border border-emerald-900/20 rounded-xl p-8 text-center space-y-3 my-8">
          <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-800 mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className={`${aire.className} text-xl text-neutral-900`}>
            Thank You for Reaching Out
          </h3>
          <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
            Your message has been received by our Lifestyle Shopping UK concierge team. We will review your query and reply within 12 hours.
          </p>
          <button
            type="button"
            onClick={() => setFormSubmitted(false)}
            className="mt-4 text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-neutral-700">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ayesha Malik"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-neutral-700">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ayesha@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-medium text-neutral-700">
                Phone Number (WhatsApp)
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 0000000"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="orderNumber" className="text-xs font-medium text-neutral-700">
                Order Number (Optional)
              </label>
              <input
                id="orderNumber"
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                placeholder="e.g. #LSUK-8492"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-xs font-medium text-neutral-700">
              Topic of Query
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="General Query">General Inquiry</option>
              <option value="Order Tracking">Order Status & Tracking</option>
              <option value="Product & Sizing">Sizing & Material Advice</option>
              <option value="Returns & Exchanges">Return or Exchange Request</option>
              <option value="UK Import Special Order">UK Special Import Request</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-medium text-neutral-700">
              Your Message <span className="text-red-600">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="How can our concierge assist you today?"
              className={`${inputClass} py-3 resize-none`}
            />
          </div>

          {sendMessage.isError && (
            <div
              role="alert"
              className="border border-red-200 bg-red-50 p-3 text-xs text-red-700 rounded-lg"
            >
              {sendMessage.error.message || 'Something went wrong. Please try again.'}
            </div>
          )}

          <button
            type="submit"
            disabled={sendMessage.isPending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-light-beige px-8 py-3 rounded-lg text-xs uppercase tracking-widest font-medium transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sendMessage.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Submit Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm