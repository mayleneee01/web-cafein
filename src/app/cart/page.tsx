'use client';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import BottomNav from '@/components/customer/BottomNav';
import { ChevronLeft, X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { showToast } = useToast();
  const tax = Math.round(totalPrice * 0.1);
  const grandTotal = totalPrice + tax;

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-8">
      <header className="sticky top-0 z-30 bg-cream-light/90 backdrop-blur-xl border-b border-cream-dark">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/menu" className="text-brand-lighter hover:text-brand flex items-center gap-1 text-xs font-medium"><ChevronLeft size={16} /> Menu</Link>
          <h1 className="font-heading text-lg font-bold">Your Cart</h1>
          {items.length > 0 && (
            <button onClick={() => { clearCart(); showToast('Cart cleared', 'info'); }} className="text-[10px] text-red-500/60 hover:text-red-600 flex items-center gap-1 uppercase tracking-wider"><Trash2 size={12} /> Clear</button>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-4">
        {items.length === 0 ? (
          <div className="text-center py-20 text-charcoal/25">
            <ShoppingBag size={56} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium text-lg">Your cart is empty</p>
            <p className="text-xs mt-1 mb-6">Add some delicious items from our menu</p>
            <Link href="/menu" className="bg-brand text-white px-6 py-3 rounded-xl text-xs font-semibold inline-block hover:bg-brand-light transition-colors tracking-wide uppercase">Browse Menu</Link>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 min-w-[64px] rounded-xl relative overflow-hidden bg-cream-dark">
                      <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm truncate pr-2">{item.menuItem.name}</h3>
                        <button onClick={() => { removeItem(item.id); showToast('Item removed', 'info'); }} className="text-charcoal/20 hover:text-red-500 transition-colors shrink-0"><X size={14} /></button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.size && <span className="text-[9px] bg-cream px-1.5 py-0.5 rounded text-charcoal/40 tracking-wide">{item.size}</span>}
                        {item.sugarLevel && <span className="text-[9px] bg-cream px-1.5 py-0.5 rounded text-charcoal/40 tracking-wide">{item.sugarLevel}</span>}
                        {item.iceLevel && <span className="text-[9px] bg-cream px-1.5 py-0.5 rounded text-charcoal/40 tracking-wide">{item.iceLevel}</span>}
                      </div>
                      {item.addOns.length > 0 && <p className="text-[9px] text-charcoal/30 mt-0.5">+ {item.addOns.map(a => a.name).join(', ')}</p>}
                      {item.notes && <p className="text-[9px] text-charcoal/30 italic mt-0.5">{item.notes}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-brand font-bold text-sm">{formatPrice(item.subtotal)}</span>
                        <div className="flex items-center bg-cream rounded-lg">
                          <button onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : (removeItem(item.id), showToast('Item removed', 'info'))}
                            className="w-7 h-7 flex items-center justify-center text-brand"><Minus size={12} /></button>
                          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-brand"><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="bg-white rounded-xl p-4 mt-4 shadow-sm">
              <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/50">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-charcoal/40"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between text-charcoal/40"><span>Tax (10%)</span><span>{formatPrice(tax)}</span></div>
                <div className="border-t border-cream-dark pt-2 flex justify-between font-bold"><span>Total</span><span className="text-brand">{formatPrice(grandTotal)}</span></div>
              </div>
            </div>

            <Link href="/checkout" className="block mt-4">
              <motion.button whileTap={{ scale: 0.97 }} className="w-full bg-brand text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-light transition-colors shadow-lg shadow-brand/20">
                Proceed to Checkout — {formatPrice(grandTotal)}
              </motion.button>
            </Link>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
