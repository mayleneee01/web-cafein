'use client';
import Link from 'next/link';
import BottomNav from '@/components/customer/BottomNav';
import { ChevronLeft, Bell, Phone, Plus, ChevronDown } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    { q: 'How do I place an order?', a: 'Browse our menu, add items to your cart, then proceed to checkout. Choose dine-in or takeaway, enter your details, and select your payment method.' },
    { q: 'How does QRIS payment work?', a: 'After checkout, a QR code will appear on your screen. Scan it with any QRIS-supported banking app to complete payment.' },
    { q: 'How can I track my order?', a: 'After placing an order, go to the Track Order page. Search using your order number to see real-time status updates.' },
    { q: 'Can I cancel my order?', a: 'Orders can only be cancelled before they enter the preparation stage. Please contact our staff for assistance.' },
    { q: 'How do I call staff for help?', a: 'Use the Call Staff button above or simply raise your hand if you are dining in. Our staff will be happy to assist you.' },
  ];

  return (
    <div className="min-h-screen bg-cream pb-24">
      <header className="sticky top-0 z-30 bg-cream-light/90 backdrop-blur-xl border-b border-cream-dark">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/menu" className="text-brand-lighter hover:text-brand text-xs font-medium flex items-center gap-1"><ChevronLeft size={16} /> Menu</Link>
          <h1 className="font-heading text-lg font-bold">Help</h1>
          <div className="w-12" />
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-3">
        <button className="w-full bg-brand text-white py-4 rounded-xl font-semibold text-sm hover:bg-brand-light transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand/20">
          <Bell size={16} /> Call Staff
        </button>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/50">Frequently Asked Questions</h3>
          {faqs.map((faq, i) => (
            <details key={i} className="border-b border-cream-dark last:border-0 py-3 group">
              <summary className="text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <Plus size={14} className="text-brand transition-transform group-open:rotate-45 shrink-0 ml-2" />
              </summary>
              <p className="text-xs text-charcoal/40 mt-2 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-xs text-charcoal/35">Need more help?</p>
          <p className="text-brand font-semibold mt-1 flex items-center justify-center gap-1.5"><Phone size={13} /> +62 812-3456-7890</p>
          <p className="text-[10px] text-charcoal/25 mt-0.5">Available 7AM - 10PM</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
