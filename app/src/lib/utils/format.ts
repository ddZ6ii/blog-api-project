function capitalizeWord(word = '') {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function capitalize(str = '') {
  return str.trim().split(' ').map(capitalizeWord).join(' ');
}

export function countWords(str = '') {
  // Remove whitespaces and line breaks.
  const formattedStr = str.trim().replace(/(\r\n|\n|\r)/gm, ' ');
  if (!formattedStr) return 0;
  return formattedStr.split(' ').filter((word) => word !== '').length;
}

export function pluralize(word = '', count: number) {
  return word + (count > 1 ? 's' : '');
}
