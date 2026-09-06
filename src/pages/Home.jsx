import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsApi, recommendationApi } from '../services/api';
import ProductList from '../components/products/ProductList';
import RecommendationCarousel from '../components/recommendations/RecommendationCarousel';
import { useAuth } from '../context/AuthContext';

const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Beauty'];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await productsApi.getProducts({ featured: true, limit: 8 });
        setFeaturedProducts(data.products || []);
        if (user?.id) {
          const recResponse = await recommendationApi.getRecommendations(user.id);
          setRecommendations(recResponse.data.recommendations || []);
        }
      } catch (error) {
        console.error('Home data load failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, [user]);

  return (
    <div className="space-y-20 pb-20">
      <section className="container-custom grid items-center gap-12 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Curated for everyday living</p>
          <h1 className="font-display animate-fade-up mt-5 text-4xl leading-[1.15] text-espresso md:text-6xl">
            Discover products worth bringing home.
          </h1>
          <p className="animate-fade-up stagger-2 mt-5 max-w-lg text-lg text-[var(--color-text-secondary)]">
            Thoughtful electronics, fashion, books, and home essentials — selected with care, presented without noise.
          </p>
          <div className="animate-fade-up stagger-3 mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary px-6 py-3">Shop now</Link>
            <Link to="/products?sort=rating" className="btn-secondary px-6 py-3">Explore</Link>
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <div className="absolute -left-6 top-8 hidden h-24 w-24 rounded-full border border-accent/30 lg:block" />
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
            alt="Editorial interior with curated home objects"
            className="animate-scale-in h-[420px] w-full rounded-[18px] object-cover"
          />
        </div>
      </section>

      <section className="container-custom space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">This season</p>
            <h2 className="font-display mt-2 text-3xl text-espresso">Featured products</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-mocha">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductList products={featuredProducts} loading={loading} emptyMessage="No featured products available." />
      </section>

      <section className="container-custom space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">For you</p>
          <h2 className="font-display mt-2 text-3xl text-espresso">Recommended</h2>
        </div>
        <RecommendationCarousel products={recommendations} loading={loading} />
      </section>

      <section className="container-custom space-y-8">
        <h2 className="font-display text-3xl text-espresso">Shop by category</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {categories.map((category, index) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className={`card-reveal hover-lift stagger-${(index % 5) + 1} flex h-36 flex-col justify-between p-5`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Collection</p>
              <div>
                <p className="font-display text-2xl text-espresso">{category}</p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Explore now</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
