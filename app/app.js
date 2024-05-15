// Backend application interacting with private API.

import express from 'express';
import chalk from 'chalk';
import 'dotenv/config';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import appRouter from '@routers/appRouter.js';

const PORT = parseInt(process.env.SERVER_APP_PORT ?? '3000', 10);
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set(
  'views',
  import.meta.env.DEV
    ? join(__dirname, 'src', 'views')
    : join(__dirname, 'views'),
);
app.set('view engine', 'ejs');

// Application-level middlewares.
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', appRouter);

// Application server.
app.listen(PORT, () => {
  console.info(
    chalk.yellow(
      `Backend server is running on ${import.meta.env.DEV ? 'http://localhost' : process.env.SERVER_BASE_URL}:${PORT}...`,
    ),
  );
});

// vite-node-plugin requires a named export.
/* eslint-disable import/prefer-default-export */
export const viteNodeApp = app;
