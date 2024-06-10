import { z } from 'zod';
import { capitalize, countWords, pluralize } from '@lib/utils/format.ts';

const POST_RESTRICTIONS = {
  titleChars: {
    min: 5,
    max: 150,
  },
  contentWords: {
    min: 1,
    max: 500,
  },
  authorChars: {
    min: 5,
    max: 50,
  },
};

export const postContentSchema = z.object({
  title: z
    .string({
      required_error: "'title' is required.",
      invalid_type_error: "'title' must be a string.",
    })
    .trim()
    // Customize error message with currently received value.
    .superRefine((str, ctx) => {
      const currentLength = str.length;
      const { min, max } = POST_RESTRICTIONS.titleChars;

      if (currentLength < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: 'string',
          minimum: min,
          inclusive: true,
          message: `'title' must be at least ${min.toString()} ${pluralize('character', min)} (current: ${currentLength.toString()}).`,
        });
      }
      if (currentLength > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: 'string',
          maximum: max,
          inclusive: true,
          message: `'title' can't be more than ${max.toString()} ${pluralize('character', max)} (current: ${currentLength.toString()}).`,
        });
      }
    })
    .transform(capitalize),
  content: z
    .string({
      required_error: "'content' is required.",
      invalid_type_error: "'content' must be a string.",
    })
    .trim()
    .superRefine((str, ctx) => {
      const wordsCount = countWords(str);
      const { min, max } = POST_RESTRICTIONS.contentWords;

      if (wordsCount < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: 'string',
          minimum: min,
          inclusive: true,
          message: `'content' must contain at least ${min.toString()} ${pluralize('word', min)} (current: ${wordsCount.toString()}).`,
        });
      }
      if (wordsCount > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: 'string',
          maximum: max,
          inclusive: true,
          message: `'content' can't be more than ${max.toString()} ${pluralize('word', max)} (current: ${wordsCount.toString()}.)`,
        });
      }
    }),
  author: z
    .string({
      required_error: "'author' is required.",
      invalid_type_error: "'author' must be a string.",
    })
    .trim()
    .superRefine((str, ctx) => {
      const currentLength = str.length;
      const { min, max } = POST_RESTRICTIONS.authorChars;

      if (currentLength < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: 'string',
          minimum: min,
          inclusive: true,
          message: `'author' must be at least ${min.toString()} ${pluralize('character', min)} (current: ${currentLength.toString()}).`,
        });
      }
      if (currentLength > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: 'string',
          maximum: max,
          inclusive: true,
          message: `'author' can't be more than ${max.toString()} ${pluralize('character', max)} (current: ${currentLength.toString()}).`,
        });
      }
    })
    .transform(capitalize),
});

// Create additional strict schema to validate request body data, so passing any additional field will trigger an error.
export const createPostSchema = postContentSchema.strict();

export const updatePostSchema = createPostSchema.partial();

export const postSchema = createPostSchema.extend({
  id: z
    .number({
      required_error: "'id' is required.",
      invalid_type_error: "'id' must be a number.",
    })
    .int({
      message: "'id' must be an integer.",
    })
    .positive({
      message: "'id' must be stritcly positive.",
    }),
  date: z.string({
    required_error: "'date' is required.",
    invalid_type_error: "'date' must be a string.",
  }),
});
