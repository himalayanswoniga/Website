import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';

/**
 * Opt-in rather than a global setupFile: booting a mongod binary takes seconds, and
 * suites that exercise the seed-content API or the Netlify handler never touch the
 * database. Starting one per test file regardless was slow enough to intermittently
 * blow the beforeAll timeout under load.
 */
export function useTestDatabase() {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod?.stop();
  });
}
