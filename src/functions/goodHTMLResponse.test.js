import goodHTMLResponse from './goodHTMLResponse';

test('returns successful (true) response', () => {
  const status = 200;
  expect(goodHTMLResponse(status)).toBe(true);
});
test('returns unsuccessful (false) response', () => {
  const status = 400;
  expect(goodHTMLResponse(status)).toBe(false);
});
