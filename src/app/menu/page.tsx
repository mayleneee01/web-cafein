'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenuItems, getCategories, formatPrice } from '@/lib/store';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { MenuItem } from '@/lib/types';
import { sugarLevels, iceLevels } from '@/lib/seed';
import BottomNav from '@/components/customer/BottomNav';
import FloatingCart from '@/components/customer/FloatingCart';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Search, ShoppingCart, Star, Tag, UtensilsCrossed, Cookie, CupSoda, X, Plus, Minus, ChevronLeft } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  coffee: <Coffee size={14} />,
  'non-coffee': <CupSoda size={14} />,
  food: <UtensilsCrossed size={14} />,
  snacks: <Cookie size={14} />,
  'best-seller': <Star size={14} />,
  promo: <Tag size={14} />,
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const categories = getCategories();
  const { addItem, totalItems } = useCart();
  const { showToast } = useToast();

  useEffect(() => { setItems(getMenuItems()); setLoading(false); }, []);

  const filtered = useMemo(() => {
    let result = items.filter(i => i.isAvailable);
    if (activeCategory === 'best-seller') result = result.filter(i => i.isBestSeller);
    else if (activeCategory === 'promo') result = result.filter(i => i.isPromo);
    else if (activeCategory !== 'all') result = result.filter(i => i.categoryId === activeCategory);
    if (search) result = result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [items, activeCategory, search]);

  const greeting = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-cream-light/90 backdrop-blur-xl border-b border-cream-dark">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-heading text-xl font-bold text-charcoal">Café<span className="text-brand-lighter">in</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/track" className="text-xs text-brand-lighter hover:text-brand font-medium hidden md:block tracking-wide uppercase">Track Order</Link>
            <Link href="/cart" className="relative p-2 text-charcoal hover:text-brand transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </Link>
            <Link href="/admin/login" className="text-[10px] text-charcoal/30 hover:text-brand hidden md:block uppercase tracking-wider">Admin</Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        {/* Hero banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl overflow-hidden relative h-48 md:h-56">
          <Image src="/images/hero.png" alt="Caféin interior with warm ambient lighting" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
            <p className="text-brand-accent text-xs tracking-[0.2em] uppercase font-medium mb-1">Good {greeting}</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">What would you like<br />to order today?</h1>
            <p className="text-white/50 text-xs tracking-wider italic">Where Every Sip Inspires</p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
          <input type="text" placeholder="Search menu..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-cream-dark focus:outline-none focus:border-brand-lighter text-sm placeholder:text-charcoal/30" />
        </div>

        {/* Category tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide sticky top-[57px] z-20 bg-cream pt-1 -mx-4 px-4">
          <button onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all tracking-wide ${activeCategory === 'all' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-white text-charcoal-light hover:bg-cream-dark'}`}>
            All Menu
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 tracking-wide ${activeCategory === cat.id ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-white text-charcoal-light hover:bg-cream-dark'}`}>
              {categoryIcons[cat.id]} {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid / List */}
        {loading ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-center text-charcoal/30">
            <Coffee size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No items found</p>
            <p className="text-xs mt-1">Try another category or search term</p>
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="mt-6 hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-brand-accent/20">
                  <div className="h-44 relative overflow-hidden bg-cream-dark">
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {item.isBestSeller && <span className="absolute top-3 left-3 bg-charcoal/80 backdrop-blur-sm text-white text-[9px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 tracking-wide"><Star size={9} fill="currentColor" /> BEST SELLER</span>}
                    {item.isPromo && <span className="absolute top-3 right-3 bg-red-700/90 backdrop-blur-sm text-white text-[9px] font-semibold px-2.5 py-1 rounded-full tracking-wide">PROMO</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm group-hover:text-brand transition-colors">{item.name}</h3>
                    <p className="text-[11px] text-charcoal/40 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        {item.isPromo && item.promoPrice ? (
                          <><span className="text-brand font-bold text-sm">{formatPrice(item.promoPrice)}</span><span className="text-charcoal/25 text-[10px] line-through ml-1.5">{formatPrice(item.price)}</span></>
                        ) : (
                          <span className="text-brand font-bold text-sm">{formatPrice(item.price)}</span>
                        )}
                      </div>
                      <button onClick={e => { e.stopPropagation(); setSelectedItem(item); }}
                        className="bg-brand/10 text-brand hover:bg-brand hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile List */}
            <div className="mt-4 md:hidden flex flex-col gap-2.5">
              {filtered.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-xl p-3 flex gap-3 items-center shadow-sm active:scale-[0.98] transition-all">
                  <div className="w-20 h-20 min-w-[80px] rounded-xl relative overflow-hidden bg-cream-dark">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    {item.isBestSeller && <span className="absolute top-0.5 left-0.5 bg-charcoal/70 rounded-full p-0.5"><Star size={8} className="text-white" fill="white" /></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      {item.isPromo && <span className="bg-red-700 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 tracking-wider">PROMO</span>}
                    </div>
                    <p className="text-[10px] text-charcoal/35 mt-0.5 line-clamp-1">{item.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      {item.isPromo && item.promoPrice ? (
                        <div><span className="text-brand font-bold text-sm">{formatPrice(item.promoPrice)}</span><span className="text-charcoal/20 text-[9px] line-through ml-1">{formatPrice(item.price)}</span></div>
                      ) : (
                        <span className="text-brand font-bold text-sm">{formatPrice(item.price)}</span>
                      )}
                      <button onClick={e => { e.stopPropagation(); setSelectedItem(item); }}
                        className="bg-brand text-white w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={(opts) => {
            addItem(selectedItem, opts);
            showToast(`${selectedItem.name} added to cart`, 'success');
            setSelectedItem(null);
          }} />
        )}
      </AnimatePresence>

      <FloatingCart />
      <BottomNav />
    </div>
  );
}

