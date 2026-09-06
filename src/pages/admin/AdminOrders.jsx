import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('all');
  const load = () => adminApi.getOrders({ status }).then(({ data }) => setOrders(data.orders)).catch(() => toast.error('Failed to load orders'));
  useEffect(() => { load(); }, [status]);
  const update = async (id, next) => {
    try {
      const { data } = await adminApi.updateOrderStatus(id, next);
      if (!data.statusChanged) return toast.success('Order already has this status');
      toast.success(data.emailSent ? 'Order updated. Customer notification and email sent.' : 'Order updated. Notification created; email could not be sent.');
      load();
    } catch (error) { toast.error(error.response?.data?.error || 'Failed to update order'); load(); }
  };
  return <div className="space-y-6"><div><p className="text-sm text-[var(--color-text-secondary)]">Fulfillment control</p><h2 className="text-3xl font-display">Orders</h2></div><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-surface px-4 py-3"><option value="all">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select><div className="overflow-x-auto rounded-[14px] border border-[var(--color-border)] bg-surface shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-ivory text-[var(--color-text-secondary)]"><tr>{['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((heading) => <th className="p-4" key={heading}>{heading}</th>)}</tr></thead><tbody>{orders.length ? orders.map((order) => <tr className="border-t border-[var(--color-border)]" key={order._id}><td className="p-4 font-mono text-xs">{order._id.slice(-8)}</td><td className="p-4">{order.user?.name}<br /><span className="text-xs text-[var(--color-text-secondary)]">{order.user?.email}</span></td><td className="p-4">{order.items?.length}</td><td className="p-4">${order.totalAmount}</td><td className="p-4 capitalize">{order.paymentStatus}</td><td className="p-4"><select value={order.status} onChange={(e) => update(order._id, e.target.value)} className="rounded border px-2 py-1 capitalize">{statuses.map((item) => <option key={item}>{item}</option>)}</select></td><td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td><td className="p-4"><Link className="font-medium text-accent" to={`/admin/orders/${order._id}`}>View</Link></td></tr>) : <tr><td colSpan="8" className="p-8 text-center text-[var(--color-text-secondary)]">No orders found.</td></tr>}</tbody></table></div></div>;
}
