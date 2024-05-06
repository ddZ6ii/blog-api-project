import { describe, expect, it } from 'vitest';
import { sortPostsByDate , INITIAL_POSTS as POSTS } from '../utils/posts';

describe('sortPostsByDate', () => {
  it('should throw an error if order is null', () => {
    expect(() => sortPostsByDate(POSTS, null)).toThrowError('null');
  });

  it('should throw an error if posts is null or undefined', () => {
    expect(() => sortPostsByDate(undefined, null)).toThrowError('required');
  });

  it('should return undefined if order is missing', () => {
    expect(sortPostsByDate([])).toEqual([]);
  });

  it('should throw an error if order is not either ASC or DESC', () => {
    expect(() => sortPostsByDate(POSTS, 'foo')).toThrowError(
      'order must be either "ASC" or "DESC"',
    );
  });

  it('should return the most recent post first', () => {
    expect(sortPostsByDate(POSTS, 'desc')[0]).toBe(POSTS[2]);
  });

  it('should return the least recent post first', () => {
    expect(sortPostsByDate(POSTS, 'asc')[0]).toBe(POSTS[0]);
  });
});
