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
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog.ts';
import { readFromJSON } from '@/utils/fileIO.ts';
import { Post } from '@/ts/posts.interface.ts';
import { PostId } from '@/ts/posts.type.ts';
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

    describe.sequential('...default sorted by DESC order)', () => {
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
          const sortedPosts = blog.sortPostsByDate(posts, 'desc');
          expect(response.data).toStrictEqual(sortedPosts);
        },
      );
    });

    describe.sequential('...sorted by ASC order', () => {
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
        const sortedPosts = blog.sortPostsByDate(posts, 'asc');
        expect(response.data).toStrictEqual(sortedPosts);
      });
    });

    describe.sequential('...matching search filter', () => {
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

    describe.sequential('...invalid ID)', () => {
      let response: AxiosResponse<object>;
      const postId: PostId = 'invalid';

      beforeAll(async () => {
        try {
          response = await axios.get(
            `${API_BASE_URL}/posts/${postId}`,
            options,
          );
        } catch (err) {
          console.error(`Failed to fetch post with ID ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 400', () => {
        expect(response.status).toBe(400);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(response.data).toBeObject();
      });

      it.sequential(
        'response data should contain the expected error message',
        () => {
          expect(response.data).toMatchObject({
            message: expect.stringMatching(/invalid request parameter/i),
          });
        },
      );
    });

    describe.sequential('...valid but non-matching ID)', () => {
      let response: AxiosResponse<object>;
      const postId: PostId = '9999';

      beforeAll(async () => {
        try {
          response = await axios.get(
            `${API_BASE_URL}/posts/${postId}`,
            options,
          );
        } catch (err) {
          console.error(`Failed to fetch post with ID ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 404', () => {
        expect(response.status).toBe(404);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(response.data).toBeObject();
      });

      it.sequential(
        'response data should contain the expected error message',
        () => {
          expect(response.data).toMatchObject({
            message: expect.stringMatching(/no existing post with id/i),
          });
        },
      );
    });

    describe.sequential('...valid and matching ID)', () => {
      let posts: Post[];
      let response: AxiosResponse<Post>;
      const postId: PostId = '2';

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

    describe.sequential('...without body request)', () => {
      let response: AxiosResponse<object>;
      const body = undefined;

      beforeAll(async () => {
        try {
          response = await axios.post(`${API_BASE_URL}/posts`, body, options);
        } catch (err) {
          console.error('Failed to create post!', err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 400', () => {
        expect(response.status).toBe(400);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(response.data).toBeObject();
      });

      it.sequential(
        'response data should contain the expected error message',
        () => {
          expect(response.data).toMatchObject({
            message: expect.stringMatching(/no post data/i),
          });
        },
      );
    });

    describe.sequential('...with body request)', () => {
      let response: AxiosResponse<Post[]>;
      const newPost: Partial<Post> = {
        title: "Amazing Things You Wouldn't Have Guessed About...",
        author: 'Myrtie Jasmine',
        content:
          'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
      };
      beforeAll(async () => {
        try {
          response = await axios.post(`${API_BASE_URL}/posts`, newPost);
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

      it.sequential('response data should be of type array', () => {
        expectTypeOf(response.data).toBeArray();
      });

      it.sequential('should return the created post', () => {
        expect(response.data).toMatchObject([newPost]);
      });
    });
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

      describe.sequential('...invalid ID)', () => {
        let response: AxiosResponse<object>;
        const postId: PostId = 'invalid';
        const updatedPostContent: Partial<Post> = {
          title: 'New Title',
          content: 'New Content',
          author: 'Mia Williams',
        };

        beforeAll(async () => {
          try {
            response = await axios.patch(
              `${API_BASE_URL}/posts/${postId}`,
              updatedPostContent,
              options,
            );
          } catch (err) {
            console.error(`Failed to update post with ID ${postId}!`, err);
          }
        }, TIMEOUT);

        it.sequential('response status should be 400', () => {
          expect(response.status).toBe(400);
        });

        it.sequential('response should have content-type application', () => {
          expect(response.headers['content-type']).toContain(
            'application/json',
          );
        });

        it.sequential('response data should be of type object', () => {
          expectTypeOf(response.data).toBeObject();
        });

        it.sequential(
          'response data should contain the expected error message',
          () => {
            expect(response.data).toMatchObject({
              message: expect.stringMatching(/invalid request/i),
            });
          },
        );
      });

      describe.sequential('...valid but non-matching ID)', () => {
        let response: AxiosResponse<object>;
        const postId: PostId = '9999';
        const updatedPostContent: Partial<Post> = {
          title: 'New Title',
          content: 'New Content',
          author: 'Mia Williams',
        };

        beforeAll(async () => {
          try {
            response = await axios.patch(
              `${API_BASE_URL}/posts/${postId}`,
              updatedPostContent,
              options,
            );
          } catch (err) {
            console.error(`Failed to update post with ID ${postId}!`, err);
          }
        }, TIMEOUT);

        it.sequential('response status should be 404', () => {
          expect(response.status).toBe(404);
        });

        it.sequential('response should have content-type application', () => {
          expect(response.headers['content-type']).toContain(
            'application/json',
          );
        });

        it.sequential('response data should be of type object', () => {
          expectTypeOf(response.data).toBeObject();
        });

        it.sequential(
          'response data should contain the expected error message',
          () => {
            expect(response.data).toMatchObject({
              message: expect.stringMatching(/no existing post/i),
            });
          },
        );
      });

      describe.sequential(
        '...valid and matching ID but without body request)',
        () => {
          let response: AxiosResponse<object>;
          const updatedPostContent = undefined;
          let posts: Post[];
          let postId: PostId;

          beforeAll(async () => {
            try {
              posts = await readFromJSON();
              postId = posts.at(-1)?.id;
              if (!postId) throw new Error('Post ID is undefined');
              response = await axios.patch(
                `${API_BASE_URL}/posts/${postId.toString()}`,
                updatedPostContent,
                options,
              );
            } catch (err) {
              console.error(
                `Failed to update post with ID ${postId ? postId.toString() : ''}!`,
                err,
              );
            }
          }, TIMEOUT);

          it.sequential('response status should be 400', () => {
            expect(response.status).toBe(400);
          });

          it.sequential('response should have content-type application', () => {
            expect(response.headers['content-type']).toContain(
              'application/json',
            );
          });

          it.sequential('response data should be of type object', () => {
            expectTypeOf(response.data).toBeObject();
          });

          it.sequential(
            'response data should contain the expected error message',
            () => {
              expect(response.data).toMatchObject({
                message: expect.stringMatching(/invalid request/i),
              });
            },
          );
        },
      );

      describe.sequential('...valid ID and with body request)', () => {
        let response: AxiosResponse<Post>;
        const postId: PostId = '2';
        const updatedPostContent: Partial<Post> = {
          title: 'New Title',
          content: 'New Content',
          author: 'Mia Williams',
        };

        beforeAll(async () => {
          try {
            response = await axios.patch(
              `${API_BASE_URL}/posts/${postId}`,
              updatedPostContent,
            );
          } catch (err) {
            console.error(`Failed to update post with ID ${postId}!`, err);
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
          expect(response.data).toMatchObject(updatedPostContent);
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
      let response: AxiosResponse<object>;
      const postId: PostId = 'invalid';

      beforeAll(async () => {
        try {
          await blog.resetPosts();
          response = await axios.delete(
            `${API_BASE_URL}/posts/${postId}`,
            options,
          );
        } catch (err) {
          console.error(`Failed to delete post with ID ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 400', () => {
        expect(response.status).toBe(400);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(response.data).toBeObject();
      });

      it.sequential(
        'response data should contain the expected error message',
        () => {
          expect(response.data).toMatchObject({
            message: expect.stringMatching(/invalid request parameter/i),
          });
        },
      );
    });

    describe.sequential('...valid but non-matching ID)', () => {
      let response: AxiosResponse<object>;
      const postId: PostId = '9999';

      beforeAll(async () => {
        try {
          await blog.resetPosts();
          response = await axios.delete(
            `${API_BASE_URL}/posts/${postId}`,
            options,
          );
        } catch (err) {
          console.error(`Failed to fetch post with ID ${postId}!`, err);
        }
      }, TIMEOUT);

      it.sequential('response status should be 404', () => {
        expect(response.status).toBe(404);
      });

      it.sequential('response should have content-type application', () => {
        expect(response.headers['content-type']).toContain('application/json');
      });

      it.sequential('response data should be of type object', () => {
        expectTypeOf(response.data).toBeObject();
      });

      it.sequential(
        'response data should contain the expected error message',
        () => {
          expect(response.data).toMatchObject({
            message: expect.stringMatching(/no existing post with id/i),
          });
        },
      );
    });

    describe.sequential('...valid and matching ID)', () => {
      let response: AxiosResponse<string>;
      const postId: PostId = '3';
      const newPost: Partial<Post> = {
        title: "Amazing Things You Wouldn't Have Guessed About...",
        author: 'Myrtie Jasmine',
        content:
          'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
      };

      beforeAll(async () => {
        try {
          await axios.post(`${API_BASE_URL}/posts`, newPost);
          response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
        } catch (err) {
          console.error(`Failed to delete post with ID ${postId}!`, err);
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

      it.sequential('should return expect success message', () => {
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

    // it.sequential('should return the expected number of posts', () => {
    //   expect(response.data).toHaveLength(INITIAL_POSTS.length);
    // });

    it.sequential('should return all initial posts', () => {
      expect(response.data).toStrictEqual(INITIAL_POSTS);
    });
  });

  describe.sequential("GET request to undefined API's endpoint", () => {
    let response: AxiosResponse<object>;
    // Prevent axios from throwing an error if HTTP code is not within the 200 range.
    const options: AxiosRequestConfig = { validateStatus: null };

    beforeAll(async () => {
      try {
        response = await axios.get(`${API_BASE_URL}/invalid`, options);
      } catch (err) {
        console.error('Failed request to invalid endpoint!', err);
      }
    }, TIMEOUT);

    it.sequential('response status should be 404', () => {
      expect(response.status).toBe(404);
    });

    it.sequential('response should have content-type application', () => {
      expect(response.headers['content-type']).toContain('application/json');
    });

    it.sequential('response data should be of type object', () => {
      expectTypeOf(response.data).toBeObject();
    });

    it.sequential(
      'response data should contain the expected error message',
      () => {
        expect(response.data).toMatchObject({
          message: expect.stringMatching(/invalid route/i),
        });
      },
    );
  });
});