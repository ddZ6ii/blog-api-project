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

// Main page
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render('index', { title: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// App server
app.listen(port, () => {
  console.info(
    chalk.yellow(`Backend server is running on http://localhost:${port}...`),
  );
});
