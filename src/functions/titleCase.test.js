import titleCase from "./titleCase";

const sentence = 'something happened';
const randomCaseSentence = 'sOmEthiNg HappeNeD';
const tooShortSentence = '';
const notAString = {};

describe('turn a lowercase sentence into a title case', () => {
 it('checks to see if the argument length is at least one', () => {
  expect(titleCase(tooShortSentence)).toBe('Not enough letters');
 });
 it('checks the type of the argument is  astring', () => {
  expect(titleCase(notAString)).toBe('This is not a string');
 });
 it('returns a string', () => {
  expect(typeof titleCase(sentence)).toBe('string');
 });
 it('turns the first letter into a capital', () => {
  expect(titleCase(sentence)[0]).toBe('S');
 });
 it('formats a full sentence correctly, "Such as this"', () => {
  expect(titleCase(randomCaseSentence)).toBe('Something happened');
 });
})