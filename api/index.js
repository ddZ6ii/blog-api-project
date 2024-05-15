// Private API backend.

import express from 'express';
import 'dotenv/config';
import chalk from 'chalk';
import blog from '@store/blog.js';
import apiRouter from '@routers/apiRouter.js';

const PORT = parseInt(process.env.SERVER_API_PORT ?? '8000', 10);
const app = express();

// Initialize in-memory data store from JSON file.
async function init() {
  try {
    await blog.initPosts();
  } catch (err) {
    console.error('Failed to retrieve posts from file!', err);
  }
}
init();

// Application-level middlewares.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', apiRouter);

// API server.
app.listen(PORT, () => {
  console.info(
    chalk.yellow(
      `API is running on ${import.meta.env.DEV ? 'http://localhost' : process.env.SERVER_BASE_URL}:${PORT}...`,
    ),
  );
});

// vite-node-plugin requires a named export.
/* eslint-disable import/prefer-default-export */
export const viteNodeApp = app;
