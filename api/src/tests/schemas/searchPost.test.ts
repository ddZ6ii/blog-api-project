import { describe, expect, it } from 'vitest';
import { SearchPostsSchema } from '@/types/searchPost.schema.ts';
import { SortSchema } from '@/types/post.schema.ts';

describe('SearchPostsSchema', () => {
  it('should fail if invalid sort', () => {
    const query = {
      sort: 'invalid',
    };
    expect(SearchPostsSchema.safeParse({ query }).success).toBe(false);
  });

  it('should fail if invalid query param', () => {
    const query = {
      any: 'unexpected',
    };
    expect(SearchPostsSchema.safeParse({ query }).success).toBe(false);
  });

  it('should pass if query is empty', () => {
    const query = {};
    expect(SearchPostsSchema.safeParse({ query }).success).toBe(true);
  });

  it('should pass if valid search filter and missing sort', () => {
    const query = {
      filter: 'thompson',
    };
    expect(SearchPostsSchema.safeParse({ query }).success).toBe(true);
  });

  it('should pass if missing search filter and valid sort', () => {
    const query = {
      sort: SortSchema.enum.ASC,
    };
    expect(SearchPostsSchema.safeParse({ query }).success).toBe(true);
  });

  it('should pass if valid sort with case insensitive', () => {
    const query = {
      sort: SortSchema.enum.ASC.toLowerCase(),
    };
    expect(SearchPostsSchema.safeParse({ query }).success).toBe(true);
  });
});
