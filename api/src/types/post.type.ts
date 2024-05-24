import { z } from 'zod';
import {
  PostContentStrictSchema,
  PostIdParamSchema,
  PostSchema,
  SearchSchema,
  SortSchema,
} from './post.schema.ts';

export type SortEnum = z.infer<typeof SortSchema>;

export type Search = z.infer<typeof SearchSchema>;

export type PostIdParam = z.infer<typeof PostIdParamSchema>;

export type PostContent = z.infer<typeof PostContentStrictSchema>;

export type Post = z.infer<typeof PostSchema>;
