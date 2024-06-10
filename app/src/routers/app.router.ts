import express from 'express';
import * as appController from '@controllers/appController.ts';

export const appRouter = express.Router();

// Render main page.
appRouter.get('/', appController.renderAllPosts);

// Render main page with filtered posts.
appRouter.post('/', appController.renderFilteredPost);

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

// Handle invalid URLs for all HTTP methods.
appRouter.all('*', appController.renderNotFound);
