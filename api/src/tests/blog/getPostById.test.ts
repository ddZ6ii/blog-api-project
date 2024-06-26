import { describe, expect, it } from 'vitest';
import { blog } from '@store/blog.ts';
import { Post } from '@/types/post.type.ts';

describe("Retrive post by 'id'", () => {
  it('should return undefined if no corresponding post', () => {
    expect(blog.getPostById(9999)).toBeUndefined();
  });

  it("should return post specified by 'id'", () => {
    const post: Post = {
      id: 2,
      title: 'The Impact of Artificial Intelligence on Modern Businesses',
      content:
        "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning businesses can now address previously insurmountable problems and tap into new opportunities.",
      author: 'Mia Williams',
      date: '2023-08-05T14:30:00Z',
    };
    expect(blog.getPostById(post.id)).toEqual(post);
  });
});
