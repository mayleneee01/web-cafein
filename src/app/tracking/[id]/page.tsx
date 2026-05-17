'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, formatPrice, formatDate } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BottomNav from '@/components/customer/BottomNav';
import { ChevronLeft, ClipboardList, CheckCircle2, ChefHat, Bell, PartyPopper, XCircle, QrCode, Banknote, UtensilsCrossed, PackageOpen, User, RefreshCw, MessageSquare } from 'lucide-react';

const statusSteps: { key: OrderStatus; label: string; Icon: React.ElementType }[] = [
  { key: 'received', label: 'Order Received', Icon: ClipboardList },
  { key: 'paid', label: 'Payment Confirmed', Icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', Icon: ChefHat },
  { key: 'ready', label: 'Ready to Serve', Icon: Bell },
  { key: 'completed', label: 'Completed', Icon: PartyPopper },
];

const statusOrder: Record<string, number> = { received: 0, waiting_payment: 0, paid: 1, preparing: 2, ready: 3, completed: 4, cancelled: -1 };

export default function TrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const o = getOrderById(id as string);
    if (!o) { router.push('/menu'); return; }
    setOrder(o);
    const poll = setInterval(() => { const fresh = getOrderById(id as string); if (fresh) setOrder(fresh); }, 2000);
    return () => clearInterval(poll);
  }, [id, router]);

  if (!order) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="skeleton w-8 h-8 rounded-full" /></div>;

  const currentStep = statusOrder[order.orderStatus] ?? 0;
  const cancelled = order.orderStatus === 'cancelled';

  return (
    <div className="min-h-screen bg-cream pb-32 md:pb-8">
      <header className="sticky top-0 z-30 bg-cream-light/90 backdrop-blur-xl border-b border-cream-dark">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/menu" className="text-brand-lighter hover:text-brand text-xs font-medium flex items-center gap-1"><ChevronLeft size={16} /> Menu</Link>
          <h1 className="font-heading text-lg font-bold">Order Status</h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-[10px] text-charcoal/35 uppercase tracking-wider">Order Number</p>
          <p className="font-heading text-2xl font-bold text-brand mt-1">{order.orderNumber}</p>
          <div className="flex justify-center gap-4 mt-3 text-[10px] text-charcoal/40">
            <span className="flex items-center gap-1">{order.orderType === 'dine-in' ? <><UtensilsCrossed size={10} /> Table {order.tableNumber}</> : <><PackageOpen size={10} /> Takeaway</>}</span>
            <span className="flex items-center gap-1"><User size={10} /> {order.customerName}</span>
          </div>
          <p className="text-[9px] text-charcoal/25 mt-2">{formatDate(order.createdAt)}</p>
        </div>

        {cancelled ? (
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <XCircle size={40} className="mx-auto mb-2 text-red-400" />
            <h3 className="font-bold text-red-700 text-sm">Order Cancelled</h3>
            {order.cancelReason && <p className="text-xs text-red-500 mt-1">{order.cancelReason}</p>}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-xs mb-4 uppercase tracking-wider text-charcoal/50">Order Progress</h3>
            <div className="space-y-0">
              {statusSteps.map((step, i) => {
                const done = currentStep >= i;
                const active = currentStep === i;
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <motion.div initial={false} animate={{ scale: active ? 1.1 : 1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${done ? 'bg-brand text-white' : 'bg-cream-dark text-charcoal/25'} ${active ? 'ring-4 ring-brand/15' : ''}`}>
                        <step.Icon size={18} />
                      </motion.div>
                      {i < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-8 ${done && currentStep > i ? 'bg-brand' : 'bg-cream-dark'}`} />
                      )}
                    </div>
                    <div className="pt-2 pb-4">
                      <p className={`text-sm font-medium ${done ? 'text-charcoal' : 'text-charcoal/25'}`}>{step.label}</p>
                      {active && <p className="text-[9px] text-brand mt-0.5 uppercase tracking-wider">Current status</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-xs mb-2 uppercase tracking-wider text-charcoal/50">Payment</h3>
          <div className="flex justify-between items-center">
            <span className="text-xs text-charcoal/40 flex items-center gap-1.5">{order.paymentMethod === 'qris' ? <><QrCode size={12} /> QRIS</> : <><Banknote size={12} /> Cash</>}</span>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full status-${order.paymentStatus}`}>
              {order.paymentStatus === 'pending' ? 'Pending' : order.paymentStatus === 'success' ? 'Paid' : 'Failed'}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-cream-dark">
            <span className="text-sm font-medium">Total</span>
            <span className="font-bold text-brand">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/50">Order Items</h3>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-cream-dark last:border-0">
              <div>
                <span className="font-medium">{item.menuItem.name}</span>
                <span className="text-charcoal/30 ml-1">x{item.quantity}</span>
                {item.size && <span className="text-[9px] text-charcoal/30 block">{item.size}</span>}
              </div>
              <span className="font-medium">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/menu" className="flex-1">
            <button className="w-full bg-brand text-white py-3 rounded-xl text-xs font-semibold hover:bg-brand-light transition-colors flex items-center justify-center gap-1.5">
              <RefreshCw size={13} /> Order Again
            </button>
          </Link>
          <Link href={`/feedback/${order.id}`} className="flex-1">
            <button className="w-full bg-cream text-charcoal py-3 rounded-xl text-xs font-semibold hover:bg-cream-dark transition-colors flex items-center justify-center gap-1.5">
              <MessageSquare size={13} /> Feedback
            </button>
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
