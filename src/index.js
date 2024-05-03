/**
 * API backend application.
 */

import express from 'express';
import 'dotenv/config';
import initialPosts from './data/posts.js';
import { checkSortParamValidity, sortPostsByDate } from './utils/posts.js';

const { API_SERVER_PORT } = process.env;
const app = express();
const port = parseInt(API_SERVER_PORT, 10) ?? 8000;

// In-memory data store
const posts = initialPosts;
const nextPostId = 4;

// Application-level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// GET All posts
app.get('/posts', (req, res) => {
  const { sort } = req.query;
  const sortingOrder = checkSortParamValidity(sort) ? sort : 'DESC';
  const sortedPost = sortPostsByDate(sortingOrder, posts);
  return res.json(sortedPost);
});

// App server
app.listen(port, () => {
  console.info(`API is running at http://localhost:${port}...`);
});
