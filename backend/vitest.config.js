import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Suites that need MongoDB call useTestDatabase() from tests/setup.js themselves.
    // Running files serially keeps two mongod binaries from booting at once, which is
    // what pushed the beforeAll hook past its timeout once more suites were added.
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 60000,
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '2h',
      CLIENT_ORIGINS: 'http://localhost:5173',
      ADMIN_EMAIL: 'admin@test.com',
      ADMIN_PASSWORD: 'testpassword123',
    },
  },
});
