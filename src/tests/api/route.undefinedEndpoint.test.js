import { beforeAll, describe, expect, expectTypeOf, it } from 'vitest';
import axios from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog';

const TIMEOUT = 30000; // 30 sec
const { API_SERVER_PORT, LOCAL_HOST_IP_ADRESS } = process.env;
// Use local IP address instead of localhost to fix Axios error ECONNREFUSED.
const API_BASE_URL = `http://${LOCAL_HOST_IP_ADRESS}:${parseInt(API_SERVER_PORT, 10) ?? 8000}`;

describe("GET request to undefined API's endpoint", () => {
  let response;
  // Prevent axios from throwing an error if HTTP code is not within the 200 range.
  const options = { validateStatus: false };

  beforeAll(async () => {
    try {
      response = await axios.get(API_BASE_URL + '/invalid', options);
    } catch (err) {
      console.error('Failed request to invalid endpoint!', err);
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
    const pattern = new RegExp('invalid route', 'i');
    expect(response.data).toMatchObject({
      message: expect.stringMatching(pattern),
    });
  });
});
