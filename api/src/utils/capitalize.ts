function capitalizeWord(word = '') {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function capitalize(str = '') {
  return str.trim().split(' ').map(capitalizeWord).join(' ');
}
