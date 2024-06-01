import { describe, expect, expectTypeOf, it, beforeAll } from 'vitest';
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog.ts';
import { readFromJSON } from '@/utils/fileIO.ts';
import { Post } from '@/types/post.type.ts';
import { SortSchema } from '@/types/post.schema.ts';
import { CustomErrorContent } from '@/types/CustomError.class.ts';
import { API_BASE_URL, TIMEOUT } from './config.ts';

describe.sequential('GET request for all blog posts...', () => {
  describe.sequential("...sorted in 'DESC' order by default)", () => {
    let posts: Post[];
    let response: AxiosResponse<Post[]>;

    beforeAll(async () => {
      try {
        posts = await readFromJSON();
        response = await axios.get(`${API_BASE_URL}/posts`);
      } catch (err) {
        console.error('Failed to fetch posts!', err);
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
      expect(response.data).toHaveLength(posts.length);
    });

    it('should return all of the posts in DESC order (default sorting)', () => {
      const sortedPosts = blog.sortPostsByDate(posts, SortSchema.enum.DESC);
      expect(response.data).toStrictEqual(sortedPosts);
    });
  });

  describe.sequential("...sorted in 'ASC' order", () => {
    let posts: Post[];
    let response: AxiosResponse<Post[]>;

    beforeAll(async () => {
      try {
        posts = await readFromJSON();
        response = await axios.get(`${API_BASE_URL}/posts?sort=ASC`);
      } catch (err) {
        console.error('Failed to fetch posts sorted in ASC order!', err);
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
      expect(response.data).toHaveLength(posts.length);
    });

    it("should return all of the posts in 'ASC' order", () => {
      const sortedPosts = blog.sortPostsByDate(posts, SortSchema.enum.ASC);
      expect(response.data).toStrictEqual(sortedPosts);
    });
  });

  describe.sequential("...matching 'search' filter", () => {
    let posts: Post[];
    let response: AxiosResponse<Post[]>;

    beforeAll(async () => {
      try {
        posts = await readFromJSON();
        response = await axios.get(`${API_BASE_URL}/posts?filter=thompson`);
      } catch (err) {
        console.error('Failed to search matching posts!', err);
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
      expect(response.data).toHaveLength(1);
    });

    it('should return all posts matching search filter', () => {
      expect(response.data).toStrictEqual([posts[0]]);
    });
  });

  describe.sequential("...with invalid 'sort' query parameter", () => {
    let errorResponse: AxiosResponse | undefined;
    let errorContent: CustomErrorContent;

    beforeAll(async () => {
      try {
        await axios.get(`${API_BASE_URL}/posts?sort=invalid`);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          errorResponse = err.response;
          errorContent = err.response?.data as CustomErrorContent;
        } else {
          console.error('Failed to search matching posts!', err);
        }
      }
    }, TIMEOUT);

    it("error name should be 'error'", () => {
      expect(errorContent.status).toMatch('error');
    });

    it('error status code should be 400', () => {
      expect(errorContent.code).toBe(400);
    });

    it('error should contain the expected error message', () => {
      expect(errorContent).toMatchObject({
        message: expect.stringMatching(
          /expected 'sort' to be 'ASC' or 'DESC'/i,
        ) as string,
      });
    });

    it('response should have content-type application', () => {
      expect(errorResponse?.headers['content-type']).toContain(
        'application/json',
      );
    });

    it('response data should be of type object', () => {
      expectTypeOf(errorContent).toBeObject();
    });
  });

  describe.sequential('...with invalid additional query parameter', () => {
    let errorResponse: AxiosResponse | undefined;
    let errorContent: CustomErrorContent;

    beforeAll(async () => {
      try {
        await axios.get(`${API_BASE_URL}/posts?any=unexpected`);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          errorResponse = err.response;
          errorContent = err.response?.data as CustomErrorContent;
        } else {
          console.error('Failed to search matching posts!', err);
        }
      }
    }, TIMEOUT);

    it("error name should be 'error'", () => {
      expect(errorContent.status).toMatch('error');
    });

    it('error status code should be 400', () => {
      expect(errorContent.code).toBe(400);
    });

    it('error should contain the expected error message', () => {
      expect(errorResponse?.data).toMatchObject({
        message: expect.stringMatching(/unrecognized key/i) as string,
      });
    });

    it('response should have content-type application', () => {
      expect(errorResponse?.headers['content-type']).toContain(
        'application/json',
      );
    });

    it('response data should be of type object', () => {
      expectTypeOf(errorContent).toBeObject();
    });
  });
});
