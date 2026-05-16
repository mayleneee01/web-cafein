import { Order, Feedback, MenuItem } from './types';
import { menuItems as seedMenu, categories as seedCategories } from './seed';

// --- Helpers ---
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function generateOrderNumber(): string {
  const d = new Date();
  const prefix = `CF${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${suffix}`;
}

export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// --- localStorage helpers ---
function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function setJSON(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Menu ---
const SEED_VERSION = 'v2'; // bump to force reseed
export function getMenuItems(): MenuItem[] {
  const ver = typeof window !== 'undefined' ? localStorage.getItem('cafein_seed_ver') : null;
  if (ver !== SEED_VERSION) {
    if (typeof window !== 'undefined') localStorage.setItem('cafein_seed_ver', SEED_VERSION);
    setJSON('cafein_menu', seedMenu);
    return seedMenu;
  }
  const items = getJSON<MenuItem[]>('cafein_menu', []);
  if (items.length === 0) { setJSON('cafein_menu', seedMenu); return seedMenu; }
  return items;
}
export function saveMenuItems(items: MenuItem[]): void { setJSON('cafein_menu', items); }
export function getCategories() {
  return seedCategories;
}

// --- Orders ---
export function getOrders(): Order[] { return getJSON<Order[]>('cafein_orders', []); }
export function saveOrders(orders: Order[]): void { setJSON('cafein_orders', orders); }
export function addOrder(order: Order): void { const orders = getOrders(); orders.unshift(order); saveOrders(orders); }
export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() };
  saveOrders(orders);
  return orders[idx];
}
export function getOrderById(id: string): Order | null { return getOrders().find(o => o.id === id) || null; }

// --- Feedback ---
export function getFeedbacks(): Feedback[] { return getJSON<Feedback[]>('cafein_feedbacks', []); }
export function addFeedback(fb: Feedback): void { const fbs = getFeedbacks(); fbs.unshift(fb); setJSON('cafein_feedbacks', fbs); }

// --- Admin Auth ---
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'cafein123';
export function adminLogin(user: string, pass: string): boolean { return user === ADMIN_USER && pass === ADMIN_PASS; }
export function isAdminLoggedIn(): boolean { return getJSON<boolean>('cafein_admin_auth', false); }
export function setAdminAuth(v: boolean): void { setJSON('cafein_admin_auth', v); }
