const debounceLead = (cbFn, delayInMs = 1e3) => {
  let timeoutId;
  return (evt, ...args) => {
    if (!timeoutId) {
      cbFn(evt, ...args);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delayInMs);
  };
};
const debounce = (cbFn, delayInMs = 500) => {
  let timeoutId;
  return (evt, ...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      cbFn(evt, ...args);
    }, delayInMs);
  };
};
function onLinkClick(evt, dialogEl) {
  if (!dialogEl)
    return;
  dialogEl.setAttribute("open", "");
  if (!(evt.target instanceof HTMLAnchorElement))
    return;
  location.href = evt.target.href;
}
export {
  debounce as a,
  debounceLead as d,
  onLinkClick as o
};
