import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { blog } from '@store/blog.ts';
import { readFromJSON } from '@utils/fileIO.ts';
import { PostContent } from '@/types/post.type.ts';

const validPostContent: PostContent = {
  title: "Amazing Things You Wouldn't Have Guessed About...",
  author: 'Myrtie Jasmine',
  content:
    'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
};

describe('Adding a new post', () => {
  // Reset posts prior to testing.
  beforeEach(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  });

  // Reset posts after testing.
  afterEach(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  });

  it('should return the newly added post', async () => {
    await expect(blog.addPost(validPostContent)).resolves.toMatchObject({
      title: validPostContent.title,
      author: validPostContent.author,
      content: validPostContent.content,
    });
  });

  it('JSON file should contain the newly added post', async () => {
    const addedPost = await blog.addPost(validPostContent);
    const jsonContent = await readFromJSON();
    const match = jsonContent.find((post) => post.id === addedPost.id);
    expect(match?.id).toEqual(addedPost.id);
  });
});
