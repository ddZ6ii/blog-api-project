import { d as debounceLead, a as debounce, o as onLinkClick } from "./eventHandlers-DhOmyAxr.js";
const containerEl = document.querySelector(".container");
const searchFormEl = document.querySelector("#searchForm");
const searchInputEl = document.querySelector("#search");
const dialogEl = document.querySelector("dialog");
const debouncedOnLinkClick = debounceLead((e) => {
  onLinkClick(e, dialogEl);
});
const debouncedOnInputChange = debounce(onInputChange);
window.addEventListener("load", () => {
  if (!searchInputEl)
    return;
  searchInputEl.focus();
  if (searchInputEl.value) {
    const previousValue = searchInputEl.value;
    searchInputEl.value = "";
    searchInputEl.value = previousValue;
  }
  searchInputEl.addEventListener("keyup", debouncedOnInputChange);
});
containerEl == null ? void 0 : containerEl.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLAnchorElement))
    return;
  if (e.target.nodeName.toLowerCase() === "a") {
    e.preventDefault();
    debouncedOnLinkClick(e);
  }
});
function onInputChange() {
  dialogEl == null ? void 0 : dialogEl.setAttribute("open", "");
  searchFormEl == null ? void 0 : searchFormEl.requestSubmit();
}
