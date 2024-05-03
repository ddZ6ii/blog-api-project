import { toTimeStamp } from './timestamps.js';

/**
 * Sort posts order by date.
 * @param {string} order
 * @param {post[]} posts
 * @returns {post[]}
 */
export function sortPostsByDate(order, posts) {
  if (arguments.length === 1 && typeof arguments[0] !== 'string')
    throw new Error('Order input is missing.');

  if (arguments.length === 2 && typeof arguments[0] !== 'string')
    throw new Error('Order input must be of type string.');

  if (
    arguments.length === 2 &&
    typeof arguments[0] === 'string' &&
    arguments[0].toUpperCase() !== 'DESC' &&
    arguments[0].toUpperCase() !== 'ASC'
  )
    throw new Error('order must either be DESC or ASC.');

  if (order.toUpperCase() === 'DESC') {
    return posts.toSorted(
      (post1, post2) => toTimeStamp(post2.date) - toTimeStamp(post1.date),
    );
  }
  return posts.toSorted(
    (post1, post2) => toTimeStamp(post1.date) - toTimeStamp(post2.date),
  );
}

/**
 * Check whether `sort` request parameter is valid: must be equal to either 'ASC' of 'DESC'.
 * @param {string} sortParam
 * @returns {boolean}
 */
export const checkSortParamValidity = (sortParam) => {
  return (
    sortParam &&
    (sortParam.toLowerCase() === 'asc' || sortParam.toLowerCase() === 'desc')
  );
};
