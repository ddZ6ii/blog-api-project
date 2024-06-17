import { describe, expect, expectTypeOf, it, beforeAll } from 'vitest';
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import { CustomErrorContent } from '@/types/CustomError.class.ts';
import { API_URL, OPTIONS, TIMEOUT } from './config.ts';

describe.sequential('API routes', () => {
  describe.sequential("GET request to undefined API's endpoint", () => {
    let response: AxiosResponse;
    let errorContent: CustomErrorContent;

    beforeAll(async () => {
      try {
        response = await axios.get(`${API_URL}/invalid`, OPTIONS);
        if (response.status !== 200) {
          errorContent = response.data as CustomErrorContent;
        }
      } catch (err) {
        console.error('Failed request to invalid endpoint!', err);
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
        message: expect.stringMatching(/invalid route/i) as string,
      });
    });

    it('response should have content-type application', () => {
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('response data should be of type object', () => {
      expectTypeOf(errorContent).toBeObject();
    });
  });
});
