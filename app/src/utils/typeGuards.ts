import { AxiosResponse } from 'axios';
import { CustomErrorContent } from '@/types/error.type.ts';
import { ZodObject, ZodRawShape } from 'zod';
import { FieldElement } from '@/types/form.type.ts';

export function isErrorResponse<T>(
  response: AxiosResponse<T> | AxiosResponse<CustomErrorContent>,
): response is AxiosResponse<CustomErrorContent> {
  return response.status !== 200;
}

export function isFieldElement(
  nodeEl: Element | RadioNodeList | EventTarget | null,
): nodeEl is FieldElement {
  return (
    nodeEl instanceof HTMLInputElement || nodeEl instanceof HTMLTextAreaElement
  );
}

export function isSchemaZodObject<T extends ZodRawShape>(
  schema: unknown,
): schema is ZodObject<T> {
  return schema instanceof ZodObject;
}
