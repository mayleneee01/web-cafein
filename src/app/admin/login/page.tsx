'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, setAdminAuth } from '@/lib/store';
import { useToast } from '@/contexts/ToastContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(user, pass)) {
      setAdminAuth(true);
      showToast('Welcome back, Admin!', 'success');
      router.push('/admin');
    } else {
      showToast('Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold">Café<span className="text-brand">in</span></h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Username</label>
            <input type="text" value={user} onChange={e => setUser(e.target.value)}
              className="w-full p-3 bg-cream rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-lighter" placeholder="admin" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              className="w-full p-3 bg-cream rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-lighter" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-brand text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-light transition-colors">Sign In</button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-6">Demo: admin / cafein123</p>
      </div>
    </div>
  );
}
