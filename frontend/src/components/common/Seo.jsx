import { useEffect } from 'react';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Hand-rolled per-page SEO tag setter (title + description + Open Graph).
 * Avoids pulling in react-helmet-async purely to sidestep any doubt about
 * its React 19 support — this is ~20 lines and has zero dependency risk.
 */
export default function Seo({ title, description, image, url }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = `${title} | Himalayan Swoniga Harvest`;

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:url', url || window.location.href);
    upsertMeta('property', 'og:type', 'website');

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, image, url]);

  return null;
}
