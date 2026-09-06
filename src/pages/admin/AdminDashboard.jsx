import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, Package, Clock, AlertTriangle } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { StatSkeletonGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

const money = (value) => `Rs. ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    adminApi.getDashboard().then(({ data: result }) => setData(result)).catch(() => setError('Failed to load dashboard'));
  };
  useEffect(() => { load(); }, []);
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!data) return <StatSkeletonGrid />;
  const stats = [
    ['Total Revenue', money(data.stats.revenue), DollarSign],
    ['Total Orders', data.stats.orders, ShoppingBag],
    ['Total Customers', data.stats.users, Users],
    ['Total Products', data.stats.products, Package],
    ['Total Categories', data.stats.categories, Package],
    ['Pending Orders', data.stats.pendingOrders, Clock],
    ['Low Stock', data.stats.lowStock, AlertTriangle],
    ['Out of Stock', data.stats.outOfStock, AlertTriangle],
  ];
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Live store</p>
        <h2 className="font-display mt-2 text-3xl">Dashboard</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <div className="admin-stat" key={label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
              <Icon size={18} className="text-accent" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card overflow-hidden">
          <div className="border-b border-[var(--color-border)] p-5"><h3 className="font-semibold">Recent orders</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory text-[var(--color-text-secondary)]">
                <tr><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th></tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr className="border-t border-[var(--color-border)] hover:bg-ivory/70" key={order._id}>
                    <td className="p-4"><p className="font-medium">{order.user?.name || 'Unknown'}</p><p className="text-xs text-[var(--color-text-secondary)]">{order.user?.email}</p></td>
                    <td className="p-4">{money(order.totalAmount)}</td>
                    <td className="p-4 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card p-5">
          <h3 className="font-semibold">Top selling products</h3>
          <div className="mt-4 space-y-4">
            {data.topProducts.length ? data.topProducts.map((item, index) => (
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3" key={item._id || item.name}>
                <span><b className="mr-3 text-accent">0{index + 1}</b>{item.name}</span>
                <span className="font-semibold">{item.sold} sold</span>
              </div>
            )) : <p className="text-sm text-[var(--color-text-secondary)]">No sales data yet.</p>}
          </div>
          <h3 className="mt-8 font-semibold">Low stock</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.lowStockProducts.length ? data.lowStockProducts.map((item) => (
              <span className="status-badge bg-amber-50 text-warning" key={item._id}>{item.name}: {item.stock}</span>
            )) : <p className="text-sm text-[var(--color-text-secondary)]">Inventory levels look healthy.</p>}
          </div>
        </section>
      </div>
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent customer reviews</h3>
          <a href="/admin/reviews" className="text-sm font-medium text-accent">View all</a>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data.recentReviews?.length ? data.recentReviews.map((review) => (
            <article className="border-l-2 border-accent pl-3" key={review._id}>
              <p className="text-accent">{'★'.repeat(review.rating)}</p>
              <p className="mt-1 line-clamp-2 text-sm text-mocha">{review.comment}</p>
              <p className="mt-2 text-xs font-semibold text-[var(--color-text-secondary)]">{review.user?.name} · {review.product?.name}</p>
            </article>
          )) : <p className="text-sm text-[var(--color-text-secondary)]">No reviews yet.</p>}
        </div>
      </section>
    </div>
  );
}