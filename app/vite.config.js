import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { resolve, join } from 'path';
import 'dotenv/config';

const PORT = parseInt(process.env.CLIENT_APP_PORT ?? '5173', 10);

// Define chrome as default browser for the dev server.
const opsys = process.platform;
// windows
if (opsys === 'win32') process.env.BROWSER = 'chrome';
// macOS
if (opsys === 'darwin') process.env.BROWSER = '/Applications/Google Chrome.app';

export default defineConfig({
  root: resolve(__dirname, './'),
  publicDir: false,
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    sourcemap: true,
    minify: true,
    cssMinify: true,
  },
  preview: {
    // Vite client-server.
    port: PORT,
    open: true,
    // Use a proxy to redirect vite client server to the backend server (cannot use the same port).
    proxy: {
      '/': {
        target: `${process.env.NODE_ENV === 'development' ? 'http://localhost' : process.env.SERVER_BASE_URL}:${process.env.SERVER_APP_PORT}/`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(join(__dirname, 'src')),
      '@controllers': resolve(join(__dirname, 'src', 'controllers')),
      '@routers': resolve(join(__dirname, 'src', 'routers')),
    },
  },
  server: {
    // Vite client-server.
    port: PORT,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      // Set the project entry for the plugin.
      appPath: 'app.js',
      // Optional: the name of named export of you app from the appPath file (default: 'viteNodeApp').
      exportName: 'viteNodeApp',
      // Optional: to init the app on boot, set this to true (default: false).
      initAppOnBoot: false,
      tsCompiler: 'esbuild',
      swcOptions: {},
    }),
  ],
});
