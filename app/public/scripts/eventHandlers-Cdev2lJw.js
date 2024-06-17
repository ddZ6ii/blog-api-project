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
const fieldsetEls = document.querySelectorAll("fieldset");
const linkEls = document.querySelectorAll("a");
const buttonEls = document.querySelectorAll("button");
const nodeEls = [...fieldsetEls, ...linkEls, ...buttonEls];
function onLinkClick(evt) {
  if (!(evt.target instanceof HTMLAnchorElement))
    return;
  if (evt.target.classList.contains("link-disabled"))
    return;
  location.href = evt.target.href;
}
function onContainerClick(evt, cbFn) {
  if (!(evt.target instanceof HTMLAnchorElement))
    return;
  evt.preventDefault();
  cbFn(evt);
  addSpinner(evt.target);
  disableUserInteractions();
}
function addSpinner(nodeEl) {
  if (!nodeEl)
    return;
  const isDisabled = nodeEl instanceof HTMLButtonElement && nodeEl.disabled || nodeEl instanceof HTMLAnchorElement && nodeEl.classList.contains("link-disabled");
  if (isDisabled)
    return;
  const spinnerEl = document.createElement("span");
  spinnerEl.classList.add("spinner");
  if (!(nodeEl instanceof HTMLDivElement)) {
    nodeEl.style.gap = "10px";
  }
  if (nodeEl.classList.contains("outline")) {
    spinnerEl.classList.add("spinner-outline");
  }
  nodeEl.prepend(spinnerEl);
}
function removeSpinner() {
  const spinnerEl = document.querySelector(".spinner");
  if (!spinnerEl)
    return;
  spinnerEl.remove();
}
function disableUserInteractions() {
  nodeEls.forEach((nodeEl) => {
    if (nodeEl instanceof HTMLFieldSetElement || nodeEl instanceof HTMLButtonElement) {
      nodeEl.disabled = true;
    }
    if (nodeEl instanceof HTMLAnchorElement) {
      nodeEl.classList.add("link-disabled");
    }
  });
}
function enableUserInteractions() {
  nodeEls.forEach((nodeEl) => {
    if (nodeEl instanceof HTMLFieldSetElement || nodeEl instanceof HTMLButtonElement) {
      nodeEl.disabled = false;
    }
    if (nodeEl instanceof HTMLAnchorElement) {
      nodeEl.classList.remove("link-disabled");
    }
  });
}
export {
  addSpinner as a,
  debounce as b,
  debounceLead as c,
  disableUserInteractions as d,
  onLinkClick as e,
  enableUserInteractions as f,
  onContainerClick as o,
  removeSpinner as r
};
