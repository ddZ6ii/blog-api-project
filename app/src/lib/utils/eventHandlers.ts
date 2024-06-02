export function onLinkClick(
  evt: MouseEvent,
  dialogEl: HTMLDialogElement | null,
) {
  if (!dialogEl) return;

  dialogEl.setAttribute('open', '');

  if (!(evt.target instanceof HTMLAnchorElement)) return;

  location.href = evt.target.href;
}
