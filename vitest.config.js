import { configDefaults, defineConfig } from 'vitest/config';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@store': resolve(join(__dirname, 'src', 'store')),
      '@tests': resolve(join(__dirname, 'src', 'tests')),
      '@utils': resolve(join(__dirname, 'src', 'utils')),
    },
  },
  test: {
    exclude: [...configDefaults.exclude],

    // Disable multi-threading for API testing (see: https://adequatica.medium.com/api-testing-with-vitest-391697942527).
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
