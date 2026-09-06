import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState(null);
  useEffect(() => { adminApi.getFeedback().then(({ data }) => setFeedback(data.feedback || [])).catch(() => toast.error('Failed to load feedback')); }, []);
  if (!feedback) return <p className="skeleton mx-auto h-40 w-full max-w-3xl" />;
  return <div className="space-y-6"><div><p className="text-sm text-[var(--color-text-secondary)]">General website experience</p><h2 className="text-3xl font-display">Website Feedback</h2></div><div className="space-y-4">{feedback.length ? feedback.map((item) => <article className="rounded-[14px] border border-[var(--color-border)] bg-surface p-5 shadow-sm" key={item._id}><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-bold">{item.user?.name || 'Customer'}</h3><p className="text-xs text-[var(--color-text-secondary)]">{item.user?.email}</p></div><span className="text-sm text-[var(--color-text-secondary)]">{item.category} · {item.rating || '-'} stars</span></div><p className="mt-4 text-mocha">{item.message}</p><time className="mt-3 block text-xs text-[var(--color-text-secondary)]">{new Date(item.createdAt).toLocaleString()}</time></article>) : <div className="rounded-[14px] border border-[var(--color-border)] bg-surface p-10 text-center text-[var(--color-text-secondary)]">No website feedback yet.</div>}</div></div>;
}