/**
 * API backend application.
 */

import express from 'express';
import 'dotenv/config';
import chalk from 'chalk';

import isEmpty from './utils/isEmpty.js';
import { blog } from './store/blog.js';

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

// Routes
// GET All posts
app.get('/posts', (req, res) => {
  try {
    const { sort, filter: filterText } = req.query;
    const filteredPosts = blog.filterPosts(filterText);
    const sortedPost = blog.sortPostsByDate(filteredPosts, sort);
    return res.json(sortedPost);
  } catch (err) {
    console.error('Failed to retrieve posts!', err);
    return res.status(400).json({
      status: 'error',
      message: `Invalid search parameters: ${err}`,
      code: 400,
    });
  }
});

// GET a specific post by id
app.get('/posts/:id', (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = blog.getPostById(postId);
    if (isEmpty(post)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId}`,
        code: 404,
      });
    }
    return res.json(post);
  } catch (err) {
    console.error('Failed to retrieve post by id!', err);
    return res.status(400).json({
      status: 'error',
      message: `Invalid request parameter: ${err}`,
      code: 400,
    });
  }
});

// POST create a new post and update JSON file.
app.post('/posts', async (req, res) => {
  try {
    if (isEmpty(req.body)) {
      return res
        .status(400)
        .json({ status: 'error', message: 'No post data provided', code: 400 });
    }
    const newPost = await blog.addPosts(req.body);
    return res.json(newPost);
  } catch (err) {
    console.error('Failed to create post!', err);
    return res.status(500).json({
      status: 'error',
      message: `Failed to create post: ${err}`,
      code: 500,
    });
  }
});

// PATCH a post when you just want to update one parameter
app.patch('/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const updatedPost = await blog.updatePostById(req.body, postId);
    if (isEmpty(updatedPost)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId}`,
        code: 404,
      });
    }
    return res.json(updatedPost);
  } catch (err) {
    console.error('Failed to update post!', err);
    return res.status(400).json({
      status: 'error',
      message: `Invalid request: ${err}`,
      code: 400,
    });
  }
});

// DELETE delete a specific post by its id and update JSON file.
app.delete('/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const deletedPostId = await blog.deletePostById(postId);
    if (isEmpty(deletedPostId)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId}`,
        code: 404,
      });
    }
    return res.sendStatus(200);
  } catch (err) {
    console.error('Failed to delete post!', err);
    return res.status(500).json({
      status: 'error',
      message: `Failed to delete post: ${err}`,
      code: 500,
    });
  }
});

// GET Reset all posts
app.post('/posts/reset', async (req, res) => {
  try {
    await blog.resetPosts();
    return res.sendStatus(205);
  } catch (err) {
    console.error('Failed to reset posts!', err);
    return res.status(500).json({
      status: 'error',
      message: `Failed to reset posts: ${err}`,
      code: 500,
    });
  }
});

// App server
app.listen(port, () => {
  console.info(chalk.yellow(`API is running at http://localhost:${port}...`));
});
