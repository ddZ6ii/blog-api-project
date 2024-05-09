import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
} from 'vitest';
import axios from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog';

const TIMEOUT = 30000; // 30 sec
const { API_SERVER_PORT, LOCAL_HOST_IP_ADRESS } = process.env;
// Use local IP address instead of localhost to fix Axios error ECONNREFUSED.
const API_BASE_URL = `http://${LOCAL_HOST_IP_ADRESS}:${parseInt(API_SERVER_PORT, 10) ?? 8000}`;

describe('POST request to create a new blog post without body request)', () => {
  let response;
  let body;
  // Prevent axios from throwing an error if HTTP code is not within the 200 range.
  const options = {
    validateStatus: (status) => status < 500,
  };

  beforeAll(async () => {
    try {
      await blog.resetPosts();
      response = await axios.post(API_BASE_URL + '/posts', body, options);
    } catch (err) {
      console.error('Failed to create post!', err);
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
    const pattern = new RegExp('no post data', 'i');
    expect(response.data).toMatchObject({
      message: expect.stringMatching(pattern),
    });
  });
});

describe('POST request to create a new blog post with body request)', () => {
  let response;
  const newPost = {
    title: "Amazing Things You Wouldn't Have Guessed About...",
    author: 'Myrtie Jasmine',
    content:
      'Pellentesque justo nisl, laoreet ac magna vel, cursus consectetu  sem. Vestibulum in sem eu velit volutpat pharetra eu sit amet nunc. Aliquam in interdum lacus Nam facilisis turpis sit amet leo tincidunt auctor. Mauris cursus hendrerit facilisis. Curabitur purus magna, feugiat sed diam id, posuere consectetur ipsum. Nulla luctus lobortis nibh fringilla porta. Sed a ligula ut nibh placerat tincidunt eget et neque. Fusce at nunc tempus est hendrerit maximus. Pellentesque viverra eu mi nec accumsan. Fusce vitae efficitur est id eleifend sapien. In faucibus enim eget leo dignissim facilisis.',
  };
  // Prevent axios from throwing an error if HTTP code is not within the 200 range.
  const options = {
    validateStatus: (status) => status < 500,
  };

  beforeEach(async () => {
    try {
      await blog.resetPosts();
      response = await axios.post(API_BASE_URL + '/posts', newPost, options);
    } catch (err) {
      console.error('Failed to create post!', err);
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

  it('response data should be of type array', () => {
    expectTypeOf(response.data).toBeArray();
  });

  it('should return the created post', async () => {
    expect(response.data).toMatchObject([newPost]);
  });
});
