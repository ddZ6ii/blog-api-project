// API backend application.

import express from 'express';
import 'dotenv/config';
import chalk from 'chalk';
import { blog } from './store/blog.js';
import apiRouter from './routers/apiRouter.js';

const { API_SERVER_PORT } = process.env;
const app = express();
const port = parseInt(API_SERVER_PORT, 10) ?? 8000;

// Initialize in-memory data store from JSON file.
try {
  await blog.initPosts();
} catch (err) {
  console.error('Failed to retrieve posts from file!', err);
}

// Application-level middlewares.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', apiRouter);

// API server.
app.listen(port, () => {
  console.info(chalk.yellow(`API is running at http://localhost:${port}...`));
});
