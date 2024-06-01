import { RequestHandler } from 'express';
import { blog } from '@store/blog.ts';
import { Post, PostContent, PostIdParam, Search } from '@/types/post.type.ts';
import { FindPostSchema } from '@/types/findPost.schema.ts';
import { UpdatePostSchema } from '@/types/updatePost.schema.ts';
import { SearchPostsSchema } from '@/types/searchPost.schema.ts';
import { CreatePostStrictSchema } from '@/types/createPost.schema.ts';
import { NotFoundError } from '@/types/NotFoundError.class.ts';
import { ServerError } from '@/types/ServerError.class.ts';
import { isEmpty } from '@/utils/isEmpty.ts';

export const getAllPosts: RequestHandler<unknown, Post[], unknown, Search> = (
  req,
  res,
) => {
  // Use Zod parse to format 'sort' query param(uppercase, if any).
  const { filter: validatedFilter, sort: validatedSort } =
    SearchPostsSchema.parse(req).query;
  const filteredPosts = blog.filterPosts(validatedFilter);
  const sortedPost = blog.sortPostsByDate(filteredPosts, validatedSort);
  res.json(sortedPost);
};

export const getPostById: RequestHandler<
  PostIdParam,
  unknown,
  Post,
  unknown
> = (req, res) => {
  // Use Zod parse to format id param (string -> number).
  const { id: validatedPostId } = FindPostSchema.parse(req).params;
  const post = blog.getPostById(validatedPostId);
  if (!post) {
    throw new NotFoundError(
      `No existing post with 'id' ${validatedPostId.toString()}.`,
    );
  }
  res.json(post);
};

export const createPost: RequestHandler<
  unknown,
  Post,
  PostContent,
  unknown
> = async (req, res, next) => {
  // Use Zod parse to format post content (trim whitespaces and capitalize author's name).
  const validatedPostContent = CreatePostStrictSchema.parse(req).body;
  const createdPost = await blog.addPost(validatedPostContent);
  if (isEmpty(createdPost)) {
    /**
     * Use the 'next' middleware function to forward asynchronous error.
     * The 'next' function typically does not take in an argument but simply gets invoked to move the request to the next middleware in the stack. When given an input, it signals to the Express server that it should skip everything and go straight to the error handler.
     */
    next(new ServerError('Failed to create post!'));
    return;
  }
  res.json(createdPost);
};

export const updatePostById: RequestHandler<
  PostIdParam,
  Post,
  Partial<Post>,
  unknown
> = async (req, res, next) => {
  // Use Zod parse to format id param (string -> number).
  const { id: validatedPostId } = UpdatePostSchema.parse(req).params;
  const validatedPostContent = UpdatePostSchema.parse(req).body;
  const updatedPost = await blog.updatePostById(
    validatedPostContent,
    validatedPostId,
  );

  if (!updatedPost) {
    next(
      new NotFoundError(
        `No existing post with 'id' ${validatedPostId.toString()}.`,
      ),
    );
    return;
  }
  res.json(updatedPost);
};

export const deletePostById: RequestHandler<
  PostIdParam,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  // Use Zod parse to format id param (string -> number).
  const { id: validatedPostId } = FindPostSchema.parse(req).params;
  const deletedPostId = await blog.deletePostById(validatedPostId);
  if (!deletedPostId) {
    next(
      new NotFoundError(
        `No existing post with 'id' ${validatedPostId.toString()}.`,
      ),
    );
    return;
  }
  res.sendStatus(200);
};

export const resetPosts: RequestHandler = async (_req, res, next) => {
  try {
    const posts = await blog.resetPosts();
    res.status(200).json(posts);
  } catch (error: unknown) {
    next(new ServerError('Failed to reset posts.'));
  }
};

export const handleInvalidRoutes: RequestHandler = () => {
  throw new NotFoundError('Invalid route.');
};
