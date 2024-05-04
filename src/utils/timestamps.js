/**
 * Convert a date from the ISO string format to timestamp.
 * @param {date} isoStringDate
 * @returns {number}
 */
const toTimeStamp = (isoStringDate) => Date.parse(isoStringDate);

export default toTimeStamp;
