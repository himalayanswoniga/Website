import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import apiRoutes from './routes/index.js';
import { ApiError } from './utils/ApiError.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Hosts vary on trailing slash and case, and a single mismatch rejects the whole site
// with an opaque CORS failure, so compare on a normalised form rather than verbatim.
const normalizeOrigin = (value) => value.trim().toLowerCase().replace(/\/+$/, '');

/**
 * Builds the API. The router is injectable so the same middleware stack — helmet,
 * CORS, logging, error handling — serves both the real database-backed routes and
 * the read-only seed content router used before MongoDB is configured.
 */
export function createApp({
  router = apiRoutes,
  dataSource = 'database',
  trustProxy = process.env.NODE_ENV === 'production',
} = {}) {
  const app = express();

  // Render, Netlify and any other managed host terminate TLS in front of us, so without
  // this every request looks like it came from the proxy and req.ip collapses to a single
  // address. Serverless callers pass trustProxy explicitly, because NODE_ENV is not
  // reliably 'production' at function runtime.
  if (trustProxy) {
    app.set('trust proxy', 1);
  }

  app.use(helmet());

  const allowedOrigins = new Set(
    (process.env.CLIENT_ORIGINS || '').split(',').map(normalizeOrigin).filter(Boolean)
  );

  if (process.env.NODE_ENV === 'production' && allowedOrigins.size === 0) {
    console.warn(
      '[cors] CLIENT_ORIGINS is unset, so any origin may call this API. That is expected when the ' +
        'API is served from the same origin as the site (Netlify Functions) and CORS never applies. ' +
        'If this API is hosted separately, set CLIENT_ORIGINS to the site origins, e.g. ' +
        'https://himalayanswonigaharvest.com,https://www.himalayanswonigaharvest.com'
    );
  }

  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server / curl requests (no Origin header), anything explicitly
        // configured, and — when CLIENT_ORIGINS is unset — everything, because the API is
        // then being served from the site's own origin and CORS does not apply anyway.
        if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(normalizeOrigin(origin))) {
          return callback(null, true);
        }
        return callback(new ApiError(403, `Origin ${origin} is not listed in CLIENT_ORIGINS`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Lets callers (and the deployment checklist) tell a fully wired API apart from one
  // still serving the built-in seed content, without having to eyeball the payload.
  app.use((req, res, next) => {
    res.set('X-Data-Source', dataSource);
    next();
  });

  app.get('/health', (req, res) =>
    res.json({ success: true, message: 'API is running', dataSource })
  );

  app.use('/api/v1', apiLimiter, router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp();
