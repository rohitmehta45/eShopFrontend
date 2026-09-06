import { AlertCircle } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong.', description = "We couldn't load this content.", onRetry }) {
  return (
    <div className="card px-8 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] bg-red-50 text-danger">
        <AlertCircle size={26} />
      </div>
      <h2 className="font-display mt-6 text-2xl text-espresso">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-text-secondary)]">{description}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary mt-7">
          Try again
        </button>
      )}
    </div>
  );
}
