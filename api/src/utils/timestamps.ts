/**
 * Convert a date from the ISO string format to timestamp.
 * @param {string} isoStringDate
 * @returns {number}
 */
export const toTimeStamp = (isoStringDate: string): number =>
  Date.parse(isoStringDate);

/**
 * Create a string representing the current date in ISO format YYYY-MM-DDTHH:mm:ss.sssZ.
 * The timezone is always UTC, as denoted by the suffix Z.
 * @returns {string}
 */
export const toISOString = (): string => new Date().toISOString();
