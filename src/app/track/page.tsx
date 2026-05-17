'use client';
import { useState } from 'react';
import { getOrders, formatPrice, formatDate } from '@/lib/store';
import Link from 'next/link';
import BottomNav from '@/components/customer/BottomNav';
import { ChevronLeft, Search, Package } from 'lucide-react';

export default function TrackPage() {
  const [search, setSearch] = useState('');
  const orders = getOrders();
  const filtered = search ? orders.filter(o => o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase())) : orders.slice(0, 10);

  return (
    <div className="min-h-screen bg-cream pb-32 md:pb-8">
      <header className="sticky top-0 z-30 bg-cream-light/90 backdrop-blur-xl border-b border-cream-dark">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/menu" className="text-brand-lighter hover:text-brand text-xs font-medium flex items-center gap-1"><ChevronLeft size={16} /> Menu</Link>
          <h1 className="font-heading text-lg font-bold">Track Order</h1>
          <div className="w-12" />
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/25" />
          <input type="text" placeholder="Search by order number or name..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-cream-dark focus:outline-none focus:border-brand-lighter text-sm placeholder:text-charcoal/25" />
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-charcoal/25">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No orders found</p>
            <p className="text-xs mt-1">Place an order from our menu</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {filtered.map(o => (
              <Link key={o.id} href={`/tracking/${o.id}`}>
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-brand text-sm">{o.orderNumber}</p>
                      <p className="text-[10px] text-charcoal/35 mt-0.5">{o.customerName} &middot; {o.orderType === 'dine-in' ? `Table ${o.tableNumber}` : 'Takeaway'}</p>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full status-${o.orderStatus}`}>{o.orderStatus.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-charcoal/30">
                    <span>{o.items.length} items</span>
                    <span>{formatPrice(o.total)}</span>
                  </div>
                  <p className="text-[9px] text-charcoal/20 mt-1">{formatDate(o.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
