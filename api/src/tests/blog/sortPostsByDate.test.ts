import { beforeAll, describe, expect, it } from 'vitest';
import { blog } from '@store/blog.ts';
import { readFromJSON } from '@/utils/fileIO.ts';
import { Post } from '@/ts/posts.interface.ts';

describe('Sort posts by date', () => {
  let posts: Post[];

  // Reset posts prior to testing and read posts.
  beforeAll(async () => {
    try {
      await blog.resetPosts();
      const jsonContent = await readFromJSON();
      posts = structuredClone(jsonContent);
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  });

  it('should throw an error if sort is neither ASC nor DESC', () => {
    expect(() => blog.sortPostsByDate(posts, 'foo')).toThrowError(
      'order must be either "ASC" or "DESC"',
    );
  });

  it('should return the most recent post first whne sorting by DESC', () => {
    expect(blog.sortPostsByDate(posts, 'desc')[0]).toEqual(posts.at(-1));
  });

  it('should return the least recent post first when sorting by ASC', () => {
    expect(blog.sortPostsByDate(posts, 'asc')[0]).toEqual(posts[0]);
  });
});
