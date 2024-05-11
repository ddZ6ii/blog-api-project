import isEmpty from '../utils/isEmpty.js';
import { readFromJSON, writeToJSON } from '../utils/fileIO.js';
import shallowEqual from '../utils/shallowEqual.js';
import { toISOString, toTimeStamp } from '../utils/timestamps.js';
import isValidPostId from '../utils/isValidPostId.js';
import { extractPostContent, formatPostContent } from '../utils/postContent.js';

export const INITIAL_POSTS = [
  {
    id: 1,
    title: 'The Rise of Decentralized Finance',
    content:
      'Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.',
    author: 'Alex Thompson',
    date: '2023-08-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'The Impact of Artificial Intelligence on Modern Businesses',
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: 'Mia Williams',
    date: '2023-08-05T14:30:00Z',
  },
  {
    id: 3,
    title: 'Sustainable Living: Tips for an Eco-Friendly Lifestyle',
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: 'Samuel Green',
    date: '2023-08-10T09:15:00Z',
  },
];

/**
 * Create a 'store'-like object to share data (read & write) across different files (without defining a global variable).
 *
 * For data to be mutable, it has to be a type object so it is passed by reference. Each file accessing the data has access to the original memory location.
 */
class Blog {
  // Cannot perform async operaton within constructor function.
  constructor(initialPosts) {
    this.posts = structuredClone(initialPosts);
    this.nextPostId = this.posts.at(-1).id + 1;
  }

  /**
   * Retrieve posts from JSON file (if any) or load initial posts and persist data to JSON file.
   * @returns {Promise<void>}
   */
  async initPosts() {
    const jsonContent = await readFromJSON();
    this.posts = structuredClone(isEmpty(jsonContent) ? [] : jsonContent);
    this.nextPostId = isEmpty(jsonContent) ? 1 : this.posts.at(-1).id + 1;
  }

  /**
   * Reset posts to initial posts and persist data to JSON file.
   * @returns {Promise<void>}
   */
  async resetPosts() {
    this.posts = structuredClone(INITIAL_POSTS);
    this.nextPostId = this.posts.at(-1).id + 1;
    await writeToJSON(this.posts);
  }

  /**
   * Search blog posts (title, content and author) for specified filterText.
   * @param {string?} filterText
   * @returns {post[] | []}
   */
  filterPosts(filterText = '') {
    const pattern = new RegExp(filterText.trim(), 'i');
    const filteredPosts = this.posts.filter(({ title, content, author }) => {
      const hasMatch = [title, content, author].some((el) => pattern.test(el));
      return hasMatch;
    });
    return structuredClone(filteredPosts);
  }

  /**
   * Sort blog posts order by date (default is descending order).
   * @param {post[]} posts
   * @param {string?} sort
   * @returns {post[]}
   */
  sortPostsByDate(posts = this.posts, sort = 'DESC') {
    if (posts == null) throw new Error('posts is required.');
    if (sort == null) throw new Error('sort cannot be null.');
    const formattedSort = sort.toString().trim().toUpperCase();
    const isDescendingOrder = formattedSort === 'DESC';
    const isAscendingOrder = formattedSort === 'ASC';
    if (!isDescendingOrder && !isAscendingOrder)
      throw new Error(
        'Invalid sort parameter: sorting order must be either "ASC" or "DESC".',
      );
    return structuredClone(
      posts.toSorted((post1, post2) =>
        isDescendingOrder
          ? toTimeStamp(post2.date) - toTimeStamp(post1.date)
          : toTimeStamp(post1.date) - toTimeStamp(post2.date),
      ),
    );
  }

  /**
   * Find post by id and return the matching post, otherwise returns an empty object.
   * @param {number} postId
   * @returns {post | {}}
   */
  getPostById(postId) {
    if (isEmpty(this.posts)) return {};
    if (!isValidPostId(postId)) return {};
    return { ...this.posts.find((post) => post.id === postId) };
  }

  /**
   * Create a new post from provided input posts and persist data to JSON file.
   * Note: the id added automatically.
   * The method allows to pass multiple posts as a list (e.g. addPosts(post1, post2, ...)).
   * @param {post[]} posts
   * @returns {Promise<post[]>} newPosts
   */
  async addPosts(...posts) {
    if (posts == null || !posts.length) throw new Error('No post provided.');
    const newPosts = [];
    posts.forEach((post) => {
      const copyPost = { ...post };
      if ('id' in copyPost) {
        delete copyPost.id;
      }
      Object.entries(copyPost).forEach(([key, value]) => {
        copyPost[key] = value.trim();
      });
      const newPost = {
        id: this.nextPostId,
        title: copyPost.title ?? 'New Post',
        content: copyPost.content ?? '',
        author: copyPost.author ?? '',
        date: toISOString(),
      };
      this.posts.push(newPost);
      this.nextPostId += 1;
      newPosts.push(newPost);
    });
    // Persist data to JSON file.
    await writeToJSON(this.posts);
    return newPosts;
  }

  /**
   * Update post specified by postId with provided content only if content, and persist data to JSON file.
   * @param {post} newPost
   * @param {number} postId
   * @returns {Promise<post>} updatedPost
   */
  async updatePostById(newPost, postId) {
    if (isEmpty(newPost)) throw new Error('No post provided.');
    if (!isValidPostId(postId)) return {};

    const copyNewPost = { ...newPost };
    const postIndex = this.posts.findIndex(
      (entry) => entry.id === (copyNewPost.id ?? postId),
    );
    if (postIndex < 0) return {};

    const currentContent = formatPostContent(this.posts[postIndex]);
    const updatedContent = formatPostContent(extractPostContent(newPost));
    const hasUpdatedContent = !shallowEqual(currentContent, updatedContent);
    const updatedPost = hasUpdatedContent
      ? {
          ...this.posts[postIndex],
          ...updatedContent,
          date: toISOString(),
        }
      : this.posts[postIndex];

    if (hasUpdatedContent) {
      this.posts[postIndex] = updatedPost;
      // Persist data to JSON file.
      await writeToJSON(this.posts);
    }
    return updatedPost;
  }

  /**
   * Delete post with specified postId and persist data to JSON file.
   * @param {number} postId
   * @returns {Promise<number | null>} updatedPost
   *
   */
  async deletePostById(postId) {
    if (isEmpty(this.posts) || !isValidPostId(postId)) return null;

    const postIndex = this.posts.findIndex((post) => post.id === postId);
    if (postIndex < 0) return null;

    this.posts.splice(postIndex, 1);
    // Persist data to JSON file.
    await writeToJSON(this.posts);
    return postId;
  }
}

export const blog = new Blog(INITIAL_POSTS);
