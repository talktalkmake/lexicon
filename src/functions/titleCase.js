function titleCase(word) {
  if (word.length < 1) return 'Not enough letters';
  if (typeof word !== 'string') return 'This is not a string';
  word = word.split('');
  word = word.map((letter, i) => i === 0 ? letter.toUpperCase() : letter.toLowerCase())
  return word.join('');
}
export default titleCase;