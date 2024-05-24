import { beforeAll, describe, expect, it } from 'vitest';
import { blog } from '@store/blog.ts';
import { readFromJSON } from '@/utils/fileIO.ts';
import { Post } from '@/ts/posts.type.ts';

describe('Filter posts', () => {
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

  it('should return all posts if missing filterText', () => {
    expect(blog.filterPosts()).toEqual(posts);
  });

  it('should return an empty array if no match', () => {
    expect(blog.filterPosts('foobar')).toEqual([]);
  });

  it('should return posts matching the search filter', () => {
    expect(blog.filterPosts('alex')).toEqual([posts[0]]);
  });
});
