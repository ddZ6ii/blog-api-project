/**
 * All unit tests for API routes have been placed within the same file in order to serialize their order of execution and prevent interference when reading/writing the same JSON file.
 *
 * Splitting tests across different files caused undertministic test output when run as a batch, despites every single test would succeed on its own.
 */

import {
  describe,
  expect,
  expectTypeOf,
  it,
  beforeAll,
  afterAll,
} from 'vitest';
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog.ts';
import { PostContent } from '@/types/post.type.ts';
import { CustomErrorContent } from '@/types/CustomError.class.ts';
import { API_URL, OPTIONS, TIMEOUT } from './config.ts';

describe.sequential('DELETE request to remove post specified by...', () => {
  describe.sequential("...invalid 'id'", () => {
    let response: AxiosResponse;
    let errorContent: CustomErrorContent;
    const postId = 'invalid';

    beforeAll(async () => {
      try {
        response = await axios.delete(`${API_URL}/posts/${postId}`, OPTIONS);
        if (response.status !== 200) {
          errorContent = response.data as CustomErrorContent;
        }
      } catch (err) {
        console.error(`Failed to delete post with 'id' ${postId}!`, err);
      }
    }, TIMEOUT);

    it("error name should be 'error'", () => {
      expect(errorContent.status).toMatch('error');
    });

    it('error status code should be 400', () => {
      expect(errorContent.code).toBe(400);
    });

    it('error should contain the expected error message', () => {
      expect(response.data).toMatchObject({
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

  describe.sequential("...valid but non-matching 'id", () => {
    let response: AxiosResponse;
    let errorContent: CustomErrorContent;
    const postId = '9999';

    beforeAll(async () => {
      try {
        response = await axios.delete(`${API_URL}/posts/${postId}`, OPTIONS);
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
      expect(response.data).toMatchObject({
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

  describe.sequential("...valid and matching 'id", () => {
    let response: AxiosResponse<string>;
    const postId = '3';
    const newPost: Partial<PostContent> = {
      title: "Amazing Things You Wouldn't Have Guessed About...",
      content:
        'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
      author: 'Myrtie Jasmine',
    };

    beforeAll(async () => {
      try {
        await blog.resetPosts();
        await axios.post(`${API_URL}/posts`, newPost, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        response = await axios.delete(`${API_URL}/posts/${postId}`);
      } catch (err) {
        console.error(`Failed to delete post with 'id' ${postId}!`, err);
      }
    }, TIMEOUT);

    afterAll(async () => {
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
      expect(response.headers['content-type']).toContain('text/plain');
    });

    it('response data should be of type string', () => {
      expectTypeOf(response.data).toBeString();
    });

    it('should return expected success message', () => {
      expect(response.data).match(/ok/i);
    });
  });
});
