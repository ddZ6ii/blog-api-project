import { beforeAll, describe, expect, expectTypeOf, it } from 'vitest';
import axios from 'axios';
import 'dotenv/config';
import { blog } from '@store/blog';

const TIMEOUT = 30000; // 30 sec
const { API_SERVER_PORT, LOCAL_HOST_IP_ADRESS } = process.env;
// Use local IP address instead of localhost to fix Axios error ECONNREFUSED.
const API_BASE_URL = `http://${LOCAL_HOST_IP_ADRESS}:${parseInt(API_SERVER_PORT, 10) ?? 8000}`;

describe('POST request to reset blog posts', () => {
  let response;

  beforeAll(async () => {
    try {
      response = await axios.post(API_BASE_URL + '/posts/reset');
    } catch (err) {
      console.error('Failed request to reset posts!', err);
    }
  }, TIMEOUT);

  it('response status should be 205', () => {
    expect(response.status).toBe(205);
  });

  it('response should have content-type application', () => {
    expect(response.headers.get('content-type')).toContain('text/plain');
  });

  it('response data should be of type string', () => {
    expect(response.data).toBe('');
  });
});
