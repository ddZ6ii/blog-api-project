import { toTimeStamp, toISOString } from './timestamps.js';
import isEmpty from './checkIsEmpty.js';
import shallowEqual from './shallowEqual.js';
import { readFromJSON } from './file.js';

export const INITIAL_POSTS = [
  {
    id: 1,
    title: 'The Rise of Decentralized Finance',
    content:
      'Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.',
    author: 'Alex Thompson',
    date: '2023-08-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'The Impact of Artificial Intelligence on Modern Businesses',
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: 'Mia Williams',
    date: '2023-08-05T14:30:00Z',
  },
  {
    id: 3,
    title: 'Sustainable Living: Tips for an Eco-Friendly Lifestyle',
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: 'Samuel Green',
    date: '2023-08-10T09:15:00Z',
  },
];

/**
 * Get posts from JSON file (if any) or load initial posts.
 * @returns {Promise<{ initialPosts: post[], nextId: number }>}
 */
export const initPosts = async () => {
  try {
    const jsonContent = await readFromJSON();
    const initialPosts = isEmpty(jsonContent) ? INITIAL_POSTS : jsonContent;
    const nextId = initialPosts.at(-1).id + 1;
    return { initialPosts, nextId };
  } catch (err) {
    console.error(
      'Failed to retrieve posts from file:',
      err.message,
      err.stack,
    );
    return { initialPosts: INITIAL_POSTS, nextId: INITIAL_POSTS.length + 1 };
  }
};

/**
 * Search blog posts (title, content, author) with matching filterText.
 * @param {post[]} posts
 * @param {string} filterText
 * @returns {post[] | []}
 */
export const filterPosts = (posts, filterText = '') => {
  const pattern = new RegExp(filterText.trim(), 'i');
  return posts
    .filter(({ title, content, author }) => {
      const hasMatch = [title, content, author].some((el) => pattern.test(el));
      return hasMatch;
    })
    .map((post) => ({ ...post }));
};

/**
 * Sort blog posts order by date (default is descending order).
 * @param {post[]} posts
 * @param {string} sort
 * @returns {post[] | undefined}
 */
export const sortPostsByDate = (posts, sort = 'DESC') => {
  if (posts == null) throw new Error('posts is required.');
  if (sort == null) throw new Error('sort cannot be null.');
  const formattedSort = sort.toString().trim().toUpperCase();
  const isDescendingOrder = formattedSort === 'DESC';
  const isAscendingOrder = formattedSort === 'ASC';
  if (!isDescendingOrder && !isAscendingOrder)
    throw new Error(
      'Invalid sort parameter: sorting order must be either "ASC" or "DESC".',
    );
  return posts.toSorted((post1, post2) =>
    isDescendingOrder
      ? toTimeStamp(post2.date) - toTimeStamp(post1.date)
      : toTimeStamp(post1.date) - toTimeStamp(post2.date),
  );
};

/**
 * Check whether posts contains the specified postId.
 * @param {number} postId
 * @returns {boolean | undefined}
 */
export const isValidPostId = (postId) => {
  if (postId == null) throw new Error('postId is required.');
  if (typeof postId !== 'number')
    throw new Error('Expected postId to be a number.');
  if (Number.isNaN(postId))
    throw new Error('postId must be a positive number.');
  return postId > 0;
};

/**
 * Find post by id and return the post in case of a match, otherwise returns an empty object.
 * @param {number} postId
 * @returns {post | {}}
 */
export const getPostById = (posts, postId) => {
  if (isEmpty(posts)) return {};
  if (!isValidPostId(postId)) return {};
  return posts.find((post) => post.id === postId);
};

/**
 * Create a new post from provided input parameters and add the id automatically.
 * @param {number} nextPostId
 * @param {{ title, author, content }} param
 * @returns {post}
 */
export const createPost = (
  nextPostId,
  { title = '', author = '', content = '' },
) => {
  if (!nextPostId) throw new Error('nextPostId is required.');
  if (typeof nextPostId !== 'number')
    throw new Error('nextPostId must be of type number');
  return {
    id: nextPostId,
    title: title.trim(),
    author: author.trim(),
    content: content.trim(),
    date: toISOString(),
  };
};

/**
 * Update selected post from provided postId and postContent.
 * Update only if postId is valid and new postContent,
 * @param {post[]} posts
 * @param {number} postId
[ * @param {object} postContent
] * @returns {post | {}}
 */
export const updatePostById = (
  posts,
  postId,
  { title = '', author = '', content = '' },
) => {
  if (!isValidPostId(postId)) return {};

  const post = getPostById(posts, postId);
  if (isEmpty(post)) return {};

  const currentContent = {
    title: post.title,
    author: post.author,
    content: post.content,
  };
  const updatedContent = {
    title: title.trim() || post.title,
    author: author.trim() || post.author,
    content: content.trim() || post.content,
  };
  const hasUpdatedContent = !shallowEqual(currentContent, updatedContent);
  const updatedPost = hasUpdatedContent
    ? { ...post, ...updatedContent, date: toISOString() }
    : { ...post };
  return { updatedPost, hasUpdatedContent };
};

/**
 * Delete selected post from provided postId.
 * Returns a (deep) filtered copy of the initial posts.
 * @param {post[]} posts
 * @param {number} postId
 * @returns {post[] | []}
 */
export const deletePostById = (posts, postId) => {
  if (isEmpty(posts)) return [];
  if (!isValidPostId(postId)) return [];

  const matchingPost = getPostById(posts, postId);
  if (isEmpty(matchingPost)) return [];

  return posts
    .filter((post) => post.id !== postId)
    .map((post) => ({ ...post }));
};
