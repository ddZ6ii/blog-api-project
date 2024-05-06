import { describe, expect, it } from 'vitest';
import shallowEqual from '../utils/shallowEqual';

describe('shallowEqual', () => {
  it('should throw an error if missing an input argument', () => {
    expect(() => shallowEqual({})).toThrowError('required');
  });

  it('should return false for different objects', () => {
    expect(shallowEqual({ id: 1 }, {})).toBe(false);
  });

  it('should return false for different objects', () => {
    expect(shallowEqual({ id: 1 }, { id: 1 })).toBe(true);
  });
});
