'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function FloatingCart() {
  const { totalItems, totalPrice } = useCart();
  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-28 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-80 z-40">
        <Link href="/cart">
          <motion.div whileTap={{ scale: 0.97 }}
            className="bg-brand text-white rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-xl shadow-charcoal/20 hover:bg-brand-light transition-colors">
            <div className="flex items-center gap-3">
              <motion.span key={totalItems} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="bg-white/15 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </motion.span>
              <span className="font-medium text-sm flex items-center gap-1.5"><ShoppingBag size={14} /> View Cart</span>
            </div>
            <span className="font-bold text-sm">{formatPrice(totalPrice)}</span>
          </motion.div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
