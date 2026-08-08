import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { usePaginatedFetch } from '../../hooks/usePaginatedFetch';
import { teamService } from '../../services/teamService';

export default function Team() {
  const { items, loading, error, reload } = usePaginatedFetch(teamService.list, { limit: 50, sort: 'order' }, []);

  return (
    <>
      <Seo title="Our Team" description="Meet the people behind Himalayan Swoniga Harvest." />

      <div className="page-hero">
        <span className="eyebrow">The People Behind It</span>
        <h1 className="section-title">Our Team</h1>
      </div>

      {loading && <Loader label="Loading team…" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && <EmptyState icon="🤝" title="Team page coming soon" />}
      {!loading && !error && items.length > 0 && (
        <div className="team-grid">
          {items.map((member) => (
            <div className="team-card" key={member._id}>
              <div className="team-photo">
                {member.photo?.url ? (
                  <img src={member.photo.url} alt={member.name} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>👤</div>
                )}
              </div>
              <h3>{member.name}</h3>
              <p className="designation">{member.designation}</p>
              <p>{member.bio}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
