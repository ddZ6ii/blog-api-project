/**
 * API backend application.
 */

import express from 'express';
import 'dotenv/config';
import chalk from 'chalk';
import initialPosts from './data/posts.js';

import {
  checkSortParamValidity,
  createPost,
  getPostById,
  sortPostsByDate,
} from './utils/posts.js';
import isEmpty from './utils/checkIsEmpty.js';

const { API_SERVER_PORT } = process.env;
const app = express();
const port = parseInt(API_SERVER_PORT, 10) ?? 8000;

// In-memory data store
const posts = initialPosts;
let nextPostId = 4;

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

// GET a specific post by id
app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = getPostById(posts, postId);
  if (isEmpty(post)) {
    return res
      .status(404)
      .json({ message: `No existing post with id ${postId}...` });
  }
  return res.json(post);
});

// POST a new post
app.post('/posts', (req, res) => {
  if (isEmpty(req.body)) return res.sendStatus(400);
  const newPost = createPost(nextPostId, req.body);
  posts.push(newPost);
  nextPostId += 1;
  return res.json(newPost);
});

// App server
app.listen(port, () => {
  console.info(chalk.yellow(`API is running at http://localhost:${port}...`));
});
