import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import blog from '@store/blog.js';

const updatedPostContent = {
  title: 'New Title',
  content: 'New Content',
  author: 'Mia Williams',
};

describe('Partially updated post content by ID', () => {
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

  it('should throw an error if missing ID', async () => {
    await expect(
      blog.updatePostById(updatedPostContent, null),
    ).rejects.toThrowError('required');
  });

  it('should throw an error if missing newPost', async () => {
    await expect(blog.updatePostById(null, 2)).rejects.toThrowError(
      'No post provided',
    );
  });

  it('should throw an error if ID is not of type number', async () => {
    await expect(() =>
      blog.updatePostById(updatedPostContent, '2'),
    ).rejects.toThrowError('number');
  });

  it('should return an empty object if no corresponding post', async () => {
    await expect(
      blog.updatePostById(updatedPostContent, 9999),
    ).resolves.toEqual({});
  });

  it('should return the updated object', async () => {
    const updatedPost = await blog.updatePostById(updatedPostContent, 2);
    expect(updatedPost).toMatchObject(updatedPostContent);
  });
});
