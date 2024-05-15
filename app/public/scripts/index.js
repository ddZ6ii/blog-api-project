const containerEl = document.querySelector('.container');
const searchFormEl = document.querySelector('#searchForm');
const searchInputEl = document.querySelector('#search');
const dialogEl = document.querySelector('dialog');

/**
 * Debounced version of onLinkClick function.
 * Prevents server error caused by clicking multiple times the Delete button from the UI.
 * Debouncing allows to trigger a request to the server on the first event, and "cancel" subsequent events.
 * @function debouncedOnLinkClick
 */
const debouncedOnLinkClick = debounceLead(onLinkClick);
/**
 * Debounced version of onInputChange function.
 * Optimize application performance by reducing the rate at which the search request is triggered.
 * @function debouncedOnInputChange
 */
const debouncedOnInputChange = debounce(onInputChange);

// Handle the case where all blog posts have been deleted.
window.addEventListener('load', (event) => {
  if (searchInputEl) {
    searchInputEl.focus();
    // Reset focus position at the end of search text on page reload.
    if (searchInputEl.value) {
      const previousValue = searchInputEl.value;
      searchInputEl.value = '';
      searchInputEl.value = previousValue;
    }
    searchInputEl.addEventListener('keyup', debouncedOnInputChange);
  }
});

containerEl.addEventListener('click', (e) => {
  if (e.target.nodeName.toLowerCase() === 'a') {
    e.preventDefault();
    debouncedOnLinkClick(e);
  }
});

function onLinkClick(event) {
  dialogEl.setAttribute('open', '');
  location.href = event.target.href;
}
function onInputChange() {
  dialogEl.setAttribute('open', '');
  searchFormEl.requestSubmit();
}
/**
 * Debounce user action by specified delay.
 * First action is triggered immediately while subsequent actions are canceled.
 * @param {function} cbFn user action to debounce
 * @param {number} delayInMs delay in milliseconds
 * @returns {function}
 */
function debounceLead(cbFn, delayInMs = 1000) {
  let timeoutId;
  return (...args) => {
    if (!timeoutId) {
      cbFn(...args);
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delayInMs);
  };
}
/**
 * Debounce user action by specified delay.
 * First action is delyaed. Every new action triggered during that same period cancels the previous one and reschedules its execution by the same delay.
 * @param {function} cbFn user action to debounce
 * @param {number} delayInMs delay in milliseconds
 * @returns {function}
 */
function debounce(cbFn, delayInMs = 500) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      cbFn(...args);
    }, delayInMs);
  };
}
