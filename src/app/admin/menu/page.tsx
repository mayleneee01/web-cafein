'use client';
import { useEffect, useState } from 'react';
import { getMenuItems, saveMenuItems, getCategories, formatPrice, generateId } from '@/lib/store';
import { useToast } from '@/contexts/ToastContext';
import { MenuItem } from '@/lib/types';
import Image from 'next/image';
import { Plus, X, Star, Tag, Coffee, CupSoda, UtensilsCrossed, Cookie } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  coffee: <Coffee size={12} />,
  'non-coffee': <CupSoda size={12} />,
  food: <UtensilsCrossed size={12} />,
  snacks: <Cookie size={12} />,
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const categories = getCategories();
  const { showToast } = useToast();

  useEffect(() => { setItems(getMenuItems()); }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.categoryId === filter);

  const handleSave = (item: MenuItem) => {
    let updated: MenuItem[];
    if (items.find(i => i.id === item.id)) {
      updated = items.map(i => i.id === item.id ? item : i);
    } else {
      updated = [item, ...items];
    }
    saveMenuItems(updated);
    setItems(updated);
    setShowForm(false);
    setEditItem(null);
    showToast(editItem ? 'Menu item updated' : 'Menu item added', 'success');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this item?')) return;
    const updated = items.filter(i => i.id !== id);
    saveMenuItems(updated);
    setItems(updated);
    showToast('Item deleted', 'info');
  };

  const toggleAvailability = (id: string) => {
    const updated = items.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i);
    saveMenuItems(updated);
    setItems(updated);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold font-heading">Menu Management</h1>
        <button onClick={() => { setEditItem(null); setShowForm(true); }}
          className="bg-brand text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-brand-light transition-colors flex items-center gap-1.5"><Plus size={14} /> Add Item</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap tracking-wide ${filter === 'all' ? 'bg-brand text-white' : 'bg-white text-charcoal/50'}`}>All ({items.length})</button>
        {categories.filter(c => !['best-seller', 'promo'].includes(c.id)).map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap flex items-center gap-1 tracking-wide ${filter === c.id ? 'bg-brand text-white' : 'bg-white text-charcoal/50'}`}>
            {categoryIcons[c.id]} {c.name} ({items.filter(i => i.categoryId === c.id).length})
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(item => (
          <div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${item.isAvailable ? 'border-l-emerald-500' : 'border-l-red-300'}`}>
            <div className="flex gap-3">
              <div className="w-14 h-14 min-w-[56px] rounded-lg relative overflow-hidden bg-cream-dark">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs truncate">{item.name}</h3>
                <p className="text-[9px] text-charcoal/30 mt-0.5 line-clamp-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-brand font-bold text-xs">{formatPrice(item.price)}</span>
                  {item.isBestSeller && <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5"><Star size={8} fill="currentColor" /> Best</span>}
                  {item.isPromo && <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5"><Tag size={8} /> Promo</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => toggleAvailability(item.id)}
                  className={`text-[9px] px-2 py-1 rounded-lg font-medium tracking-wide ${item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-500'}`}>
                  {item.isAvailable ? 'Active' : 'Off'}
                </button>
                <button onClick={() => { setEditItem(item); setShowForm(true); }} className="text-[9px] px-2 py-1 rounded-lg bg-blue-100 text-blue-600 font-medium">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-[9px] px-2 py-1 rounded-lg bg-red-50 text-red-400 font-medium">Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && <MenuForm item={editItem} categories={categories.filter(c => !['best-seller', 'promo'].includes(c.id))} onSave={handleSave} onClose={() => { setShowForm(false); setEditItem(null); }} />}
    </div>
  );
}

function MenuForm({ item, categories, onSave, onClose }: { item: MenuItem | null; categories: { id: string; name: string }[]; onSave: (item: MenuItem) => void; onClose: () => void }) {
  const [name, setName] = useState(item?.name || '');
  const [desc, setDesc] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price?.toString() || '');
  const [cat, setCat] = useState(item?.categoryId || categories[0]?.id || '');
  const [available, setAvailable] = useState(item?.isAvailable ?? true);
  const [bestSeller, setBestSeller] = useState(item?.isBestSeller ?? false);
  const [promo, setPromo] = useState(item?.isPromo ?? false);
  const [promoPrice, setPromoPrice] = useState(item?.promoPrice?.toString() || '');

  const handleSubmit = () => {
    if (!name || !price) return;
    onSave({
      id: item?.id || generateId(), categoryId: cat, name, description: desc, price: parseInt(price),
      image: item?.image || '/menu/latte.png', isAvailable: available, isBestSeller: bestSeller,
      isPromo: promo, promoPrice: promo ? parseInt(promoPrice) || undefined : undefined,
      sizes: item?.sizes, addOns: item?.addOns,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold">{item ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
          <button onClick={onClose} className="text-charcoal/20 hover:text-charcoal/50"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <input type="text" placeholder="Item name *" value={name} onChange={e => setName(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
          <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
          <input type="number" placeholder="Price *" value={price} onChange={e => setPrice(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
          <select value={cat} onChange={e => setCat(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none">
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} className="accent-brand" /> Available</label>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={bestSeller} onChange={e => setBestSeller(e.target.checked)} className="accent-brand" /> Best Seller</label>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={promo} onChange={e => setPromo(e.target.checked)} className="accent-brand" /> Promo</label>
          </div>
          {promo && (
            <input type="number" placeholder="Promo Price" value={promoPrice} onChange={e => setPromoPrice(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
          )}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={handleSubmit} className="flex-1 bg-brand text-white py-2.5 rounded-xl text-xs font-medium hover:bg-brand-light transition-colors">Save</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-charcoal/50 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}
