import { describe, expect, expectTypeOf, it, beforeAll } from 'vitest';
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import { Post } from '@/types/post.type.ts';
import INITIAL_POSTS from '@data/initialPosts.json';
import { API_URL, TIMEOUT } from './config.ts';

describe.sequential('POST request to reset blog posts', () => {
  let response: AxiosResponse<Post[]>;

  beforeAll(async () => {
    try {
      response = await axios.post(`${API_URL}/posts/reset`);
    } catch (err) {
      console.error('Failed request to reset posts!', err);
    }
  }, TIMEOUT);

  it('response status should be 200', () => {
    expect(response.status).toBe(200);
  });

  it('response should have content-type application', () => {
    expect(response.headers['content-type']).toContain('application/json');
  });

  it('response data should be of type array', () => {
    expectTypeOf(response.data).toBeArray();
  });

  it('should return the expected number of posts', () => {
    expect(response.data).toHaveLength(INITIAL_POSTS.length);
  });

  it('should return all initial posts', () => {
    expect(response.data).toStrictEqual(INITIAL_POSTS);
  });
});
