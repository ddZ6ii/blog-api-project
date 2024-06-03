import { debounceLead } from '@lib/utils/debounce.ts';
import {
  addSpinner,
  disableUserInteractions,
  onContainerClick,
  onLinkClick,
} from '@lib/utils/eventHandlers.ts';

const containerEl = document.querySelector<HTMLDivElement>('.container');
const formEl = document.querySelector<HTMLFormElement>('form');

// Prevents server error caused by multiple clicks on the Delete button. Debouncing allows to trigger a request only on the first event of the series, discarding subsequent events.
const debouncedOnLinkClick = debounceLead((e: MouseEvent) => {
  onLinkClick(e);
});

formEl?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!formEl.checkValidity()) return;

  formEl.submit();
  addSpinner(formEl.querySelector<HTMLButtonElement>('button[type="submit"]'));
  disableUserInteractions();
});

containerEl?.addEventListener('click', (e) => {
  onContainerClick(e, debouncedOnLinkClick);
});
