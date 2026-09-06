import { useEffect, useState } from 'react';
import { customerApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function PreviouslyPurchased() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  useEffect(() => { customerApi.getPurchases().then(({ data }) => setPurchases(data.purchases || [])).catch(() => setPurchases([])).finally(() => setLoading(false)); }, []);
  const buyAgain = async (purchase) => { try { await addToCart(purchase.product._id); } catch (error) { toast.error(error.response?.data?.error || 'Product is unavailable'); } };
  if (loading) return <p className="text-sm text-[var(--color-text-secondary)]">Loading purchase history...</p>;
  if (!purchases.length) return <p className="text-sm text-[var(--color-text-secondary)]">You haven't purchased any products yet.</p>;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{purchases.slice(0, 6).map(({ product, lastPurchasedAt, purchaseCount }) => <article className="rounded-[14px] border border-[var(--color-border)] bg-surface p-3" key={product._id}><Link to={`/products/${product._id}`}><img src={product.image} alt={product.name} className="h-36 w-full rounded-[12px] object-cover" /></Link><h3 className="mt-3 line-clamp-1 font-semibold">{product.name}</h3><p className="mt-1 text-sm font-semibold">Rs. {product.price}</p><p className="mt-1 text-xs text-[var(--color-text-secondary)]">Purchased {new Date(lastPurchasedAt).toLocaleDateString()} ({purchaseCount} total)</p><button disabled={!product.stock} onClick={() => buyAgain({ product })} className="btn-primary mt-3 w-full disabled:opacity-50">{product.stock ? 'Buy again' : 'Out of stock'}</button></article>)}</div>;
}
