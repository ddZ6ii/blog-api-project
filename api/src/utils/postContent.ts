import { PostContent } from '@/ts/posts.type.ts';

const CONTENT_ITEMS = ['title', 'content', 'author'];

/**
 * Extract content only (title, content, author) from post.
 * @param {Partial<Post>} post
 * @returns {Partial<PostContent>}
 */
export const extractPostContent = (
  post: Partial<PostContent>,
): Partial<PostContent> => {
  return Object.entries(post).reduce(
    (acc, [key, value]) =>
      CONTENT_ITEMS.includes(key.toLowerCase())
        ? { ...acc, [key]: value }
        : acc,
    {},
  );
};

/**
 * Format post content by removing starting and ending whitespaces (if any).
 * @param {Partial<PostContent>} post
 * @returns {Partial<PostContent>}
 */
export const formatPostContent = (
  post: Partial<PostContent>,
): Partial<PostContent> => {
  return Object.entries(post).reduce(
    (acc, [key, value]) =>
      typeof value === 'string' ? { ...acc, [key]: value.trim() } : acc,
    {},
  );
};
