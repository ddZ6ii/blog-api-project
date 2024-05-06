import { describe, expect, it } from 'vitest';
import { createPost } from '../utils/posts';
import { toISOString } from '../utils/timestamps.js';

describe('createPost', () => {
  it('should throw an error if nextPostId is missing', () => {
    expect(() => createPost(null, {})).toThrowError('required');
  });

  it('should throw an error if nextPostId is not of type number', () => {
    expect(() => createPost('foo', {})).toThrowError('number');
  });

  it('should return the newly added post', async () => {
    const nextPostId = 5;
    const newPostContent = {
      title: "Amazing Things You Wouldn't Have Guessed About...",
      author: 'Myrtie Jasmine',
      content:
        'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetur sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus. Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est, id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
    };
    const newPost = {
      id: nextPostId,
      ...newPostContent,
      date: toISOString(),
    };
    expect(createPost(nextPostId, newPost)).toMatchObject(newPostContent);
  });
});
