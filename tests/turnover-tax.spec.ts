import { test, expect } from '@playwright/test';
import { calculateTurnoverTax } from '../helpers/helpers';

// Example from the spec
test('turnover tax: EE, 19.99', async ({ request }) => {
  const response = await calculateTurnoverTax(request, 'EE', 19.99);

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ net: 19.99, tax: 4.8, gross: 24.79, rate: 24 });
});

// Example of parametrization: same test, different data
const fullCasesWithResponseBody = [
  { country: 'EE', amount: 100, tax: 24, gross: 124, rate: 24 },
  { country: 'LV', amount: 19.99, tax: 4.2, gross: 24.19, rate: 21 },
  { country: 'LT', amount: 100, tax: 4.2, gross: 24.19, rate: 21 },
  { country: 'FI', amount: 150, tax: 25.5, gross: 125.5, rate: 25.5 },
  { country: 'SE', amount: 200, tax: 25, gross: 125, rate: 25 },
  // TODO (students): add more cases: FI (25.5%) and SE (25%)
];

const simpleCases = [
  //REGULAR NUMBERS FOR HAPPY FLOW
  { country: 'EE', amount: 100},
  { country: 'LV', amount: 19.99},
  { country: 'LT', amount: 100},
  { country: 'FI', amount: 150},
  { country: 'SE', amount: 200},
  //TP VERIFY ALLOWED RANGE WITH BOUNDARY VALUES APPROACH
  { country: 'EE', amount: 0.01},
  { country: 'EE', amount: 1000000},
];

for (const { country, amount} of simpleCases) {
  test(`turnover tax: ${country}, ${amount}`, async ({ request }) => {
    const response = await calculateTurnoverTax(request, country, amount);

    expect(response.status()).toBe(200);
    //expect(await response.json()).toEqual({ net: amount, tax, gross, rate });
  });
}

const simpleCasesNegativeFlow = [
  //
  { country: 'GB', amount: 100},
  { country: '', amount: 19.99},
  { country: 'LT', amount: 0},
  { country: 'FI', amount: 1000001},
  { country: 'SE', amount: -1},
];

for (const { country, amount} of simpleCasesNegativeFlow) {
  test(`turnover tax: ${country}, ${amount}`, async ({ request }) => {
    const response = await calculateTurnoverTax(request, country, amount);

    expect(response.status()).toBe(400);
    //expect(await response.json()).toEqual({ net: amount, tax, gross, rate });
  });
}

// TODO (students): all 5 countries, rounding half-up to cents
test.fixme('turnover tax: rates and rounding', async () => {});

// TODO (students): 400 for unknown country, amount 0 / -5 / 1000000.01 / 10.123 / "abc"
// test.fixme('turnover tax: invalid params return 400', async () => {});


