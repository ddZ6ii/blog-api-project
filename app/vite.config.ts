import { defineConfig } from 'vite';
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
const SERVER_PORT = process.env.SERVER_APP_PORT ?? '3000';
const CLIENT_PORT = parseInt(process.env.CLIENT_APP_PORT ?? '5173', 10);
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'http://localhost';

export default defineConfig({
  root: resolve(__dirname, './'),
  publicDir: false,
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    sourcemap: true,
    minify: true,
    cssMinify: true,
    // Define Vite entry point for a file other than default index.html. Use either an absolute path (resolve(__dirname, 'src', 'index.ts') or a path relative to 'root' if defined (source: https://vitejs.dev/guide/backend-integration.html)
    rollupOptions: {
      input: 'app.ts',
    },
  },
  preview: {
    // Vite client-server.
    port: CLIENT_PORT,
    open: true,
    // Use a proxy to redirect vite client server to the backend server (cannot use the same port).
    proxy: {
      '/': {
        target: `${DEV ? 'http://localhost' : SERVER_HOSTNAME}:${SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(join(__dirname, 'src')),
      '@controllers': resolve(join(__dirname, 'src', 'controllers')),
      '@lib': resolve(join(__dirname, 'src', 'lib')),
      '@middlewares': resolve(join(__dirname, 'src', 'middlewares')),
      '@routers': resolve(join(__dirname, 'src', 'routers')),
      '@utils': resolve(join(__dirname, 'src', 'utils')),
    },
  },
  server: {
    // Vite client-server.
    port: CLIENT_PORT,
    open: true,
    // Use a proxy to redirect vite client server to the backend server (cannot use the same port).
    proxy: {
      '/': `${DEV ? 'http://localhost' : SERVER_HOSTNAME}:${SERVER_PORT}`,
    },
  },
  // (source: https://dev.to/rxliuli/developing-and-building-nodejs-applications-with-vite-311n)
  plugins: [node()],
});
