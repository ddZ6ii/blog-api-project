import { blog } from '../store/blog.js';
import isEmpty from '../utils/isEmpty.js';

export const getAllPosts = (req, res) => {
  try {
    const { sort, filter: filterText } = req.query;
    const filteredPosts = blog.filterPosts(filterText);
    const sortedPost = blog.sortPostsByDate(filteredPosts, sort);
    return res.json(sortedPost);
  } catch (error) {
    console.error('Failed to retrieve posts!', error);
    return res.status(400).json({
      status: 'error',
      message: `Invalid search parameters: ${error}`,
      code: 400,
    });
  }
};

export const getPostById = (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = blog.getPostById(postId);
    if (isEmpty(post)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with ID: ${postId}`,
        code: 404,
      });
    }
    return res.json(post);
  } catch (error) {
    console.error('Failed to retrieve post by ID!', error);
    return res.status(400).json({
      status: 'error',
      message: `Invalid request parameter: ${error}`,
      code: 400,
    });
  }
};

export const addPost = async (req, res) => {
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
  } catch (error) {
    console.error('Failed to create post!', error);
    return res.status(500).json({
      status: 'error',
      message: `Failed to create post: ${error}`,
      code: 500,
    });
  }
};

export const updatePostById = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const updatedPost = await blog.updatePostById(req.body, postId);
    if (isEmpty(updatedPost)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId}`,
        code: 404,
      });
    }
    return res.json(updatedPost);
  } catch (error) {
    console.error('Failed to update post!', error);
    return res.status(400).json({
      status: 'error',
      message: `Invalid request: ${error}`,
      code: 400,
    });
  }
};

export const deletePostById = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const deletedPostId = await blog.deletePostById(postId);
    if (isEmpty(deletedPostId)) {
      return res.status(404).json({
        status: 'error',
        message: `No existing post with id: ${postId}`,
        code: 404,
      });
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error('Failed to delete post!', error);
    return res.status(400).json({
      status: 'error',
      message: `Invalid request parameter: ${error}`,
      code: 400,
    });
  }
};

export const resetPosts = async (req, res) => {
  try {
    await blog.resetPosts();
    return res.sendStatus(205);
  } catch (error) {
    console.error('Failed to reset posts!', error);
    return res.status(500).json({
      status: 'error',
      message: `Failed to reset posts: ${error}`,
      code: 500,
    });
  }
};

export const handleInvalidRoutes = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Invalid route`,
    code: 404,
  });
};
