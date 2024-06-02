export type DebouncedFn<T> = (evt: T, ...args: unknown[]) => void;

/**
 * Debounce user's action with specified delay.
 * @param {function} cbFn user's action to debounce
 * @param {number} delayInMs delay in milliseconds
 * @returns {function} debounced function
 */
export type Debounce = <T>(
  cbFn: DebouncedFn<T>,
  delayInMs?: number,
) => DebouncedFn<T>;
