/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import { VitePluginNode } from 'vite-plugin-node';
import { resolve, join } from 'path';
import 'dotenv/config';

const PORT = parseInt(process.env.CLIENT_APP_PORT ?? '4173', 10);

export default defineConfig({
  root: resolve(__dirname, './'),
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    sourcemap: true,
    // minify: true,
    // cssMinify: true,
  },
  preview: {
    // Vite client-server.
    port: PORT,
    open: true,
    // Use a proxy to redirect vite client server to the backend server (cannot use the same port).
    proxy: {
      '': {
        target: `${process.env.NODE_ENV === 'development' ? 'http://localhost' : process.env.SERVER_BASE_URL}:${process.env.SERVER_API_PORT}/posts`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(join(__dirname, 'src')),
      '@controllers': resolve(join(__dirname, 'src', 'controllers')),
      '@data': resolve(join(__dirname, 'src', 'data')),
      '@routers': resolve(join(__dirname, 'src', 'routers')),
      '@store': resolve(join(__dirname, 'src', 'store')),
      '@utils': resolve(join(__dirname, 'src', 'utils')),
    },
  },
  server: {
    // Vite client-server.
    port: PORT,
    open: true,
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
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      // Set the project entry for the plugin.
      appPath: 'index.js',
      // Optional: the name of named export of you app from the appPath file (default: 'viteNodeApp').
      exportName: 'viteNodeApp',
      // Optional: to init the app on boot, set this to true (default: false).
      initAppOnBoot: false,
      // Optional: the TypeScript compiler you want to use (default: 'esbuild').
      tsCompiler: 'esbuild',
      swcOptions: {},
    }),
  ],
});
