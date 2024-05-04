/**
 * Determine whether 2 objects are equals via a shallow comparison.
 * @param {object} obj1
 * @param {object} obj2
 * @returns {boolean}
 */
const shallowEqual = (obj1, obj2) => {
  if (obj1 == null || obj2 == null) throw new Error('Input arguments required.');
  if (typeof obj1 !== typeof obj2) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every((key) => obj1[key] === obj2[key]);
};

export default shallowEqual;
