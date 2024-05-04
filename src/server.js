/**
 * "Third-party" service's backend application that makes API requests.
 */

import express from 'express';
import axios from 'axios';
import chalk from 'chalk';
import 'dotenv/config';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const { APP_SERVER_PORT, API_SERVER_PORT } = process.env;
const API_URL = `http://localhost:${parseInt(API_SERVER_PORT, 10) ?? 8000}`;
const app = express();
const port = parseInt(APP_SERVER_PORT, 10) ?? 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Application settings properties
app.set('views', join(__dirname, './views'));
app.set('view engine', 'ejs');

// Application-level middlewares
app.use(express.static(join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

// Route to render the main page
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render('index', { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Route to render the edit page
app.get('/new', (req, res) => {
  res.render('modify', { heading: 'New Post', submit: 'Create Post' });
});

// Route to render the edit page pre-filled with data from selected post
app.get('/edit/:id', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render('modify', {
      heading: 'Edit Post',
      submit: 'Update Post',
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// Route to create a new post
app.post('/api/posts', async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts`, req.body);
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Route to partially update a post
app.post('/api/posts/:id', async (req, res) => {
  try {
    await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
});

// Route to delete a post
app.get('/api/posts/delete/:id', async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// App server
app.listen(port, () => {
  console.info(
    chalk.yellow(`Backend server is running on http://localhost:${port}...`),
  );
});
