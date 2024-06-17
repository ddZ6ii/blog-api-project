// Private API backend.

import express from 'express';
import 'dotenv/config';
import chalk from 'chalk';
import { blog } from '@store/blog.ts';
import { apiRouter } from '@/routers/api.router.ts';
import { errorHandler } from '@/middlewares/error.middleware.ts';

const API_PORT = parseInt(process.env.API_PORT ?? '3000', 10);
const API_BASE_URL = `http://${process.env.API_PRIVATE_DOMAIN ?? 'localhost'}`;
const API_URL = `${API_BASE_URL}:${API_PORT.toString()}`;
const app = express();

// Initialize in-memory data store from JSON file.
blog.initPosts().catch((err: unknown) => {
  console.error(chalk.red('Failed to initialize posts!', err));
});

// Application-level middlewares.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', apiRouter);
/**
 * Custom error-handling middleware (must be defined after all the routes!).
 * Any error thrown from a route or another middleware will be caught by the 'errorHandler'.
 */
app.use(errorHandler);

// API server.
const _server = app.listen(API_PORT, '::', (): void => {
  console.info(chalk.yellow(`API is running on ${API_URL}...`));
});

// Fix: Properly close existing erver prior to HMR (source: https://github.com/vitest-dev/vitest/issues/2334)
// Fix: property 'hot' does not exist on import.meta (source : https://github.com/vitejs/vite/issues/9539 )
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    _server.close();
  });
}
