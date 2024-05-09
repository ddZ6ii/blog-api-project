import {
  describe,
  expect,
  expectTypeOf,
  it,
  beforeAll,
  beforeEach,
  afterEach,
} from 'vitest';
import axios from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog';

const TIMEOUT = 30000; // 30 sec
const { API_SERVER_PORT, LOCAL_HOST_IP_ADRESS } = process.env;
// Use local IP address instead of localhost to fix Axios error ECONNREFUSED.
const API_BASE_URL = `http://${LOCAL_HOST_IP_ADRESS}:${parseInt(API_SERVER_PORT, 10) ?? 8000}`;

describe('PATCH request to partially update post specified with invalid ID)', () => {
  let response;
  const updatedPostContent = {
    title: 'New Title',
    content: 'New Content',
    author: 'Mia Williams',
  };
  let postId = 'invalid';
  // Prevent axios from throwing an error if HTTP code is not within the 200 range.
  const options = {
    validateStatus: (status) => status < 500,
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

  it('response status should be 400', () => {
    expect(response.status).toBe(400);
  });

  it('response should have content-type application', () => {
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('response data should be of type object', () => {
    expectTypeOf(response.data).toBeObject();
  });

  it('response data should contain the expected error message', async () => {
    const pattern = new RegExp('invalid request', 'i');
    expect(response.data).toMatchObject({
      message: expect.stringMatching(pattern),
    });
  });
});

describe('PATCH request to partially update post specified with valid but non-matching ID)', () => {
  let response;
  const updatedPostContent = {
    title: 'New Title',
    content: 'New Content',
    author: 'Mia Williams',
  };
  const postId = 9999;
  // Prevent axios from throwing an error if HTTP code is not within the 200 range.
  const options = {
    validateStatus: (status) => status < 500,
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

  it('response status should be 404', () => {
    expect(response.status).toBe(404);
  });

  it('response should have content-type application', () => {
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('response data should be of type object', () => {
    expectTypeOf(response.data).toBeObject();
  });

  it('response data should contain the expected error message', async () => {
    const pattern = new RegExp('no existing post', 'i');
    expect(response.data).toMatchObject({
      message: expect.stringMatching(pattern),
    });
  });
});

describe('PATCH request to partially update post specified with valid and matching ID but without body request)', () => {
  let response;
  let updatedPostContent;
  const postId = blog.posts.at(-1).id;
  // Prevent axios from throwing an error if HTTP code is not within the 200 range.
  const options = {
    validateStatus: (status) => status < 500,
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

  it('response status should be 400', () => {
    expect(response.status).toBe(400);
  });

  it('response should have content-type application', () => {
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('response data should be of type object', () => {
    expectTypeOf(response.data).toBeObject();
  });

  it('response data should contain the expected error message', async () => {
    const pattern = new RegExp('invalid request', 'i');
    expect(response.data).toMatchObject({
      message: expect.stringMatching(pattern),
    });
  });
});

describe('PATCH request to partially update post specified with valid ID and with body request)', () => {
  let response;
  const updatedPostContent = {
    title: 'New Title',
    content: 'New Content',
    author: 'Mia Williams',
  };
  const postId = 2;

  beforeEach(async () => {
    try {
      await blog.resetPosts();
      response = await axios.patch(
        `${API_BASE_URL}/posts/${postId}`,
        updatedPostContent,
      );
    } catch (err) {
      console.error(`Failed to update post with ID ${postId}!`, err);
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

  it('response data should be of type object', () => {
    expectTypeOf(response.data).toBeObject();
  });

  it('should return the updated post', async () => {
    expect(response.data).toMatchObject(updatedPostContent);
  });
});
