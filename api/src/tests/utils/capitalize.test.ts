import { describe, expect, it } from 'vitest';
import { capitalize } from '@utils/capitalize.ts';

describe('capitalize', () => {
  it('should return an empty string if no provided input', () => {
    expect(capitalize('')).toMatch('');
  });

  it('should return capitalized input string', () => {
    expect(capitalize('hello how are you?')).toMatch('Hello How Are You?');
  });
});
