import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import StatCard from '../../components/admin/StatCard';
import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch(() => dashboardService.getStats(), []);

  if (loading) return <Loader label="Loading dashboard…" />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;

  const { totals, recentActivity } = data;

  return (
    <div>
      <Seo title="Admin Dashboard" />
      <h1 className="font-serif text-2xl text-forest">Dashboard</h1>
      <p className="mt-1 text-sm text-text-muted">Overview of your site's content.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Products" value={totals.products} icon="🧄" />
        <StatCard label="Categories" value={totals.categories} icon="🗂️" />
        <StatCard label="Gallery Images" value={totals.galleryImages} icon="🖼️" />
        <StatCard label="Blog Posts" value={totals.blogs} icon="📝" />
        <StatCard label="Team Members" value={totals.team} icon="🤝" />
        <StatCard label="Testimonials" value={totals.testimonials} icon="💬" />
        <StatCard label="Messages" value={totals.messages} icon="✉️" />
        <StatCard label="Unread Messages" value={totals.unreadMessages} icon="🔴" />
        <StatCard label="Published Posts" value={totals.publishedBlogs} icon="✅" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg text-forest">Recent Messages</h2>
            <Link to="/admin/messages" className="text-xs font-semibold uppercase tracking-widest text-gold">View All</Link>
          </div>
          {recentActivity.messages.length === 0 && <p className="text-sm text-text-muted">No messages yet.</p>}
          <ul className="flex flex-col gap-3">
            {recentActivity.messages.map((m) => (
              <li key={m._id} className="flex items-center justify-between border-b border-forest/5 pb-2 text-sm">
                <div>
                  <p className="font-medium text-forest">{m.name}</p>
                  <p className="text-xs text-text-muted">{m.enquiryType}</p>
                </div>
                {!m.isRead && <span className="h-2 w-2 rounded-full bg-red-500" title="Unread" />}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg text-forest">Recent Blog Posts</h2>
            <Link to="/admin/blogs" className="text-xs font-semibold uppercase tracking-widest text-gold">View All</Link>
          </div>
          {recentActivity.blogs.length === 0 && <p className="text-sm text-text-muted">No posts yet.</p>}
          <ul className="flex flex-col gap-3">
            {recentActivity.blogs.map((b) => (
              <li key={b._id} className="flex items-center justify-between border-b border-forest/5 pb-2 text-sm">
                <p className="font-medium text-forest">{b.title}</p>
                <span className={`text-xs font-semibold uppercase ${b.status === 'published' ? 'text-forest-light' : 'text-text-muted'}`}>{b.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
