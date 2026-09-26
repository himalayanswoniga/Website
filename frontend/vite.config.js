import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const DEV_API_PROXY_DEFAULT = 'http://localhost:5000';

// The same-origin API: a Netlify Function serving the Express app next to these assets.
const SAME_ORIGIN_API = fileURLToPath(new URL('../netlify/functions/api.mjs', import.meta.url));

/**
 * Vite inlines VITE_* values at build time, so a bad API URL does not fail loudly — it
 * ships a bundle whose every request goes somewhere unreachable. That is how the site
 * ended up calling http://localhost:5000/api/v1 in production, so the build refuses to
 * run unless the app has an API it can actually reach.
 *
 * Two configurations are valid:
 *   - VITE_API_BASE_URL unset, and the API ships with the site as a Netlify Function.
 *   - VITE_API_BASE_URL set to an https origin ending in /api/v1, for a separate API host.
 */
function assertDeployableApiUrl(baseUrl) {
  const hint =
    'Either deploy the API alongside the site (netlify/functions/api.mjs) and leave\n' +
    'VITE_API_BASE_URL unset, or set it to a separate API origin including the /api/v1\n' +
    'prefix, e.g. https://your-api.example.com/api/v1.\n' +
    'On Netlify: Site settings -> Environment variables, then redeploy with "Clear cache and deploy".\n' +
    'To build against a local API anyway, run the build with ALLOW_LOCAL_API_BUILD=1.';

  if (!baseUrl) {
    // Unset means "call /api/v1 on our own origin", which is only true if the function is
    // part of this deploy. Without it those calls fall through to the SPA rewrite and come
    // back as index.html.
    if (existsSync(SAME_ORIGIN_API)) return;
    throw new Error(
      `VITE_API_BASE_URL is not set and no same-origin API function was found at\n  ${SAME_ORIGIN_API}\n${hint}`
    );
  }

  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    // A relative value such as /api/v1 is fine — it resolves against the site's own origin.
    if (baseUrl.startsWith('/')) return;
    throw new Error(`VITE_API_BASE_URL is not a valid URL: ${baseUrl}\n${hint}`);
  }

  if (['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(url.hostname)) {
    throw new Error(`VITE_API_BASE_URL points at ${url.hostname}, which no visitor can reach.\n${hint}`);
  }
  if (url.protocol !== 'https:') {
    throw new Error(
      `VITE_API_BASE_URL uses ${url.protocol}; the site is served over HTTPS and browsers block ` +
        `mixed content.\n${hint}`
    );
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith('/api/v1')) {
    throw new Error(`VITE_API_BASE_URL is missing the /api/v1 prefix: ${baseUrl}\n${hint}`);
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  if (command === 'build' && !process.env.ALLOW_LOCAL_API_BUILD) {
    assertDeployableApiUrl(env.VITE_API_BASE_URL);
  }

  return {
    plugins: [react()],
    server: {
      // Lets local dev work with no .env at all: the app calls the relative /api/v1
      // default and Vite forwards it to the Express server.
      proxy: {
        '/api': {
          target: process.env.DEV_API_PROXY || DEV_API_PROXY_DEFAULT,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/tests/setup.js'],
    },
  };
});
