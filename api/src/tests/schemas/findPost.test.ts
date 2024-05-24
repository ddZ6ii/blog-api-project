import { describe, expect, it } from 'vitest';
import { FindPostSchema } from '@/types/findPost.schema.ts';

describe('FindPostSchema', () => {
  it('should fail if no provided params', () => {
    const params = {};
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it('should fail if ID cannot be coerced to number', () => {
    const params = { id: 'NaN' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it('should fail if coerced ID is not an integer', () => {
    const params = { id: '4.5' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it('should fail if coerced ID exceeds', () => {
    const params = { id: '9007199254740992' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it('should fail if coerced ID is not strictly positive', () => {
    const params = { id: '0' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it('should pass if coerced ID is a strictly positive integer', () => {
    const params = { id: '2' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(true);
  });
});
