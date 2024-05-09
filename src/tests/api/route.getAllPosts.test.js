import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
} from 'vitest';
import axios from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog';

const TIMEOUT = 30000; // 30 sec
const { API_SERVER_PORT, LOCAL_HOST_IP_ADRESS } = process.env;
// Use local IP address instead of localhost to fix Axios error ECONNREFUSED.
const API_BASE_URL = `http://${LOCAL_HOST_IP_ADRESS}:${parseInt(API_SERVER_PORT, 10) ?? 8000}`;

describe('GET request for all blog posts (default sorted by DESC order)', () => {
  let response;

  beforeEach(async () => {
    try {
      await blog.resetPosts();
      response = await axios.get(API_BASE_URL + '/posts');
    } catch (err) {
      console.error('Failed to fetch posts!', err);
    }
  }, TIMEOUT);

  afterEach(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  }, TIMEOUT);

  it('response status should be 200', () => {
    expect(response.status).toBe(200);
  });

  it('response should have content-type application', () => {
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('response data should be of type array', () => {
    expectTypeOf(response.data).toBeArray();
  });

  it('should return the expected number of posts', () => {
    expect(response.data).toHaveLength(blog.posts.length);
  });

  it('should return all of the posts in DESC order (default sorting)', async () => {
    const sortedPosts = blog.sortPostsByDate(blog.posts, 'desc');
    expect(response.data).toStrictEqual(sortedPosts);
  });
});

describe('GET request for all blog posts sorted in ASC order', () => {
  let response;

  beforeEach(async () => {
    try {
      await blog.resetPosts();
      response = await axios.get(API_BASE_URL + '/posts?sort=ASC');
    } catch (err) {
      console.error('Failed to fetch posts sorted in ASC order!', err);
    }
  }, TIMEOUT);

  afterEach(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  }, TIMEOUT);

  it('response status should be 200', () => {
    expect(response.status).toBe(200);
  });

  it('response should have content-type application', () => {
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('response data should be of type array', () => {
    expectTypeOf(response.data).toBeArray();
  });

  it('should return the expected number of posts', () => {
    expect(response.data).toHaveLength(blog.posts.length);
  });

  it('should return all of the posts in ascending order', async () => {
    const sortedPosts = blog.sortPostsByDate(blog.posts, 'asc');
    expect(response.data).toStrictEqual(sortedPosts);
  });
});

describe('GET request for all blog posts matching search filter', () => {
  let response;

  beforeEach(async () => {
    try {
      await blog.resetPosts();
      response = await axios.get(API_BASE_URL + '/posts?filter=thompson');
    } catch (err) {
      console.error('Failed to search matching posts!', err);
    }
  }, TIMEOUT);

  afterEach(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  }, TIMEOUT);

  it('response status should be 200', () => {
    expect(response.status).toBe(200);
  });

  it('response should have content-type application', () => {
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('response data should be of type array', () => {
    expectTypeOf(response.data).toBeArray();
  });

  it('should return the expected number of posts', () => {
    expect(response.data).toHaveLength(1);
  });

  it('should return all posts matching search filter', async () => {
    expect(response.data).toEqual([blog.posts[0]]);
  });
});
