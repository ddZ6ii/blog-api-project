import { z } from 'zod';
import { PostContentSchema, PostContentStrictSchema } from './post.schema.ts';

export const CreatePostSchema = z.object({
  body: PostContentSchema,
});

export const CreatePostStrictSchema = z.object({
  body: PostContentStrictSchema,
});
