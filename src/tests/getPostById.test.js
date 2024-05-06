import { describe, expect, it } from 'vitest';
import { getPostById } from '../utils/posts';
import { readFromJSON } from '../utils/file';

describe('getPostById', () => {
  it('should return an empty object if missing posts', () => {
    expect(getPostById()).toEqual({});
  });

  it('should throw an error if missing postId', async () => {
    const posts = await readFromJSON();
    expect(() => getPostById(posts)).toThrowError('required');
  });

  it('should throw an error if postId is not of type number', async () => {
    const posts = await readFromJSON();
    expect(() => getPostById(posts, '1')).toThrowError('number');
  });

  it('should return an empty object if no match', async () => {
    const posts = await readFromJSON();
    expect(getPostById(posts, 9999)).toBeUndefined();
  });

  it('should return an object with matching id in case of match', async () => {
    const postId = 1;
    const posts = await readFromJSON();
    const match = posts.find((post) => post.id === postId);
    expect(getPostById(posts, postId)).toEqual(match);
  });
});
