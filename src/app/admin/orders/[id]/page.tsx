'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, updateOrder, formatPrice, formatDate } from '@/lib/store';
import { useToast } from '@/contexts/ToastContext';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, XCircle, StickyNote, AlertTriangle } from 'lucide-react';

const orderStatuses: { key: OrderStatus; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'paid', label: 'Paid' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const o = getOrderById(id as string);
    if (!o) { router.push('/admin/orders'); return; }
    setOrder(o);
  }, [id, router]);

  const handleStatusUpdate = (status: OrderStatus) => {
    const updated = updateOrder(id as string, { orderStatus: status });
    if (updated) { setOrder(updated); showToast(`Status updated to ${status}`, 'success'); }
  };

  const handlePaymentUpdate = (status: PaymentStatus) => {
    const updates: Partial<Order> = { paymentStatus: status };
    if (status === 'success') updates.orderStatus = 'paid';
    const updated = updateOrder(id as string, updates);
    if (updated) { setOrder(updated); showToast(`Payment marked as ${status}`, 'success'); }
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) { showToast('Please enter a reason', 'warning'); return; }
    const updated = updateOrder(id as string, { orderStatus: 'cancelled', cancelReason });
    if (updated) { setOrder(updated); setShowCancel(false); showToast('Order cancelled', 'info'); }
  };

  if (!order) return <div className="p-6"><div className="skeleton h-8 w-48 mb-4" /><div className="skeleton h-64 rounded-xl" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <Link href="/admin/orders" className="text-brand-lighter hover:text-brand text-xs font-medium flex items-center gap-1 w-fit"><ChevronLeft size={14} /> Back to Orders</Link>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold font-heading text-brand">{order.orderNumber}</h1>
                <p className="text-[10px] text-charcoal/30 mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <span className={`text-[10px] font-semibold px-3 py-1 rounded-full status-${order.orderStatus}`}>{order.orderStatus.replace('_', ' ')}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div><span className="text-[10px] text-charcoal/35 uppercase tracking-wider">Customer</span><p className="font-medium text-xs mt-0.5">{order.customerName}</p></div>
              <div><span className="text-[10px] text-charcoal/35 uppercase tracking-wider">Phone</span><p className="font-medium text-xs mt-0.5">{order.customerPhone}</p></div>
              <div><span className="text-[10px] text-charcoal/35 uppercase tracking-wider">Type</span><p className="font-medium text-xs capitalize mt-0.5">{order.orderType}{order.tableNumber ? ` — Table ${order.tableNumber}` : ''}</p></div>
              <div><span className="text-[10px] text-charcoal/35 uppercase tracking-wider">Payment</span><p className="font-medium text-xs mt-0.5">{order.paymentMethod.toUpperCase()} <span className={`status-${order.paymentStatus} px-1.5 py-0.5 rounded text-[9px] font-semibold ml-1`}>{order.paymentStatus}</span></p></div>
            </div>
            {order.notes && <div className="mt-3 bg-amber-50 text-amber-800 text-xs p-3 rounded-lg flex items-start gap-2"><StickyNote size={14} className="shrink-0 mt-0.5" /> {order.notes}</div>}
            {order.cancelReason && <div className="mt-3 bg-red-50 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2"><AlertTriangle size={14} className="shrink-0 mt-0.5" /> Cancelled: {order.cancelReason}</div>}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/40">Order Items</h3>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-xs">{item.menuItem.name} <span className="text-charcoal/30">x{item.quantity}</span></p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.size && <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">{item.size}</span>}
                    {item.sugarLevel && <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">{item.sugarLevel}</span>}
                    {item.iceLevel && <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">{item.iceLevel}</span>}
                  </div>
                  {item.addOns.length > 0 && <p className="text-[9px] text-charcoal/30 mt-0.5">+ {item.addOns.map(a => a.name).join(', ')}</p>}
                  {item.notes && <p className="text-[9px] text-charcoal/30 italic">{item.notes}</p>}
                </div>
                <span className="font-medium text-xs">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm">
              <div className="flex justify-between text-charcoal/35 text-xs"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-charcoal/35 text-xs"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
              <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-brand">{formatPrice(order.total)}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {order.orderStatus !== 'cancelled' && order.orderStatus !== 'completed' && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/40">Update Status</h3>
              <div className="space-y-2">
                {orderStatuses.map(s => (
                  <button key={s.key} onClick={() => handleStatusUpdate(s.key)} disabled={order.orderStatus === s.key}
                    className={`w-full py-2 rounded-lg text-[10px] font-medium transition-all tracking-wide ${order.orderStatus === s.key ? 'bg-brand text-white' : 'bg-gray-100 text-charcoal/50 hover:bg-gray-200'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {order.paymentStatus !== 'success' && order.orderStatus !== 'cancelled' && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/40">Payment</h3>
              <button onClick={() => handlePaymentUpdate('success')}
                className="w-full py-2 rounded-lg text-[10px] font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors mb-2 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={12} /> Confirm Payment
              </button>
              <button onClick={() => handlePaymentUpdate('failed')}
                className="w-full py-2 rounded-lg text-[10px] font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center gap-1.5">
                <XCircle size={12} /> Mark Failed
              </button>
            </div>
          )}

          {order.orderStatus !== 'cancelled' && order.orderStatus !== 'completed' && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              {showCancel ? (
                <>
                  <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Reason for cancellation..."
                    className="w-full p-2 bg-gray-50 rounded-lg text-xs resize-none h-20 focus:outline-none focus:ring-1 focus:ring-red-300 mb-2 placeholder:text-charcoal/20" />
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-[10px] font-medium">Confirm Cancel</button>
                    <button onClick={() => setShowCancel(false)} className="flex-1 py-2 bg-gray-100 text-charcoal/50 rounded-lg text-[10px] font-medium">Back</button>
                  </div>
                </>
              ) : (
                <button onClick={() => setShowCancel(true)} className="w-full py-2 rounded-lg text-[10px] font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                  Cancel Order
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
