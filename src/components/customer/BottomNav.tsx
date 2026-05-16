'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Home, BookOpen, ShoppingCart, Package, HelpCircle } from 'lucide-react';

const navItems = [
  { href: '/menu', label: 'Home', Icon: Home },
  { href: '/menu', label: 'Menu', Icon: BookOpen },
  { href: '/cart', label: 'Cart', Icon: ShoppingCart, showBadge: true },
  { href: '/track', label: 'Track', Icon: Package },
  { href: '/help', label: 'Help', Icon: HelpCircle },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-cream-dark z-50 md:hidden">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${active ? 'text-brand' : 'text-charcoal/30 hover:text-brand-lighter'}`}>
              <span className="relative">
                <item.Icon size={20} />
                {item.showBadge && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>
                )}
              </span>
              <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
