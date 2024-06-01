import {
  describe,
  expect,
  expectTypeOf,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import { blog } from '@/store/blog.ts';
import { readFromJSON } from '@/utils/fileIO.ts';
import { Post, PostContent } from '@/types/post.type.ts';
import { CustomErrorContent } from '@/types/CustomError.class.ts';
import { API_BASE_URL, OPTIONS, TIMEOUT } from './config.ts';

describe.sequential(
  'PATCH request to partially update post specified by...',
  () => {
    const VALID_POST_CONTENT: PostContent = {
      title: "Amazing Things You Wouldn't Have Guessed About...",
      content:
        'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
      author: 'Myrtie Jasmine',
    };

    beforeEach(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    afterEach(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    const UPDATED_POST_CONTENT: Partial<PostContent> = {
      title: 'New Title',
      content: 'New Content',
    };

    describe.sequential("...invalid 'id'", () => {
      let response: AxiosResponse;
      let errorContent: CustomErrorContent;
      const postId = 'invalid';

      beforeAll(async () => {
        try {
          response = await axios.patch(
            `${API_BASE_URL}/posts/${postId}`,
            UPDATED_POST_CONTENT,
            {
              ...OPTIONS,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          );
          if (response.status !== 200) {
            errorContent = response.data as CustomErrorContent;
          }
        } catch (err) {
          console.error(`Failed to update post with 'id' ${postId}!`, err);
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
          response = await axios.patch(
            `${API_BASE_URL}/posts/${postId}`,
            UPDATED_POST_CONTENT,
            {
              ...OPTIONS,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          );
          if (response.status !== 200) {
            errorContent = response.data as CustomErrorContent;
          }
        } catch (err) {
          console.error(`Failed to update post with 'id' ${postId}!`, err);
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
          message: expect.stringMatching(
            /no existing post with 'id'/i,
          ) as string,
        });
      });

      it('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it('response data should be of type object', () => {
        expectTypeOf(errorContent).toBeObject();
      });
    });

    describe.sequential(
      "...valid and matching 'id' but without body request",
      () => {
        let response: AxiosResponse<Post>;
        let posts: Post[];
        let postId: number;

        beforeAll(async () => {
          try {
            // Add temporary post to work on the update.
            await axios.post(`${API_BASE_URL}/posts`, VALID_POST_CONTENT, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            });

            posts = await readFromJSON();
            if (posts.length) {
              postId = posts[posts.length - 1].id;
            }
            if (!postId) {
              throw new Error("'id' is undefined");
            }
            response = await axios.patch(
              `${API_BASE_URL}/posts/${postId.toString()}`,
              {},
              {
                ...OPTIONS,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              },
            );
          } catch (err) {
            console.error(
              `Failed to update post with 'id' ${postId.toString()}!`,
              err,
            );
          }
        }, TIMEOUT);

        afterAll(async () => {
          try {
            await axios.delete(`${API_BASE_URL}/posts/${postId.toString()}`);
          } catch (err) {
            console.error('Failed to reset posts!', err);
          }
        }, TIMEOUT);

        it('response status should be 200', () => {
          expect(response.status).toBe(200);
        });

        it('response should have content-type application', () => {
          expect(response.headers['content-type']).toContain(
            'application/json',
          );
        });

        it('response data should be of type object', () => {
          expectTypeOf(response.data).toBeObject();
        });

        it('should return the already existing post', () => {
          expect(response.data.id).toBe(posts[posts.length - 1].id);
        });
      },
    );

    describe.sequential("...valid 'id' and with body request)", () => {
      let response: AxiosResponse<Post>;
      let posts: Post[];
      let postId: number;

      beforeAll(async () => {
        try {
          // Add temporary post to work on the update.
          await axios.post(`${API_BASE_URL}/posts`, VALID_POST_CONTENT, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          posts = await readFromJSON();

          if (posts.length) {
            postId = posts[posts.length - 1].id;
          }
          if (!postId) {
            throw new Error("'id' is undefined");
          }

          response = await axios.patch(
            `${API_BASE_URL}/posts/${postId.toString()}`,
            UPDATED_POST_CONTENT,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          );
        } catch (err) {
          console.error(
            `Failed to update post with 'id' ${postId.toString()}!`,
            err,
          );
        }
      }, TIMEOUT);

      afterAll(async () => {
        try {
          await axios.delete(`${API_BASE_URL}/posts/${postId.toString()}`);
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

      it('should return the updated post', () => {
        expect(response.data).toMatchObject(UPDATED_POST_CONTENT);
      });
    });
  },
);
