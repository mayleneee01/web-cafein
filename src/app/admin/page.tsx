'use client';
import { useEffect, useState } from 'react';
import { getOrders, formatPrice } from '@/lib/store';
import { Order } from '@/lib/types';
import Link from 'next/link';
import { ClipboardList, Clock, ChefHat, CheckCircle2, XCircle, DollarSign, CreditCard, Timer } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    const poll = setInterval(() => setOrders(getOrders()), 3000);
    return () => clearInterval(poll);
  }, []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const pending = todayOrders.filter(o => ['received', 'waiting_payment'].includes(o.orderStatus));
  const preparing = todayOrders.filter(o => o.orderStatus === 'preparing');
  const completed = todayOrders.filter(o => o.orderStatus === 'completed');
  const cancelled = todayOrders.filter(o => o.orderStatus === 'cancelled');
  const totalSales = todayOrders.filter(o => o.paymentStatus === 'success').reduce((s, o) => s + o.total, 0);
  const paidOrders = todayOrders.filter(o => o.paymentStatus === 'success');
  const pendingPayments = todayOrders.filter(o => o.paymentStatus === 'pending');

  const stats = [
    { label: 'Total Orders', value: todayOrders.length, Icon: ClipboardList, color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending', value: pending.length, Icon: Clock, color: 'bg-amber-50 text-amber-700' },
    { label: 'Preparing', value: preparing.length, Icon: ChefHat, color: 'bg-orange-50 text-orange-700' },
    { label: 'Completed', value: completed.length, Icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Cancelled', value: cancelled.length, Icon: XCircle, color: 'bg-red-50 text-red-700' },
    { label: 'Total Sales', value: formatPrice(totalSales), Icon: DollarSign, color: 'bg-green-50 text-green-700' },
    { label: 'Paid', value: paidOrders.length, Icon: CreditCard, color: 'bg-teal-50 text-teal-700' },
    { label: 'Awaiting Pay', value: pendingPayments.length, Icon: Timer, color: 'bg-yellow-50 text-yellow-700' },
  ];

  const recentOrders = orders.slice(0, 8);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading">Dashboard</h1>
          <p className="text-xs text-charcoal/35 mt-0.5">Today&apos;s overview</p>
        </div>
        <Link href="/admin/orders" className="bg-brand text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-brand-light transition-colors">View All Orders</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 transition-all hover:scale-[1.02]`}>
            <s.Icon size={20} className="opacity-60" />
            <p className="text-2xl font-bold mt-2">{s.value}</p>
            <p className="text-[10px] opacity-50 mt-0.5 tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-sm">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[10px] text-brand hover:underline uppercase tracking-wider">View All</Link>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-charcoal/35 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-charcoal/35 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-charcoal/35 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-charcoal/35 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-charcoal/35 uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-charcoal/35 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-charcoal/35 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-brand text-xs">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-xs">{o.customerName}</td>
                  <td className="px-4 py-3 capitalize text-xs">{o.orderType}</td>
                  <td className="px-4 py-3 font-medium text-xs">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3"><span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full status-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                  <td className="px-4 py-3"><span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full status-${o.orderStatus}`}>{o.orderStatus.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="text-brand text-[10px] hover:underline uppercase tracking-wider">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-3 space-y-2">
          {recentOrders.map(o => (
            <Link key={o.id} href={`/admin/orders/${o.id}`}>
              <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-brand text-xs">{o.orderNumber}</p>
                    <p className="text-[10px] text-charcoal/35">{o.customerName} &middot; {o.orderType}</p>
                  </div>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full status-${o.orderStatus}`}>{o.orderStatus.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between mt-2 text-[10px]">
                  <span className="font-medium">{formatPrice(o.total)}</span>
                  <span className={`font-semibold status-${o.paymentStatus} px-1.5 py-0.5 rounded text-[9px]`}>{o.paymentStatus}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {recentOrders.length === 0 && (
          <div className="py-12 text-center text-charcoal/20">
            <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
