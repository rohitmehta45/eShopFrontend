import { Minus, Plus, Trash2 } from 'lucide-react';

const fallbackImage = 'https://placehold.co/240x240?text=No+Image';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const product = item.product || {};
  const quantity = item.quantity || 1;
  return (
    <article className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="image-zoom h-24 w-24 shrink-0 overflow-hidden rounded-[12px] bg-ivory">
        <img
          src={product.image || fallbackImage}
          alt={product.name || 'Product'}
          className="h-full w-full object-cover"
          onError={(event) => { event.currentTarget.src = fallbackImage; }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{product.category || 'Product'}</p>
        <h3 className="mt-1 truncate text-lg font-medium text-espresso">{product.name || 'Product unavailable'}</h3>
        <p className="mt-2 font-semibold text-mocha">Rs. {Number(product.price || 0).toFixed(2)}</p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex h-10 items-center rounded-[12px] border border-[var(--color-border)] bg-ivory p-1">
          <button type="button" onClick={() => onUpdateQuantity(product._id, Math.max(1, quantity - 1))} className="rounded-[8px] p-1.5 text-mocha hover:bg-surface" aria-label="Decrease quantity">
            <Minus size={16} />
          </button>
          <span className="min-w-9 text-center text-sm font-semibold">{quantity}</span>
          <button type="button" onClick={() => onUpdateQuantity(product._id, quantity + 1)} className="rounded-[8px] p-1.5 text-mocha hover:bg-surface" aria-label="Increase quantity">
            <Plus size={16} />
          </button>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-text-secondary)]">Item total</p>
          <p className="font-semibold">Rs. {(Number(product.price || 0) * quantity).toFixed(2)}</p>
        </div>
        <button type="button" onClick={() => onRemove(product._id)} className="rounded-[12px] p-2 text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-danger" aria-label={`Remove ${product.name || 'product'}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
