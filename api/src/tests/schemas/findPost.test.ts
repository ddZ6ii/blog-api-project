import { describe, expect, it } from 'vitest';
import { FindPostSchema } from '@/types/findPost.schema.ts';

describe('FindPostSchema', () => {
  it('should fail if no provided params', () => {
    const params = {};
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it("should fail if 'id' cannot be coerced to number", () => {
    const params = { id: 'NaN' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it("should fail if coerced 'id' is not an integer", () => {
    const params = { id: '4.5' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it("should fail if coerced 'id' exceeds", () => {
    const params = { id: '9007199254740992' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it("should fail if coerced 'id' is not strictly positive", () => {
    const params = { id: '0' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(false);
  });

  it("should pass if coerced 'id' is a strictly positive integer", () => {
    const params = { id: '2' };
    expect(FindPostSchema.safeParse({ params }).success).toBe(true);
  });
});
