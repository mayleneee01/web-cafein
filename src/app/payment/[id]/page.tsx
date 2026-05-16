'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, updateOrder, formatPrice } from '@/lib/store';
import { Order } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Clock, ArrowRight, QrCode } from 'lucide-react';

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const o = getOrderById(id as string);
    if (!o) { router.push('/menu'); return; }
    setOrder(o);
  }, [id, router]);

  useEffect(() => {
    if (!order || order.paymentStatus === 'success') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  useEffect(() => {
    if (!order || order.paymentStatus === 'success') return;
    const timer = setTimeout(() => {
      const updated = updateOrder(order.id, { paymentStatus: 'success', orderStatus: 'paid' });
      if (updated) setOrder(updated);
    }, 10000);
    return () => clearTimeout(timer);
  }, [order]);

  useEffect(() => {
    if (!order) return;
    const poll = setInterval(() => { const fresh = getOrderById(order.id); if (fresh) setOrder(fresh); }, 2000);
    return () => clearInterval(poll);
  }, [order]);

  if (!order) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="skeleton w-8 h-8 rounded-full" /></div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const paid = order.paymentStatus === 'success';

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-lg text-center">

        {paid ? (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </motion.div>
            <h2 className="font-heading text-2xl font-bold text-emerald-700">Payment Successful</h2>
            <p className="text-xs text-charcoal/40 mt-2">Your order is now being prepared</p>
            <div className="mt-4 bg-cream rounded-xl p-3">
              <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Order Number</p>
              <p className="font-bold text-lg text-brand mt-0.5">{order.orderNumber}</p>
            </div>
            <Link href={`/tracking/${order.id}`}>
              <button className="mt-6 w-full bg-brand text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-light transition-colors flex items-center justify-center gap-2">
                Track Your Order <ArrowRight size={14} />
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-1">
              <QrCode size={20} className="text-brand" />
              <h2 className="font-heading text-xl font-bold">Scan to Pay</h2>
            </div>
            <p className="text-xs text-charcoal/40 mb-5">Open your banking app and scan the QR code</p>

            <div className="bg-white border-2 border-cream-dark rounded-2xl p-4 mx-auto w-64 h-64 flex flex-col items-center justify-center relative">
              <div className="grid grid-cols-8 gap-0.5 w-48 h-48">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-charcoal' : 'bg-white'}`} />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-cream-dark">
                  <span className="font-heading text-xs font-bold text-brand">C</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-charcoal/50">
              <p>Amount: <span className="font-bold text-brand text-base">{formatPrice(order.total)}</span></p>
              <p className="mt-1 text-xs">Order: <span className="font-semibold">{order.orderNumber}</span></p>
            </div>

            <div className="mt-4 bg-amber-50 text-amber-800 rounded-xl px-4 py-2 text-xs flex items-center justify-center gap-2">
              <Clock size={14} />
              <span>Expires in <span className="font-bold">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span></span>
            </div>

            <p className="text-[9px] text-charcoal/20 mt-3 italic">Demo: Payment auto-confirms in ~10 seconds</p>

            <div className="mt-4 flex gap-2">
              <Link href={`/tracking/${order.id}`} className="flex-1">
                <button className="w-full bg-cream text-charcoal py-2.5 rounded-xl text-xs font-medium hover:bg-cream-dark transition-colors">Track Order</button>
              </Link>
              <Link href="/menu" className="flex-1">
                <button className="w-full bg-cream text-charcoal py-2.5 rounded-xl text-xs font-medium hover:bg-cream-dark transition-colors">Back to Menu</button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
