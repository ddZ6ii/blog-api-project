/**
 * Check wheter the input argument is empty (null, undefined, '', [], {}).
 * @param {unknown} obj
 * @returns {boolean}
 */
export const isEmpty = (obj: unknown) => {
  // Check for both `null` and `undefined` with loose comparison operator.
  if (obj == null) return true;
  if (typeof obj === 'string' && obj.trim() === '') return true;
  if (typeof obj === 'number' && Number.isNaN(obj)) return true;
  if (Array.isArray(obj) && !obj.length) return true;
  if (typeof obj === 'object' && !Object.keys(obj).length) return true;
  return false;
};
