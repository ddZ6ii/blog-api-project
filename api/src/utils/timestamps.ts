// Convert a date from ISO string format to timestamp.
export function toTimeStamp(isoStringDate: string) {
  return Date.parse(isoStringDate);
}

// Create a string representing the current date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ).
export function toISOString() {
  return new Date().toISOString();
}
