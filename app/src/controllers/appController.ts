import { RequestHandler } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { Filter, Post, PostContent, PostIdParam } from '@/types/post.type.ts';
import { isErrorResponse } from '@utils/typeGuards.ts';
import { AxiosCustom } from '@/types/axios.type.ts';

const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost';
const API_PORT = parseInt(process.env.API_PORT ?? '3000', 10);
const API_URL = `${SERVER_URL}:${API_PORT.toString()}`;
const OPTIONS: AxiosRequestConfig = {
  validateStatus: (status) => status < 500,
};

export const renderAllPosts: RequestHandler = async (_req, res, next) => {
  const response: AxiosCustom<Post[]> = await axios.get(
    `${API_URL}/posts`,
    OPTIONS,
  );

  isErrorResponse(response)
    ? next(response.data)
    : res.render('index', { posts: response.data });
};

export const renderFilteredPost: RequestHandler<
  unknown,
  unknown,
  Filter,
  unknown
> = async (req, res, next) => {
  const { search: searchText } = req.body;

  const response: AxiosCustom<Post[]> = await axios.get(
    `${API_URL}/posts?filter=${searchText}`,
  );

  isErrorResponse(response)
    ? next(response.data)
    : res.render('index', { posts: response.data, filter: searchText });
};

export const renderEditPost: RequestHandler = (_req, res) => {
  res.render('modify', { heading: 'New Post', submit: 'Create Post' });
};

export const renderEditPostById: RequestHandler<
  PostIdParam,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id: postId } = req.params;

  const response: AxiosCustom<Post> = await axios.get(
    `${API_URL}/posts/${postId}`,
    OPTIONS,
  );

  isErrorResponse(response)
    ? next(response.data)
    : res.render('modify', {
        heading: 'Edit Post',
        submit: 'Update Post',
        post: response.data,
      });
};

export const createPost: RequestHandler<
  unknown,
  unknown,
  PostContent,
  unknown
> = async (req, res, next) => {
  const postContent = req.body;

  const response: AxiosCustom<Post> = await axios.post(
    `${API_URL}/posts`,
    postContent,
    OPTIONS,
  );

  isErrorResponse(response) ? next(response.data) : res.redirect('/');
};

export const editPostById: RequestHandler<
  PostIdParam,
  unknown,
  Partial<PostContent>
> = async (req, res, next) => {
  const { id: postId } = req.params;
  const postContent = req.body;

  const response: AxiosCustom<Post> = await axios.patch(
    `${API_URL}/posts/${postId}`,
    postContent,
    OPTIONS,
  );

  isErrorResponse(response) ? next(response.data) : res.redirect('/');
};

export const deletePostById: RequestHandler<
  PostIdParam,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id: postId } = req.params;

  const response: AxiosCustom<unknown> = await axios.delete(
    `${API_URL}/posts/${postId}`,
    OPTIONS,
  );

  isErrorResponse(response) ? next(response.data) : res.redirect('/');
};

export const resetPosts: RequestHandler = async (_req, res, next) => {
  const response: AxiosCustom<Post[]> = await axios.post(
    `${API_URL}/posts/reset`,
    OPTIONS,
  );

  isErrorResponse(response) ? next(response.data) : res.redirect('/');
};

export const renderNotFound: RequestHandler = (_req, res) => {
  res.render('notFound');
};
