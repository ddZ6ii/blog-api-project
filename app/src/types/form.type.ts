import { typeToFlattenedError } from 'zod';
import { ObjectValues } from './utils.type.ts';

const FORM_STATUS = {
  typing: 'TYPING',
  submitting: 'SUBMITTING',
} as const;

type FormStatus = ObjectValues<typeof FORM_STATUS>;

export type FormError<T> = typeToFlattenedError<T>['fieldErrors'];

export type FieldError<T> = ObjectValues<FormError<T>>;

// To represent an empty object do not use {} since it represents any value except null and undefined (source: https://www.totaltypescript.com/the-empty-object-type-in-typescript).
export type FormState<T> = {
  data: Partial<T>;
  error: Partial<FormError<T>>;
  status: FormStatus;
};

export type FieldElement = HTMLInputElement | HTMLTextAreaElement;
