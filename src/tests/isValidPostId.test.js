import { describe, expect, it } from 'vitest';
import { isValidPostId } from '../utils/posts';

describe('isValidPostId', () => {
  it('should return false if missing postId', () => {
    expect(() => isValidPostId()).toThrowError('required');
  });

  it('should throw an error if postId is not of type number', () => {
    expect(() => isValidPostId('sdsd')).toThrowError('number');
  });

  it('should throw an error if postId cannot be converted to type number', () => {
    expect(() => isValidPostId(parseInt('sdsd', 10))).toThrowError('number');
  });

  it('should return false if postId is a negative integer', () => {
    expect(isValidPostId(-3)).toBe(false);
  });

  it('should return true if postId is a positive integer', () => {
    expect(isValidPostId(1)).toBe(true);
  });
});
