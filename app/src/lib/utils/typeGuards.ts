import { ZodObject, ZodRawShape } from 'zod';
import { FieldElement } from '@/types/form.type.ts';

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
