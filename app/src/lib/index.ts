import { debounce, debounceLead } from '@lib/utils/debounce.ts';
import {
  addSpinner,
  disableUserInteractions,
  onContainerClick,
  onLinkClick,
} from '@lib/utils/eventHandlers.ts';

const containerEl = document.querySelector<HTMLDivElement>('.container');
const searchFormEl = document.querySelector<HTMLFormElement>('#searchForm');
const searchInputEl = document.querySelector<HTMLInputElement>('#search');
const searchIconEl = document.querySelector<HTMLInputElement>('#search-icon');
let previousSearchText = '';
let isSubmitting = false;

// Prevents server error caused by multiple clicks on the Delete button. Debouncing allows to trigger a request only on the first event of the series, discarding subsequent events.
const debouncedOnLinkClick = debounceLead((e: MouseEvent) => {
  onLinkClick(e);
});

// Optimize application performance by reducing the rate at which the search request is triggered.
const debouncedOnInputChange = debounce(() => searchFormEl?.requestSubmit());

// Handle the case where all blog posts have been deleted.
window.addEventListener('load', () => {
  if (!searchInputEl) return;
  // Reset focus position at the end of previous search text (if any).
  searchInputEl.focus();
  if (searchInputEl.value) {
    previousSearchText = searchInputEl.value;
    searchInputEl.value = '';
    searchInputEl.value = previousSearchText;
  }
  isSubmitting = false;
  searchInputEl.addEventListener('keyup', debouncedOnInputChange);
});

containerEl?.addEventListener('click', (e) => {
  onContainerClick(e, debouncedOnLinkClick);
});

searchFormEl?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  if (!searchInputEl?.value && !previousSearchText) return;
  searchFormEl.submit();
  searchIconEl?.querySelector('img')?.remove();
  addSpinner(searchIconEl);
  disableUserInteractions();
  // Prevent multiple form submissions (input change + enter key press).
  isSubmitting = true;
});
