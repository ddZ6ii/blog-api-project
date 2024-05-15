import express from 'express';
import * as apiController from '@controllers/apiController.js';

const apiRouter = express.Router();

// Retrieve all blog posts or posts matching search filter.
apiRouter.get('/posts', apiController.getAllPosts);

// Retrieve blog post specified by ID.
apiRouter.get('/posts/:id', apiController.getPostById);

// Create a new blog post (write to JSON file).
apiRouter.post('/posts', apiController.addPost);

// Partially update (patch) blog post content specidied by ID (write to JSON file).
apiRouter.patch('/posts/:id', apiController.updatePostById);

// Delete blog post specified by ID (write to JSON file).
apiRouter.delete('/posts/:id', apiController.deletePostById);

// Reset all blog posts to initial posts (write to JSON file).
apiRouter.post('/posts/reset', apiController.resetPosts);

// Handle invalid routes.
apiRouter.get('*', apiController.handleInvalidRoutes);

export default apiRouter;
