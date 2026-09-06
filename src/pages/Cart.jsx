import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import PreviouslyPurchased from '../components/products/PreviouslyPurchased';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/ui/EmptyState';

export default function Cart() {
  const { cart, fetchCart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCart(); }, []);

  const subtotal = useMemo(() => totalPrice, [totalPrice]);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  const handleUpdateQuantity = async (productId, quantity) => {
    setLoading(true);
    try { await updateQuantity(productId, quantity); await fetchCart(); } finally { setLoading(false); }
  };

  const handleRemoveItem = async (productId) => {
    setLoading(true);
    try { await removeFromCart(productId); await fetchCart(); } finally { setLoading(false); }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container-custom space-y-10 py-16">
        <EmptyState icon={ShoppingBag} title="Your cart is empty." description="Discover something you'll love." actionLabel="Continue shopping" actionTo="/products" />
        {isAuthenticated && <section><h2 className="font-display mb-4 text-2xl">Previously purchased</h2><PreviouslyPurchased /></section>}
      </div>
    );
  }

  return (
    <div className="container-custom animate-fade-in py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Bag</p>
          <h1 className="font-display mt-2 text-4xl">Shopping cart</h1>
        </div>
        <Link to="/products" className="text-sm font-semibold text-mocha">Continue shopping</Link>
      </div>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className={`space-y-4 ${loading ? 'opacity-70' : ''}`}>
          {cart.items.map((item) => (
            <CartItem key={item.product?._id || item.product} item={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem} />
          ))}
        </div>
        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-mocha">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>Rs. {tax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-base font-semibold text-espresso"><span>Total</span><span>Rs. {total.toFixed(2)}</span></div>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary mt-6 w-full gap-2 py-3">
            Checkout <ArrowRight size={17} />
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]"><LockKeyhole size={13} /> Secure sandbox checkout</p>
        </aside>
      </div>
      {isAuthenticated && <section className="mt-12"><h2 className="font-display mb-4 text-2xl">Previously purchased</h2><PreviouslyPurchased /></section>}
    </div>
  );
}
