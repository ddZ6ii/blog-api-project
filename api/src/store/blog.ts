import INITIAL_POSTS from '@data/initialPosts.json';
import { PostContent, PostId } from '@/ts/posts.type.ts';
import { BlogInterface } from '@/ts/blog.interface.ts';
import { isEmpty } from '@utils/isEmpty.ts';
import { readFromJSON, writeToJSON } from '../utils/fileIO.js';
import { shallowEqual } from '@utils/shallowEqual.js';
import { toISOString, toTimeStamp } from '../utils/timestamps.js';
import { isValidPostId } from '@utils/isValidPostId.js';
import { extractPostContent, formatPostContent } from '@utils/postContent.js';
import { Post } from '@/ts/posts.interface.ts';

/**
 * Create a 'store'-like object to share data (read & write) across different files (without defining a global variable).
 *
 * For data to be mutable, it has to be a type object so it is passed by reference. Each file accessing the data has access to the original memory location.
 */
class Blog implements BlogInterface {
  private _posts: Post[];
  private _nextPostId: number;
  private _getLastPostId(): number {
    return this._posts.at(-1)?.id ?? 0;
  }

  constructor(initialPosts: Post[] = INITIAL_POSTS) {
    this._posts = structuredClone(initialPosts);
    this._nextPostId = this._getLastPostId() + 1;
  }

  initPosts = async (): Promise<void> => {
    const jsonContent: Post[] = await readFromJSON();
    this._posts = structuredClone(isEmpty(jsonContent) ? [] : jsonContent);
    this._nextPostId = isEmpty(jsonContent) ? 1 : this._getLastPostId() + 1;
  };

  resetPosts = async (): Promise<Post[]> => {
    this._posts = structuredClone(INITIAL_POSTS);
    this._nextPostId = this._getLastPostId() + 1;
    await writeToJSON(this._posts);
    return readFromJSON();
  };

  filterPosts = (filterText = ''): Post[] => {
    const pattern = new RegExp(filterText.trim(), 'i');
    const filteredPosts = this._posts.filter(({ title, content, author }) => {
      const hasMatch = [title, content, author].some((el) => pattern.test(el));
      return hasMatch;
    });
    return structuredClone(filteredPosts);
  };

  sortPostsByDate = (posts = this._posts, sort = 'DESC'): Post[] => {
    const formattedSort = sort.toString().trim().toUpperCase();
    const isDescendingOrder = formattedSort === 'DESC';
    const isAscendingOrder = formattedSort === 'ASC';
    if (!isDescendingOrder && !isAscendingOrder)
      throw new Error(
        'Invalid sort parameter: sorting order must be either "ASC" or "DESC".',
      );
    const clonedPosts = structuredClone(posts);
    return clonedPosts.toSorted((post1, post2) =>
      isDescendingOrder
        ? toTimeStamp(post2.date) - toTimeStamp(post1.date)
        : toTimeStamp(post1.date) - toTimeStamp(post2.date),
    );
  };

  getPostById = (postId: PostId): Post | undefined => {
    if (isEmpty(this._posts)) return;
    if (!isValidPostId(postId)) return;
    const matchingPost = this._posts.find((post) => post.id === postId);
    if (!matchingPost) return;
    return matchingPost;
  };

  addPosts = async (...posts: Partial<Post>[] | undefined[]) => {
    if (isEmpty(posts) || posts.some((post) => isEmpty(post)))
      throw new Error('No post provided.');
    const newPosts: Post[] = [];
    posts.forEach((post) => {
      const copyPost: Omit<Partial<Post>, 'date'> = { ...post };
      if ('id' in copyPost) {
        delete copyPost.id;
      }
      Object.entries(copyPost as PostContent).forEach(([key, value]) => {
        copyPost[key as keyof PostContent] = value.trim();
      });
      const newPost: Post = {
        id: this._nextPostId,
        title: copyPost.title ?? 'New Post',
        content: copyPost.content ?? '',
        author: copyPost.author ?? '',
        date: toISOString(),
      };
      this._posts.push(newPost);
      this._nextPostId += 1;
      newPosts.push(newPost);
    });
    // Persist data to JSON file.
    await writeToJSON(this._posts);
    return newPosts;
  };

  updatePostById = async (
    newPost: Partial<Post> | undefined,
    postId: PostId,
  ): Promise<Post | undefined> => {
    if (isEmpty(newPost)) throw new Error('No post provided.');
    if (!isValidPostId(postId)) return;

    const postIndex = this._posts.findIndex((entry) => entry.id === postId);
    if (postIndex < 0) return;

    const currentContent = formatPostContent(this._posts[postIndex]);

    // Disable eslint rule because `undefined` already coverred by `!isValidPostId(postId)` above.
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const updatedContent = formatPostContent(extractPostContent(newPost));
    const hasUpdatedContent = !shallowEqual(currentContent, updatedContent);
    const updatedPost = hasUpdatedContent
      ? {
          ...this._posts[postIndex],
          ...updatedContent,
          date: toISOString(),
        }
      : this._posts[postIndex];

    if (hasUpdatedContent) {
      this._posts[postIndex] = updatedPost;
      // Persist data to JSON file.
      await writeToJSON(this._posts);
    }
    return updatedPost;
  };

  deletePostById = async (postId: PostId): Promise<number | undefined> => {
    if (isEmpty(this._posts) || !isValidPostId(postId)) return;

    const postIndex = this._posts.findIndex((post) => post.id === postId);
    if (postIndex < 0) return;

    this._posts.splice(postIndex, 1);

    // Persist data to JSON file.
    await writeToJSON(this._posts);
    return postId as number;
  };
}

export const blog = new Blog(INITIAL_POSTS);
