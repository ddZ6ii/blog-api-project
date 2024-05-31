import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { blog } from '@store/blog.ts';
import { PostContent } from '@/types/post.type.ts';

const updatedPostContent: Partial<PostContent> = {
  title: 'New Title',
  content: 'New Content',
  author: 'Mia Williams',
};

describe("Partially updated post content by 'id'", () => {
  // Reset posts prior to testing.
  beforeEach(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  });

  // Reset posts after testing.
  afterEach(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  });

  it('should return undefined if no corresponding post', async () => {
    await expect(
      blog.updatePostById(updatedPostContent, 9999),
    ).resolves.toBeUndefined();
  });

  it('should return the updated object', async () => {
    const updatedPost = await blog.updatePostById(updatedPostContent, 2);
    expect(updatedPost).toMatchObject(updatedPostContent);
  });
});
