import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Reveal from '../../components/public/Reveal';
import { useFetch } from '../../hooks/useFetch';
import { settingsService } from '../../services/settingsService';

export default function About() {
  const { data: settings, loading, error, reload } = useFetch(() => settingsService.get(), []);

  if (loading) return <Loader label="Loading our story…" />;
  if (error || !settings) return <ErrorState message={error} onRetry={reload} />;

  const { about, process, values } = settings;

  return (
    <>
      <Seo title="Our Story" description={about.body?.slice(0, 155)} />

      <div className="page-hero">
        <span className="eyebrow">Our Story</span>
        <h1 className="section-title">{about.title}</h1>
      </div>

      <section className="about-section">
        <Reveal className="about-visual">
          <div className="about-frame">
            <img src={about.image?.url || '/legacy/lapsi-powder.png'} alt={about.title} />
            <div className="about-badge">
              <span className="b-num">{about.establishedYear}</span>
              <span className="b-sub">Estd.</span>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <span className="eyebrow">Who We Are</span>
          <h2 className="section-title">From Farm to Family Kitchens</h2>
          <div className="rule" />
          <p className="section-body">{about.body}</p>
          <ul className="about-list">
            {about.bullets?.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </Reveal>
      </section>

      <section className="process-section">
        <Reveal as="div" className="section-header">
          <span className="eyebrow">How We Work</span>
          <h2 className="section-title">{process.title}</h2>
          <div className="rule center" />
        </Reveal>
        <div className="process-grid">
          {process.steps?.map((s, i) => (
            <Reveal key={s.title} className="process-step">
              <div className="step-circle">{s.icon}</div>
              <p className="step-num">Step {String(i + 1).padStart(2, '0')}</p>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="values-section">
        <Reveal as="div" className="section-header">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="section-title">{values.title}</h2>
          <div className="rule center" />
        </Reveal>
        <div className="values-grid">
          {values.items?.map((v) => (
            <Reveal key={v.title} className="value-card">
              <span className="value-icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
