import express from 'express';
import axios from 'axios';
import * as appController from '../controllers/appController.js';

const { API_SERVER_PORT } = process.env;
const API_URL = `http://localhost:${parseInt(API_SERVER_PORT, 10) ?? 8000}`;
const appRouter = express.Router();

// Render main page.
appRouter.get('/', appController.renderAllPosts);

// Render main page with filtered posts.
appRouter.post('/', appController.renderFilteredPosts);

// Render add/edit page.
appRouter.get('/new', appController.renderEditPost);

// Render edit page pre-filled post content specified by ID.
appRouter.get('/edit/:id', appController.renderEditPostById);

// Create a new post with content submitted from UI form.
appRouter.post('/api/posts', appController.createPost);

// Partially update blog post specified by ID with content submitted from UI form.
appRouter.post('/api/posts/:id', appController.editPostById);

// Delete blog post specified by ID.
appRouter.get('/api/posts/delete/:id', appController.deletePostById);

// Reset all blog posts from UI button (only visible when all posts are deleted).
appRouter.get('/api/posts/reset', appController.resetPosts);

// Handle invalid URLs.
appRouter.get('*', appController.renderNotFound);

export default appRouter;
