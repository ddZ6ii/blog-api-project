const postsEl = document.querySelector('#postsList');
const formEl = document.querySelector('#searchForm');
const inputEl = document.querySelector('#search');
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

// Reset focus and input value on search input.
window.addEventListener('load', (event) => {
  inputEl.focus();
  if (inputEl.value) {
    const previousValue = inputEl.value;
    inputEl.value = '';
    inputEl.value = previousValue;
  }
});

inputEl.addEventListener('keyup', debouncedOnInputChange);

if (postsEl) {
  postsEl.addEventListener('click', (e) => {
    const isDeleteLink = e.target.classList.contains('delete');
    if (!isDeleteLink) return;
    e.preventDefault();
    debouncedOnLinkClick(e);
  });
}

function onLinkClick(event) {
  location.href = event.target.href;
}
function onInputChange() {
  formEl.requestSubmit();
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
