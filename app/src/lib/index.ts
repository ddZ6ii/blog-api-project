import { debounce, debounceLead } from '@lib/utils/debounce.ts';
import { onLinkClick } from '@lib/utils/eventHandlers.ts';

const containerEl = document.querySelector<HTMLDivElement>('.container');
const searchFormEl = document.querySelector<HTMLFormElement>('#searchForm');
const searchInputEl = document.querySelector<HTMLInputElement>('#search');
const dialogEl = document.querySelector('dialog');

// Prevents server error caused by multiple clicks on the Delete button. Debouncing allows to trigger a request only on the first event of the series, discarding subsequent events.
const debouncedOnLinkClick = debounceLead((e: MouseEvent) => {
  onLinkClick(e, dialogEl);
});

// Optimize application performance by reducing the rate at which the search request is triggered.
const debouncedOnInputChange = debounce(onInputChange);

// Handle the case where all blog posts have been deleted.
window.addEventListener('load', () => {
  if (!searchInputEl) return;

  searchInputEl.focus();
  // Reset focus position at the end of search text on page reload.
  if (searchInputEl.value) {
    const previousValue = searchInputEl.value;
    searchInputEl.value = '';
    searchInputEl.value = previousValue;
  }
  searchInputEl.addEventListener('keyup', debouncedOnInputChange);
});

containerEl?.addEventListener('click', (e) => {
  if (!(e.target instanceof HTMLAnchorElement)) return;

  if (e.target.nodeName.toLowerCase() === 'a') {
    e.preventDefault();
    debouncedOnLinkClick(e);
  }
});

function onInputChange() {
  dialogEl?.setAttribute('open', '');
  searchFormEl?.requestSubmit();
}
