import { aire } from '@/lib/fonts'
import { Truck, RotateCcw, HelpCircle, ShieldCheck, FileText } from 'lucide-react'
import { Metadata } from 'next'
import PolicyNav from '@/components/client/Policy'

export const metadata: Metadata = {
  title: 'Shipping, Returns, FAQs & Policies',
  description:
    "Read lifestyle shopping.uk's shipping and delivery details, returns and exchanges policy, FAQs, privacy policy and terms of service for imported products delivered across Pakistan.",
  alternates: {
    canonical: '/policies',
  },
  openGraph: {
    title: 'Shipping, Returns, FAQs & Policies | lifestyle shopping.uk',
    description:
      'Everything you need to know about delivery, returns, privacy and terms when shopping with lifestyle shopping.uk.',
    url: '/policies',
    siteName: 'lifestyle shopping.uk',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Shipping, Returns, FAQs & Policies | lifestyle shopping.uk',
    description:
      'Delivery, returns, privacy and terms for lifestyle shopping.uk.',
  },
}

const PoliciesPage = () => {
  return (
    <main className="bg-light-beige text-black min-h-screen py-16 pt-28 px-4 sm:px-6 lg:px-12 relative">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-4 border-b border-black/10 pb-8 md:pb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-600 mb-2 inline-block">
            lifestyle shopping.uk Client Services
          </span>
          <h1 className={`${aire.className} text-4xl sm:text-5xl text-neutral-900 tracking-wide`}>
            Policies & Customer Information
          </h1>
          <p className="text-[13px] text-neutral-600 text-center leading-relaxed">
            Transparency is the cornerstone of luxury. Explore our shipping standards, returns procedure, and terms governing your lifestyle shopping.uk experience.
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">

          {/* Sticky side navigation (client component) */}
          <PolicyNav />

          {/* Policy content */}
          <div className="lg:col-span-8 space-y-16">

  {/* 1. Shipping & Delivery */}
  <section id="shipping" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
      <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-neutral-900 shadow-sm">
        <Truck className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h2 className={`${aire.className} text-2xl text-black tracking-wide`}>
        Shipping & Delivery
      </h2>
    </div>
    <div className="space-y-4 text-[13px] text-black leading-relaxed">
      <p>
        Lifestyle Shopping UK sells pre-loved fashion, watches and accessories imported from the UK, USA and UAE. All orders are delivered across Pakistan through TCS.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-black">
        <li><strong>In-Stock Items:</strong> Delivered within 4–5 days of order confirmation.</li>
        <li><strong>Pre-Orders:</strong> Items that are not in stock are imported on request and take 3–4 weeks to arrive.</li>
        <li><strong>Courier:</strong> We ship with TCS and share your tracking details once the order is dispatched.</li>
        <li><strong>Delivery Charges:</strong> PKR 400 for Lahore and PKR 450 for all other cities. The charge is shown at checkout before you place your order.</li>
      </ul>
    </div>
  </section>

  {/* 2. Payment */}
  <section id="payment" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
      <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-black shadow-sm">
        <FileText className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h2 className={`${aire.className} text-2xl text-black tracking-wide`}>
        Payment
      </h2>
    </div>
    <div className="space-y-4 text-[13px] text-black leading-relaxed">
      <ul className="list-disc pl-5 space-y-2 text-black">
        <li><strong>In-Stock Items:</strong> 100% advance payment is required to confirm and dispatch your order.</li>
        <li><strong>Pre-Orders:</strong> 50% advance payment is required to place the order. The remaining 50% is due before the item is dispatched to you.</li>
        <li><strong>Confirmation:</strong> Our team will contact you on WhatsApp with payment details after you place your order.</li>
      </ul>
    </div>
  </section>

  {/* 3. Returns & Exchanges */}
  <section id="returns" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
      <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-black shadow-sm">
        <RotateCcw className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h2 className={`${aire.className} text-2xl text-black tracking-wide`}>
        Returns, Exchanges & Refunds
      </h2>
    </div>
    <div className="space-y-4 text-[13px] text-black leading-relaxed">
      <p>
        If there is an issue with your product, you can request a return or exchange within 2 days of delivery.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-black">
        <li><strong>2-Day Window:</strong> Requests must be made within 2 days of receiving your order. Requests after this period cannot be accepted.</li>
        <li><strong>How to Request:</strong> Message us on WhatsApp at 0322 4204456 with your order number and clear photos or a short video of the issue.</li>
        <li><strong>Return Shipping:</strong> The customer bears the return shipping cost.</li>
        <li><strong>Refunds:</strong> Approved refunds are processed within 2 working days after we receive and inspect the returned item.</li>
        <li><strong>Pre-Orders:</strong> Pre-ordered items are imported specially for you, so please confirm your size, colour and details before paying.</li>
      </ul>
    </div>
  </section>

  {/* 4. FAQs */}
  <section id="faq" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
      <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-black shadow-sm">
        <HelpCircle className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h2 className={`${aire.className} text-2xl text-black tracking-wide`}>
        Frequently Asked Questions
      </h2>
    </div>
    <div className="space-y-6 text-[13px] text-black">
      <div className="space-y-1.5">
        <h3 className="font-semibold text-black">How long does delivery take?</h3>
        <p className="text-black leading-relaxed">In-stock items arrive in 4–5 days. Pre-orders take 3–4 weeks because they are imported after you order.</p>
      </div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-black">How do I pay?</h3>
        <p className="text-black leading-relaxed">In-stock items need 100% advance payment. Pre-orders need 50% in advance, with the rest paid before dispatch.</p>
      </div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-black">Which courier do you use?</h3>
        <p className="text-black leading-relaxed">All orders are shipped with TCS.</p>
      </div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-black">Can I exchange an item?</h3>
        <p className="text-black leading-relaxed">Yes, if there is an issue with the product, you can request an exchange within 2 days of delivery.</p>
      </div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-black">Do watches come with a guarantee?</h3>
        <p className="text-black leading-relaxed">Yes. All watches come with a 1-year guarantee.</p>
      </div>
    </div>
  </section>

  {/* 5. Privacy Policy */}
  <section id="privacy-policy" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
      <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-black shadow-sm">
        <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h2 className={`${aire.className} text-2xl text-black tracking-wide`}>
        Privacy Policy
      </h2>
    </div>
    <div className="space-y-4 text-[13px] text-black leading-relaxed">
      <p>
        We collect only the information needed to process your order: your name, phone number, email, delivery address and any notes you add.
      </p>
      <p className="text-black">
        This information is used to confirm and deliver your order and to contact you about it. It is shared only with our courier (TCS) for delivery, and we never sell your personal information.
      </p>
    </div>
  </section>

  {/* 6. Terms of Service */}
  <section id="terms" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
      <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-black shadow-sm">
        <FileText className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h2 className={`${aire.className} text-2xl text-black tracking-wide`}>
        Terms of Service
      </h2>
    </div>
    <div className="space-y-4 text-[13px] text-black leading-relaxed">
      <p>
        By ordering from Lifestyle Shopping UK, you agree to the terms below.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-black">
        <li><strong>Pricing & Availability:</strong> All prices are in PKR and may change based on stock availability.</li>
        <li><strong>Guarantee:</strong> Watches come with a 1-year guarantee.</li>
        <li><strong>Disputes:</strong> For any complaint or dispute, contact us on WhatsApp at 0322 4204456 and we will work to resolve it.</li>
        <li><strong>Intellectual Property:</strong> All imagery, designs and branding on this website belong to Lifestyle Shopping UK.</li>
      </ul>
    </div>
  </section>

  {/* 7. Business Information */}
  <section id="business-info" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
    <div className="flex items-center gap-3 border-b border-black/10 pb-4">
      <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-black shadow-sm">
        <HelpCircle className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h2 className={`${aire.className} text-2xl text-black tracking-wide`}>
        Business Information
      </h2>
    </div>
    <div className="space-y-2 text-[13px] text-black leading-relaxed">
      <p><strong>Address:</strong> Phase 3, DHA, Lahore, Pakistan</p>
      <p><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/923224204456" className="underline underline-offset-4">0322 4204456</a></p>
    </div>
  </section>

</div>
        </div>
      </div>
    </main>
  )
}

export default PoliciesPage