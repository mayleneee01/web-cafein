'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice, generateId, generateOrderNumber, addOrder } from '@/lib/store';
import { OrderType, PaymentMethod, Order } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft, UtensilsCrossed, PackageOpen, QrCode, Banknote } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [table, setTable] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('qris');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tax = Math.round(totalPrice * 0.1);
  const grandTotal = totalPrice + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="text-center text-charcoal/30">
          <PackageOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">Your cart is empty</p>
          <Link href="/menu" className="text-brand text-xs mt-2 inline-block">Back to Menu</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!name.trim()) { showToast('Please enter your name', 'warning'); return; }
    if (!phone.trim()) { showToast('Please enter phone number', 'warning'); return; }
    if (orderType === 'dine-in' && !table.trim()) { showToast('Please enter table number', 'warning'); return; }

    setSubmitting(true);
    const order: Order = {
      id: generateId(), orderNumber: generateOrderNumber(), customerName: name, customerPhone: phone,
      tableNumber: orderType === 'dine-in' ? table : '', orderType, items, subtotal: totalPrice,
      tax, total: grandTotal, paymentMethod: payment,
      paymentStatus: payment === 'qris' ? 'pending' : 'pending',
      orderStatus: 'received', notes, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();

    if (payment === 'qris') {
      router.push(`/payment/${order.id}`);
    } else {
      showToast('Order placed! Pay at cashier.', 'success');
      router.push(`/tracking/${order.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-8">
      <header className="sticky top-0 z-30 bg-cream-light/90 backdrop-blur-xl border-b border-cream-dark">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/cart" className="text-brand-lighter hover:text-brand text-xs font-medium flex items-center gap-1"><ChevronLeft size={16} /> Cart</Link>
          <h1 className="font-heading text-lg font-bold">Checkout</h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/50">Order Type</h3>
          <div className="flex gap-3">
            {([['dine-in', 'Dine-in', UtensilsCrossed], ['takeaway', 'Takeaway', PackageOpen]] as const).map(([key, label, Icon]) => (
              <button key={key} onClick={() => setOrderType(key as OrderType)}
                className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${orderType === key ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-cream text-charcoal hover:bg-cream-dark'}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
          {orderType === 'dine-in' && (
            <input type="text" placeholder="Table Number" value={table} onChange={e => setTable(e.target.value)}
              className="mt-3 w-full p-3 bg-cream rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
          )}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/50">Your Information</h3>
          <input type="text" placeholder="Your Name *" value={name} onChange={e => setName(e.target.value)}
            className="w-full p-3 bg-cream rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
          <input type="tel" placeholder="Phone Number *" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full p-3 bg-cream rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/50">Special Notes</h3>
          <textarea placeholder="Any special request..." value={notes} onChange={e => setNotes(e.target.value)}
            className="w-full p-3 bg-cream rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/50">Payment Method</h3>
          <div className="flex gap-3">
            <button onClick={() => setPayment('qris')}
              className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${payment === 'qris' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-cream text-charcoal hover:bg-cream-dark'}`}>
              <QrCode size={14} /> QRIS
            </button>
            <button onClick={() => setPayment('cash')}
              className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${payment === 'cash' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-cream text-charcoal hover:bg-cream-dark'}`}>
              <Banknote size={14} /> Cash
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/50">Order Summary</h3>
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-cream-dark last:border-0">
              <span className="text-charcoal/50">{item.menuItem.name} x{item.quantity}</span>
              <span className="font-medium">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
          <div className="mt-3 pt-2 border-t border-cream-dark space-y-1 text-sm">
            <div className="flex justify-between text-charcoal/40"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between text-charcoal/40"><span>Tax (10%)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span className="text-brand">{formatPrice(grandTotal)}</span></div>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full bg-brand text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-light transition-colors shadow-lg shadow-brand/20 disabled:opacity-50">
          {submitting ? 'Processing...' : `Place Order — ${formatPrice(grandTotal)}`}
        </button>
      </div>
    </div>
  );
}
