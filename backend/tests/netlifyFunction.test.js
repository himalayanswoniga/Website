import { describe, it, expect } from 'vitest';
import { handler } from '../../netlify/functions/api.mjs';

/**
 * Netlify rewrites /api/* onto the function, so the handler receives its own mount
 * prefix on the path and must strip it before Express routes the request. Getting this
 * wrong 404s the entire API, and it cannot be caught locally by supertest alone — so
 * drive the real handler with the event shape Netlify actually delivers.
 */
function netlifyEvent(path, { method = 'GET', query = null, body = null, headers = {} } = {}) {
  return {
    path,
    httpMethod: method,
    headers: { host: 'himalayanswonigaharvest.com', ...headers },
    queryStringParameters: query,
    multiValueQueryStringParameters: null,
    body: body ? JSON.stringify(body) : null,
    isBase64Encoded: false,
  };
}

const invoke = (path, opts) => handler(netlifyEvent(path, opts), {});

describe('Netlify function routing', () => {
  it('routes the rewritten /api/v1 path Netlify delivers', async () => {
    const res = await invoke('/.netlify/functions/api/api/v1/settings');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).data.hero.title).toBeTruthy();
  });

  it('routes the rewritten health check', async () => {
    const res = await invoke('/.netlify/functions/api/health');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).success).toBe(true);
  });

  it('preserves the query string through the rewrite', async () => {
    const res = await invoke('/.netlify/functions/api/api/v1/products', {
      query: { featured: 'true', limit: '6' },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.length).toBe(3);
    expect(body.data.every((p) => p.featured)).toBe(true);
  });

  it('routes path parameters through the rewrite', async () => {
    const res = await invoke('/.netlify/functions/api/api/v1/products/lapsi-powder');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).data.name).toBe('Lapsi Powder');
  });

  it('accepts a POST body through the rewrite', async () => {
    const res = await invoke('/.netlify/functions/api/api/v1/contact', {
      method: 'POST',
      body: { name: 'A', email: 'a@b.com', message: 'hi' },
      headers: { 'content-type': 'application/json' },
    });
    // 503 in seed mode, but it proves the request reached the route rather than 404ing.
    expect(res.statusCode).toBe(503);
  });

  it('still routes if the platform hands over an already-clean path', async () => {
    const res = await invoke('/api/v1/settings');
    expect(res.statusCode).toBe(200);
  });

  it('404s an unknown API route rather than swallowing it', async () => {
    const res = await invoke('/.netlify/functions/api/api/v1/products/does-not-exist');
    expect(res.statusCode).toBe(404);
  });

  it('advertises that it is serving seed content while MONGO_URI is unset', async () => {
    const res = await invoke('/.netlify/functions/api/health');
    expect(res.headers['x-data-source']).toBe('seed');
  });

  // A serverless invocation has no socket, so req.ip is undefined and the rate limiter
  // would either throw ERR_ERL_UNDEFINED_IP_ADDRESS or put every visitor in one bucket.
  it('rate-limits per client address, not per function instance', async () => {
    const forClient = (ip) =>
      invoke('/.netlify/functions/api/api/v1/settings', { headers: { 'x-nf-client-connection-ip': ip } });

    const first = await forClient('203.0.113.9');
    const second = await forClient('203.0.113.9');
    const other = await forClient('198.51.100.4');

    expect(Number(second.headers['ratelimit-remaining'])).toBe(
      Number(first.headers['ratelimit-remaining']) - 1
    );
    // A different visitor must not inherit the first one's spent budget.
    expect(Number(other.headers['ratelimit-remaining'])).toBeGreaterThan(
      Number(second.headers['ratelimit-remaining'])
    );
  });
});
