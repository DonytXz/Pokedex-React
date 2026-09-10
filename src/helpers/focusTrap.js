export const handleFocusTrap = (e, containerElement) => {
  if (!containerElement) return;
  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const focusable = Array.from(focusableElements).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
  );
  if (focusable.length === 0) return;

  const firstElement = focusable[0];
  const lastElement = focusable.at(-1);

  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  }
};
