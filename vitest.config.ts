import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*Spec.ts'],
    exclude: ['examples/**', '.downstream_cache/**', 'node_modules/**'],
  },
});
