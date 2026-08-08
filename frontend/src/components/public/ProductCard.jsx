import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url;

  return (
    <Reveal as={Link} to={`/products/${product.slug}`} className="prod-card">
      <div className="prod-media">
        {image ? (
          <img src={image} alt={product.name} loading="lazy" />
        ) : (
          <span className="prod-media-icon">{product.icon || '🌿'}</span>
        )}
        {product.tag && <span className="prod-tag">{product.tag}</span>}
      </div>
      <div className="prod-card-body">
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
      </div>
    </Reveal>
  );
}
