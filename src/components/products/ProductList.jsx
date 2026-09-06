import ProductCard from './ProductCard';
import { ProductSkeletonGrid } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { Package } from 'lucide-react';

export default function ProductList({ products, loading, emptyMessage = 'No products available.' }) {
  if (loading) return <ProductSkeletonGrid />;

  if (!products.length) {
    return <EmptyState icon={Package} title={emptyMessage} description="Try adjusting filters or browse the full catalog." actionLabel="Clear and shop" actionTo="/products" />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}
