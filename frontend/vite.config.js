import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const DEV_API_PROXY_DEFAULT = 'http://localhost:5000';

/**
 * Vite inlines VITE_* values at build time, so an unset or localhost API URL does not
 * fail loudly — it ships a bundle whose every request goes to the *visitor's* machine.
 * That is how the production site ended up calling http://localhost:5000/api/v1, so the
 * production build refuses to run unless the URL is one a browser can actually reach.
 */
function assertDeployableApiUrl(baseUrl) {
  const hint =
    'Set VITE_API_BASE_URL to the deployed API origin including the /api/v1 prefix, e.g.\n' +
    '  https://himalayan-swoniga-backend.onrender.com/api/v1\n' +
    'On Netlify: Site settings -> Environment variables, then redeploy with "Clear cache and deploy".\n' +
    'To build against a local API anyway, run the build with ALLOW_LOCAL_API_BUILD=1.';

  if (!baseUrl) throw new Error(`VITE_API_BASE_URL is not set.\n${hint}`);

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
