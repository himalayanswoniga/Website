import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    testTimeout: 20000,
    hookTimeout: 20000,
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
