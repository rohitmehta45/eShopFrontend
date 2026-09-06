import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="card animate-scale-in px-8 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] border border-[var(--color-border)] bg-ivory text-accent">
        <Icon size={26} />
      </div>
      <h2 className="font-display mt-6 text-2xl text-espresso">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-text-secondary)]">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-7">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
