import { AxiosResponse } from 'axios';
import { CustomErrorContent } from './error.type.ts';

export type AxiosCustom<T> =
  | AxiosResponse<T>
  | AxiosResponse<CustomErrorContent>;
