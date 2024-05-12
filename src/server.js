/// "Third-party" backend application that makes API requests.

import express from 'express';
import chalk from 'chalk';
import 'dotenv/config';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import appRouter from './routers/appRouter.js';

const { APP_SERVER_PORT } = process.env;
const app = express();
const port = parseInt(APP_SERVER_PORT, 10) ?? 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Application settings properties.
app.set('views', join(__dirname, './views'));
app.set('view engine', 'ejs');

// Application-level middlewares.
app.use(express.static(join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', appRouter);

// Application server.
app.listen(port, () => {
  console.info(
    chalk.yellow(`Backend server is running on http://localhost:${port}...`),
  );
});
