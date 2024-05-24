import express from 'express';
import * as apiController from '@controllers/apiController.ts';
import { validate } from '@/middlewares/validate.middleware.ts';
import { SearchPostsSchema } from '@/types/searchPost.schema.ts';
import { FindPostSchema } from '@/types/findPost.schema.ts';
import { UpdatePostSchema } from '@/types/updatePost.schema.ts';
import { CreatePostStrictSchema } from '@/types/createPost.schema.ts';

export const apiRouter = express.Router();

// Retrieve all blog posts or posts matching search filter (if any) sorted by date (default DESC).
apiRouter.get('/posts', validate(SearchPostsSchema), apiController.getAllPosts);

// Retrieve blog post specified by ID.
apiRouter.get(
  '/posts/:id',
  validate(FindPostSchema),
  apiController.getPostById,
);

// Create new blog post.
apiRouter.post(
  '/posts',
  validate(CreatePostStrictSchema),
  apiController.createPost,
);

// Partially update (patch) blog post content specified by ID.
apiRouter.patch(
  '/posts/:id',
  validate(UpdatePostSchema),
  apiController.updatePostById,
);

// Delete blog post specified by ID (write to JSON file).
apiRouter.delete(
  '/posts/:id',
  validate(FindPostSchema),
  apiController.deletePostById,
);

// Reset all blog posts to initial posts.
apiRouter.post('/posts/reset', apiController.resetPosts);

// Handle invalid routes for all HTTP methods.
apiRouter.all('*', apiController.handleInvalidRoutes);
