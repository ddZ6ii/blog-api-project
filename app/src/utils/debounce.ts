import { Debounce } from '@/types/debounce.type.ts';

// First action is triggered immediately while subsequent actions are canceled.
export const debounceLead: Debounce = (cbFn, delayInMs = 1000) => {
  let timeoutId: ReturnType<typeof setTimeout> | null;
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

// First action is delayed. Every new action triggered during that same period cancels the previous one and reschedules its execution by the same delay.
export const debounce: Debounce = (cbFn, delayInMs = 500) => {
  let timeoutId: ReturnType<typeof setTimeout> | null;
  return (evt, ...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      cbFn(evt, ...args);
    }, delayInMs);
  };
};
