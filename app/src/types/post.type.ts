import { z } from 'zod';
import { postContentSchema, postSchema } from '@lib/schemas/post.schema.ts';

export type Filter = {
  search: string;
};

export type PostIdParam = {
  id: string;
};

export type PostContent = z.infer<typeof postContentSchema>;

export type Post = z.infer<typeof postSchema>;
