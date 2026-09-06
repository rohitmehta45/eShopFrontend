import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerApi, reviewApi } from '../services/api';
import toast from 'react-hot-toast';
import AccountNav from '../components/layout/AccountNav';
import EmptyState from '../components/ui/EmptyState';
import { Star } from 'lucide-react';

export default function MyReviews() {
  const [reviews, setReviews] = useState(null);
  const [editing, setEditing] = useState(null);
  const [comment, setComment] = useState('');
  const load = () => customerApi.getReviews().then(({ data }) => setReviews(data.reviews || [])).catch(() => toast.error('Failed to load reviews'));
  useEffect(() => { load(); }, []);
  const remove = async (id) => { if (!window.confirm('Delete this review?')) return; try { await reviewApi.deleteReview(id); toast.success('Review deleted'); load(); } catch { toast.error('Failed to delete review'); } };
  const save = async (review) => { try { await reviewApi.updateReview(review._id, { rating: review.rating, comment }); setEditing(null); toast.success('Review updated'); load(); } catch (error) { toast.error(error.response?.data?.error || 'Failed to update review'); } };
 return (
    <div className="container-custom grid gap-8 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      <AccountNav />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Feedback</p>
        <h1 className="font-display mt-2 text-4xl">My reviews</h1>
        {!reviews ? <p className="mt-8 text-sm text-[var(--color-text-secondary)]">Loading reviews...</p> : (
          <div className="mt-8 space-y-4">
            {reviews.length ? reviews.map((review) => (
              <article className="card flex flex-col gap-4 p-5 sm:flex-row" key={review._id}>
                <img src={review.product?.image} alt="" className="h-20 w-20 rounded-[12px] object-cover" />
                <div className="flex-1">
                  <Link to={`/products/${review.product?._id}`} className="font-semibold text-espresso hover:text-accent">{review.product?.name || 'Product unavailable'}</Link>
                  <p className="mt-1 flex text-accent">{'★'.repeat(review.rating)}<span className="text-[var(--color-border)]">{'★'.repeat(5 - review.rating)}</span></p>
                  {editing === review._id ? (
                    <div className="mt-2 flex gap-2">
                      <input value={comment} onChange={(e) => setComment(e.target.value)} className="admin-input mt-0" />
                      <button onClick={() => save(review)} className="btn-primary">Save</button>
                    </div>
                  ) : <p className="mt-2 text-mocha">{review.comment}</p>}
                  <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => { setEditing(review._id); setComment(review.comment); }} className="font-semibold text-accent">Edit</button>
                  <button onClick={() => remove(review._id)} className="font-semibold text-danger">Delete</button>
                </div>
              </article>
            )) : <EmptyState icon={Star} title="No reviews yet." description="Your product feedback will appear here." actionLabel="Browse products" actionTo="/products" />}
          </div>
        )}
      </div>
    </div>
  );
}
