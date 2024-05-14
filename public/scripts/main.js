const postsEl = document.querySelector('#postsList');

/**
 * Debounced version of onLinkClick function.
 * Prevents server error caused by clicking multiple times the Delete button from the UI. 
 * Debouncing allows to trigger a request to the server on the first event, and "cancel" subsequent events.
 * @function debouncedOnLinkClick
 */
const debouncedOnLinkClick = debounce(onLinkClick);

if(postsEl) {
  postsEl.addEventListener('click', (e) => {
  const isDeleteLink = e.target.classList.contains('delete');
  if(!isDeleteLink) return;
  e.preventDefault();
  debouncedOnLinkClick(e);
})
}

function onLinkClick(event) {
  location.href = event.target.href;
}

/**
 * Debounce user action by specified delay.
 * @param {function} cbFn user action to debounce
 * @param {number} delayInMs delay in milliseconds
 * @returns {function}
 */
function debounce(cbFn, delayInMs = 1000) {
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