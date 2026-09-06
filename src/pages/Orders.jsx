import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';

import { orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import AccountNav from '../components/layout/AccountNav';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function statusClass(status) {
  if (status === 'cancelled') {
    return 'bg-red-50 text-danger';
  }

  if (status === 'delivered') {
    return 'bg-emerald-50 text-success';
  }

  if (status === 'shipped') {
    return 'bg-accent/15 text-accent';
  }

  return 'bg-ivory text-mocha';
}

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) {
      return;
    }

    try {
      await orderApi.cancelOrder(orderId);

      toast.success('Order cancelled');

      setOrder((current) =>
        current
          ? {
              ...current,
              status: 'cancelled',
            }
          : current
      );

      setOrders((current) =>
        current.map((item) =>
          item._id === orderId
            ? {
                ...item,
                status: 'cancelled',
              }
            : item
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          'Unable to cancel order'
      );
    }
  };

  // Reorder previous order
  const reorder = async (previousOrder) => {
    const unavailable = [];

    for (const item of previousOrder.items || []) {
      try {
        const productId =
          item.product?._id || item.product;

        if (!productId) {
          unavailable.push(item.name);
          continue;
        }

        await addToCart(productId, item.quantity);
      } catch (error) {
        unavailable.push(item.name);
      }
    }

    if (unavailable.length) {
      toast.success(
        `Some products were unavailable: ${unavailable.join(
          ', '
        )}`
      );
    } else {
      toast.success('Items added to cart');
    }

    navigate('/cart');
  };

  // Fetch orders
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);

      try {
        if (id) {
          // Fetch single order
          const { data } = await orderApi.getOrder(id);

          const fetchedOrder = data?.order || null;

          setOrder(fetchedOrder);
          setOrders(fetchedOrder ? [fetchedOrder] : []);
        } else {
          // Fetch all orders
          const { data } = await orderApi.getOrders();

          setOrders(data?.orders || []);
          setOrder(null);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);

        setOrders([]);
        setOrder(null);

        toast.error(
          error.response?.data?.error ||
            'Unable to load orders'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, id]);

  // Order details
  const renderOrderDetails = () => {
    if (loading) {
      return <TableSkeleton />;
    }

    const targetOrder = id ? order : null;

    if (targetOrder) {
      const stepIndex = STEPS.indexOf(
        targetOrder.status
      );

      return (
        <div className="card p-6 md:p-8">
          {/* Header */}
          <div>
            <h1 className="font-display text-3xl">
              Order details
            </h1>

            <p className="mt-2 break-all text-sm text-[var(--color-text-secondary)]">
              Order ID: {targetOrder._id}
            </p>

            <p className="mt-1 text-sm text-mocha">
              {new Date(
                targetOrder.createdAt || Date.now()
              ).toLocaleString()}{' '}
              · {targetOrder.paymentMethod || '—'} ·{' '}
              {targetOrder.paymentStatus || '—'}
            </p>
          </div>

          {/* Order progress */}
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {STEPS.map((status, index) => {
              const isActive =
                targetOrder.status !== 'cancelled' &&
                stepIndex >= index;

              return (
                <div
                  key={status}
                  className={`rounded-[12px] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide ${
                    isActive
                      ? 'bg-espresso text-ivory'
                      : 'bg-ivory text-[var(--color-text-secondary)]'
                  }`}
                >
                  {status}
                </div>
              );
            })}
          </div>

          {/* Cancelled status */}
          {targetOrder.status === 'cancelled' && (
            <div className="mt-5 rounded-[12px] bg-red-50 p-4 text-sm font-medium text-danger">
              This order has been cancelled.
            </div>
          )}

          {/* Items */}
          <div className="mt-6 space-y-3">
            {(targetOrder.items || []).map(
              (item, index) => (
                <div
                  key={`${targetOrder._id}-${
                    item.product?._id ||
                    item.product ||
                    index
                  }`}
                  className="flex justify-between gap-4 border-b border-[var(--color-border)] pb-2 text-sm"
                >
                  <span>
                    {item.name || 'Product'} ×{' '}
                    {item.quantity}
                  </span>

                  <span className="whitespace-nowrap">
                    Rs.{' '}
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Total + status */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span
              className={`status-badge ${statusClass(
                targetOrder.status
              )}`}
            >
              {targetOrder.status}
            </span>

            <span className="text-lg font-semibold">
              Total: Rs.{' '}
              {Number(
                targetOrder.totalAmount || 0
              ).toFixed(2)}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => reorder(targetOrder)}
              className="btn-secondary"
            >
              Buy again
            </button>

            {['pending', 'processing'].includes(
              targetOrder.status
            ) && (
              <button
                type="button"
                onClick={() =>
                  cancelOrder(targetOrder._id)
                }
                className="btn-danger"
              >
                Cancel order
              </button>
            )}
          </div>
        </div>
      );
    }

    // No orders
    if (!orders.length) {
      return (
        <EmptyState
          icon={Package}
          title="No orders yet."
          description="Your future purchases will appear here."
          actionLabel="Continue shopping"
          actionTo="/products"
        />
      );
    }

    // Order history
    return (
      <div className="space-y-5">
        <h1 className="font-display text-4xl">
          Order history
        </h1>

        {orders.map((item) => (
          <div
            key={item._id}
            className="card p-6"
          >
            {/* Order header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  #
                  {item._id
                    ? item._id.slice(-8)
                    : '--------'}{' '}
                  ·{' '}
                  {new Date(
                    item.createdAt || Date.now()
                  ).toLocaleDateString()}
                </p>

                <p className="text-lg font-semibold">
                  Rs.{' '}
                  {Number(
                    item.totalAmount || 0
                  ).toFixed(2)}
                </p>

                <p className="text-xs text-mocha">
                  {item.paymentMethod || 'Payment'} ·{' '}
                  {item.paymentStatus || 'status'}
                </p>
              </div>

              <span
                className={`status-badge ${statusClass(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>

            {/* Order items */}
            <div className="mt-5 space-y-3">
              {(item.items || []).map(
                (line, index) => (
                  <div
                    key={`${item._id}-${
                      line.product?._id ||
                      line.product ||
                      index
                    }`}
                    className="flex justify-between gap-4 border-b border-[var(--color-border)] pb-2 text-sm text-mocha"
                  >
                    <span>
                      {line.name || 'Product'} ×{' '}
                      {line.quantity}
                    </span>

                    <span className="whitespace-nowrap">
                      Rs.{' '}
                      {(
                        Number(line.price || 0) *
                        Number(line.quantity || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => reorder(item)}
                className="btn-secondary"
              >
                Buy again
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(`/orders/${item._id}`)
                }
                className="btn-primary"
              >
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-custom grid gap-8 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      <AccountNav />

      <div>{renderOrderDetails()}</div>
    </div>
  );
}
