import { RequestHandler } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import chalk from 'chalk';
import { Filter, Post, PostContent, PostIdParam } from '@/types/post.type.ts';
import { CustomErrorContent } from '@/types/error.type.ts';

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'http://localhost';
const SERVER_API_PORT = parseInt(process.env.SERVER_API_PORT ?? '8000', 10);
const API_BASE_URL = `${SERVER_HOSTNAME}:${SERVER_API_PORT.toString()}`;
const OPTIONS: AxiosRequestConfig = {
  validateStatus: (status) => status < 500,
};

// !TO DO: implement error handling...
export const renderAllPosts: RequestHandler = async (_req, res) => {
  try {
    const response: AxiosResponse<Post[] | CustomErrorContent> =
      await axios.get(`${API_BASE_URL}/posts`, OPTIONS);
    if (response.status !== 200) {
      const errorContent = response.data as CustomErrorContent;
      console.error(chalk.red(JSON.stringify(errorContent, null, 2)));
      // !TO DO: render error page (view)...
      return;
    }
    const posts = response.data as Post[];
    res.render('index', { posts });
    return;
  } catch (error: unknown) {
    console.error(
      chalk.red(`Failed retieve posts:`, JSON.stringify(error, null, 2)),
    );
    // !TO DO: render error page (view)...
    return;
  }
};

// !TO DO: implement error handling...
export const renderFilteredPost: RequestHandler<
  unknown,
  unknown,
  Filter,
  unknown
> = async (req, res) => {
  try {
    const { search: searchText } = req.body;
    const response: AxiosResponse<Post[] | CustomErrorContent> =
      await axios.get(`${API_BASE_URL}/posts?filter=${searchText}`);
    if (response.status !== 200) {
      const errorContent = response.data as CustomErrorContent;
      console.error(chalk.red(JSON.stringify(errorContent, null, 2)));
      // !TO DO: render error page (view)...
      return;
    }
    const filteredPosts = response.data as Post[];
    res.render('index', { posts: filteredPosts, filter: searchText });
    return;
  } catch (error) {
    console.error(
      chalk.red(`Failed to search post:`, JSON.stringify(error, null, 2)),
    );
    // !TO DO: render error page (view)...
    return;
  }
};

export const renderEditPost: RequestHandler = (_req, res) => {
  res.render('modify', { heading: 'New Post', submit: 'Create Post' });
};

// !TO DO: implement error handling...
export const renderEditPostById: RequestHandler<
  PostIdParam,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const response = await axios.get(
      `${API_BASE_URL}/posts/${postId}`,
      OPTIONS,
    );
    if (response.status !== 200) {
      const errorContent = response.data as CustomErrorContent;
      console.error(chalk.red(JSON.stringify(errorContent, null, 2)));
      // !TO DO: render error page (view)...
      return;
    }
    const post = response.data as Post;
    res.render('modify', {
      heading: 'Edit Post',
      submit: 'Update Post',
      post,
    });
    return;
  } catch (error) {
    console.error(
      chalk.red(
        `Failed to retrieve post data:`,
        JSON.stringify(error, null, 2),
      ),
    );
    // !TO DO: render error page (view)...
    return;
  }
};

// !TO DO: implement error handling...
export const createPost: RequestHandler<
  unknown,
  unknown,
  PostContent,
  unknown
> = async (req, res) => {
  try {
    const postContent = req.body;
    const response = await axios.post(
      `${API_BASE_URL}/posts`,
      postContent,
      OPTIONS,
    );
    if (response.status !== 200) {
      const errorContent = response.data as CustomErrorContent;
      console.error(chalk.red(JSON.stringify(errorContent, null, 2)));
      // !TO DO: render error page (view)...
      return;
    }
    res.redirect('/');
    return;
  } catch (error) {
    console.error(
      chalk.red(`Failed to create post:`, JSON.stringify(error, null, 2)),
    );
    // !TO DO: render error page (view)...
    return;
  }
};

// !TO DO: implement error handling...
export const editPostById: RequestHandler<
  PostIdParam,
  unknown,
  Partial<PostContent>
> = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const postContent = req.body;
    const response = await axios.patch(
      `${API_BASE_URL}/posts/${postId}`,
      postContent,
      OPTIONS,
    );
    if (response.status !== 200) {
      const errorContent = response.data as CustomErrorContent;
      console.error(chalk.red(JSON.stringify(errorContent, null, 2)));
      // !TO DO: render error page (view)...
      return;
    }
    res.redirect('/');
    return;
  } catch (error) {
    console.error(
      chalk.red(`Failed to update post:`, JSON.stringify(error, null, 2)),
    );
    // !TO DO: render error page (view)...
    return;
  }
};

// !TO DO: implement error handling...
export const deletePostById: RequestHandler<
  PostIdParam,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const response = await axios.delete(
      `${API_BASE_URL}/posts/${postId}`,
      OPTIONS,
    );
    if (response.status !== 200) {
      const errorContent = response.data as CustomErrorContent;
      console.error(chalk.red(JSON.stringify(errorContent, null, 2)));
      // !TO DO: render error page (view)...
      return;
    }
    res.redirect('/');
    return;
  } catch (error) {
    console.error(
      chalk.red(`Failed to delete post:`, JSON.stringify(error, null, 2)),
    );
    // !TO DO: render error page (view)...
    return;
  }
};

// !TO DO: implement error handling...
export const resetPosts: RequestHandler = async (_req, res) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/reset`, OPTIONS);
    if (response.status !== 200) {
      const errorContent = response.data as CustomErrorContent;
      console.error(chalk.red(JSON.stringify(errorContent, null, 2)));
      // !TO DO: render error page (view)...
      return;
    }
    res.redirect('/');
    return;
  } catch (error) {
    console.error(
      chalk.red(`Failed to reset posts:`, JSON.stringify(error, null, 2)),
    );
    // !TO DO: render error page (view)...
    return;
  }
};

export const renderNotFound: RequestHandler = (_req, res) => {
  res.render('notFound');
};
