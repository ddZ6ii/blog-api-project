import toTimeStamp from './timestamps.js';
import isEmpty from './checkIsEmpty.js';

/**
 * Sort posts order by date.
 * @param {string} order
 * @param {post[]} posts
 * @returns {post[]}
 */
export const sortPostsByDate = (...args) => {
  if (args.length === 1 && typeof args[0] !== 'string') throw new Error('Order input is missing.');

  if (args.length === 2 && typeof args[0] !== 'string') throw new Error('Order input must be of type string.');

  if (
    args.length === 2
    && typeof args[0] === 'string'
    && args[0].toUpperCase() !== 'DESC'
    && args[0].toUpperCase() !== 'ASC'
  ) throw new Error('order must either be DESC or ASC.');

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
export const checkSortParamValidity = (sortParam) => sortParam
  && (sortParam.toLowerCase() === 'asc' || sortParam.toLowerCase() === 'desc');

export const checkIdValidity = (posts, postId) => {
  if (isEmpty(posts) || isEmpty(postId)) throw new Error('Arguments are required.');
  if (typeof postId !== 'number') throw new Error('postId must be of type number');
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
