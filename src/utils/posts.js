import { toTimeStamp, toISOString } from './timestamps.js';
import isEmpty from './checkIsEmpty.js';
import shallowEqual from './shallowEqual.js';

/**
 * Sort posts order by date.
 * @param {string} order
 * @param {post[]} posts
 * @returns {post[]}
 */
export const sortPostsByDate = (...args) => {
  if (args.length === 1 && typeof args[0] !== 'string')
    throw new Error('Order input is missing.');

  if (args.length === 2 && typeof args[0] !== 'string')
    throw new Error('Order input must be of type string.');

  if (
    args.length === 2 &&
    typeof args[0] === 'string' &&
    args[0].toUpperCase() !== 'DESC' &&
    args[0].toUpperCase() !== 'ASC'
  )
    throw new Error('order must either be DESC or ASC.');

  if (args[0].toUpperCase() === 'DESC') {
    return args[1].toSorted(
      (post1, post2) => toTimeStamp(post2.date) - toTimeStamp(post1.date),
    );
  }
  return args[1].toSorted(
    (post1, post2) => toTimeStamp(post1.date) - toTimeStamp(post2.date),
  );
};

/**
 * Check whether `sort` request parameter is valid: must be equal to either 'ASC' of 'DESC'.
 * @param {string} sortParam
 * @returns {boolean}
 */
export const checkSortParamValidity = (sortParam) =>
  sortParam &&
  (sortParam.toLowerCase() === 'asc' || sortParam.toLowerCase() === 'desc');

/**
 * Check whether `posts` contains the specified `postId`.
 * @param {post[]} posts
 * @param {number} postId
 * @returns {boolean}
 */
export const checkIdValidity = (posts, postId) => {
  if (isEmpty(posts) || isEmpty(postId))
    throw new Error('Arguments are required.');
  if (typeof postId !== 'number')
    throw new Error('postId must be of type number');
  return posts.some((post) => post.id === postId);
};

/**
 * Find post by id and return the post in case of a match, otherwise returns an empty object.
 * @param {post[]} posts
 * @param {number} postId
 * @returns {post | {}}
 */
export const getPostById = (posts, postId) => {
  const validPostId = checkIdValidity(posts, postId);
  if (!validPostId) return {};
  return posts.find((post) => post.id === postId);
};

/**
 * Create a new post from provided input parameters and add the id automatically.
 * @param {number} nextPostId
 * @param {{ title, author, content }} param1
 * @returns {post}
 */
export const createPost = (
  nextPostId,
  { title = 'New Post', author = 'John Doe', content = '' },
) => {
  if (!nextPostId) throw new Error('nextPostId is required');
  if (typeof nextPostId !== 'number')
    throw new Error('nextPostId must be of type number');
  if (title == null && author == null && content == null)
    throw new Error('post info are missing');
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
] * @returns  {post}
 */
export const updatePostById = (posts, postId, { title, author, content }) => {
  const validPostId = checkIdValidity(posts, postId);
  if (!validPostId) return {};
  const currentPost = posts.find((post) => post.id === postId);
  const postContent = {
    title: title?.trim() ?? currentPost.title,
    author: author?.trim() ?? currentPost.author,
    content: content?.trim() ?? currentPost.content,
  };
  const isSamePostContent = shallowEqual(
    {
      title: currentPost.title,
      author: currentPost.author,
      content: currentPost.content,
    },
    postContent,
  );
  if (isSamePostContent) return { ...currentPost };
  return {
    ...currentPost,
    ...postContent,
    date: toISOString(),
  };
};

/**
 * Delete selected post from provided postId.
 * Returns a (deep) filtered copy of the initial posts.
 * @param {post[]} posts
 * @param {number} postId
 * @returns {post[]}
 */
export const deletePostById = (posts, postId) => posts.filter((post) => ({ ...post }).id !== postId);
