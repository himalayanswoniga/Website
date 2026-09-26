import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

/** Connect once at boot. Used by the long-running server (server.js) and the seed script. */
export async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
}

// Lambda reuses a warm container across invocations, so the connection has to survive
// between them. Caching the promise rather than the resolved connection means concurrent
// cold-start requests share one handshake instead of each opening its own pool.
let connectionPromise = null;

/**
 * Connect from a serverless function, reusing the pool across warm invocations.
 * A failed attempt is not cached, so the next request retries instead of being stuck
 * behind a rejection from minutes ago.
 */
export function connectDBCached() {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        // The container is frozen between bursts, so a large idle pool is wasted. The short
        // server-selection timeout surfaces a bad URI as an error instead of letting the
        // request sit until the function itself times out.
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10_000,
      })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }
  return connectionPromise;
}
