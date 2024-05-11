import { describe, expect, it } from 'vitest';
import { blog } from '@store/blog.js';

describe('Filter posts', () => {
  it('should return all posts if missing filterText', () => {
    expect(blog.filterPosts()).toEqual(blog.posts);
  });

  it('should return an empty array if no match', () => {
    expect(blog.filterPosts('foobar')).toEqual([]);
  });

  it('should return posts matching the search filter', () => {
    expect(blog.filterPosts('alex')).toEqual([blog.posts[0]]);
  });
});
