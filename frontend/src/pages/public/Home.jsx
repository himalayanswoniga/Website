import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Marquee from '../../components/public/Marquee';
import Reveal from '../../components/public/Reveal';
import ProductCard from '../../components/public/ProductCard';
import TestimonialCarousel from '../../components/public/TestimonialCarousel';
import { useFetch } from '../../hooks/useFetch';
import { settingsService } from '../../services/settingsService';
import { productService } from '../../services/productService';
import { testimonialService } from '../../services/testimonialService';

export default function Home() {
  const { data: settings, loading: settingsLoading, error: settingsError, reload } = useFetch(() => settingsService.get(), []);
  const { data: featured } = useFetch(() => productService.list({ featured: 'true', limit: 6 }), []);
  const { data: testimonials } = useFetch(() => testimonialService.list({ limit: 6 }), []);

  if (settingsLoading) return <Loader label="Loading homepage…" />;
  if (settingsError || !settings) return <ErrorState message={settingsError} onRetry={reload} />;

  const { hero, about, packaging, process, values, cta } = settings;

  return (
    <>
      <Seo title="Home" description={settings.seo?.metaDescription} />

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="hero-tag">{hero.tag}</p>
          <h1>{hero.title}</h1>
          <p className="hero-desc">{hero.description}</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-dark">Explore Products</Link>
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
          {!!hero.stats?.length && (
            <div className="hero-stats">
              {hero.stats.map((s) => (
                <div key={s.label}>
                  <span className="stat-num">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="hero-visual">
          <img src={about.image?.url || '/legacy/lapsi-powder.png'} alt="" />
        </div>
      </section>

      <Marquee />

      <section className="about-section" id="about">
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
          <span className="eyebrow">Our Story</span>
          <h2 className="section-title">{about.title}</h2>
          <div className="rule" />
          <p className="section-body">{about.body}</p>
          <ul className="about-list">
            {about.bullets?.map((b) => <li key={b}>{b}</li>)}
          </ul>
          <Link to="/about" className="btn btn-dark">Read Our Full Story</Link>
        </Reveal>
      </section>

      <section className="products-section" id="products">
        <Reveal as="div" className="section-header">
          <span className="eyebrow">What We Offer</span>
          <h2 className="section-title">Our Product Range</h2>
          <div className="rule center" />
          <p className="section-body">Each product is harvested at peak season, carefully dried, and milled in small batches — delivering full-spectrum flavour every time.</p>
        </Reveal>
        <div className="products-grid">
          {featured?.data?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/products" className="btn btn-outline">View All Products</Link>
        </div>
      </section>

      <section className="packaging-section" id="packaging">
        <div className="packaging-inner">
          <Reveal as="div" className="packaging-header">
            <span className="eyebrow">Our Packaging</span>
            <h2 className="section-title">{packaging.title}</h2>
            <div className="rule center" />
            <p className="section-body" style={{ maxWidth: 540, margin: '0 auto' }}>{packaging.body}</p>
          </Reveal>
          <div className="pkg-features-grid">
            {packaging.features?.map((f) => (
              <Reveal key={f.title} className="pkg-feat-card">
                <span className="pkg-feat-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="pkg-cta-band">
            <div>
              <h3>{packaging.ctaTitle}</h3>
              <p>{packaging.ctaBody}</p>
            </div>
            <Link to="/contact" className="btn btn-dark" style={{ flexShrink: 0 }}>Enquire Now</Link>
          </Reveal>
        </div>
      </section>

      <section className="process-section" id="process">
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

      <section className="values-section" id="values">
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

      {!!testimonials?.data?.length && (
        <section className="testimonial-section">
          <span className="eyebrow">What People Say</span>
          <div className="rule center" style={{ margin: '1rem auto 2rem' }} />
          <TestimonialCarousel testimonials={testimonials.data} />
        </section>
      )}

      <section className="contact-section" style={{ textAlign: 'center' }}>
        <Reveal as="div" className="section-header" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Get In Touch</span>
          <h2 className="section-title">{cta.title}</h2>
          <div className="rule center" />
          <p className="section-body" style={{ maxWidth: 500, margin: '0 auto 2rem' }}>{cta.body}</p>
          <Link to={cta.buttonLink || '/contact'} className="btn btn-dark">{cta.buttonText}</Link>
        </Reveal>
      </section>
    </>
  );
}
