import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import seedContentRouter from './seed/seedContentRouter.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Mirrors netlify/functions/api.mjs: without a database, serve the read-only seed
// content instead of refusing to boot. Running locally then shows exactly what a
// deploy without MONGO_URI shows, which is the whole point of the fallback.
const usingDatabase = Boolean(process.env.MONGO_URI);

async function start() {
  try {
    if (usingDatabase) {
      await connectDB();
    } else {
      console.warn(
        'MONGO_URI is not set — serving read-only built-in content.\n' +
          'The storefront works; the admin panel, contact form and uploads stay disabled.\n' +
          'Set MONGO_URI in backend/.env and run `npm run seed` to enable them.'
      );
    }

    const app = usingDatabase
      ? createApp({ dataSource: 'database' })
      : createApp({ router: seedContentRouter, dataSource: 'seed' });

    app.listen(PORT, () =>
      console.log(
        `API on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}, ` +
          `${usingDatabase ? 'database' : 'seed content'}]`
      )
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
