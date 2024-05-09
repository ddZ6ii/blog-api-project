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

describe('DELETE request to remove post specified with invalid ID)', () => {
  let response;
  let postId = 'invalid';
  // Prevent axios from throwing an error if HTTP code is not within the 200 range.
  const options = {
    validateStatus: (status) => status < 500,
  };

  beforeAll(async () => {
    try {
      await blog.resetPosts();
      response = await axios.delete(`${API_BASE_URL}/posts/${postId}`, options);
    } catch (err) {
      console.error(`Failed to delete post with ID ${postId}!`, err);
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
    const pattern = new RegExp('invalid request parameter', 'i');
    expect(response.data).toMatchObject({
      message: expect.stringMatching(pattern),
    });
  });
});

describe('DELETE request to remove post specified with valid but non-matching ID)', () => {
  let response;
  let postId = 9999;
  // Prevent axios from throwing an error if HTTP code is not within the 200 range.
  const options = {
    validateStatus: (status) => status < 500,
  };

  beforeAll(async () => {
    try {
      await blog.resetPosts();
      response = await axios.delete(`${API_BASE_URL}/posts/${postId}`, options);
    } catch (err) {
      console.error(`Failed to fetch post with ID ${postId}!`, err);
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
    const pattern = new RegExp('no existing post with id', 'i');
    expect(response.data).toMatchObject({
      message: expect.stringMatching(pattern),
    });
  });
});

describe('DELETE request to remove post specified with valid and matching ID)', () => {
  let response;
  let postId = 3;
  const newPost = {
    title: "Amazing Things You Wouldn't Have Guessed About...",
    author: 'Myrtie Jasmine',
    content:
      'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
  };

  beforeEach(async () => {
    try {
      await blog.resetPosts();
      await axios.post(API_BASE_URL + '/posts', newPost);
      response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
    } catch (err) {
      console.error(`Failed to delete post with ID ${postId}!`, err);
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
    expect(response.headers.get('content-type')).toContain('text/plain');
  });

  it('response data should be of type string', () => {
    expectTypeOf(response.data).toBeString();
  });

  it('should return expect success message', async () => {
    const pattern = new RegExp('ok', 'i');
    expect(response.data).match(pattern);
  });
});
