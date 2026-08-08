import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

async function getToken() {
  await User.create({ name: 'Admin', email: 'admin@test.com', password: 'testpassword123', role: 'admin' });
  const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@test.com', password: 'testpassword123' });
  return res.body.data.token;
}

describe('Products API', () => {
  it('lists products with pagination metadata', async () => {
    await Product.create([
      { name: 'Garlic Powder', slug: 'garlic-powder' },
      { name: 'Ginger Powder', slug: 'ginger-powder' },
    ]);

    const res = await request(app).get('/api/v1/products?page=1&limit=1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(2);
    expect(res.body.meta.totalPages).toBe(2);
  });

  it('rejects product creation without auth', async () => {
    const res = await request(app).post('/api/v1/products').send({ name: 'Test Product' });
    expect(res.status).toBe(401);
  });

  it('creates a product when authenticated and auto-generates a slug', async () => {
    const token = await getToken();
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Turmeric Powder' });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('turmeric-powder');
  });

  it('fetches a single product by slug', async () => {
    await Product.create({ name: 'Lapsi Powder', slug: 'lapsi-powder' });
    const res = await request(app).get('/api/v1/products/lapsi-powder');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Lapsi Powder');
  });
});
