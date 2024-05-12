import { describe, expect, it } from 'vitest';
import { blog } from '../../store/blog.js';

describe('Sort posts by date', () => {
  it('should throw an error if sort is null', () => {
    expect(() => blog.sortPostsByDate(blog.posts, null)).toThrowError('null');
  });

  it('should throw an error if posts is null', () => {
    expect(() => blog.sortPostsByDate(null, 'desc')).toThrowError('required');
  });

  it('should throw an error if sort is neither ASC nor DESC', () => {
    expect(() => blog.sortPostsByDate(blog.posts, 'foo')).toThrowError(
      'order must be either "ASC" or "DESC"',
    );
  });

  it('should return the most recent post first whne sorting by DESC', () => {
    expect(blog.sortPostsByDate(blog.posts, 'desc')[0]).toEqual(
      blog.posts.at(-1),
    );
  });

  it('should return the least recent post first when sorting by ASC', () => {
    expect(blog.sortPostsByDate(blog.posts, 'asc')[0]).toEqual(blog.posts[0]);
  });
});
