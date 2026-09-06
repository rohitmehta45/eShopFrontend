import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { customerApi } from '../../services/api';

const fallbackImage = 'https://placehold.co/600x800?text=No+Image';

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const productUrl = `/products/${product._id}`;
  const openProduct = () => navigate(productUrl);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const discount = product.discount || product.discountPercent;

  const toggleWishlist = async (event) => {
    event.stopPropagation();
    if (!isAuthenticated) return toast.error('Please login to save favorites.');
    try {
      if (saved) await customerApi.removeFromWishlist(product._id);
      else await customerApi.addToWishlist(product._id);
      setSaved((current) => !current);
      toast.success(saved ? 'Removed from wishlist.' : 'Added to wishlist.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update wishlist.');
    }
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    if (adding || outOfStock) return;
    setAdding(true);
    try {
      await addToCart(product._id);
    } catch {
      /* Cart context presents the API error. */
    } finally {
      setAdding(false);
    }
  };

  const onKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProduct();
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={onKeyDown}
      className={`card-reveal hover-lift stagger-${(index % 5) + 1} group flex h-full cursor-pointer flex-col overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-surface focus:outline-none focus:ring-2 focus:ring-accent`}
    >
      <div className="image-zoom relative overflow-hidden bg-ivory">
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          className="h-64 w-full object-cover"
          loading="lazy"
          onError={(event) => { event.currentTarget.src = fallbackImage; }}
        />
        <button
          type="button"
          onClick={toggleWishlist}
          className="icon-hover absolute right-3 top-3 rounded-full bg-surface/95 p-2 text-mocha shadow-sm hover:text-accent"
          aria-label="Save to wishlist"
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-current text-accent' : ''}`} />
        </button>
        {outOfStock && <span className="status-badge absolute bottom-3 left-3 bg-espresso text-ivory">Out of stock</span>}
        {lowStock && <span className="status-badge absolute bottom-3 left-3 bg-warning/15 text-warning">Low stock</span>}
        {discount ? <span className="status-badge absolute left-3 top-3 bg-accent text-white">-{discount}%</span> : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{product.category}</p>
        <Link to={productUrl} onClick={(event) => event.stopPropagation()} className="mt-2 line-clamp-2 min-h-[48px] font-medium leading-6 text-espresso hover:text-accent">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{Number(product.rating || 0).toFixed(1)}</span>
          <span className="text-xs text-[var(--color-text-secondary)]">({product.numReviews || 0})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-espresso">Rs. {Number(product.price || 0).toFixed(2)}</span>
        </div>
        <button
          type="button"
          className="btn-primary mt-auto w-full gap-1.5 pt-3 text-xs opacity-100 transition group-hover:translate-y-0 sm:opacity-90"
          onClick={handleAddToCart}
          disabled={adding || outOfStock}
        >
          <ShoppingCart className="h-4 w-4" />
          {adding ? 'Adding…' : outOfStock ? 'Unavailable' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
