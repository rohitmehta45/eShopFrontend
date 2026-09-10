import { useEffect, useState } from 'react';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import { paymentApi } from '../services/api';
import ErrorState from '../components/ui/ErrorState';

export default function PaymentResult() {
  const [params] = useSearchParams();

  const orderId = params.get('orderId');
  const result = params.get('result');
  const message = params.get('message');

  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadOrder() {
      if (!orderId) {
        if (mounted) {
          setError(
            'No order was supplied with this payment result.'
          );
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError('');

        console.log(
          '🔎 Loading payment result order:',
          orderId
        );

        const response =
          await paymentApi.getGatewayPaymentStatus(
            orderId
          );

        if (!mounted) return;

        setOrder(
          response?.data?.order || null
        );
      } catch (requestError) {
        console.error(
          '❌ Failed to load payment result:',
          requestError
        );

        if (!mounted) return;

        setError(
          requestError.response?.data?.error ||
            'We could not load this order. Please check My Orders.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="card p-8 text-center">
          <h1 className="font-display text-3xl">
            Checking payment...
          </h1>

          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Please wait while we load your order.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16">
        <ErrorState
          title="Unable to load payment"
          message={error}
        />

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/orders"
            className="btn-primary"
          >
            My Orders
          </Link>

          <Link
            to="/"
            className="btn-secondary"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const paid =
    order?.paymentStatus === 'paid' ||
    result === 'success';

  const cancelled =
    result === 'cancelled' ||
    order?.paymentStatus === 'cancelled';

  return (
    <div className="container-custom py-16">
      <div className="mx-auto max-w-2xl">
        <div className="card p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Payment result
          </p>

          <h1 className="font-display mt-3 text-4xl">
            {paid
              ? 'Payment successful'
              : cancelled
                ? 'Payment cancelled'
                : 'Payment unsuccessful'}
          </h1>

          <p className="mt-4 text-[var(--color-text-secondary)]">
            {message ||
              (paid
                ? 'Your payment has been verified and your order is being processed.'
                : cancelled
                  ? 'Your payment was cancelled.'
                  : 'Your payment could not be completed.')}
          </p>

          {order && (
            <div className="mt-8 rounded-[14px] bg-ivory p-5 text-left">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-mocha">
                  Order
                </span>

                <span className="font-semibold">
                  #{order._id.slice(-8)}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4">
                <span className="text-sm text-mocha">
                  Payment
                </span>

                <span className="font-semibold">
                  {order.paymentStatus || 'pending'}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4">
                <span className="text-sm text-mocha">
                  Order status
                </span>

                <span className="font-semibold">
                  {order.status || 'pending'}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4 border-t border-[var(--color-border)] pt-3">
                <span className="text-sm text-mocha">
                  Total
                </span>

                <span className="font-semibold">
                  Rs.{' '}
                  {Number(
                    order.totalAmount || 0
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {orderId && (
              <Link
                to={`/orders/${orderId}`}
                className="btn-primary"
              >
                View order
              </Link>
            )}

            <Link
              to="/orders"
              className="btn-secondary"
            >
              My Orders
            </Link>

            <Link
              to="/products"
              className="btn-secondary"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}