/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import { resolve, join } from 'path';
import { node } from './rollup.config.ts';
import 'dotenv/config';

// Define chrome as default browser for the dev server.
const opsys = process.platform;
// windows
if (opsys === 'win32') process.env.BROWSER = 'chrome';
// macOS
if (opsys === 'darwin') process.env.BROWSER = '/Applications/Google Chrome.app';

const DEV = process.env.NODE_ENV === 'development';
const SERVER_PORT = process.env.SERVER_API_PORT ?? '3000';
const CLIENT_PORT = parseInt(process.env.CLIENT_APP_PORT ?? '4173', 10);
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'http://localhost';

export default defineConfig({
  base: '/',
  root: resolve(__dirname, './'),
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    sourcemap: true,
    minify: true,
    cssMinify: true,
    // Define Vite entry point for a file other than default index.html. Use either an absolute path (resolve(__dirname, 'src', 'index.ts') or a path relative to 'root' if defined (source: https://vitejs.dev/guide/backend-integration.html)
    rollupOptions: {
      input: 'index.ts',
    },
  },
  preview: {
    // Vite client-server.
    port: CLIENT_PORT,
    open: true,
    // Use a proxy to redirect vite client server to the backend server (cannot use the same port).
    proxy: {
      '/': {
        target: `${DEV ? 'http://localhost' : SERVER_HOSTNAME}:${SERVER_PORT}/posts`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(join(__dirname, 'src')),
      '@controllers': resolve(join(__dirname, 'src', 'controllers')),
      '@data': resolve(join(__dirname, 'src', 'data')),
      '@middlewares': resolve(join(__dirname, 'src', 'middlewares')),
      '@routers': resolve(join(__dirname, 'src', 'routers')),
      '@store': resolve(join(__dirname, 'src', 'store')),
      '@utils': resolve(join(__dirname, 'src', 'utils')),
    },
  },
  server: {
    // Vite client-server.
    port: CLIENT_PORT,
    open: true,
    // Use a proxy to redirect vite client server to the backend server (cannot use the same port).
    proxy: {
      '/': `${DEV ? 'http://localhost' : SERVER_HOSTNAME}:${SERVER_PORT}/posts`,
    },
  },
  test: {
    // Appent test files or folders to be excluded during test run.
    exclude: [...configDefaults.exclude],
    // Disable multi-threading for API testing (see: https://adequatica.medium.com/api-testing-with-vitest-391697942527).
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },

  // (source: https://dev.to/rxliuli/developing-and-building-nodejs-applications-with-vite-311n)
  plugins: [node()],
});
