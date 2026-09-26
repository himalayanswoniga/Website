import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import seedContentRouter from '../seed/seedContentRouter.js';

// The stopgap the public site runs on before MongoDB is configured. These assertions
// pin the response envelope to exactly what the frontend services destructure, because
// a shape mismatch here shows up as a blank page rather than an error.
const app = createApp({ router: seedContentRouter, dataSource: 'seed' });

describe('Seed content API (no database)', () => {
  it('serves the homepage settings the Home page destructures', async () => {
    const res = await request(app).get('/api/v1/settings');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const settings = res.body.data;
    for (const section of ['hero', 'about', 'packaging', 'process', 'values', 'cta', 'contactInfo', 'seo']) {
      expect(settings[section], `missing settings.${section}`).toBeTruthy();
    }
    expect(settings.hero.stats.length).toBeGreaterThan(0);
    expect(settings.about.establishedYear).toBeTruthy();
  });

  it('lists products with pagination metadata', async () => {
    const res = await request(app).get('/api/v1/products?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 2, total: 6, totalPages: 3 });
  });

  it('filters featured products for the homepage carousel', async () => {
    const res = await request(app).get('/api/v1/products?featured=true&limit=6');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
    expect(res.body.data.every((p) => p.featured)).toBe(true);
  });

  it('gives every product the slug and populated category ProductCard links on', async () => {
    const res = await request(app).get('/api/v1/products?limit=100');
    for (const product of res.body.data) {
      expect(product._id).toMatch(/^[0-9a-f]{24}$/);
      expect(product.slug).toBeTruthy();
      expect(product.category).toMatchObject({ _id: expect.any(String), name: expect.any(String) });
    }
  });

  it('resolves a product by slug, and 404s an unknown one', async () => {
    const ok = await request(app).get('/api/v1/products/garlic-powder');
    expect(ok.status).toBe(200);
    expect(ok.body.data.name).toBe('Garlic Powder');

    const missing = await request(app).get('/api/v1/products/no-such-product');
    expect(missing.status).toBe(404);
  });

  it('keeps ids stable across requests so React keys and filters do not churn', async () => {
    const [first, second] = await Promise.all([
      request(app).get('/api/v1/categories'),
      request(app).get('/api/v1/categories'),
    ]);
    expect(first.body.data.map((c) => c._id)).toEqual(second.body.data.map((c) => c._id));
  });

  it('matches product category ids to the ids the category filter offers', async () => {
    const categories = (await request(app).get('/api/v1/categories')).body.data;
    const spiceId = categories.find((c) => c.name === 'Spice Powders')._id;

    const res = await request(app).get(`/api/v1/products?category=${spiceId}&limit=100`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it('returns empty pages, not errors, for resources that were never seeded', async () => {
    for (const path of ['/api/v1/gallery', '/api/v1/blogs', '/api/v1/team']) {
      const res = await request(app).get(path);
      expect(res.status, path).toBe(200);
      expect(res.body.data, path).toEqual([]);
      expect(res.body.meta.total, path).toBe(0);
    }
  });

  it('tells contact-form visitors how to reach the business instead of failing silently', async () => {
    const res = await request(app).post('/api/v1/contact').send({ name: 'A', email: 'a@b.com', message: 'hi' });
    expect(res.status).toBe(503);
    expect(res.body.message).toContain('@');
  });

  it('explains why admin login is unavailable', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'a@b.com', password: 'x' });
    expect(res.status).toBe(503);
    expect(res.body.message).toMatch(/admin panel is offline/i);
  });

  it('flags the data source so a half-configured deploy is visible from the outside', async () => {
    const res = await request(app).get('/health');
    expect(res.body.dataSource).toBe('seed');
    expect(res.headers['x-data-source']).toBe('seed');
  });
});
