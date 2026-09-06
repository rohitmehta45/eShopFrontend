import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { customerApi } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import AccountNav from '../components/layout/AccountNav';
import EmptyState from '../components/ui/EmptyState';


export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const load = () => customerApi.getWishlist().then(({ data }) => setProducts(data.products || [])).catch(() => toast.error('Failed to load wishlist'));
  useEffect(() => { load(); }, []);
  const remove = async (id) => { await customerApi.removeFromWishlist(id); setProducts((items) => items.filter((item) => item._id !== id)); };
  const move = async (product) => { try { await addToCart(product._id); toast.success('Added to cart'); } catch { toast.error('Unable to add product'); } };
  return (
    <div className="container-custom grid gap-8 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      <AccountNav />
      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Saved</p>
            <h1 className="font-display mt-2 text-4xl">Wishlist</h1>
          </div>
          <span className="text-sm text-[var(--color-text-secondary)]">{products.length} items</span>
        </div>
        {products.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article className="card overflow-hidden" key={product._id}>
                <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
                <div className="p-4">
                  <h2 className="font-medium">{product.name}</h2>
                  <p className="mt-2 font-semibold">Rs. {product.price}</p>
                  <p className={`mt-2 text-sm ${product.stock ? 'text-success' : 'text-danger'}`}>{product.stock ? `${product.stock} in stock` : 'Out of stock'}</p>
                  <div className="mt-4 flex gap-2">
                    <button disabled={!product.stock} onClick={() => move(product)} className="btn-primary flex-1">Add to cart</button>
                    <button onClick={() => remove(product._id)} className="rounded-[12px] border border-[var(--color-border)] px-3 text-danger" aria-label="Remove from wishlist">&times;</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8"><EmptyState icon={Heart} title="Your wishlist is empty." description="Save pieces you love for later." actionLabel="Browse products" actionTo="/products" /></div>
        )}
      </div>
    </div>
  );
}