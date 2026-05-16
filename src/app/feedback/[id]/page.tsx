'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, addFeedback, generateId } from '@/lib/store';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function FeedbackPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => { const o = getOrderById(id as string); if (o) setOrderNumber(o.orderNumber); }, [id]);

  const handleSubmit = () => {
    if (!comment.trim()) { showToast('Please write a comment', 'warning'); return; }
    addFeedback({ id: generateId(), orderId: id as string, customerName: '', rating, comment, createdAt: new Date().toISOString() });
    showToast('Thank you for your feedback!', 'success');
    router.push('/menu');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="font-heading text-xl font-bold text-center mb-1">Rate Your Experience</h2>
        <p className="text-xs text-charcoal/35 text-center mb-6 tracking-wide">Order {orderNumber}</p>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} onClick={() => setRating(s)} className={`transition-transform hover:scale-110 ${s <= rating ? 'text-amber-500' : 'text-charcoal/10'}`}>
              <Star size={32} fill={s <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell us about your experience..."
          className="w-full p-3 bg-cream rounded-xl text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-brand-lighter placeholder:text-charcoal/25" />
        <button onClick={handleSubmit} className="w-full mt-4 bg-brand text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-light transition-colors">Submit Feedback</button>
        <Link href="/menu"><p className="text-center text-xs text-charcoal/25 mt-3 hover:text-brand cursor-pointer">Skip</p></Link>
      </div>
    </div>
  );
}
