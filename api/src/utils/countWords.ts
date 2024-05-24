export function countWords(str = '') {
  // Remove whitespaces and line breaks.
  const formattedStr = str.trim().replace(/(\r\n|\n|\r)/gm, ' ');
  if (!formattedStr) return 0;
  return formattedStr.split(' ').filter((word) => word !== '').length;
}
