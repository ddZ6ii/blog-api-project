import {
  a as addSpinner,
  d as disableUserInteractions,
  o as onContainerClick,
  c as debounceLead,
  e as onLinkClick,
} from './eventHandlers-NryoCHX1.js';
const containerEl = document.querySelector('.container');
const formEl = document.querySelector('form');
const debouncedOnLinkClick = debounceLead((e) => {
  onLinkClick(e);
});
formEl == null
  ? void 0
  : formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!formEl.checkValidity()) return;
      formEl.submit();
      addSpinner(formEl.querySelector('button[type="submit"]'));
      disableUserInteractions();
    });
containerEl == null
  ? void 0
  : containerEl.addEventListener('click', (e) =>
      onContainerClick(e, debouncedOnLinkClick),
    );
