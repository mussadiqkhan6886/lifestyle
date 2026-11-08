'use client'

import { aire } from '@/lib/fonts'
import {
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const ContactPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: 'General Query',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    setFormSubmitted(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const contactMethods = [
    {
      title: 'Concierge WhatsApp',
      value: '+92 300 1234567',
      description: 'Instant support for sizing, stock availability, & orders.',
      href: 'https://wa.me/923001234567',
      icon: MessageSquare,
      actionText: 'Chat on WhatsApp',
    },
    {
      title: 'Email Assistance',
      value: 'support@lifestyleshopping.uk',
      description: 'Send us your queries—we respond within 12 hours.',
      href: 'mailto:support@lifestyleshopping.uk',
      icon: Mail,
      actionText: 'Send Email',
    },
    {
      title: 'Concierge Hours',
      value: 'Mon – Sat: 10:00 AM – 8:00 PM',
      description: 'Pakistan Standard Time (PST)',
      href: null,
      icon: Clock,
      actionText: null,
    },
  ]

  return (
    <div className="bg-light-beige text-neutral-900 min-h-screen py-16 pt-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 border-b border-black/10 pb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600">
            Client Concierge Service
          </span>
          <h1 className={`${aire.className} text-4xl sm:text-5xl text-neutral-900 tracking-wide`}>
            We’re Here to Help
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Have a question about our UK-imported collections, sizing, delivery times, or returns? Get in touch with our dedicated client advisors.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <div
                key={method.title}
                className="bg-contrast-beige/60 border border-black/10 p-6 rounded-xl flex flex-col justify-between space-y-4 shadow-sm hover:border-black/20 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="p-2.5 bg-light-beige text-neutral-900 rounded-lg border border-black/5 w-fit shadow-sm">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className={`${aire.className} text-lg text-neutral-900 tracking-wide`}>
                      {method.title}
                    </h3>
                    <p className="text-sm font-semibold text-neutral-900 mt-1">
                      {method.value}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {method.description}
                  </p>
                </div>

                {method.href && method.actionText && (
                  <a
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors pt-2"
                  >
                    <span>{method.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )
          })}
        </div>

        {/* Main Grid: Form + Info / FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Form Container */}
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
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ayesha Malik"
                      className="w-full bg-light-beige border border-black/15 rounded-lg px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ayesha@example.com"
                      className="w-full bg-light-beige border border-black/15 rounded-lg px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className="w-full bg-light-beige border border-black/15 rounded-lg px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  {/* Order Number Optional */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="e.g. #LSUK-8492"
                      className="w-full bg-light-beige border border-black/15 rounded-lg px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">
                    Topic of Query
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-light-beige border border-black/15 rounded-lg px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                  >
                    <option value="General Query">General Inquiry</option>
                    <option value="Order Tracking">Order Status & Tracking</option>
                    <option value="Product & Sizing">Sizing & Material Advice</option>
                    <option value="Returns & Exchanges">Return or Exchange Request</option>
                    <option value="UK Import Special Order">UK Special Import Request</option>
                  </select>
                </div>

                {/* Message Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">
                    Your Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can our concierge assist you today?"
                    className="w-full bg-light-beige border border-black/15 rounded-lg px-4 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-light-beige px-8 py-3 rounded-lg text-xs uppercase tracking-widest font-medium transition-all shadow-sm hover:gap-3"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Frequently Help & Policy Links */}
          <div className="lg:col-span-5 space-y-8 lg:pl-4">
            
            {/* Quick Answer Panel */}
            <div className="bg-contrast-beige/60 border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <div className="p-2 bg-light-beige rounded-md border border-black/5 text-neutral-900">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className={`${aire.className} text-xl text-neutral-900 tracking-wide`}>
                  Quick Help Topics
                </h3>
              </div>

              <div className="space-y-4 text-xs text-neutral-700">
                <div className="space-y-1">
                  <h4 className="font-semibold text-neutral-900">How long does shipping take?</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Main cities (Karachi, Lahore, Islamabad) receive orders within 2–4 business days via insured express delivery.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-neutral-900">Are duties and taxes included?</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Yes, 100% of UK import duties and taxes are covered by Lifestyle Shopping UK. Zero hidden fees on delivery.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-neutral-900">Can I exchange for a different size?</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    We offer a hassle-free 7-day exchange window for unworn items in original packaging.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-black/10 flex justify-between items-center text-xs">
                <span className="text-neutral-500">Need full policy details?</span>
                <Link
                  href="/policies"
                  className="font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                >
                  View Policy Hub
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default ContactPage