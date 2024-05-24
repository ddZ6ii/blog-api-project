/**
 * Check whether posts contains the specified postId.
 * @param {unknown} postId
 * @returns {boolean}
 */
export const isValidPostId = (postId: unknown): boolean => {
  if (postId == null) throw new Error('postId is required.');
  if (typeof postId !== 'number')
    throw new Error('Expected postId to be of type number.');
  if (Number.isNaN(postId))
    throw new Error('Expected postId to be a positive number.');
  return postId > 0;
};
