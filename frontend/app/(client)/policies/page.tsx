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
                  At lifestyle shopping.uk, we curate luxury collections directly imported from the United Kingdom. Every order is meticulously inspected, securely packaged in our signature unboxing boxes, and shipped straight to your doorstep across Pakistan and worldwide.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-black">
                  <li><strong>Complimentary Delivery:</strong> Enjoy free express shipping on all orders above PKR 5,000.</li>
                  <li><strong>Duties & Taxes Included:</strong> The price you see is the absolute final price you pay. All customs duties, import tariffs, and taxes are fully covered by lifestyle shopping.uk.</li>
                  <li><strong>Nationwide Transit Time:</strong> Orders reaching Karachi, Lahore, Islamabad, and major cities typically arrive within 2–4 business days via insured courier partners.</li>
                  <li><strong>Eco-Curation:</strong> Every single order automatically plants a tree in your name, tracked live inside your personal account dashboard.</li>
                </ul>
              </div>
            </section>

            {/* 2. Returns & Exchanges */}
            <section id="returns" className="bg-contrast-beige/40 border border-black/10 rounded-xl p-6 sm:p-10 space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <div className="p-2.5 bg-light-beige rounded-lg border border-black/5 text-black shadow-sm">
                  <RotateCcw className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h2 className={`${aire.className} text-2xl text-black tracking-wide`}>
                  Returns & Exchanges
                </h2>
              </div>
              <div className="space-y-4 text-[13px] text-black leading-relaxed">
                <p>
                  We want your lifestyle shopping.uk experience to be flawless. If you wish to exchange a timepiece, apparel size, or accessory, we offer a straightforward return and exchange window.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-black">
                  <li><strong>7-Day Window:</strong> You may request a return or exchange within 7 days of receiving your package.</li>
                  <li><strong>Item Condition:</strong> Items must be unblemished, unworn, and returned in their original luxury packaging with all tags and seals intact.</li>
                  <li><strong>Quick Processing:</strong> Once inspected at our Lahore distribution hub, exchanges are dispatched immediately or store credit/refunds are processed securely.</li>
                </ul>
              </div>
            </section>

            {/* 3. FAQs */}
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
                  <h3 className="font-semibold text-black">Are lifestyle shopping.uk watches and jewelry authentic?</h3>
                  <p className="text-black leading-relaxed">Yes. Every piece in our men&apos;s watches, women&apos;s watches, clothing, and accessories collection is authentically imported straight from authorized British brand houses.</p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-black">Will I have to pay any extra customs tax upon delivery?</h3>
                  <p className="text-black leading-relaxed">Never. lifestyle shopping.uk covers 100% of international import duties and taxes. What you see at checkout is all you pay.</p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-black">How do I track my planted tree?</h3>
                  <p className="text-black leading-relaxed">With every completed order, our environmental partnership records your tree planting milestone directly in your customer portal profile.</p>
                </div>
              </div>
            </section>

            {/* 4. Privacy Policy */}
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
                  Your privacy is paramount. lifestyle shopping.uk respects and protects your personal information in accordance with international data security standards.
                </p>
                <p className="text-black">
                  We collect only necessary information required to process orders, manage deliveries, and optimize your shopping experience. We never sell or distribute your private credentials.
                </p>
              </div>
            </section>

            {/* 5. Terms of Service */}
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
                  By accessing and purchasing from lifestyle shopping.uk, you agree to comply with our operating terms.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-black">
                  <li><strong>Pricing & Availability:</strong> All prices are listed in PKR and are subject to adjustment based on stock availability.</li>
                  <li><strong>Intellectual Property:</strong> All imagery, product designs, brand names, and typography associated with lifestyle shopping.uk are legally protected.</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
}

export default PoliciesPage