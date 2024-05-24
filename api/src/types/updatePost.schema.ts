import { z } from 'zod';
import { PostIdSchema, UpdateSchema } from './post.schema.ts';

export const UpdatePostSchema = z.object({
  body: UpdateSchema,
  params: PostIdSchema,
});
