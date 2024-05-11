const CONTENT_ITEMS = ['title', 'content', 'author'];

/**
 * Extract content (title, content, author) from post.
 * @param {post} post
 * @returns {postContent}
 */
export const extractPostContent = (post) =>
  Object.entries(post).reduce(
    (acc, [key, value]) =>
      CONTENT_ITEMS.includes(key.toLowerCase())
        ? { ...acc, [key]: value }
        : acc,
    {},
  );

/**
 * Format post content by removing starting and ending whitespaces (if any).
 * @param {post} post
 * @returns {post}
 */
export const formatPostContent = (post) =>
  Object.entries(post).reduce(
    (acc, [key, value]) =>
      typeof value === 'string' ? { ...acc, [key]: value.trim() } : acc,
    {},
  );
