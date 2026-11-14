import { aire } from '@/lib/fonts'
import { Mail, MessageSquare, Clock, HelpCircle, ArrowUpRight } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/client/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with lifestyle shopping.uk by WhatsApp, email or our contact form for help with orders, sizing, delivery, returns and special import requests.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | lifestyle shopping.uk',
    description:
      'Questions about an order, sizing or delivery? Reach our support team on WhatsApp, email or through the contact form.',
    url: '/contact',
    siteName: 'lifestyle shopping.uk',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | lifestyle shopping.uk',
    description: 'Reach lifestyle shopping.uk for help with orders, sizing and delivery.',
  },
}

const contactMethods = [
  {
    title: 'Concierge WhatsApp',
    value: '03224204456',
    description: 'Instant support for sizing, stock availability, & orders.',
    href: 'https://wa.me/923224204456',
    icon: MessageSquare,
    actionText: 'Chat on WhatsApp',
  },
  {
    title: 'Email Assistance',
    value: 'lifestyleshoppinguk12@gmail.com',
    description: 'Send us your queries—we respond within 12 hours.',
    href: 'mailto:lifestyleshoppinguk12@gmail.com',
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

const ContactPage = () => {
  return (
    <main className="bg-light-beige text-neutral-900 min-h-screen py-16 pt-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
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
                    <h2 className={`${aire.className} text-lg text-neutral-900 tracking-wide`}>
                      {method.title}
                    </h2>
                    <p className="text-sm font-semibold text-neutral-900 mt-1">
                      {method.value}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {method.description}
                  </p>
                </div>

                {method.href && method.actionText && (
                  <Link
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors pt-2"
                  >
                    <span>{method.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Main Grid: Form + Quick Help */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Client component */}
          <ContactForm />

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-8 lg:pl-4">
            <div className="bg-contrast-beige/60 border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <div className="p-2 bg-light-beige rounded-md border border-black/5 text-neutral-900">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h2 className={`${aire.className} text-xl text-neutral-900 tracking-wide`}>
                  Quick Help Topics
                </h2>
              </div>

              <div className="space-y-4 text-xs text-neutral-700">
                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-900">How long does delivery take?</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    In-stock items arrive in 4–5 days via TCS. Pre-orders are imported on request and take 3–4 weeks.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-900">How do I pay for my order?</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    In-stock items need 100% advance payment. Pre-orders need 50% in advance, with the rest paid before dispatch.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-900">Can I exchange or return an item?</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    If there is an issue with your product, message us on WhatsApp within 2 days of delivery. Return shipping is paid by the customer.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-900">Do watches have a guarantee?</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Yes, all watches come with a 1-year guarantee.
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
    </main>
  )
}

export default ContactPage