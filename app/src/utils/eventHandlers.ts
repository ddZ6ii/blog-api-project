import { DebouncedFn } from '@/types/debounce.type.ts';

const fieldsetEls = document.querySelectorAll<HTMLFieldSetElement>('fieldset');
const linkEls = document.querySelectorAll<HTMLAnchorElement>('a');
const buttonEls = document.querySelectorAll<HTMLButtonElement>('button');
const nodeEls = [...fieldsetEls, ...linkEls, ...buttonEls];

export function onLinkClick(evt: MouseEvent) {
  if (!(evt.target instanceof HTMLAnchorElement)) return;
  if (evt.target.classList.contains('link-disabled')) return;
  location.href = evt.target.href;
}

export function onContainerClick(
  evt: MouseEvent,
  cbFn: DebouncedFn<MouseEvent>,
) {
  if (!(evt.target instanceof HTMLAnchorElement)) return;
  evt.preventDefault();
  cbFn(evt);
  addSpinner(evt.target);
  disableUserInteractions();
}

export function addSpinner(nodeEl: HTMLElement | null) {
  if (!nodeEl) return;

  const isDisabled =
    (nodeEl instanceof HTMLButtonElement && nodeEl.disabled) ||
    (nodeEl instanceof HTMLAnchorElement &&
      nodeEl.classList.contains('link-disabled'));
  if (isDisabled) return;

  const spinnerEl = document.createElement('span');
  spinnerEl.classList.add('spinner');
  if (!(nodeEl instanceof HTMLDivElement)) {
    nodeEl.style.gap = '10px';
  }
  if (nodeEl.classList.contains('outline')) {
    spinnerEl.classList.add('spinner-outline');
  }
  nodeEl.prepend(spinnerEl);
}

export function removeSpinner() {
  const spinnerEl = document.querySelector('.spinner');
  if (!spinnerEl) return;
  spinnerEl.remove();
}

export function disableUserInteractions() {
  nodeEls.forEach((nodeEl) => {
    if (
      nodeEl instanceof HTMLFieldSetElement ||
      nodeEl instanceof HTMLButtonElement
    ) {
      nodeEl.disabled = true;
    }
    if (nodeEl instanceof HTMLAnchorElement) {
      nodeEl.classList.add('link-disabled');
    }
  });
}

export function enableUserInteractions() {
  nodeEls.forEach((nodeEl) => {
    if (
      nodeEl instanceof HTMLFieldSetElement ||
      nodeEl instanceof HTMLButtonElement
    ) {
      nodeEl.disabled = false;
    }
    if (nodeEl instanceof HTMLAnchorElement) {
      nodeEl.classList.remove('link-disabled');
    }
  });
}
