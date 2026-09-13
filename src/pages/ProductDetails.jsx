import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { customerApi, productsApi, reviewApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import ErrorState from '../components/ui/ErrorState';

const fallbackImage = 'https://placehold.co/900x900?text=No+Image';

function DetailSkeleton() {
  return (
    <div className="container-custom animate-fade-in py-8 md:py-12">
      <div className="relative overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-surface p-5 md:p-8">
        <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-[18px] bg-ivory">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-white/30 to-transparent" />

              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-accent" />
                <div className="absolute h-7 w-7 rounded-full bg-accent/20" />
              </div>
            </div>

            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 w-20 shrink-0 animate-pulse rounded-[12px] bg-ivory"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="h-3 w-24 animate-pulse rounded-full bg-ivory" />

            <div className="mt-5 space-y-3">
              <div className="h-10 w-full animate-pulse rounded-lg bg-ivory" />
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-ivory" />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="h-5 w-24 animate-pulse rounded-full bg-ivory" />
              <div className="h-4 w-28 animate-pulse rounded-full bg-ivory" />
            </div>

            <div className="my-6 border-y border-[var(--color-border)] py-6">
              <div className="h-9 w-40 animate-pulse rounded-lg bg-ivory" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-ivory" />
              <div className="h-4 w-full animate-pulse rounded-full bg-ivory" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-ivory" />
            </div>

            <div className="mt-6 h-12 w-full animate-pulse rounded-[12px] bg-ivory" />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="h-12 w-36 animate-pulse rounded-[12px] bg-ivory" />
              <div className="h-12 flex-1 animate-pulse rounded-[12px] bg-ivory" />
              <div className="h-12 w-28 animate-pulse rounded-[12px] bg-ivory" />
              <div className="h-12 w-12 animate-pulse rounded-[12px] bg-ivory" />
            </div>

            <div className="mt-7 h-20 animate-pulse rounded-[14px] bg-ivory" />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div className="card p-6 md:p-8">
          <div className="h-7 w-52 animate-pulse rounded-lg bg-ivory" />

          <div className="mt-6 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-ivory" />
            <div className="h-4 w-full animate-pulse rounded-full bg-ivory" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-ivory" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-[12px] bg-ivory"
              />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-ivory" />

          <div className="mt-5 flex gap-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-6 w-6 animate-pulse rounded-full bg-ivory"
              />
            ))}
          </div>

          <div className="mt-5 h-28 animate-pulse rounded-[12px] bg-ivory" />
          <div className="mt-4 h-11 animate-pulse rounded-[12px] bg-ivory" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      setProduct(null);
      setRelatedProducts([]);
      setReviews([]);
      setQuantity(1);

      try {
        const { data } = await productsApi.getProduct(id);
        const item = data.product || data;

        if (!item?._id) {
          throw new Error('Product not found.');
        }

        if (!active) return;

        setProduct(item);

        const images = [
          item.image,
          ...(Array.isArray(item.images) ? item.images : [])
        ].filter(Boolean);

        setSelectedImage(images[0] || fallbackImage);

        try {
          const viewed = JSON.parse(
            localStorage.getItem('recentlyViewed') || '[]'
          ).filter((entry) => entry._id !== item._id);

          localStorage.setItem(
            'recentlyViewed',
            JSON.stringify([item, ...viewed].slice(0, 6))
          );
        } catch {}

        const [relatedResult, reviewsResult] = await Promise.allSettled([
          productsApi.getProducts({
            category: item.category,
            limit: 8
          }),
          reviewApi.getProductReviews(item._id)
        ]);

        if (!active) return;

        if (relatedResult.status === 'fulfilled') {
          setRelatedProducts(
            (relatedResult.value.data.products || [])
              .filter((candidate) => candidate._id !== item._id)
              .slice(0, 4)
          );
        }

        if (reviewsResult.status === 'fulfilled') {
          setReviews(reviewsResult.value.data.reviews || []);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.status === 404
              ? 'This product could not be found.'
              : 'We could not load this product. Please check your connection and try again.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id]);

  const gallery = useMemo(
    () =>
      product
        ? [
            ...new Set(
              [
                product.image,
                ...(Array.isArray(product.images) ? product.images : [])
              ].filter(Boolean)
            )
          ]
        : [],
    [product]
  );

  const selectedIndex = Math.max(0, gallery.indexOf(selectedImage));

  const addProduct = async () => {
    if (!product || adding || product.stock <= 0) return;

    setAdding(true);

    try {
      await addToCart(product._id, quantity);
    } finally {
      setAdding(false);
    }
  };

  const buyNow = async () => {
    if (!product || product.stock <= 0 || adding) return;

    await addProduct();
    navigate('/checkout');
  };

  const saveWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await customerApi.addToWishlist(product._id);
      toast.success('Added to wishlist.');
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.error ||
          'Unable to update wishlist.'
      );
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!reviewRating || reviewComment.trim().length < 3) {
      toast.error('Choose a rating and write at least 3 characters.');
      return;
    }

    setReviewLoading(true);

    try {
      const { data } = await reviewApi.createReview({
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment
      });

      setReviews((current) => [data.review, ...current]);
      setReviewComment('');
      setReviewRating(0);

      setProduct((current) => ({
        ...current,
        rating: data.review?.productRating || current.rating,
        numReviews: (current.numReviews || 0) + 1
      }));

      toast.success('Review submitted.');
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.error ||
          'Failed to submit review.'
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container-custom py-16">
        <ErrorState
          title="Product not found"
          description={error || 'This product is unavailable.'}
        />

        <div className="mt-6 text-center">
          <Link className="btn-primary" to="/products">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const maxQuantity = Math.max(1, product.stock || 1);

  const specifications =
    product.specifications &&
    typeof product.specifications === 'object'
      ? Object.entries(product.specifications)
      : [];

  const discount = product.discount || product.discountPercent;

  return (
    <div className="container-custom animate-fade-in py-8 md:py-12">
      <div className="mb-6 text-sm text-[var(--color-text-secondary)]">
        <Link
          to="/products"
          className="font-semibold text-mocha hover:text-accent"
        >
          Shop
        </Link>

        <span className="mx-2">/</span>

        <span>{product.category}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="relative overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-surface">
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-surface p-2 shadow-soft"
                  onClick={() =>
                    setSelectedImage(
                      gallery[
                        (selectedIndex - 1 + gallery.length) %
                          gallery.length
                      ]
                    )
                  }
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-surface p-2 shadow-soft"
                  onClick={() =>
                    setSelectedImage(
                      gallery[(selectedIndex + 1) % gallery.length]
                    )
                  }
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <img
              key={selectedImage}
              src={selectedImage || fallbackImage}
              alt={product.name}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="animate-fade-in aspect-square w-full object-cover"
              onError={(event) => {
                if (event.currentTarget.src !== fallbackImage) {
                  event.currentTarget.src = fallbackImage;
                }
              }}
            />
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((image) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-[12px] border p-1 ${
                    selectedImage === image
                      ? 'border-accent'
                      : 'border-[var(--color-border)]'
                  }`}
                  aria-label="View product image"
                >
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-[8px] object-cover"
                    onError={(event) => {
                      if (event.currentTarget.src !== fallbackImage) {
                        event.currentTarget.src = fallbackImage;
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            {product.category}
          </p>

          <h1 className="font-display mt-3 text-4xl text-espresso">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <Star className="h-5 w-5 fill-accent text-accent" />

            <span className="font-semibold">
              {Number(product.rating || 0).toFixed(1)}
            </span>

            <span className="text-sm text-[var(--color-text-secondary)]">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3 border-y border-[var(--color-border)] py-5">
            <p className="text-3xl font-semibold text-espresso">
              Rs. {Number(product.price || 0).toFixed(2)}
            </p>

            {discount ? (
              <span className="status-badge bg-accent/15 text-accent">
                -{discount}%
              </span>
            ) : null}
          </div>

          <p className="mt-6 leading-7 text-mocha">
            {product.description}
          </p>

          <div
            className={`mt-6 flex items-center gap-2 rounded-[12px] px-4 py-3 text-sm font-semibold ${
              outOfStock
                ? 'bg-red-50 text-danger'
                : 'bg-emerald-50 text-success'
            }`}
          >
            {outOfStock ? <Package size={17} /> : <Check size={17} />}

            {outOfStock
              ? 'Out of stock'
              : `${product.stock} in stock`}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-12 items-center justify-between rounded-[12px] border border-[var(--color-border)] bg-surface px-2 sm:w-36">
              <button
                type="button"
                className="rounded-lg p-2 hover:bg-ivory disabled:opacity-40"
                disabled={quantity <= 1}
                onClick={() =>
                  setQuantity((value) => Math.max(1, value - 1))
                }
              >
                <Minus size={17} />
              </button>

              <span className="font-semibold">{quantity}</span>

              <button
                type="button"
                className="rounded-lg p-2 hover:bg-ivory disabled:opacity-40"
                disabled={quantity >= maxQuantity || outOfStock}
                onClick={() =>
                  setQuantity((value) =>
                    Math.min(maxQuantity, value + 1)
                  )
                }
              >
                <Plus size={17} />
              </button>
            </div>

            <button
              type="button"
              disabled={outOfStock || adding}
              onClick={addProduct}
              className="btn-primary h-12 flex-1 gap-2"
            >
              <ShoppingCart size={18} />

              {adding
                ? 'Adding…'
                : outOfStock
                  ? 'Out of stock'
                  : 'Add to cart'}
            </button>

            <button
              type="button"
              disabled={outOfStock || adding}
              onClick={buyNow}
              className="btn-accent h-12 px-5"
            >
              Buy now
            </button>

            <button
              type="button"
              onClick={saveWishlist}
              className="btn-secondary h-12 gap-2"
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </button>
          </div>

          <div className="mt-7 rounded-[14px] bg-ivory p-4">
            <div className="flex items-center gap-3">
              <Truck className="text-accent" size={20} />

              <div>
                <p className="font-semibold">Delivery</p>

                <p className="text-sm text-[var(--color-text-secondary)]">
                  Free shipping on orders over Rs. 100.
                </p>
              </div>
            </div>

            {(product.sku || product._id) && (
              <p className="mt-3 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-secondary)]">
                {product.sku
                  ? `SKU: ${product.sku}`
                  : `Product ID: ${product._id}`}
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div className="card p-6 md:p-8">
          <h2 className="font-display text-2xl">
            Product information
          </h2>

          <p className="mt-4 whitespace-pre-line leading-7 text-mocha">
            {product.description}
          </p>

          {specifications.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold">
                Specifications
              </h3>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {specifications.map(([key, value]) => (
                  <div
                    className="rounded-[12px] bg-ivory px-4 py-3"
                    key={key}
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                      {key}
                    </dt>

                    <dd className="mt-1 font-medium">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <form onSubmit={submitReview} className="card h-fit p-6">
          <h2 className="font-display text-2xl">
            Write a review
          </h2>

          <div className="mt-5 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setReviewRating(star)}
                className="text-accent"
                aria-label={`${star} stars`}
              >
                <Star
                  size={25}
                  className={
                    star <= reviewRating ? 'fill-current' : ''
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            required
            minLength="3"
            value={reviewComment}
            onChange={(event) =>
              setReviewComment(event.target.value)
            }
            className="admin-input mt-4 min-h-28"
            placeholder={
              isAuthenticated
                ? 'Write your review…'
                : 'Log in to write a review'
            }
          />

          <button
            type="submit"
            disabled={reviewLoading}
            className="btn-primary mt-4 w-full"
          >
            {reviewLoading
              ? 'Submitting…'
              : isAuthenticated
                ? 'Submit review'
                : 'Login to review'}
          </button>
        </form>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              More to explore
            </p>

            <h2 className="font-display mt-2 text-3xl">
              Related products
            </h2>
          </div>

          <Link
            to={`/products?category=${encodeURIComponent(
              product.category
            )}`}
            className="text-sm font-semibold text-mocha"
          >
            View all
          </Link>
        </div>

        {relatedProducts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item, index) => (
              <ProductCard
                key={item._id}
                product={item}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-[var(--color-text-secondary)]">
            More products in this category will appear here.
          </div>
        )}
      </section>

      <section className="mt-16 border-t border-[var(--color-border)] pt-10">
        <h2 className="font-display text-3xl">
          Customer reviews
        </h2>

        {reviews.length ? (
          <div className="mt-5 space-y-3">
            {reviews.map((review) => (
              <article key={review._id} className="card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex text-accent">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= review.rating
                            ? 'fill-current'
                            : ''
                        }
                      />
                    ))}
                  </div>

                  <time className="text-xs text-[var(--color-text-secondary)]">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </time>
                </div>

                <p className="mt-3 text-mocha">
                  {review.comment}
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {review.user?.name || 'Customer'}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[var(--color-text-secondary)]">
            No reviews yet. Be the first to review this product.
          </p>
        )}
      </section>
    </div>
  );
}

