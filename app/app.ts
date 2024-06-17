// Backend application interacting with private API.

import express from 'express';
import 'dotenv/config';
import chalk from 'chalk';
import { join } from 'path';
import { appRouter } from '@routers/app.router.ts';
import { errorHandler } from '@middlewares/error.middleware.ts';

const { DEV } = import.meta.env;
const SERVER_PORT = parseInt(process.env.PORT ?? '8000', 10);
const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost';
const app = express();

app.set(
  'views',
  DEV ? join(__dirname, 'src', 'views') : join(__dirname, 'views'),
);
app.set('view engine', 'ejs');

// Application-level middlewares.
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', appRouter);
/**
 * Custom error-handling middleware (must be defined after all the routes!).
 * Any error thrown from a route or another middleware will be caught by the 'errorHandler'.
 */
app.use(errorHandler);

// Application server.
const _server = app.listen(SERVER_PORT, (): void => {
  console.info(
    chalk.yellow(
      `Backend server is running on ${DEV ? 'http://localhost' : SERVER_URL}:${SERVER_PORT.toString()}...`,
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
