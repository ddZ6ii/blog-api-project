import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { blog } from '../../store/blog.js';
import { readFromJSON } from '../../utils/fileIO.js';

const newPost = {
  title: "Amazing Things You Wouldn't Have Guessed About...",
  author: 'Myrtie Jasmine',
  content:
    'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetur sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
};

describe('Delete post specified by ID', () => {
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

  it('should throw an error if missing ID', async () => {
    await expect(blog.deletePostById()).rejects.toThrowError('required');
  });

  it('should throw an error if ID is not of type number', async () => {
    await expect(blog.deletePostById('sdsd')).rejects.toThrowError('number');
  });

  it('should throw an error if ID cannot be converted to type number', async () => {
    await expect(
      blog.deletePostById(parseInt('sdsd', 10)),
    ).rejects.toThrowError('number');
  });

  it('should return undefined if no corresponding post', async () => {
    await expect(blog.deletePostById(44)).resolves.toBeNull();
  });

  it('should return the ID of deleted post', async () => {
    const [addedPost] = await blog.addPosts(newPost);
    const deletedPostId = await blog.deletePostById(addedPost.id);
    expect(deletedPostId).toBe(addedPost.id);
  });

  it('JSON file should not contain deleted post', async () => {
    const [addedPost] = await blog.addPosts(newPost);
    const deletedPostId = await blog.deletePostById(addedPost.id);
    const jsonContent = await readFromJSON();
    const postIds = jsonContent.map((post) => post.id);
    expect(postIds).not.toContain(deletedPostId);
  });
});
