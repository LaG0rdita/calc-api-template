import { test, expect } from '@playwright/test';
import { checkPassword } from '../helpers/helpers';

// Example from the spec
test('password: "abc" is invalid', async ({ request }) => {
  const response = await checkPassword(request, 'abc');

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({
    valid: false,
    errors: ['TOO_SHORT', 'NO_UPPERCASE', 'NO_DIGIT', 'NO_SPECIAL'],
  });
});

// Example of parametrization: same test, different data
const cases = [
  { password: 'Abcdef1!', valid: true, errors: [] },
  { password: 'ABCDEFG1!', valid: false, errors: ['NO_LOWERCASE'] },
  { password: 'de f g', valid: false, errors: ['TOO_SHORT', 'NO_UPPERCASE', 'NO_DIGIT', 'NO_SPECIAL', 'HAS_SPACE'] },
  { password: 'Aa1!!'.repeat(13), valid: false, errors: ['TOO_LONG']},

  // TODO (students): add more cases: NO_DIGIT, HAS_SPACE and other rules
  /*
  { password: 'abcdefg1!!', valid: false, errors: ['NO_UPPERCASE'] },
  { password: 'Abcdefgh!!', valid: false, errors: ['NO_DIGIT'] },
  { password: 'Abcdefg12', valid: false, errors: ['NO_SPECIAL'] },
  { password: 'Abc def1!!', valid: false, errors: ['HAS_SPACE'] },*/
];

for (const { password, valid, errors } of cases) {
  test(`password: "${password}" valid=${valid}`, async ({ request }) => {
    const response = await checkPassword(request, password);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ valid, errors });
  });
}


// TODO (students): one case per error code, e.g. TOO_LONG with 65 characters, NO_SPECIAL, NO_UPPERCASE
test.fixme('password: each rule returns its own error code', async () => {});

// TODO (students): 400 for empty password, non-string password, missing password, invalid JSON
test.fixme('password: invalid request returns 400', async () => {});

const invalidRequests = [
  { title: 'empty password', data: {password: ''}},
  { title: 'non-string password', data: {password: 12345}},
  { title: 'missing password', data: {}},
];

for (const { title, data,} of invalidRequests) {
  test(`password: ${title} returns 400 for invalid request`, async ({request}) => {
    const response = await request.post('/api/password/check', {
      data,
    });

    expect(response.status()).toBe(400);
  })
}

// TODO (students): GET on /api/password/check returns 405
test.fixme('password: unsupported method returns 405', async () => {});

// TODO (students): body larger than 10 000 bytes returns 413
test.fixme('password: too large body returns 413', async () => {});
