'use client';
import { useEffect, useState } from 'react';
import { getOrders, formatPrice, formatDate } from '@/lib/store';
import { Order } from '@/lib/types';
import Link from 'next/link';
import { Search, ClipboardList } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setOrders(getOrders());
    const poll = setInterval(() => setOrders(getOrders()), 3000);
    return () => clearInterval(poll);
  }, []);

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.orderStatus !== filter) return false;
    if (search && !o.orderNumber.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statuses: { key: string; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'received', label: 'Received', count: orders.filter(o => o.orderStatus === 'received').length },
    { key: 'paid', label: 'Paid', count: orders.filter(o => o.orderStatus === 'paid').length },
    { key: 'preparing', label: 'Preparing', count: orders.filter(o => o.orderStatus === 'preparing').length },
    { key: 'ready', label: 'Ready', count: orders.filter(o => o.orderStatus === 'ready').length },
    { key: 'completed', label: 'Completed', count: orders.filter(o => o.orderStatus === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length },
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold font-heading mb-4">Orders</h1>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/25" />
        <input type="text" placeholder="Search order number or name..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-lighter placeholder:text-charcoal/25" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {statuses.map(s => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all tracking-wide ${filter === s.key ? 'bg-brand text-white' : 'bg-white text-charcoal/50 hover:bg-gray-100'}`}>
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-charcoal/20">
          <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-xs">No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(o => (
            <Link key={o.id} href={`/admin/orders/${o.id}`}>
              <div className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer mb-2 border-l-4 ${o.orderStatus === 'received' ? 'border-l-blue-500' : o.orderStatus === 'preparing' ? 'border-l-orange-500' : o.orderStatus === 'ready' ? 'border-l-teal-500' : o.orderStatus === 'completed' ? 'border-l-green-500' : o.orderStatus === 'cancelled' ? 'border-l-red-500' : 'border-l-brand'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-brand text-xs">{o.orderNumber}</p>
                    <p className="text-[10px] text-charcoal/35 mt-0.5">{o.customerName} &middot; {o.orderType === 'dine-in' ? `Table ${o.tableNumber}` : 'Takeaway'}</p>
                    <p className="text-[9px] text-charcoal/20 mt-0.5">{formatDate(o.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full status-${o.orderStatus}`}>{o.orderStatus.replace('_', ' ')}</span>
                    <p className="font-bold text-xs mt-1">{formatPrice(o.total)}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded status-${o.paymentStatus}`}>{o.paymentStatus}</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-charcoal/25">{o.items.map(i => i.menuItem.name).join(', ')}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
