import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentApi } from '../services/api';
import ErrorState from '../components/ui/ErrorState';


export default function PaymentResult() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return setError('No order was supplied with this payment result.');
    paymentApi.getGatewayPaymentStatus(orderId)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setError('We could not load this order. Please check My Orders.'));
  }, [orderId]);

  const paid = order?.paymentStatus === 'paid' || params.get('result') === 'success';
  const message = params.get('message');
  return (
    <div className="container-custom flex min-h-[60vh] items-center justify-center py-12">
      <section className="card max-w-lg p-8 text-center">
        {error && !order ? (
          <ErrorState title="Something went wrong." description={error} />
        ) : (
          <>
            <h1 className={`font-display text-3xl ${paid ? 'text-success' : 'text-espresso'}`}>
              {paid ? 'Payment successful' : 'Payment not completed'}
            </h1>
            <p className="mt-4 text-mocha">{message || (paid ? 'Your payment was verified and your order is now being processed.' : 'The payment was cancelled, failed, or could not be verified.')}</p>
            {order && <p className="mt-3 text-sm text-[var(--color-text-secondary)]">Order #{order._id.slice(-8)} · Payment: {order.paymentStatus}</p>}
            <div className="mt-7 flex justify-center gap-3">
              {orderId && <Link className="btn-primary px-5 py-2" to={`/orders/${orderId}`}>View order</Link>}
              <Link className="btn-secondary px-5 py-2" to="/products">Continue shopping</Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
