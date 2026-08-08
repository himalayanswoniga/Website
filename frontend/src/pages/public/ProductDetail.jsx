import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { productService } from '../../services/productService';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, loading, error, reload } = useFetch(() => productService.get(slug), [slug]);
  const [activeImage, setActiveImage] = useState(0);

  if (loading) return <Loader label="Loading product…" />;
  if (error || !product) return <ErrorState message={error || 'Product not found'} onRetry={reload} />;

  const images = product.images?.length ? product.images : [];

  return (
    <>
      <Seo title={product.name} description={product.shortDescription} image={images[0]?.url} />

      <div className="product-detail">
        <div className="product-detail-gallery">
          {images.length ? (
            <>
              <img src={images[activeImage].url} alt={product.name} />
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {images.map((img, i) => (
                    <button
                      key={img.publicId || i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      style={{ width: 64, height: 64, padding: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: i === activeImage ? '2px solid var(--gold)' : '1px solid rgba(21,55,38,0.15)' }}
                    >
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: 'var(--cream2)', borderRadius: 'var(--radius-lg)' }}>
              {product.icon || '🌿'}
            </div>
          )}
        </div>
        <div>
          {product.category?.name && <span className="eyebrow">{product.category.name}</span>}
          <h1 className="section-title">{product.name}</h1>
          {product.tag && <span className="prod-tag">{product.tag}</span>}
          <p className="section-body" style={{ marginTop: '1.5rem' }}>{product.description || product.shortDescription}</p>
          {typeof product.price === 'number' && (
            <p className="section-title" style={{ fontSize: '1.8rem', marginTop: '1.5rem' }}>NPR {product.price}</p>
          )}
          <p style={{ margin: '1rem 0', fontSize: '0.85rem', color: product.inStock ? 'var(--forest)' : '#b04949', fontWeight: 600 }}>
            {product.inStock ? '● In Stock' : '● Out of Stock'}
          </p>
          <Link to="/contact" className="btn btn-dark">Enquire About This Product</Link>
        </div>
      </div>
    </>
  );
}
