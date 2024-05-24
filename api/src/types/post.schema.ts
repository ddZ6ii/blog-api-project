import { capitalize } from '@/utils/capitalize.ts';
import { countWords } from '@/utils/countWords.ts';
import { pluralize } from '@/utils/pluralize.ts';
import { z } from 'zod';

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

export const SortSchema = z.enum(['ASC', 'DESC']);

export const SearchSchema = z
  .object({
    filter: z
      .string({
        invalid_type_error: "'filter' must be a string.",
      })
      .optional(),
    sort: z
      .string({
        invalid_type_error: "'sort' must be a string.",
      })
      .trim()
      .toUpperCase()
      // Customize error message with currently received value.
      .superRefine((val, ctx) => {
        if (!SortSchema.options.some((option) => option === val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_enum_value,
            received: val,
            message: `Expected 'sort' to be 'ASC' or 'DESC' but received '${val}'.`,
            options: [],
          });
        }
      })
      // Ensure 'sort' maintains its enum 'SortSchema' type.
      .pipe(SortSchema)
      .optional(),
  })
  .strict();

export const PostIdParamSchema = z.object({
  id: z.string({
    required_error: "'id' is required.",
    invalid_type_error: "'id' must be a string.",
  }),
});

export const PostIdSchema = PostIdParamSchema.extend({
  id: z.coerce
    .number({
      required_error: "'id' is required.",
      invalid_type_error: "'id' must be a number.",
    })
    .int({
      message: "'id' must be an integer.",
    })
    .safe({
      message: "'id' is too big.",
    })
    .positive({
      message: "'id' must be stritcly positive.",
    }),
});

export const PostContentSchema = z.object({
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
    }),
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
          message: `Author must be at least ${min.toString()} ${pluralize('character', min)} (current: ${currentLength.toString()}).`,
        });
      }
      if (currentLength > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: 'string',
          maximum: max,
          inclusive: true,
          message: `Author can't be more than ${max.toString()} ${pluralize('character', max)} (current: ${currentLength.toString()}).`,
        });
      }
    })
    .transform(capitalize),
});

// Create additional strict schema to validate request body data, so passing any additional field will trigger an error.
export const PostContentStrictSchema = PostContentSchema.strict();

export const PostSchema = PostContentStrictSchema.extend({
  id: z
    .number({
      required_error: "'id' is required.",
      invalid_type_error: "'id' must be a number.",
    })
    .int({
      message: "id' must be an integer.",
    })
    .positive({
      message: "'id' must be stritcly positive.",
    }),
  date: z.string({
    required_error: "'date' is required.",
    invalid_type_error: "'date' must be a string.",
  }),
});

export const UpdateSchema = PostContentSchema.partial().strict();
