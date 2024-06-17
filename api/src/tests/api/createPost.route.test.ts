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
import { Post, PostContent } from '@/types/post.type.ts';
import { CustomErrorContent } from '@/types/CustomError.class.ts';
import { API_URL, OPTIONS, TIMEOUT } from './config.ts';

describe.sequential('POST request to create a new blog post...', () => {
  const VALID_POST_CONTENT: PostContent = {
    title: "Amazing Things You Wouldn't Have Guessed About...",
    content:
      'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
    author: 'Myrtie Jasmine',
  };

  describe.sequential('...without body request', () => {
    let response: AxiosResponse;
    let errorContent: CustomErrorContent;
    const postContent = undefined;

    beforeAll(async () => {
      try {
        response = await axios.post(`${API_URL}/posts`, postContent, {
          ...OPTIONS,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.status !== 200) {
          errorContent = response.data as CustomErrorContent;
        }
      } catch (err) {
        console.error('Failed to create post!', err);
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
        message: expect.stringMatching(/required/i) as string,
      });
    });

    it('response should have content-type application', () => {
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('response data should be of type object', () => {
      expectTypeOf(errorContent).toBeObject();
    });
  });

  describe.sequential('...with valid body request', () => {
    let response: AxiosResponse<Post[]>;

    beforeAll(async () => {
      try {
        response = await axios.post(`${API_URL}/posts`, VALID_POST_CONTENT, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      } catch (err) {
        console.error('Failed to create post!', err);
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
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('response data should be of type object', () => {
      expectTypeOf(response.data).toBeObject();
    });

    it('should return the created post', () => {
      expect(response.data).toMatchObject(VALID_POST_CONTENT);
    });
  });

  describe.sequential(
    '...with invalid additional field within body request',
    () => {
      let response: AxiosResponse;
      let errorContent: CustomErrorContent;
      const postContent: unknown = {
        ...VALID_POST_CONTENT,
        any: 'any',
      };

      beforeAll(async () => {
        try {
          response = await axios.post(`${API_URL}/posts`, postContent, {
            ...OPTIONS,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          if (response.status !== 200) {
            errorContent = response.data as CustomErrorContent;
          }
        } catch (err) {
          console.error('Failed to create post!', err);
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
          message: expect.stringMatching(/unrecognized key/i) as string,
        });
      });

      it('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it('response data should be of type object', () => {
        expectTypeOf(errorContent).toBeObject();
      });
    },
  );
});
