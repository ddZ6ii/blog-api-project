import { describe, expect, expectTypeOf, it, beforeAll } from 'vitest';
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import { readFromJSON } from '@/utils/fileIO.ts';
import { Post } from '@/types/post.type.ts';
import { CustomErrorContent } from '@/types/CustomError.class.ts';
import { API_URL, OPTIONS, TIMEOUT } from './config.ts';

describe.sequential('GET request for post specified by...', () => {
  describe.sequential("...invalid 'id'", () => {
    let response: AxiosResponse;
    let errorContent: CustomErrorContent;
    const postId = 'invalid';

    beforeAll(async () => {
      try {
        response = await axios.get(`${API_URL}/posts/${postId}`, OPTIONS);
        if (response.status !== 200) {
          errorContent = response.data as CustomErrorContent;
        }
      } catch (err) {
        console.error(`Failed to fetch post with 'id' ${postId}!`, err);
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
        message: expect.stringMatching(/'id' must be a number/i) as string,
      });
    });

    it('response should have content-type application', () => {
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('response data should be of type object', () => {
      expectTypeOf(errorContent).toBeObject();
    });
  });

  describe.sequential("...valid but non-matching 'id'", () => {
    let response: AxiosResponse;
    let errorContent: CustomErrorContent;
    const postId = '9999';

    beforeAll(async () => {
      try {
        response = await axios.get(`${API_URL}/posts/${postId}`, OPTIONS);
        if (response.status !== 200) {
          errorContent = response.data as CustomErrorContent;
        }
      } catch (err) {
        console.error(`Failed to fetch post with 'id' ${postId}!`, err);
      }
    }, TIMEOUT);

    it("error name should be 'error'", () => {
      expect(errorContent.status).toMatch('error');
    });

    it('error status code should be 404', () => {
      expect(errorContent.code).toBe(404);
    });

    it('error should contain the expected error message', () => {
      expect(errorContent).toMatchObject({
        message: expect.stringMatching(/no existing post with 'id'/i) as string,
      });
    });

    it('response should have content-type application', () => {
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('response data should be of type object', () => {
      expectTypeOf(errorContent).toBeObject();
    });
  });

  describe.sequential("...valid and matching 'id'", () => {
    let posts: Post[];
    let response: AxiosResponse<Post>;
    const postId = '1';

    beforeAll(async () => {
      try {
        posts = await readFromJSON();
        response = await axios.get(`${API_URL}/posts/${postId}`);
      } catch (err) {
        console.error(`Failed to fetch post with 'id' ${postId}!`, err);
      }
    }, TIMEOUT);

    it('response status should be 200', () => {
      expect(response.status).toBe(200);
    });

    it('response should have content-type application', () => {
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('response data should be of type object', () => {
      expectTypeOf(response.data).toBeObject();
    });

    it('should return matching post', () => {
      expect(response.data).toStrictEqual(posts[0]);
    });
  });
});
