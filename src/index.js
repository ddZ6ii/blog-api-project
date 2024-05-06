/**
 * API backend application.
 */

import express from 'express';
import 'dotenv/config';
import chalk from 'chalk';

import {
  createPost,
  deletePostById,
  filterPosts,
  getPostById,
  initPosts,
  sortPostsByDate,
  updatePostById,
} from './utils/posts.js';
import { writeToJSON } from './utils/file.js';
import isEmpty from './utils/checkIsEmpty.js';

const { API_SERVER_PORT } = process.env;
const app = express();
const port = parseInt(API_SERVER_PORT, 10) ?? 8000;

// In-memory data store.
let posts;
let nextPostId;
// let nextPostId = 4;

// Initialize posts from JSON file.
try {
  const { initialPosts, nextId } = await initPosts();
  // Updata in-memory data store.
  posts = initialPosts;
  nextPostId = nextId;
} catch (err) {
  console.error('Ooops... failed to initialize posts:', err.message, err.stack);
}

// Application-level middlewares.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// GET All posts
app.get('/posts', (req, res) => {
  try {
    const { sort, filter: filterText } = req.query;
    const filteredPosts = filterPosts(posts, filterText);
    const sortedPost = sortPostsByDate(filteredPosts, sort);
    // if (isEmpty(sortedPost)) {
    //   return res.status(404).json({
    //     status: 'success',
    //     message: 'No posts found matching your search criteria',
    //     code: 404,
    //   });
    // }
    return res.json(sortedPost);
  } catch (err) {
    console.error('Failed to retrieve posts!', err.message, err.stack);
    return res.status(400).json({
      status: 'error',
      message: 'Invalid search parameters',
      code: 400,
    });
  }
});

// GET a specific post by id
app.get('/posts/:id', (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = getPostById(posts, postId);
    if (isEmpty(post)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId}`,
        code: 404,
      });
    }
    return res.json(post);
  } catch (err) {
    console.error('Failed to retrieve post by id!', err.message, err.stack);
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request parameter',
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

    const newPost = createPost(nextPostId, req.body);
    // Update in-memory data store.
    posts.push(newPost);
    nextPostId += 1;
    // Persist data to JSON file.
    await writeToJSON(posts);
    return res.json(newPost);
  } catch (err) {
    console.error('Failed to create post!', err.message, err.stack);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create post',
      code: 500,
    });
  }
});

// PATCH a post when you just want to update one parameter
app.patch('/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const result = updatePostById(posts, postId, req.body);
    if (isEmpty(result)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId}`,
        code: 404,
      });
    }
    if (result.hasUpdatedContent) {
      // Update in-memory data store.
      posts = posts.map((post) =>
        post.id === postId ? result.updatedPost : post,
      );
      // Persist data to JSON file.
      await writeToJSON(posts);
    }
    return res.json(result.updatedPost);
  } catch (err) {
    console.error('Failed to update post!', err.message, err.stack);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update post',
      code: 500,
    });
  }
});

// DELETE delete a specific post by its id and update JSON file.
app.delete('/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);

    const updatedPosts = deletePostById(posts, postId);
    if (isEmpty(updatedPosts)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId}`,
        code: 404,
      });
    }
    // Update in-memory data store.
    posts = updatedPosts;
    // Persist data to JSON file.
    await writeToJSON(posts);
    return res.sendStatus(200);
  } catch (err) {
    console.error('Failed to delete post!', err.message, err.stack);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete post',
      code: 500,
    });
  }
});

// App server
app.listen(port, () => {
  console.info(chalk.yellow(`API is running at http://localhost:${port}...`));
});
