import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { usePaginatedFetch } from '../../hooks/usePaginatedFetch';
import { blogService } from '../../services/blogService';

export default function Blog() {
  const [page, setPage] = useState(1);
  const { items, meta, loading, error, reload } = usePaginatedFetch(blogService.list, { page, limit: 9 }, [page]);

  return (
    <>
      <Seo title="Blog" description="Stories from the highland farms, kitchen tips, and news from Himalayan Swoniga Harvest." />

      <div className="page-hero">
        <span className="eyebrow">Stories & Updates</span>
        <h1 className="section-title">From the Blog</h1>
      </div>

      {loading && <Loader label="Loading posts…" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && <EmptyState icon="📝" title="No posts yet" message="New stories are on the way." />}
      {!loading && !error && items.length > 0 && (
        <>
          <div className="blog-grid">
            {items.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blog-card" key={post._id}>
                <div className="blog-card-img">
                  {post.featuredImage?.url && <img src={post.featuredImage.url} alt={post.title} loading="lazy" />}
                </div>
                <div className="blog-card-body">
                  <span className="blog-card-date">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
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
