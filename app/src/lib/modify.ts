import { debounceLead } from '@lib/utils/debounce.ts';
import { onLinkClick } from '@lib/utils/eventHandlers.ts';

const containerEl = document.querySelector<HTMLDivElement>('.container');
const formEl = document.querySelector<HTMLFormElement>('form');
const submitBtnEl = formEl?.querySelector<HTMLButtonElement>(
  'button[type="submit"]',
);
const dialogEl = document.querySelector('dialog');

// Prevents server error caused by multiple clicks on the Delete button. Debouncing allows to trigger a request only on the first event of the series, discarding subsequent events.
const debouncedOnLinkClick = debounceLead((e: MouseEvent) => {
  onLinkClick(e, dialogEl);
});

submitBtnEl?.addEventListener('click', (e) => {
  e.preventDefault();

  if (!formEl) return;

  if (formEl.checkValidity()) {
    dialogEl?.setAttribute('open', '');
  }
  formEl.requestSubmit();
});

containerEl?.addEventListener('click', (e) => {
  if (!(e.target instanceof HTMLAnchorElement)) return;

  if (e.target.nodeName.toLowerCase() === 'a') {
    e.preventDefault();
    debouncedOnLinkClick(e);
  }
});
