import { describe, expect, it } from 'vitest';
import isEmpty from '@utils/isEmpty.js';

describe('isEmpty', () => {
  it('should return true for null input', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('should return true for undefined input', () => {
    expect(isEmpty()).toBe(true);
  });

  it('should return true for NaN input', () => {
    expect(isEmpty(NaN)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false when providing a number', () => {
    expect(isEmpty(2)).toBe(false);
  });

  it('should return false when providing a non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('should return false when providing a non-empty array', () => {
    expect(isEmpty([1])).toBe(false);
  });

  it('should return false when providing a non-empty object', () => {
    expect(isEmpty({ id: 1, title: 'Title' })).toBe(false);
  });
});
