import INITIAL_POSTS from '@data/initialPosts.json';
import { isEmpty } from '@utils/isEmpty.ts';
import { readFromJSON, writeToJSON } from '../utils/fileIO.js';
import { shallowEqual } from '@utils/shallowEqual.js';
import { toISOString, toTimeStamp } from '../utils/timestamps.js';
import { Post, PostContent, SortEnum } from '@/types/post.type.ts';
import { PostContentSchema, SortSchema } from '@/types/post.schema.ts';

/**
 * Create a 'store'-like object to share data (read & write) across different files (without defining a global variable).
 *
 * For data to be mutable, it has to be a type object so it is passed by reference. Each file accessing the data has access to the original memory location.
 */
class Blog {
  private _posts: Post[];
  private _nextPostId: number;
  private _getLastPostId() {
    return this._posts.at(-1)?.id ?? 0;
  }

  constructor(initialPosts: Post[] = INITIAL_POSTS) {
    this._posts = structuredClone(initialPosts);
    this._nextPostId = this._getLastPostId() + 1;
  }

  // Retrieve posts from JSON file (if any) or load initial posts.
  async initPosts() {
    const jsonContent: Post[] = await readFromJSON();
    this._posts = structuredClone(isEmpty(jsonContent) ? [] : jsonContent);
    this._nextPostId = isEmpty(jsonContent) ? 1 : this._getLastPostId() + 1;
  }

  // Reset posts to initial posts.
  async resetPosts() {
    this._posts = structuredClone(INITIAL_POSTS);
    this._nextPostId = this._getLastPostId() + 1;
    await writeToJSON(this._posts);
    return await readFromJSON();
  }

  // Search blog posts (title, content and author) for specified filterText.
  filterPosts(filterText = '') {
    const pattern = new RegExp(filterText.trim(), 'i');
    return this._posts.filter(({ title, content, author }) => {
      const searchFields = [title, content, author];
      return searchFields.some((el) => pattern.test(el));
    });
  }

  // Sort blog posts order by date (default is DESC order).
  sortPostsByDate(posts = this._posts, sort: SortEnum = SortSchema.enum.DESC) {
    const clonedPosts = structuredClone(posts);
    const isDescendingOrder = sort === SortSchema.enum.DESC;
    return clonedPosts.toSorted((post1, post2) =>
      isDescendingOrder
        ? toTimeStamp(post2.date) - toTimeStamp(post1.date)
        : toTimeStamp(post1.date) - toTimeStamp(post2.date),
    );
  }

  getPostById(postId: number) {
    return this._posts.find((post) => post.id === postId);
  }

  // Create a new post (id is automatically added).
  async addPost(postContent: PostContent) {
    const copyPostContent: PostContent = { ...postContent };

    Object.entries(copyPostContent).forEach(([key, value]) => {
      copyPostContent[key as keyof PostContent] = value.trim();
    });

    const newPost: Post = {
      id: this._nextPostId,
      title: copyPostContent.title,
      content: copyPostContent.content,
      author: copyPostContent.author,
      date: toISOString(),
    };

    this._posts.push(newPost);
    this._nextPostId += 1;
    await writeToJSON(this._posts);

    return newPost;
  }

  // Partially update ('patch') post specified by ID.
  async updatePostById(updatedContent: Partial<PostContent>, postId: number) {
    const matchIndex = this._posts.findIndex((entry) => entry.id === postId);

    if (matchIndex < 0) return;

    const currentPost = this._posts[matchIndex];
    // Use Zod loose schema to extract only key/value pairs related to post content.
    const currentContent = PostContentSchema.parse(currentPost);

    const hasUpdatedContent = !shallowEqual(currentContent, updatedContent);
    const updatedPost = hasUpdatedContent
      ? {
          ...currentPost,
          ...updatedContent,
          date: toISOString(),
        }
      : currentPost;

    if (hasUpdatedContent) {
      this._posts[matchIndex] = updatedPost;
      await writeToJSON(this._posts);
    }
    return updatedPost;
  }

  async deletePostById(postId: number) {
    const matchIndex = this._posts.findIndex((post) => post.id === postId);
    if (matchIndex < 0) return;

    this._posts.splice(matchIndex, 1);
    await writeToJSON(this._posts);

    return postId;
  }
}

export const blog = new Blog(INITIAL_POSTS);
