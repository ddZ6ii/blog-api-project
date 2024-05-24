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
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog.ts';
import { readFromJSON } from '@/utils/fileIO.ts';
import { Post, PostContent } from '@/types/post.type.ts';
import { SortSchema } from '@/types/post.schema.ts';
import { CustomErrorContent } from '@/errors/CustomError.ts';
import INITIAL_POSTS from '@data/initialPosts.json';

const TIMEOUT = 30000; // 30 sec
const { DEV } = import.meta.env;
// Use local IP address instead of localhost to fix Axios error ECONNREFUSED.
const SERVER_HOSTNAME = DEV
  ? `http://${process.env.LOCALHOST_IP_ADDRESS ?? 'localhost'}`
  : process.env.SERVER_HOSTNAME ?? 'localhost';
const SERVER_PORT = process.env.SERVER_API_PORT ?? '8000';

const API_BASE_URL = `${SERVER_HOSTNAME}:${SERVER_PORT}`;

describe.sequential('API routes', () => {
  beforeAll(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  }, TIMEOUT);

  afterAll(async () => {
    try {
      await blog.resetPosts();
    } catch (err) {
      console.error('Failed to reset posts!', err);
    }
  }, TIMEOUT);

  describe.sequential('GET request for all blog posts...', () => {
    beforeAll(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    afterAll(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    describe.sequential("...default sorted in 'DESC' order)", () => {
      let posts: Post[];
      let response: AxiosResponse<Post[]>;

      beforeAll(async () => {
        try {
          await blog.resetPosts();
          posts = await readFromJSON();
          response = await axios.get(`${API_BASE_URL}/posts`);
        } catch (err) {
          console.error('Failed to fetch posts!', err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 200', () => {
        expect(response.status).toBe(200);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type array', () => {
        expectTypeOf(response.data).toBeArray();
      });

      it.sequential('should return the expected number of posts', () => {
        expect(response.data).toHaveLength(posts.length);
      });

      it.sequential(
        'should return all of the posts in DESC order (default sorting)',
        () => {
          const sortedPosts = blog.sortPostsByDate(posts, SortSchema.enum.DESC);
          expect(response.data).toStrictEqual(sortedPosts);
        },
      );
    });

    describe.sequential("...sorted in 'ASC' order", () => {
      let posts: Post[];
      let response: AxiosResponse<Post[]>;

      beforeAll(async () => {
        try {
          await blog.resetPosts();
          posts = await readFromJSON();
          response = await axios.get(`${API_BASE_URL}/posts?sort=ASC`);
        } catch (err) {
          console.error('Failed to fetch posts sorted in ASC order!', err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 200', () => {
        expect(response.status).toBe(200);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type array', () => {
        expectTypeOf(response.data).toBeArray();
      });

      it.sequential('should return the expected number of posts', () => {
        expect(response.data).toHaveLength(posts.length);
      });

      it.sequential('should return all of the posts in ascending order', () => {
        const sortedPosts = blog.sortPostsByDate(posts, SortSchema.enum.ASC);
        expect(response.data).toStrictEqual(sortedPosts);
      });
    });

    describe.sequential("...matching 'search' filter", () => {
      let posts: Post[];
      let response: AxiosResponse<Post[]>;

      beforeAll(async () => {
        try {
          await blog.resetPosts();
          posts = await readFromJSON();
          response = await axios.get(`${API_BASE_URL}/posts?filter=thompson`);
        } catch (err) {
          console.error('Failed to search matching posts!', err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 200', () => {
        expect(response.status).toBe(200);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type array', () => {
        expectTypeOf(response.data).toBeArray();
      });

      it.sequential('should return the expected number of posts', () => {
        expect(response.data).toHaveLength(1);
      });

      it.sequential('should return all posts matching search filter', () => {
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

      it.sequential("error name should be 'error'", () => {
        expect(errorContent.status).toMatch('error');
      });

      it.sequential('error status code should be 400', () => {
        expect(errorContent.code).toBe(400);
      });

      it.sequential('error should contain the expected error message', () => {
        expect(errorContent).toMatchObject({
          message: expect.stringMatching(
            /expected 'sort' to be 'ASC' or 'DESC'/i,
          ) as string,
        });
      });

      it.sequential('response should have content-type application', () => {
        expect(errorResponse?.headers['content-type']).toContain(
          'application/json',
        );
      });

      it.sequential('response data should be of type object', () => {
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

      it.sequential("error name should be 'error'", () => {
        expect(errorContent.status).toMatch('error');
      });

      it.sequential('error status code should be 400', () => {
        expect(errorContent.code).toBe(400);
      });

      it.sequential('error should contain the expected error message', () => {
        expect(errorResponse?.data).toMatchObject({
          message: expect.stringMatching(/unrecognized key/i) as string,
        });
      });

      it.sequential('response should have content-type application', () => {
        expect(errorResponse?.headers['content-type']).toContain(
          'application/json',
        );
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(errorContent).toBeObject();
      });
    });
  });

  describe.sequential('GET request for post specified by...', () => {
    // Prevent axios from throwing an error if HTTP code is not within the 200 range.
    const options: AxiosRequestConfig = {
      validateStatus: (status) => status < 500,
    };

    beforeAll(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    afterAll(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    describe.sequential("...invalid 'id')", () => {
      let response: AxiosResponse;
      let errorContent: CustomErrorContent;
      const postId = 'invalid';

      beforeAll(async () => {
        try {
          response = await axios.get(
            `${API_BASE_URL}/posts/${postId}`,
            options,
          );
          if (response.status !== 200) {
            errorContent = response.data as CustomErrorContent;
          }
        } catch (err) {
          console.error(`Failed to fetch post with ID ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential("error name should be 'error'", () => {
        expect(errorContent.status).toMatch('error');
      });

      it.sequential('error status code should be 400', () => {
        expect(errorContent.code).toBe(400);
      });

      it.sequential('error should contain the expected error message', () => {
        expect(errorContent).toMatchObject({
          message: expect.stringMatching(/'id' must be a number/i) as string,
        });
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(errorContent).toBeObject();
      });
    });

    describe.sequential('...valid but non-matching ID)', () => {
      let response: AxiosResponse;
      let errorContent: CustomErrorContent;
      const postId = '9999';

      beforeAll(async () => {
        try {
          response = await axios.get(
            `${API_BASE_URL}/posts/${postId}`,
            options,
          );
          if (response.status !== 200) {
            errorContent = response.data as CustomErrorContent;
          }
        } catch (err) {
          console.error(`Failed to fetch post with ID ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential("error name should be 'error'", () => {
        expect(errorContent.status).toMatch('error');
      });

      it.sequential('error status code should be 404', () => {
        expect(errorContent.code).toBe(404);
      });

      it.sequential('error should contain the expected error message', () => {
        expect(errorContent).toMatchObject({
          message: expect.stringMatching(
            /no existing post with 'id'/i,
          ) as string,
        });
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(errorContent).toBeObject();
      });
    });

    describe.sequential('...valid and matching ID)', () => {
      let posts: Post[];
      let response: AxiosResponse<Post>;
      const postId = '2';

      beforeAll(async () => {
        try {
          await blog.resetPosts();
          posts = await readFromJSON();
          response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
        } catch (err) {
          console.error(`Failed to fetch post with ID ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 200', () => {
        expect(response.status).toBe(200);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(response.data).toBeObject();
      });

      it.sequential('should return matching post', () => {
        expect(response.data).toStrictEqual(posts[1]);
      });
    });
  });

  describe.sequential('POST request to create a new blog post...', () => {
    // Prevent axios from throwing an error if HTTP code is not within the 200 range.
    const options: AxiosRequestConfig = {
      validateStatus: (status) => status < 500,
    };

    beforeAll(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    afterAll(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    describe.sequential('...without body request', () => {
      let response: AxiosResponse;
      let errorContent: CustomErrorContent;
      const body = undefined;

      beforeAll(async () => {
        try {
          response = await axios.post(`${API_BASE_URL}/posts`, body, {
            ...options,
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

      it.sequential("error name should be 'error'", () => {
        expect(errorContent.status).toMatch('error');
      });

      it.sequential('error status code should be 400', () => {
        expect(errorContent.code).toBe(400);
      });

      it.sequential('error should contain the expected error message', () => {
        expect(response.data).toMatchObject({
          message: expect.stringMatching(/required/i) as string,
        });
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(errorContent).toBeObject();
      });
    });

    describe.sequential('...with valid body request', () => {
      let response: AxiosResponse<Post[]>;

      const validPostContent: PostContent = {
        title: "Amazing Things You Wouldn't Have Guessed About...",
        content:
          'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
        author: 'Myrtie Jasmine',
      };
      beforeAll(async () => {
        try {
          response = await axios.post(
            `${API_BASE_URL}/posts`,
            validPostContent,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          );
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

      it.sequential('response status should be 200', () => {
        expect(response.status).toBe(200);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(response.data).toBeObject();
      });

      it.sequential('should return the created post', () => {
        expect(response.data).toMatchObject(validPostContent);
      });
    });

    describe.sequential(
      '...with invalid additional field within body request',
      () => {
        let response: AxiosResponse;
        let errorContent: CustomErrorContent;

        const validPostContent: unknown = {
          title: "Amazing Things You Wouldn't Have Guessed About...",
          content:
            'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
          author: 'Myrtie Jasmine',
          any: 'any',
        };
        beforeAll(async () => {
          try {
            response = await axios.post(
              `${API_BASE_URL}/posts`,
              validPostContent,
              {
                ...options,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              },
            );
            if (response.status !== 200) {
              errorContent = response.data as CustomErrorContent;
            }
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

        it.sequential("error name should be 'error'", () => {
          expect(errorContent.status).toMatch('error');
        });

        it.sequential('error status code should be 400', () => {
          expect(errorContent.code).toBe(400);
        });

        it.sequential('error should contain the expected error message', () => {
          expect(response.data).toMatchObject({
            message: expect.stringMatching(/unrecognized key/i) as string,
          });
        });

        it.sequential('response should have content-type application', () => {
          expect(response.headers['content-type']).toContain(
            'application/json',
          );
        });

        it.sequential('response data should be of type object', () => {
          expectTypeOf(errorContent).toBeObject();
        });
      },
    );
  });

  describe.sequential(
    'PATCH request to partially update post specified by...',
    () => {
      // Prevent axios from throwing an error if HTTP code is not within the 200 range.
      const options: AxiosRequestConfig = {
        validateStatus: (status) => status < 500,
      };

      beforeAll(async () => {
        try {
          await blog.resetPosts();
        } catch (err) {
          console.error('Failed to reset posts!', err);
        }
      }, TIMEOUT);

      afterAll(async () => {
        try {
          await blog.resetPosts();
        } catch (err) {
          console.error('Failed to reset posts!', err);
        }
      }, TIMEOUT);

      describe.sequential("...invalid 'id'", () => {
        let response: AxiosResponse;
        let errorContent: CustomErrorContent;
        const postId = 'invalid';
        const updatedPostContent: Partial<PostContent> = {
          title: 'New Title',
          content: 'New Content',
          author: 'Mia Williams',
        };

        beforeAll(async () => {
          try {
            response = await axios.patch(
              `${API_BASE_URL}/posts/${postId}`,
              updatedPostContent,
              {
                ...options,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              },
            );
            if (response.status !== 200) {
              errorContent = response.data as CustomErrorContent;
            }
          } catch (err) {
            console.error(`Failed to update post with ID ${postId}!`, err);
          }
        }, TIMEOUT);

        it.sequential("error name should be 'error'", () => {
          expect(errorContent.status).toMatch('error');
        });

        it.sequential('error status code should be 400', () => {
          expect(errorContent.code).toBe(400);
        });

        it.sequential('error should contain the expected error message', () => {
          expect(response.data).toMatchObject({
            message: expect.stringMatching(/'id' must be a number/i) as string,
          });
        });

        it.sequential('response should have content-type application', () => {
          expect(response.headers['content-type']).toContain(
            'application/json',
          );
        });

        it.sequential('response data should be of type object', () => {
          expectTypeOf(errorContent).toBeObject();
        });
      });

      describe.sequential("...valid but non-matching 'id", () => {
        let response: AxiosResponse;
        let errorContent: CustomErrorContent;
        const postId = '9999';
        const updatedPostContent: Partial<PostContent> = {
          title: 'New Title',
          content: 'New Content',
          author: 'Mia Williams',
        };

        beforeAll(async () => {
          try {
            response = await axios.patch(
              `${API_BASE_URL}/posts/${postId}`,
              updatedPostContent,
              {
                ...options,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              },
            );
            if (response.status !== 200) {
              errorContent = response.data as CustomErrorContent;
            }
          } catch (err) {
            console.error(`Failed to update post with ID ${postId}!`, err);
          }
        }, TIMEOUT);

        it.sequential("error name should be 'error'", () => {
          expect(errorContent.status).toMatch('error');
        });

        it.sequential('error status code should be 404', () => {
          expect(errorContent.code).toBe(404);
        });

        it.sequential('error should contain the expected error message', () => {
          expect(response.data).toMatchObject({
            message: expect.stringMatching(
              /no existing post with 'id'/i,
            ) as string,
          });
        });

        it.sequential('response should have content-type application', () => {
          expect(response.headers['content-type']).toContain(
            'application/json',
          );
        });

        it.sequential('response data should be of type object', () => {
          expectTypeOf(errorContent).toBeObject();
        });
      });

      describe.sequential(
        "...valid and matching 'id' but without body request",
        () => {
          let response: AxiosResponse<Post>;
          const postContent: Partial<PostContent> = {};
          let posts: Post[];
          let postId: number;

          beforeAll(async () => {
            try {
              posts = await readFromJSON();
              if (posts.length) {
                postId = posts[posts.length - 1].id;
              }
              if (!postId) {
                throw new Error("'id' is undefined");
              }
              response = await axios.patch(
                `${API_BASE_URL}/posts/${postId.toString()}`,
                postContent,
                {
                  ...options,
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

          it.sequential('response status should be 200', () => {
            expect(response.status).toBe(200);
          });

          it.sequential('response should have content-type application', () => {
            expect(response.headers['content-type']).toContain(
              'application/json',
            );
          });

          it.sequential('response data should be of type object', () => {
            expectTypeOf(response.data).toBeObject();
          });

          it.sequential('should return the updated post', () => {
            expect(response.data.id).toBe(posts[posts.length - 1].id);
          });
        },
      );

      describe.sequential('...valid ID and with body request)', () => {
        let response: AxiosResponse<Post>;
        const postId = '2';
        const updatedContent: Partial<PostContent> = {
          title: 'New Title',
          content: 'New Content',
          author: 'Mia Williams',
        };

        beforeAll(async () => {
          try {
            response = await axios.patch(
              `${API_BASE_URL}/posts/${postId}`,
              updatedContent,
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              },
            );
          } catch (err) {
            console.error(`Failed to update post with 'id' ${postId}!`, err);
          }
        }, TIMEOUT);

        it.sequential('response status should be 200', () => {
          expect(response.status).toBe(200);
        });

        it.sequential('response should have content-type application', () => {
          expect(response.headers['content-type']).toContain(
            'application/json',
          );
        });

        it.sequential('response data should be of type object', () => {
          expectTypeOf(response.data).toBeObject();
        });

        it.sequential('should return the updated post', () => {
          expect(response.data).toMatchObject(updatedContent);
        });
      });
    },
  );

  describe.sequential('DELETE request to remove post specified by...', () => {
    // Prevent axios from throwing an error if HTTP code is not within the 200 range.
    const options: AxiosRequestConfig = {
      validateStatus: (status) => status < 500,
    };

    beforeAll(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    afterAll(async () => {
      try {
        await blog.resetPosts();
      } catch (err) {
        console.error('Failed to reset posts!', err);
      }
    }, TIMEOUT);

    describe.sequential('...invalid ID)', () => {
      let response: AxiosResponse;
      let errorContent: CustomErrorContent;
      const postId = 'invalid';

      beforeAll(async () => {
        try {
          await blog.resetPosts();
          response = await axios.delete(
            `${API_BASE_URL}/posts/${postId}`,
            options,
          );
          if (response.status !== 200) {
            errorContent = response.data as CustomErrorContent;
          }
        } catch (err) {
          console.error(`Failed to delete post with 'id' ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential("error name should be 'error'", () => {
        expect(errorContent.status).toMatch('error');
      });

      it.sequential('error status code should be 400', () => {
        expect(errorContent.code).toBe(400);
      });

      it.sequential('error should contain the expected error message', () => {
        expect(response.data).toMatchObject({
          message: expect.stringMatching(/'id' must be a number/i) as string,
        });
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(errorContent).toBeObject();
      });
    });

    describe.sequential('...valid but non-matching ID)', () => {
      let response: AxiosResponse;
      let errorContent: CustomErrorContent;
      const postId = '9999';

      beforeAll(async () => {
        try {
          await blog.resetPosts();
          response = await axios.delete(
            `${API_BASE_URL}/posts/${postId}`,
            options,
          );
          if (response.status !== 200) {
            errorContent = response.data as CustomErrorContent;
          }
        } catch (err) {
          console.error(`Failed to fetch post with 'id' ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential("error name should be 'error'", () => {
        expect(errorContent.status).toMatch('error');
      });

      it.sequential('error status code should be 404', () => {
        expect(errorContent.code).toBe(404);
      });

      it.sequential('error should contain the expected error message', () => {
        expect(response.data).toMatchObject({
          message: expect.stringMatching(
            /no existing post with 'id'/i,
          ) as string,
        });
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(errorContent).toBeObject();
      });
    });

    describe.sequential('...valid and matching ID)', () => {
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
          await axios.post(`${API_BASE_URL}/posts`, newPost, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
        } catch (err) {
          console.error(`Failed to delete post with 'id' ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 200', () => {
        expect(response.status).toBe(200);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('text/plain');
      });

      it.sequential('response data should be of type string', () => {
        expectTypeOf(response.data).toBeString();
      });

      it.sequential('should return expected success message', () => {
        expect(response.data).match(/ok/i);
      });
    });
  });

  describe.sequential('POST request to reset blog posts', () => {
    let response: AxiosResponse<Post[]>;

    beforeAll(async () => {
      try {
        response = await axios.post(`${API_BASE_URL}/posts/reset`);
      } catch (err) {
        console.error('Failed request to reset posts!', err);
      }
    }, TIMEOUT);

    it.sequential('response status should be 200', () => {
      expect(response.status).toBe(200);
    });

    it.sequential('response should have content-type application', () => {
      expect(response.headers['content-type']).toContain('application/json');
    });

    it.sequential('response data should be of type array', () => {
      expectTypeOf(response.data).toBeArray();
    });

    it.sequential('should return the expected number of posts', () => {
      expect(response.data).toHaveLength(INITIAL_POSTS.length);
    });

    it.sequential('should return all initial posts', () => {
      expect(response.data).toStrictEqual(INITIAL_POSTS);
    });
  });

  describe.sequential("GET request to undefined API's endpoint", () => {
    let response: AxiosResponse;
    let errorContent: CustomErrorContent;
    // Prevent axios from throwing an error if HTTP code is not within the 200 range.
    const options: AxiosRequestConfig = { validateStatus: null };

    beforeAll(async () => {
      try {
        response = await axios.get(`${API_BASE_URL}/invalid`, options);
        if (response.status !== 200) {
          errorContent = response.data as CustomErrorContent;
        }
      } catch (err) {
        console.error('Failed request to invalid endpoint!', err);
      }
    }, TIMEOUT);

    it.sequential("error name should be 'error'", () => {
      expect(errorContent.status).toMatch('error');
    });

    it.sequential('error status code should be 404', () => {
      expect(errorContent.code).toBe(404);
    });

    it.sequential('error should contain the expected error message', () => {
      expect(response.data).toMatchObject({
        message: expect.stringMatching(/invalid route/i) as string,
      });
    });

    it.sequential('response should have content-type application', () => {
      expect(response.headers['content-type']).toContain('application/json');
    });

    it.sequential('response data should be of type object', () => {
      expectTypeOf(errorContent).toBeObject();
    });
  });
});
