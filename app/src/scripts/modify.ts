import Toastify, { Options } from 'toastify-js';
import { createPostSchema } from '@schemas/post.schema.ts';
import { debounceLead } from '@utils/debounce.ts';
import {
  addSpinner,
  disableUserInteractions,
  enableUserInteractions,
  onContainerClick,
  onLinkClick,
  removeSpinner,
} from '@utils/eventHandlers.ts';
import { useForm } from '@utils/useForm.ts';
import { isFieldElement } from '@utils/typeGuards.ts';
import { objectKeys } from '@utils/object.ts';

const containerEl = document.querySelector<HTMLDivElement>('.container');
const formEl = document.querySelector<HTMLFormElement>('form');
const isEditing = window.location.href.includes('edit');
const TOAST_OPTIONS: Options = {
  text: '',
  duration: 1000,
  close: true,
  gravity: 'bottom',
  position: 'right',
  stopOnFocus: true,
  ariaLive: 'polite',
};
const FETCH_OPTIONS: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Prevents server error caused by multiple clicks on the Delete button. Debouncing allows to trigger a request only on the first event of the series, discarding subsequent events.
const debouncedOnLinkClick = debounceLead((e: MouseEvent) => {
  onLinkClick(e);
});

window.addEventListener('load', () => {
  // Remove html form validation (-> custom schema validation). Disabling validation programmatically ensures html validation persists in case JavaScript is disabled in the browser.
  if (!formEl) return;
  formEl.noValidate = true;
});

containerEl?.addEventListener('click', (e) => {
  onContainerClick(e, debouncedOnLinkClick);
});

if (formEl) {
  const form = useForm(formEl, createPostSchema, onSubmit);

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    form.clearErrors();

    // Retrieve form data as an object.
    const formData = Object.fromEntries(new FormData(formEl));

    await form.handleSubmit(formData);
  });

  formEl.addEventListener('change', (e) => {
    const targetEl = e.target;
    if (!targetEl || !isFieldElement(targetEl)) return;

    // Clear previous error state (if any).
    const match = objectKeys(form.state.error).find(
      (formError) => formError === targetEl.name,
    );
    if (match) {
      form.clearFieldErrors(match);
    }

    form.validateField(targetEl.name, targetEl.value);
  });
}

async function onSubmit<TData>(validatedData: TData) {
  try {
    const url = formEl?.getAttribute('action');
    if (!formEl || !url) return;

    addSpinner(
      formEl.querySelector<HTMLButtonElement>('button[type="submit"]'),
    );
    disableUserInteractions();

    const response = await fetch(url, {
      ...FETCH_OPTIONS,
      body: JSON.stringify(validatedData),
    });
    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status.toString()}.`,
      );
    }
    Toastify({
      ...TOAST_OPTIONS,
      text: `✅ Post successfully ${isEditing ? 'updated' : 'created'}`,
      destination: '/',
      callback: () => {
        window.location.href = '/';
      },
    }).showToast();
  } catch (err) {
    console.error(err);
    Toastify({
      ...TOAST_OPTIONS,
      duration: 3000,
      text: `❌ Oops... Something went wrong. Please try again later.`,
    }).showToast();

    setTimeout(() => {
      enableUserInteractions();
      removeSpinner();
    }, 3000);
  }
}
