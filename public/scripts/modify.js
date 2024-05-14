const containerEl = document.querySelector('.container');
const formEl = document.querySelector('form');
const submitBtnEl = formEl.querySelector('button[type="submit"]');
const dialogEl = document.querySelector('dialog');

/**
 * Debounced version of onLinkClick function.
 * Prevents server error caused by clicking multiple times the Delete button from the UI.
 * Debouncing allows to trigger a request to the server on the first event, and "cancel" subsequent events.
 * @function debouncedOnLinkClick
 */
const debouncedOnLinkClick = debounceLead(onLinkClick);

submitBtnEl.addEventListener('click', (e) => {
  e.preventDefault();
  if (formEl.checkValidity()) {
    dialogEl.setAttribute('open', '');
  }
  formEl.requestSubmit();
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
