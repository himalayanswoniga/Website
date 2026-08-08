import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-forest/10 bg-cream px-4 py-4 sm:px-6 lg:px-8">
      <button type="button" className="text-forest lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <span className="text-2xl">☰</span>
      </button>
      <Link to="/" target="_blank" rel="noreferrer" className="hidden text-xs font-semibold uppercase tracking-widest text-forest hover:text-gold lg:block">
        View Site ↗
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-muted">{user?.name}</span>
        <button
          type="button"
          onClick={logout}
          className="border border-forest px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest transition hover:bg-forest hover:text-cream"
        >
          Log Out
        </button>
      </div>
    </header>
  );
}
