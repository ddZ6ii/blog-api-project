import { PostId } from './posts.type.ts';
import { Post } from './posts.interface.ts';

export interface BlogInterface {
  /**
   * Retrieve posts from JSON file (if any) or load initial posts and persist data to JSON file.
   * @returns {Promise<void>}
   */
  initPosts(): Promise<void>;

  /**
   * Reset posts to initial posts and persist data to JSON file.
   * @returns {Promise<POst[]>}
   */
  resetPosts(): Promise<Post[]>;

  /**
   * Search blog posts (title, content and author) for specified filterText.
   * @param {string?} filterText
   * @returns {Post[] | []}
   */
  filterPosts(filterText?: string): Post[];

  /**
   * Sort blog posts order by date (default is descending order).
   * @param {Post[]} posts
   * @param {string?} sort
   * @returns {Post[]}
   */
  sortPostsByDate(posts: Post[], sort?: string): Post[];

  /**
   * Find post by id and return the matching post, otherwise returns an empty object.
   * @param {PostId} postId
   * @returns {Post | undefined}
   */
  getPostById(postId: PostId): Post | undefined;

  /**
   * Create a new post from provided input posts and persist data to JSON file.
   * Note: the id added automatically.
   * The method allows to pass multiple posts as a list (e.g. addPosts(post1, post2, ...)).
   * @param {Partial<Post>[] | udnefined[]} posts
   * @returns {Promise<Post[]>} newPosts
   */
  addPosts(...posts: Partial<Post>[] | undefined[]): Promise<Post[]>;

  /**
   * Update post specified by postId with provided content only if content, and persist data to JSON file.
   * @param {Partial<Post> | undefined} newPost
   * @param {PostId} postId
   * @returns {Promise<Post | undefined>} updatedPost
   */
  updatePostById(
    newPost: Partial<Post> | undefined,
    postId: PostId,
  ): Promise<Post | undefined>;

  /**
   * Delete post with specified postId and persist data to JSON file.
   * @param {PostId} postId
   * @returns {Promise<number | null>} updatedPost
   */
  deletePostById(postId: PostId): Promise<number | undefined>;
}
