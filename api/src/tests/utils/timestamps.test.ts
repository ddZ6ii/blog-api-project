import { describe, expect, it } from 'vitest';
import { toISOString } from '@utils/timestamps.ts';

describe('toISOString', () => {
  it('should return a string', () => {
    expect(toISOString()).toBeTypeOf('string');
  });
});
