import { useState } from 'react';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { usePaginatedFetch } from '../../hooks/usePaginatedFetch';
import { galleryService } from '../../services/galleryService';

export default function Gallery() {
  const [page, setPage] = useState(1);
  const { items, meta, loading, error, reload } = usePaginatedFetch(galleryService.list, { page, limit: 12 }, [page]);

  return (
    <>
      <Seo title="Gallery" description="A look at our harvest, drying process, and packaging in Kathmandu, Nepal." />

      <div className="page-hero">
        <span className="eyebrow">Behind the Harvest</span>
        <h1 className="section-title">Gallery</h1>
      </div>

      {loading && <Loader label="Loading gallery…" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && <EmptyState icon="🖼️" title="No photos yet" message="Check back soon." />}
      {!loading && !error && items.length > 0 && (
        <>
          <div className="gallery-grid">
            {items.map((item) => (
              <div className="gallery-item" key={item._id}>
                <img src={item.image.url} alt={item.title || 'Gallery photo'} loading="lazy" />
              </div>
            ))}
          </div>
          <div style={{ padding: '0 5% 6rem' }}>
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </>
      )}
    </>
  );
}
