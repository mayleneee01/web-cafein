'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, MenuItem } from '@/lib/types';
import { generateId } from '@/lib/store';

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, opts: { quantity: number; size?: string; sizePriceAdd: number; addOns: { name: string; price: number }[]; sugarLevel: string; iceLevel: string; notes: string }) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try { const saved = localStorage.getItem('cafein_cart'); if (saved) setItems(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('cafein_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((menuItem: MenuItem, opts: { quantity: number; size?: string; sizePriceAdd: number; addOns: { name: string; price: number }[]; sugarLevel: string; iceLevel: string; notes: string }) => {
    const basePrice = menuItem.isPromo && menuItem.promoPrice ? menuItem.promoPrice : menuItem.price;
    const addOnsTotal = opts.addOns.reduce((s, a) => s + a.price, 0);
    const unitPrice = basePrice + opts.sizePriceAdd + addOnsTotal;
    const newItem: CartItem = { id: generateId(), menuItem, quantity: opts.quantity, size: opts.size, sizePriceAdd: opts.sizePriceAdd, addOns: opts.addOns, sugarLevel: opts.sugarLevel, iceLevel: opts.iceLevel, notes: opts.notes, subtotal: unitPrice * opts.quantity };
    setItems(prev => [...prev, newItem]);
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const basePrice = item.menuItem.isPromo && item.menuItem.promoPrice ? item.menuItem.promoPrice : item.menuItem.price;
      const addOnsTotal = item.addOns.reduce((s, a) => s + a.price, 0);
      const unitPrice = basePrice + item.sizePriceAdd + addOnsTotal;
      return { ...item, quantity: qty, subtotal: unitPrice * qty };
    }));
  }, []);

  const removeItem = useCallback((id: string) => { setItems(prev => prev.filter(i => i.id !== id)); }, []);
  const clearCart = useCallback(() => { setItems([]); }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.subtotal, 0);

  return <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}>{children}</CartContext.Provider>;
}

export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error('useCart must be used within CartProvider'); return ctx; }
