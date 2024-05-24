import { Post } from './posts.interface.ts';

export type PostContent = Omit<Post, 'id' | 'date'>;

export type PostId = number | string | undefined;
