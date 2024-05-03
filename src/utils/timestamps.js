/**
 * Convert a date from the ISO string format to timestamp.
 * @param {date} isoStringDate
 * @returns {number}
 */
export const toTimeStamp = (isoStringDate) => {
  return Date.parse(isoStringDate);
};
