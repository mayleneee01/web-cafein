export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isBestSeller: boolean;
  isPromo: boolean;
  promoPrice?: number;
  sizes?: { name: string; priceAdd: number }[];
  addOns?: { name: string; price: number }[];
}

export type OrderType = 'dine-in' | 'takeaway';
export type PaymentMethod = 'qris' | 'cash';
export type PaymentStatus = 'pending' | 'success' | 'failed';
export type OrderStatus = 'received' | 'waiting_payment' | 'paid' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  size?: string;
  sizePriceAdd: number;
  addOns: { name: string; price: number }[];
  sugarLevel: string;
  iceLevel: string;
  notes: string;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  orderType: OrderType;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes: string;
  cancelReason?: string;
  paymentProofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
