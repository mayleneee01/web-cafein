'use client';
import { useEffect, useState } from 'react';
import { getOrders, formatPrice } from '@/lib/store';
import { Order } from '@/lib/types';
import { Trophy, CreditCard, Banknote, UtensilsCrossed, PackageOpen, CheckCircle2, Clock, XCircle, Download } from 'lucide-react';

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');

  useEffect(() => { setOrders(getOrders()); }, []);

  const now = new Date();
  const filtered = orders.filter(o => {
    const d = new Date(o.createdAt);
    if (period === 'today') return d.toDateString() === now.toDateString();
    if (period === 'week') return (now.getTime() - d.getTime()) < 7 * 86400000;
    if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  });

  const completed = filtered.filter(o => o.paymentStatus === 'success');
  const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
  const avgOrder = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;
  const cancelledCount = filtered.filter(o => o.orderStatus === 'cancelled').length;

  const itemCount: Record<string, { name: string; count: number; revenue: number }> = {};
  completed.forEach(o => {
    o.items.forEach(item => {
      const key = item.menuItem.id;
      if (!itemCount[key]) itemCount[key] = { name: item.menuItem.name, count: 0, revenue: 0 };
      itemCount[key].count += item.quantity;
      itemCount[key].revenue += item.subtotal;
    });
  });
  const bestSellers = Object.values(itemCount).sort((a, b) => b.count - a.count).slice(0, 10);

  const qrisOrders = filtered.filter(o => o.paymentMethod === 'qris').length;
  const cashOrders = filtered.filter(o => o.paymentMethod === 'cash').length;
  const dineIn = filtered.filter(o => o.orderType === 'dine-in').length;
  const takeaway = filtered.filter(o => o.orderType === 'takeaway').length;

  const handleExport = () => {
    const csv = ['Order Number,Customer,Type,Total,Payment Status,Order Status,Date',
      ...filtered.map(o => `${o.orderNumber},${o.customerName},${o.orderType},${o.total},${o.paymentStatus},${o.orderStatus},${o.createdAt}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `cafein-report-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold font-heading">Sales Report</h1>
        <button onClick={handleExport} className="bg-brand text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-brand-light transition-colors flex items-center gap-1.5"><Download size={14} /> Export CSV</button>
      </div>

      <div className="flex gap-2 mb-6">
        {([['today', 'Today'], ['week', 'This Week'], ['month', 'This Month'], ['all', 'All Time']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setPeriod(key)}
            className={`px-4 py-2 rounded-xl text-[10px] font-medium transition-all tracking-wide ${period === key ? 'bg-brand text-white' : 'bg-white text-charcoal/50 hover:bg-gray-100'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-charcoal/35 uppercase tracking-wider">Total Revenue</p>
          <p className="text-xl font-bold text-brand mt-1">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-charcoal/35 uppercase tracking-wider">Total Orders</p>
          <p className="text-xl font-bold mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-charcoal/35 uppercase tracking-wider">Avg Order Value</p>
          <p className="text-xl font-bold mt-1">{formatPrice(avgOrder)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-[10px] text-charcoal/35 uppercase tracking-wider">Cancelled</p>
          <p className="text-xl font-bold text-red-500 mt-1">{cancelledCount}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/40 flex items-center gap-1.5"><Trophy size={14} className="text-amber-600" /> Best Selling Items</h3>
          {bestSellers.length === 0 ? (
            <p className="text-xs text-charcoal/25 py-4 text-center">No data yet</p>
          ) : (
            bestSellers.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-charcoal/35'}`}>{i + 1}</span>
                  <div>
                    <p className="text-xs font-medium">{item.name}</p>
                    <p className="text-[9px] text-charcoal/25">{item.count} sold</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-brand">{formatPrice(item.revenue)}</span>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/40 flex items-center gap-1.5"><CreditCard size={14} /> Payment Methods</h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-blue-700">{qrisOrders}</p>
                <p className="text-[9px] text-blue-500 uppercase tracking-wider">QRIS</p>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-green-700">{cashOrders}</p>
                <p className="text-[9px] text-green-500 uppercase tracking-wider">Cash</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/40 flex items-center gap-1.5"><UtensilsCrossed size={14} /> Order Types</h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-purple-700">{dineIn}</p>
                <p className="text-[9px] text-purple-500 uppercase tracking-wider">Dine-in</p>
              </div>
              <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-orange-700">{takeaway}</p>
                <p className="text-[9px] text-orange-500 uppercase tracking-wider">Takeaway</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-xs mb-3 uppercase tracking-wider text-charcoal/40">Payment Status</h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-emerald-700">{filtered.filter(o => o.paymentStatus === 'success').length}</p>
                <p className="text-[9px] text-emerald-500 uppercase tracking-wider">Paid</p>
              </div>
              <div className="flex-1 bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-amber-700">{filtered.filter(o => o.paymentStatus === 'pending').length}</p>
                <p className="text-[9px] text-amber-500 uppercase tracking-wider">Pending</p>
              </div>
              <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-red-700">{filtered.filter(o => o.paymentStatus === 'failed').length}</p>
                <p className="text-[9px] text-red-500 uppercase tracking-wider">Failed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
