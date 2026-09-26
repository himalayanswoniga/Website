import axios from 'axios';

// Relative default so the app talks to its own origin when no explicit API URL is
// configured — Vite proxies /api to the local Express server in dev, and the
// production build refuses to run without a real VITE_API_BASE_URL (see vite.config.js).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  // Render's free tier sleeps after ~15 minutes idle and takes 30-60s to wake, so the
  // first request of a session needs a generous ceiling rather than axios' default of none.
  timeout: 90_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hsh_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('hsh_admin_token');
      localStorage.removeItem('hsh_admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }

    // axios reports every unreachable-server case as the bare string "Network Error",
    // which tells a visitor nothing. Replace it with wording they can act on.
    if (!error.response) {
      error.message =
        error.code === 'ECONNABORTED'
          ? 'The server is taking longer than usual to respond. Please try again in a moment.'
          : 'We could not reach the server. Please check your connection and try again.';
    }

    return Promise.reject(error);
  }
);

export default api;
