import { Router } from 'express';
import { slugify } from '../utils/slugify.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { categories, products, testimonials, siteSettings } from './seedData.js';

/**
 * A read-only stand-in for the database-backed API, serving the same content the seed
 * script would load and in the same { success, data, meta } envelope the frontend parses.
 *
 * It exists so the public storefront can go live before MongoDB Atlas is provisioned.
 * Anything that would write — the admin panel, contact submissions, uploads — answers 503
 * with a message explaining why, rather than a confusing 404 or 500.
 */

const UNAVAILABLE =
  'This feature needs the database, which is not configured yet. The site is currently serving ' +
  'its built-in content. Set MONGO_URI and redeploy to enable it.';

// Mongo-shaped 24-hex ids, derived from the slug so they stay stable across cold starts —
// React keys and category filter values depend on them not changing between requests.
function stableId(seed) {
  let hash = 0x811c9dc5;
  const bytes = [];
  for (let i = 0; i < 12; i += 1) {
    for (let j = 0; j < seed.length; j += 1) {
      hash ^= seed.charCodeAt(j) + i;
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    bytes.push((hash & 0xff).toString(16).padStart(2, '0'));
  }
  return bytes.join('');
}

const seedCategories = categories.map((cat, index) => {
  const slug = slugify(cat.name);
  return { ...cat, _id: stableId(`category:${slug}`), slug, order: index + 1, createdAt: new Date(0).toISOString() };
});

const categoryIdByName = Object.fromEntries(seedCategories.map((c) => [c.name, c._id]));
const categoryById = Object.fromEntries(seedCategories.map((c) => [c._id, { _id: c._id, name: c.name, slug: c.slug }]));

const seedProducts = products(categoryIdByName).map((product) => {
  const slug = slugify(product.name);
  return {
    ...product,
    _id: stableId(`product:${slug}`),
    slug,
    images: [],
    featured: Boolean(product.featured),
    // The list endpoint populates category, so the stand-in must embed it the same way.
    category: categoryById[product.category] || null,
    createdAt: new Date(0).toISOString(),
  };
});

const seedTestimonials = testimonials.map((testimonial) => ({
  ...testimonial,
  _id: stableId(`testimonial:${testimonial.name}:${testimonial.order}`),
  createdAt: new Date(0).toISOString(),
}));

/** Mirrors utils/paginate.js — same defaults, same clamping, same meta shape. */
function paginateArray(rows, query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const total = rows.length;
  return {
    data: rows.slice((page - 1) * limit, page * limit),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

function matchesSearch(row, search, fields) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return fields.some((field) => String(row[field] || '').toLowerCase().includes(needle));
}

const router = Router();

router.get('/settings', (req, res) => sendSuccess(res, 200, siteSettings));

router.get('/products', (req, res) => {
  let rows = seedProducts;
  if (req.query.featured === 'true') rows = rows.filter((p) => p.featured);
  if (req.query.category) rows = rows.filter((p) => p.category?._id === req.query.category);
  rows = rows.filter((p) => matchesSearch(p, req.query.search, ['name', 'shortDescription', 'description']));
  rows = [...rows].sort((a, b) => (a.order || 0) - (b.order || 0));

  const { data, meta } = paginateArray(rows, req.query);
  sendSuccess(res, 200, data, meta);
});

router.get('/products/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const product = seedProducts.find((p) => p.slug === idOrSlug || p._id === idOrSlug);
  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, 200, product);
});

router.get('/categories', (req, res) => {
  const { data, meta } = paginateArray(seedCategories, { limit: '100', ...req.query });
  sendSuccess(res, 200, data, meta);
});

router.get('/testimonials', (req, res) => {
  const { data, meta } = paginateArray(seedTestimonials, req.query);
  sendSuccess(res, 200, data, meta);
});

// Nothing was ever seeded for these, so an empty page is the honest answer — every
// public page already renders its own empty state for exactly this case.
for (const resource of ['/gallery', '/blogs', '/team']) {
  router.get(resource, (req, res) => {
    const { meta } = paginateArray([], req.query);
    sendSuccess(res, 200, [], meta);
  });
  router.get(`${resource}/:idOrSlug`, () => {
    throw new ApiError(404, 'Not found');
  });
}

router.post('/contact', () => {
  throw new ApiError(
    503,
    `We cannot record enquiries just yet — please email ${siteSettings.contactInfo.email} ` +
      `or call ${siteSettings.contactInfo.phone} and we will get straight back to you.`
  );
});

router.post('/auth/login', () => {
  throw new ApiError(503, `The admin panel is offline. ${UNAVAILABLE}`);
});

router.all(/.*/, () => {
  throw new ApiError(503, UNAVAILABLE);
});

export default router;
