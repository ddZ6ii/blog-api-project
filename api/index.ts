// Private API backend.

import express from 'express';
import 'dotenv/config';
import chalk from 'chalk';
import apiRouter from '@/routers/apiRouter.js';
import blog from '@/store/blog.js';

const { DEV } = import.meta.env;
const SERVER_PORT = parseInt(process.env.SERVER_API_PORT ?? '8000', 10);
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'http://localhost';
const app = express();

// Initialize in-memory data store from JSON file.
async function init(): Promise<void> {
  try {
    await blog.initPosts();
  } catch (err) {
    console.error(chalk.red('Failed to retrieve posts from file!', err));
  }
}
await init();

// Application-level middlewares.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', apiRouter);

// API server.
const _server = app.listen(SERVER_PORT, (): void => {
  console.info(
    chalk.yellow(
      `API is running on ${DEV ? 'http://localhost' : SERVER_HOSTNAME}:${SERVER_PORT.toString()}...`,
    ),
  );
});

// Fix: Properly close existing erver prior to HMR (source: https://github.com/vitest-dev/vitest/issues/2334)
// Fix: property 'hot' does not exist on import.meta (source : https://github.com/vitejs/vite/issues/9539 )
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    _server.close();
  });
}
