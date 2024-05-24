import { z } from 'zod';
import { SearchSchema } from './post.schema.ts';

export const SearchPostsSchema = z.object({
  query: SearchSchema,
});
