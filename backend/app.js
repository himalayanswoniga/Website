import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import apiRoutes from './routes/index.js';
import { ApiError } from './utils/ApiError.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

// Render (and any other managed host) terminates TLS in front of us, so without this
// every request looks like it came from the proxy: req.ip collapses to one address and
// the rate limiters below would throttle all visitors as if they were a single client.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());

// Hosts vary on trailing slash and case, and a single mismatch rejects the whole site
// with an opaque CORS failure, so compare on a normalised form rather than verbatim.
const normalizeOrigin = (value) => value.trim().toLowerCase().replace(/\/+$/, '');

const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS || '').split(',').map(normalizeOrigin).filter(Boolean)
);

if (process.env.NODE_ENV === 'production' && allowedOrigins.size === 0) {
  console.warn(
    '[cors] CLIENT_ORIGINS is empty — every browser request will be rejected. ' +
      'Set it to a comma-separated list of site origins, e.g. ' +
      'https://himalayanswonigaharvest.com,https://www.himalayanswonigaharvest.com'
  );
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server / curl requests (no Origin header) and any configured site origin.
      if (!origin || allowedOrigins.has(normalizeOrigin(origin))) return callback(null, true);
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

app.get('/health', (req, res) => res.json({ success: true, message: 'API is running' }));

app.use('/api/v1', apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
