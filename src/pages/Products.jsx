import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';

import { productsApi } from '../services/api';
import ProductList from '../components/products/ProductList';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // =========================
  // URL PARAMETERS
  // =========================

  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';

  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';

  const available =
    searchParams.get('available') === 'true';

  const page = Math.max(
    Number(searchParams.get('page')) || 1,
    1
  );

  // =========================
  // FETCH CATEGORIES
  // =========================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsApi.getCategories();

        const data = response?.data;

        let categoryList = [];

        if (Array.isArray(data)) {
          categoryList = data;
        } else if (Array.isArray(data?.categories)) {
          categoryList = data.categories;
        } else if (Array.isArray(data?.data)) {
          categoryList = data.data;
        }

        setCategories(['all', ...categoryList]);
      } catch (error) {
        console.error(
          'Failed to fetch categories:',
          error
        );

        setCategories(['all']);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const params = {
          search: searchQuery.trim(),

          category:
            activeCategory === 'all'
              ? ''
              : activeCategory,

          sort,

          minPrice,
          maxPrice,
          minRating,

          available: available ? 'true' : '',

          page,
          limit: 12,
        };

        console.log(
          'Fetching products:',
          params
        );

        const response =
          await productsApi.getProducts(params);

        const data = response?.data;

        console.log(
          'Products API response:',
          data
        );

        if (cancelled) return;

        setProducts(
          Array.isArray(data?.products)
            ? data.products
            : []
        );

        setTotalPages(
          Number(
            data?.totalPages ||
            data?.pages ||
            1
          )
        );
      } catch (error) {
        if (cancelled) return;

        console.error(
          'Failed to fetch products:',
          error.response?.data ||
            error.message
        );

        setProducts([]);
        setTotalPages(1);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    activeCategory,
    searchQuery,
    sort,
    minPrice,
    maxPrice,
    minRating,
    available,
    page,
  ]);

  // =========================
  // UPDATE URL PARAMETER
  // =========================

  const updateParam = (key, value) => {
    const params = new URLSearchParams(
      searchParams
    );

    if (
      value !== '' &&
      value !== null &&
      value !== undefined
    ) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }

    // Reset page when search/filter changes
    if (key !== 'page') {
      params.set('page', '1');
    }

    setSearchParams(params);
  };

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (category) => {
    updateParam(
      'category',
      category === 'all' ? '' : category
    );

    setFiltersOpen(false);
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    const params = new URLSearchParams();

    // Keep search text
    if (searchQuery.trim()) {
      params.set(
        'search',
        searchQuery.trim()
      );
    }

    params.set('page', '1');

    setSearchParams(params);
    setFiltersOpen(false);
  };

  // =========================
  // FILTER CHIPS
  // =========================

  const chips = [
    activeCategory !== 'all' && {
      key: 'category',
      label: activeCategory,
    },

    minPrice && {
      key: 'minPrice',
      label: `From Rs. ${minPrice}`,
    },

    maxPrice && {
      key: 'maxPrice',
      label: `To Rs. ${maxPrice}`,
    },

    minRating && {
      key: 'minRating',
      label: `${minRating}+ stars`,
    },

    available && {
      key: 'available',
      label: 'In stock',
    },
  ].filter(Boolean);

  // =========================
  // FILTER COMPONENT
  // =========================

  const Filters = () => (
    <div className="space-y-6">

      {/* CATEGORY */}
      <div>
        <h3 className="text-sm font-semibold text-espresso">
          Category
        </h3>

        <div className="mt-3 space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                handleCategoryChange(category)
              }
              className={`block w-full rounded-[10px] px-3 py-2 text-left text-sm ${
                activeCategory === category
                  ? 'bg-espresso text-ivory'
                  : 'text-mocha hover:bg-ivory'
              }`}
            >
              {category === 'all'
                ? 'All'
                : category}
            </button>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div>
        <h3 className="text-sm font-semibold text-espresso">
          Price
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2">

          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(e) =>
              updateParam(
                'minPrice',
                e.target.value
              )
            }
            className="admin-input mt-0"
          />

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) =>
              updateParam(
                'maxPrice',
                e.target.value
              )
            }
            className="admin-input mt-0"
          />

        </div>
      </div>

      {/* RATING */}
      <div>
        <h3 className="text-sm font-semibold text-espresso">
          Rating
        </h3>

        <select
          value={minRating}
          onChange={(e) =>
            updateParam(
              'minRating',
              e.target.value
            )
          }
          className="admin-input"
        >
          <option value="">
            Any rating
          </option>

          <option value="4">
            4+ stars
          </option>

          <option value="3">
            3+ stars
          </option>
        </select>
      </div>

      {/* AVAILABILITY */}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-mocha">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) =>
            updateParam(
              'available',
              e.target.checked
                ? 'true'
                : ''
            )
          }
        />

        <span>In stock</span>
      </label>

      {/* CLEAR FILTERS */}
      <button
        type="button"
        onClick={clearFilters}
        className="text-sm font-semibold text-accent"
      >
        Clear filters
      </button>
    </div>
  );

  // =========================
  // RENDER
  // =========================

  return (
    <div className="container-custom py-10">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Catalog
          </p>

          <h1 className="font-display mt-2 text-4xl text-espresso">
            Shop
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {loading
              ? 'Loading…'
              : `${products.length} products`}
          </p>
        </div>

        {/* SEARCH + SORT */}
        <div className="flex flex-wrap items-center gap-3">

          {/* MOBILE FILTER BUTTON */}
          <button
            type="button"
            onClick={() =>
              setFiltersOpen(true)
            }
            className="btn-secondary gap-2 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>

          {/* SEARCH */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              updateParam(
                'search',
                e.target.value
              )
            }
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full rounded-[12px] border border-[var(--color-border)] bg-surface px-4 py-3 md:w-72"
          />

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) =>
              updateParam(
                'sort',
                e.target.value
              )
            }
            className="rounded-[12px] border border-[var(--color-border)] bg-surface px-4 py-3 text-sm"
          >
            <option value="newest">
              Newest
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Top Rated
            </option>
          </select>

        </div>
      </div>

      {/* FILTER CHIPS */}
      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">

          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() =>
                updateParam(
                  chip.key,
                  ''
                )
              }
              className="status-badge border border-[var(--color-border)] bg-surface text-mocha"
            >
              {chip.label}

              <X className="ml-1 h-3 w-3" />
            </button>
          ))}

        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">

        {/* DESKTOP FILTERS */}
        <aside className="card hidden h-fit p-5 lg:block">
          <Filters />
        </aside>

        {/* PRODUCTS */}
        <div>

          <ProductList
            products={products}
            loading={loading}
            emptyMessage="No products match your filters."
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">

              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  updateParam(
                    'page',
                    page - 1
                  )
                }
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>

              <span className="flex items-center px-3 text-sm text-mocha">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  updateParam(
                    'page',
                    page + 1
                  )
                }
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>

            </div>
          )}

        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* OVERLAY */}
          <button
            type="button"
            className="absolute inset-0 bg-espresso/40"
            aria-label="Close filters"
            onClick={() =>
              setFiltersOpen(false)
            }
          />

          {/* DRAWER */}
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-surface p-6 shadow-soft">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="font-display text-2xl">
                Filters
              </h2>

              <button
                type="button"
                onClick={() =>
                  setFiltersOpen(false)
                }
                aria-label="Close filters"
                className="rounded-full p-2 hover:bg-ivory"
              >
                <X size={20} />
              </button>

            </div>

            <Filters />

          </div>
        </div>
      )}

    </div>
  );
}