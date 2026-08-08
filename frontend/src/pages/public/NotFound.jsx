import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';

export default function NotFound() {
  return (
    <div className="not-found">
      <Seo title="Page Not Found" />
      <span className="eyebrow">404</span>
      <h1 className="section-title">Page Not Found</h1>
      <p className="section-body" style={{ marginBottom: '2rem' }}>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-dark">Back to Home</Link>
    </div>
  );
}
