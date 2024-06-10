import { AxiosResponse } from 'axios';
import { CustomErrorContent } from '@/types/error.type.ts';

export function isErrorResponse<T>(
  response: AxiosResponse<T> | AxiosResponse<CustomErrorContent>,
): response is AxiosResponse<CustomErrorContent> {
  return response.status !== 200;
}
