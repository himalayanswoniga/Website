import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { blogService } from '../../services/blogService';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: post, loading, error, reload } = useFetch(() => blogService.get(slug), [slug]);

  if (loading) return <Loader label="Loading article…" />;
  if (error || !post) return <ErrorState message={error || 'Post not found'} onRetry={reload} />;

  return (
    <>
      <Seo title={post.title} description={post.excerpt} image={post.featuredImage?.url} />

      <div className="page-hero">
        <span className="eyebrow">
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {post.author?.name ? ` · ${post.author.name}` : ''}
        </span>
        <h1 className="section-title">{post.title}</h1>
      </div>

      <div className="blog-detail">
        {post.featuredImage?.url && <img src={post.featuredImage.url} alt={post.title} className="blog-detail-img" />}
        <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
        <Link to="/blog" className="btn btn-outline" style={{ marginTop: '2.5rem', display: 'inline-block' }}>← Back to Blog</Link>
      </div>
    </>
  );
}
