import { useState } from 'react';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import ProductCard from '../../components/public/ProductCard';
import { usePaginatedFetch } from '../../hooks/usePaginatedFetch';
import { useFetch } from '../../hooks/useFetch';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

export default function Products() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const { data: categories } = useFetch(() => categoryService.list({ all: 'true' }), []);
  const { items, meta, loading, error, reload } = usePaginatedFetch(
    productService.list,
    { page, limit: 9, category: category || undefined, search: search || undefined },
    [page, category, search]
  );

  return (
    <>
      <Seo title="Our Products" description="Sun-dried and machine-dried Himalayan spice powders, teas, and herb blends." />

      <div className="page-hero">
        <span className="eyebrow">What We Offer</span>
        <h1 className="section-title">Our Product Range</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '0 5% 3rem', justifyContent: 'center' }}>
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '0.75rem 1.1rem', border: '1.5px solid rgba(21,55,38,0.12)', borderRadius: 'var(--radius-sm)', background: 'var(--cream2)', minWidth: 220, fontFamily: 'inherit' }}
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          style={{ padding: '0.75rem 1.1rem', border: '1.5px solid rgba(21,55,38,0.12)', borderRadius: 'var(--radius-sm)', background: 'var(--cream2)', fontFamily: 'inherit' }}
        >
          <option value="">All Categories</option>
          {(Array.isArray(categories) ? categories : []).map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading && <Loader label="Loading products…" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState icon="🌿" title="No products found" message="Try a different search or category." />
      )}
      {!loading && !error && items.length > 0 && (
        <>
          <div className="products-grid" style={{ margin: '0 5%' }}>
            {items.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <div style={{ padding: '0 5% 6rem' }}>
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </>
      )}
    </>
  );
}
