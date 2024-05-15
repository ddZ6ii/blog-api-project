/**
 * Check wheter the input argument is empty (null, undefined, '', [], {}).
 * @param {unknown} obj
 * @returns {boolean}
 */
const isEmpty = (obj) => {
  // Check for both `null` and `undefined` with loose comparison operator.
  if (obj == null) return true;
  if (typeof obj !== 'object' && !obj) return true;
  if (Array.isArray(obj) && !obj.length) return true;
  if (typeof obj === 'object' && !Object.keys(obj).length) return true;
  return false;
};

export default isEmpty;
