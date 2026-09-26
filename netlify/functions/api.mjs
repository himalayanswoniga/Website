import serverless from 'serverless-http';
import { createApp } from '../../backend/app.js';
import { connectDBCached } from '../../backend/config/db.js';
import seedContentRouter from '../../backend/seed/seedContentRouter.js';

// Netlify rewrites /api/* and /health onto this function, so the incoming path arrives
// prefixed with the function's own mount point. Strip it so Express sees the route the
// browser actually asked for.
const FUNCTION_BASE = '/.netlify/functions/api';

const MONGO_URI = process.env.MONGO_URI;
const usingDatabase = Boolean(MONGO_URI);

if (!usingDatabase) {
  console.warn(
    '[api] MONGO_URI is not set — serving read-only built-in content. The storefront works; ' +
      'the admin panel, contact form and uploads stay disabled until a database is configured.'
  );
}

const app = usingDatabase
  ? createApp({ dataSource: 'database', trustProxy: true })
  : createApp({ router: seedContentRouter, dataSource: 'seed', trustProxy: true });

const handle = serverless(app);

export const handler = async (event, context) => {
  // Without this the function waits for mongoose's idle sockets before returning,
  // adding the full socket timeout to every response.
  context.callbackWaitsForEmptyEventLoop = false;

  const path = event.path || '/';
  if (path.startsWith(FUNCTION_BASE)) {
    event.path = path.slice(FUNCTION_BASE.length) || '/';
  }

  if (usingDatabase) {
    try {
      await connectDBCached();
    } catch (err) {
      console.error('[api] database connection failed:', err);
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json', 'X-Data-Source': 'database' },
        body: JSON.stringify({ success: false, message: 'The database is unavailable. Please try again shortly.' }),
      };
    }
  }

  return handle(event, context);
};
