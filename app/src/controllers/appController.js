import axios from 'axios';

const API_URL = `${import.meta.env.DEV ? 'http://localhost' : process.env.SERVER_BASE_URL}:${parseInt(process.env.SERVER_API_PORT ?? 8000, 10)}`;

export const renderAllPosts = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render('index', { posts: response.data });
  } catch (error) {
    console.error(`Failed to load main page:`, error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const renderFilteredPosts = async (req, res) => {
  try {
    const { search: filterText } = req.body;
    const response = await axios.get(`${API_URL}/posts?filter=${filterText}`);
    res.render('index', { posts: response.data, filter: filterText });
  } catch (error) {
    console.error(`Failed to search post:`, error);
    res.status(500).json({ message: 'Error searching posts' });
  }
};

export const renderEditPost = async (req, res) => {
  res.render('modify', { heading: 'New Post', submit: 'Create Post' });
};

export const renderEditPostById = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render('modify', {
      heading: 'Edit Post',
      submit: 'Update Post',
      post: response.data,
    });
  } catch (error) {
    console.error(`Failed to load Edit page:`, error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

export const createPost = async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts`, req.body);
    res.redirect('/');
  } catch (error) {
    console.error(`Failed to create new post:`, error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const editPostById = async (req, res) => {
  try {
    await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
    res.redirect('/');
  } catch (error) {
    console.error(`Failed to update post:`, error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

export const deletePostById = async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect('/');
  } catch (error) {
    console.error(`Failed to delete post:`, error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

export const resetPosts = async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts/reset`);
    res.redirect('/');
  } catch (error) {
    console.error(`Failed to reset posts:`, error);
    res.status(500).json({ message: 'Error reseting posts' });
  }
};

export const renderNotFound = (req, res) => {
  res.render('notFound');
};
