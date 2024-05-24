export function pluralize(word = '', count: number) {
  return word + (count > 1 ? 's' : '');
}
