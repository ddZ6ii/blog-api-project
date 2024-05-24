import { Response, Request } from 'express';
import chalk from 'chalk';
import { blog } from '@store/blog.ts';
import { isEmpty } from '@utils/isEmpty.ts';
import { SeachQuery } from '@/ts/searchQuery.interface.ts';
import { Post, PostIdParam } from '@/ts/posts.interface.ts';

export const getAllPosts = (
  req: Request<unknown, unknown, unknown, SeachQuery>,
  res: Response,
) => {
  try {
    const { sort, filter: filterText } = req.query;
    const filteredPosts = blog.filterPosts(filterText);
    const sortedPost = blog.sortPostsByDate(filteredPosts, sort);
    return res.json(sortedPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red('Failed to retrieve posts!', error.message));
      return res.status(400).json({
        status: 'error',
        message: `Invalid search parameters! ${error.message}`,
        code: 400,
      });
    }
    return res
      .status(500)
      .json({ message: 'Ooops... An unexpected error has occured.' });
  }
};

export const getPostById = (req: Request<PostIdParam>, res: Response) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = blog.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with ID: ${postId.toString()}`,
        code: 404,
      });
    }
    return res.json(post);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red('Failed to retrieve post by ID!', error.message));
      return res.status(400).json({
        status: 'error',
        message: `Invalid request parameter: ${error.message}`,
        code: 400,
      });
    }
    return res
      .status(500)
      .json({ message: 'Ooops... An unexpected error has occured.' });
  }
};

export const addPost = async (
  req: Request<unknown, unknown, Post>,
  res: Response,
) => {
  try {
    if (isEmpty(req.body)) {
      return res.status(400).json({
        status: 'error',
        message: 'No post data provided',
        code: 400,
      });
    }
    const newPost = await blog.addPosts(req.body);
    return res.json(newPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red('Failed to create post!', error.message));
      return res.status(500).json({
        status: 'error',
        message: `Failed to create post! ${error.message}`,
        code: 500,
      });
    }
    return res
      .status(500)
      .json({ message: 'Ooops... An unexpected error has occured.' });
  }
};

export const updatePostById = async (
  req: Request<PostIdParam, unknown, Partial<Post>>,
  res: Response,
) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const postContent = req.body;
    const updatedPost = await blog.updatePostById(postContent, postId);
    if (!updatedPost) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId.toString()}`,
        code: 404,
      });
    }
    return res.json(updatedPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red('Failed to update post!', error.message));
      return res.status(400).json({
        status: 'error',
        message: `Invalid request! ${error.message}`,
        code: 400,
      });
    }
    return res
      .status(500)
      .json({ message: 'Ooops... An unexpected error has occured.' });
  }
};

export const deletePostById = async (
  req: Request<PostIdParam>,
  res: Response,
) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const deletedPostId = await blog.deletePostById(postId);
    if (!deletedPostId) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId.toString()}`,
        code: 404,
      });
    }
    return res.sendStatus(200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red('Failed to delete post!', error.message));
      return res.status(400).json({
        status: 'error',
        message: `Invalid request parameter! ${error.message}`,
        code: 400,
      });
    }
    return res
      .status(500)
      .json({ message: 'Ooops... An unexpected error has occured.' });
  }
};

export const resetPosts = async (_: Request, res: Response) => {
  try {
    const posts = await blog.resetPosts();
    return res.status(200).json(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red('Failed to reset posts!', error.message));
      return res.status(500).json({
        status: 'error',
        message: `Failed to reset posts! ${error.message}`,
        code: 400,
      });
    }
    return res
      .status(500)
      .json({ message: 'Ooops... An unexpected error has occured.' });
  }
};

export const handleInvalidRoutes = (_: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Invalid route`,
    code: 404,
  });
};
