import { useState } from 'react';
import { customerApi } from '../services/api';
import toast from 'react-hot-toast';

export default function Support() {
  const [form, setForm] = useState({ category: 'Website', rating: 5, message: '' });
  const submit = async (event) => {
    event.preventDefault();
    try {
      await customerApi.sendFeedback(form);
      setForm({ ...form, message: '' });
      toast.success('Thanks for your feedback');
    } catch { toast.error('Failed to send feedback'); }
  };
  return (
    <div className="container-custom grid gap-10 py-12 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Customer care</p>
        <h1 className="font-display mt-3 text-4xl">Support & feedback</h1>
        <p className="mt-4 max-w-md text-mocha">Tell us what would make your shopping experience better.</p>
        <div className="mt-8 space-y-3 text-sm text-mocha">
          <p><b>Orders:</b> Check your order status from My Orders.</p>
          <p><b>Payments:</b> Sandbox payments are verified by the backend.</p>
          <p><b>Delivery:</b> Contact support with your order number for help.</p>
        </div>
      </div>
      <form onSubmit={submit} className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold">Send feedback</h2>
        <label className="text-sm font-medium">Category
          <select className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['Website', 'Checkout', 'Delivery', 'Payment', 'Customer Service', 'Other'].map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Experience rating
          <select className="admin-input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((x) => <option key={x} value={x}>{x} stars</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Message
          <textarea required minLength="3" maxLength="2000" className="admin-input min-h-36" placeholder="How can we improve?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </label>
        <button className="btn-primary">Send feedback</button>
      </form>
    </div>
  );
}
