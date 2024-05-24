import { beforeAll, describe, expect, it } from 'vitest';
import { blog } from '@store/blog.ts';
import { readFromJSON } from '@/utils/fileIO.ts';
import { Post } from '@/types/post.type.ts';
import { SortSchema } from '@/types/post.schema.ts';

describe('Sort posts by date', () => {
  let posts: Post[];

  // Reset posts prior to testing.
  beforeAll(async () => {
    try {
      await blog.resetPosts();
      const jsonContent = await readFromJSON();
      posts = structuredClone(jsonContent);
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  });

  it('should return the most recent post first whne sorting by DESC', () => {
    expect(blog.sortPostsByDate(posts, SortSchema.enum.DESC)[0]).toEqual(
      posts.at(-1),
    );
  });

  it('should return the least recent post first when sorting by ASC', () => {
    expect(blog.sortPostsByDate(posts, SortSchema.enum.ASC)[0]).toEqual(
      posts[0],
    );
  });
});
