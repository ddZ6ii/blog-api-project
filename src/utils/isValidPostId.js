/**
 * Check whether posts contains the specified postId.
 * @param {number} postId
 * @returns {boolean}
 */
const isValidPostId = (postId) => {
  if (postId == null) throw new Error('postId is required.');
  if (typeof postId !== 'number')
    throw new Error('Expected postId to be of type number.');
  if (Number.isNaN(postId))
    throw new Error('Expected postId to be a positive number.');
  return postId > 0;
};

export default isValidPostId;
