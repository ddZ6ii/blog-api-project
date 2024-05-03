/**
 * API backend application.
 */

import express from 'express';
import 'dotenv/config';

const { API_SERVER_PORT } = process.env;
const app = express();
const port = parseInt(API_SERVER_PORT, 10) ?? 8000;

// Application-level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/posts', (req, res) => {
  res.send('Hello, World!');
});

// App server
app.listen(port, () => {
  console.info(`API is running at http://localhost:${port}...`);
});
