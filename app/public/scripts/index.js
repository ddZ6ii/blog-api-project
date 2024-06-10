import {
  o as onContainerClick,
  a as addSpinner,
  d as disableUserInteractions,
  b as debounce,
  c as debounceLead,
  e as onLinkClick,
} from './eventHandlers-Cdev2lJw.js';
const containerEl = document.querySelector('.container');
const searchFormEl = document.querySelector('#searchForm');
const searchInputEl = document.querySelector('#search');
const searchIconEl = document.querySelector('#search-icon');
let previousSearchText = '';
let isSubmitting = false;
const debouncedOnLinkClick = debounceLead((e) => {
  onLinkClick(e);
});
const debouncedOnInputChange = debounce(() =>
  searchFormEl == null ? void 0 : searchFormEl.requestSubmit(),
);
window.addEventListener('load', () => {
  if (!searchInputEl) return;
  searchInputEl.focus();
  if (searchInputEl.value) {
    previousSearchText = searchInputEl.value;
    searchInputEl.value = '';
    searchInputEl.value = previousSearchText;
  }
  isSubmitting = false;
  searchInputEl.addEventListener('keyup', debouncedOnInputChange);
});
containerEl == null
  ? void 0
  : containerEl.addEventListener('click', (e) => {
      onContainerClick(e, debouncedOnLinkClick);
    });
searchFormEl == null
  ? void 0
  : searchFormEl.addEventListener('submit', (e) => {
      var _a;
      e.preventDefault();
      if (isSubmitting) return;
      if (
        !(searchInputEl == null ? void 0 : searchInputEl.value) &&
        !previousSearchText
      )
        return;
      searchFormEl.submit();
      (_a =
        searchIconEl == null ? void 0 : searchIconEl.querySelector('img')) ==
      null
        ? void 0
        : _a.remove();
      addSpinner(searchIconEl);
      disableUserInteractions();
      isSubmitting = true;
    });
