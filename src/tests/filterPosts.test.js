import { describe, expect, it } from 'vitest';
import { filterPosts } from '../utils/posts';
import { readFromJSON } from '../utils/file';

describe('filterPosts', () => {
  it('should return all posts if missing filterText', async () => {
    const posts = await readFromJSON();
    expect(filterPosts(posts)).toEqual(posts);
  });

  it('should return an empty array if no match', async () => {
    const posts = await readFromJSON();
    expect(filterPosts(posts, 'foobar')).toEqual([]);
  });

  it('should return posts matching the search', async () => {
    const posts = await readFromJSON();
    expect(filterPosts(posts, 'alex')).toEqual([posts[0]]);
  });
});
