import { describe, expect, it } from 'vitest';
import { createPost } from '../utils/posts';

describe('createPost', () => {
  it('should throw an error if nextPostId is missing', () => {
    expect(() => createPost(null, { title: '', author: '', content: '' })).toThrowError('required');
  });
  it('should throw an error if nextPostId is not of type number', () => {
    expect(() => createPost('4', { title: '', author: '', content: '' })).toThrowError('number');
  });

  it('should return an object', () => {
    expect(createPost(3, { title: '', author: '', content: '' })).toBeTypeOf(
      'object',
    );
  });
  it('should have an id equal to 3', () => {
    expect(createPost(3, { title: '', author: '', content: '' }).id).toBe(3);
  });
});
