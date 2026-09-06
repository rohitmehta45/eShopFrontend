import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductSkeletonGrid } from '../ui/Skeleton';

export default function RecommendationCarousel({ products, loading }) {
  if (loading) return <ProductSkeletonGrid count={4} />;

  if (!products || products.length === 0) {
    return (
      <div className="card px-8 py-10 text-center text-sm text-[var(--color-text-secondary)]">
        Personalized recommendations will appear after you make a few purchases.
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {products.map((product) => (
        <Link key={product._id} to={`/products/${product._id}`} className="card min-w-[240px] overflow-hidden">
          <img src={product.image} alt={product.name} className="h-48 w-full object-cover" loading="lazy" />
          <div className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Recommended</p>
            <h3 className="mt-2 line-clamp-2 font-medium text-espresso">{product.name}</h3>
            <p className="mt-2 text-sm font-semibold">Rs. {Number(product.price || 0).toFixed(2)}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-mocha">
              View item <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