function ProductModal({ item, onClose, onAdd }: { item: MenuItem; onClose: () => void; onAdd: (opts: { quantity: number; size?: string; sizePriceAdd: number; addOns: { name: string; price: number }[]; sugarLevel: string; iceLevel: string; notes: string }) => void }) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(item.sizes?.[0]?.name || '');
  const [sizePriceAdd, setSizePriceAdd] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);
  const [sugar, setSugar] = useState(sugarLevels[0]);
  const [ice, setIce] = useState(iceLevels[0]);
  const [notes, setNotes] = useState('');

  const basePrice = item.isPromo && item.promoPrice ? item.promoPrice : item.price;
  const addOnsTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
  const unitPrice = basePrice + sizePriceAdd + addOnsTotal;
  const total = unitPrice * qty;

  const toggleAddOn = (ao: { name: string; price: number }) => {
    setSelectedAddOns(prev => prev.find(a => a.name === ao.name) ? prev.filter(a => a.name !== ao.name) : [...prev, ao]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full md:w-[480px] md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="h-52 relative bg-cream-dark">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
            <X size={16} />
          </button>
          {item.isPromo && <span className="absolute top-3 left-3 bg-red-700 text-white text-[10px] font-semibold px-3 py-1 rounded-full tracking-wider">PROMO</span>}
        </div>

        <div className="p-5">
          <h2 className="font-heading text-xl font-bold">{item.name}</h2>
          <p className="text-xs text-charcoal/40 mt-1.5 leading-relaxed">{item.description}</p>
          <div className="mt-2.5">
            {item.isPromo && item.promoPrice ? (
              <><span className="text-brand font-bold text-lg">{formatPrice(item.promoPrice)}</span><span className="text-charcoal/25 text-sm line-through ml-2">{formatPrice(item.price)}</span></>
            ) : <span className="text-brand font-bold text-lg">{formatPrice(item.price)}</span>}
          </div>

          {item.sizes && item.sizes.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-charcoal/60">Size</h4>
              <div className="flex gap-2">
                {item.sizes.map(s => (
                  <button key={s.name} onClick={() => { setSize(s.name); setSizePriceAdd(s.priceAdd); }}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${size === s.name ? 'bg-brand text-white' : 'bg-cream text-charcoal hover:bg-cream-dark'}`}>
                    {s.name} {s.priceAdd > 0 && `+${formatPrice(s.priceAdd)}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-charcoal/60">Sugar Level</h4>
            <div className="flex flex-wrap gap-2">
              {sugarLevels.map(s => (
                <button key={s} onClick={() => setSugar(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${sugar === s ? 'bg-brand text-white' : 'bg-cream text-charcoal hover:bg-cream-dark'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-charcoal/60">Ice Level</h4>
            <div className="flex flex-wrap gap-2">
              {iceLevels.map(l => (
                <button key={l} onClick={() => setIce(l)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${ice === l ? 'bg-brand text-white' : 'bg-cream text-charcoal hover:bg-cream-dark'}`}>{l}</button>
              ))}
            </div>
          </div>

          {item.addOns && item.addOns.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-charcoal/60">Add-ons</h4>
              <div className="flex flex-col gap-2">
                {item.addOns.map(ao => (
                  <button key={ao.name} onClick={() => toggleAddOn(ao)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs transition-all ${selectedAddOns.find(a => a.name === ao.name) ? 'bg-brand/10 border-brand text-brand border' : 'bg-cream text-charcoal hover:bg-cream-dark border border-transparent'}`}>
                    <span>{ao.name}</span>
                    <span className="font-medium">+{formatPrice(ao.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-charcoal/60">Special Notes</h4>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g., Extra hot, less foam..."
              className="w-full p-3 bg-cream rounded-xl text-xs resize-none h-20 focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center bg-cream rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-brand hover:bg-cream-dark rounded-l-xl transition-colors">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-brand hover:bg-cream-dark rounded-r-xl transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <button onClick={() => onAdd({ quantity: qty, size, sizePriceAdd, addOns: selectedAddOns, sugarLevel: sugar, iceLevel: ice, notes })}
              className="flex-1 bg-brand text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-light transition-colors active:scale-[0.98]">
              Add to Cart — {formatPrice(total)}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
