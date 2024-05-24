import { z } from 'zod';
import { PostIdSchema } from './post.schema.ts';

export const FindPostSchema = z.object({
  params: PostIdSchema,
});
