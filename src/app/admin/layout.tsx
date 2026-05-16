'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminLoggedIn, setAdminAuth } from '@/lib/store';
import Link from 'next/link';
import { LayoutDashboard, ClipboardList, UtensilsCrossed, BarChart3, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', Icon: ClipboardList },
  { href: '/admin/menu', label: 'Menu', Icon: UtensilsCrossed },
  { href: '/admin/reports', label: 'Reports', Icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') { setReady(true); return; }
    if (!isAdminLoggedIn()) { router.replace('/admin/login'); return; }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="skeleton w-8 h-8 rounded-full" /></div>;
  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = () => { setAdminAuth(false); router.push('/admin/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex w-60 bg-charcoal text-white flex-col fixed h-full z-40">
        <div className="p-5 border-b border-white/8">
          <h1 className="font-heading text-xl font-bold">Café<span className="text-brand-accent">in</span></h1>
          <p className="text-[9px] text-white/25 mt-0.5 uppercase tracking-wider">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${pathname === item.href ? 'bg-brand text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'}`}>
              <item.Icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/8">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 bg-charcoal text-white z-40 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20} /></button>
        <h1 className="font-heading text-lg font-bold">Café<span className="text-brand-accent">in</span></h1>
        <button onClick={handleLogout} className="text-[10px] text-white/30 uppercase tracking-wider">Logout</button>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60 bg-charcoal text-white p-4 space-y-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="font-heading text-xl font-bold">Café<span className="text-brand-accent">in</span></h1>
              <button onClick={() => setSidebarOpen(false)} className="text-white/30"><X size={18} /></button>
            </div>
            {navItems.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${pathname === item.href ? 'bg-brand text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'}`}>
                <item.Icon size={16} /> {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-60 pt-14 md:pt-0">{children}</main>
    </div>
  );
}
