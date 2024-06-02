import { d as debounceLead, o as onLinkClick } from "./eventHandlers-DhOmyAxr.js";
const containerEl = document.querySelector(".container");
const formEl = document.querySelector("form");
const submitBtnEl = formEl == null ? void 0 : formEl.querySelector(
  'button[type="submit"]'
);
const dialogEl = document.querySelector("dialog");
const debouncedOnLinkClick = debounceLead((e) => {
  onLinkClick(e, dialogEl);
});
submitBtnEl == null ? void 0 : submitBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  if (!formEl)
    return;
  if (formEl.checkValidity()) {
    dialogEl == null ? void 0 : dialogEl.setAttribute("open", "");
  }
  formEl.requestSubmit();
});
containerEl == null ? void 0 : containerEl.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLAnchorElement))
    return;
  if (e.target.nodeName.toLowerCase() === "a") {
    e.preventDefault();
    debouncedOnLinkClick(e);
  }
});
