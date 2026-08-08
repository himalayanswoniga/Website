import { useRef, useState } from 'react';

export default function TestimonialCarousel({ testimonials }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  function goTo(index) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index];
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setActive(index);
  }

  if (!testimonials?.length) return null;

  return (
    <div>
      <div className="testimonial-track" ref={trackRef}>
        {testimonials.map((t) => (
          <div className="testimonial-card" key={t._id}>
            <div className="stars" aria-hidden="true">{'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}</div>
            <p className="quote-text">&ldquo;{t.quote}&rdquo;</p>
            <div className="quote-author">
              {t.avatar?.url ? (
                <img src={t.avatar.url} alt="" className="testimonial-avatar" />
              ) : (
                <span className="testimonial-avatar-fallback">{t.name.charAt(0)}</span>
              )}
              <span>{t.name}{t.location ? `, ${t.location}` : ''}</span>
            </div>
          </div>
        ))}
      </div>
      {testimonials.length > 1 && (
        <div className="testimonial-dots">
          {testimonials.map((t, i) => (
            <button
              key={t._id}
              type="button"
              className={i === active ? 'active' : ''}
              aria-label={`Show testimonial from ${t.name}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
