import { FieldError, FormError, FormState } from '@/types/form.type.ts';
import { SafeParseReturnType, Schema, ZodError } from 'zod';
import { objectKeys } from './object.ts';
import { isFieldElement, isSchemaZodObject } from '@utils/typeGuards.ts';

export function useForm<TData, TResponse>(
  formEl: HTMLFormElement,
  schema: Schema<TData>,
  onSubmit: (validatedData: TData) => Promise<TResponse>,
) {
  const state: FormState<TData> = {
    data: {},
    error: {},
    status: 'TYPING',
  };

  async function handleSubmit(formData: Partial<TData>) {
    clearErrors();

    // Validate form data using Zod schema.
    const { success, data, error } = schema.safeParse(formData);

    if (success) {
      await onValidationSuccess(data);
    } else {
      onValidationError(error);
    }
  }

  async function onValidationSuccess(validatedData: TData) {
    // Update form state.
    state.status = 'SUBMITTING';
    state.data = validatedData;

    // Execute callback.
    await onSubmit(validatedData);
  }

  function onValidationError(formErrors: ZodError<TData>) {
    // Retrieve error messages.
    const flattenedFormErrors: Partial<FormError<TData>> =
      formErrors.flatten().fieldErrors;

    // Update form state.
    state.status = 'TYPING';
    state.error = flattenedFormErrors;

    // Update UI.
    showFormErrors();
    focusFirstInvalidField();
  }

  function validateField(fieldName: string, fieldValue: string) {
    // Type checking required to access the 'shape' property from schema.
    if (!isSchemaZodObject(schema)) return;

    // Parse current field info only.
    const result: SafeParseReturnType<string, TData[keyof TData]> =
      schema.shape[fieldName].safeParse(fieldValue);

    if (result.success) {
      state.data[fieldName as keyof TData] = result.data;
    } else {
      const fieldErrors: FieldError<TData> = result.error.flatten().formErrors;
      if (!fieldErrors) return;
      showFieldError(fieldName, fieldErrors);
    }
  }

  function clearErrors() {
    objectKeys(state.error).forEach((key) => {
      clearFieldErrors(key);
    });
  }

  function clearFieldErrors(fieldName: keyof FormError<TData>) {
    if (typeof fieldName !== 'string') return;

    // Update UI.
    const fieldEl = formEl.elements.namedItem(fieldName);
    if (!fieldEl || !isFieldElement(fieldEl)) return;
    fieldEl.classList.remove('has-error');
    const listEl = fieldEl.nextElementSibling;
    if (!listEl || !(listEl instanceof HTMLUListElement)) return;
    listEl.remove();

    // Update form state.
    if (fieldName in state.error) {
      delete state.error[fieldName];
    }
  }

  function showFormErrors() {
    Object.entries<FieldError<TData>>(state.error).forEach(
      ([fieldName, fieldErrorMessages]) => {
        if (!fieldErrorMessages) return;
        showFieldError(fieldName, fieldErrorMessages);
      },
    );
  }

  function showFieldError(
    fieldName: string,
    errorMessages: NonNullable<FieldError<TData>>,
  ) {
    // Create DOM elements.
    const listEl = createErrorListNode(errorMessages);

    // Update UI.
    const fieldEl = formEl.elements.namedItem(fieldName);
    if (!fieldEl || !isFieldElement(fieldEl)) return;
    fieldEl.classList.add('has-error');
    fieldEl.parentNode?.append(listEl);

    // Update form state.
    state.error[fieldName as keyof FormError<TData>] = errorMessages;
  }

  function createErrorListNode(
    errors: NonNullable<FieldError<TData>>,
  ): HTMLUListElement {
    const listEl = document.createElement('ul');
    const liEls = errors.map((error) => {
      const liEl = document.createElement('li');
      liEl.textContent = error;
      liEl.classList.add('has-error');
      return liEl;
    });
    listEl.append(...liEls);
    return listEl;
  }

  function focusFirstInvalidField() {
    const fieldName = objectKeys(state.error)[0];
    if (!fieldName || typeof fieldName !== 'string') return;
    const fieldEl = formEl.elements.namedItem(fieldName);
    if (!fieldEl || !(fieldEl instanceof HTMLElement)) return;
    fieldEl.focus();
  }

  return {
    formEl,
    state,
    handleSubmit,
    validateField,
    clearErrors,
    clearFieldErrors,
  };
}
