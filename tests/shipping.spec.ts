import { test, expect } from '@playwright/test';
import { calculateShippingExpress } from '../helpers/helpers';

// Example from the spec: plain test
test('shipping: EE, 2.5 kg, express', async ({ request }) => {
  const response = await calculateShippingExpress(request, 'EE', 2.5, true);

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ cost: 7.5, currency: 'EUR', days: 1 });
});

// Example of parametrization: same test, different data
const cases = [
  { country: 'EE', weightKg: 1, express: false, cost: 3, days: 2 },
  { country: 'LV', weightKg: 5, express: false, cost: 10, days: 5 },
  // TODO (students): add more cases: US, 20 kg, express=true (cost 52.5, days 4) and other zones
  { country: 'US', weightKg: 20, express: true, cost: 52.5, days: 4 },
  { country: 'LT', weightKg: 10, express: false, cost: 18, days: 5 },
  { country: 'FI', weightKg: 2, express: false, cost: 10, days: 5 },
  { country: 'SE', weightKg: 3, express: false, cost: 10, days: 5 },
  { country: 'GB', weightKg: 15, express: false, cost: 35, days: 10 },
];

for (const { country, weightKg, express, cost, days } of cases) {
  test(`shipping: ${country}, ${weightKg} kg, express=${express}`, async ({ request }) => {
    const response = await calculateShippingExpress(request, country, weightKg, express);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ cost, currency: 'EUR', days });
  });
}

// TODO (students): parametrize over zones (EE / EU / rest of world) and weight boundaries 1, 1.01, 5, 5.01, 20
// Use calculateShipping (without express)
//test.fixme('shipping: tariffs by zone and weight boundaries', async () => {});

const casesWeightBoundaries = [
  { country: 'EE', weightKg: 1, cost: 3, days: 2 },
  { country: 'LV', weightKg: 1.01,cost: 10, days: 5 },
  { country: 'US', weightKg: 5, cost: 20, days: 10 },
  { country: 'LT', weightKg: 5.01, cost: 18, days: 5 },
  { country: 'FI', weightKg: 20, cost: 18, days: 5 },
];

for (const { country, weightKg, cost, days } of casesWeightBoundaries) {
  test(`shipping: tariffs by weight zone and weight boundaries ${country}, ${weightKg} kg,`, async ({ request }) => {
    const response = await calculateShippingExpress(request, country, weightKg, false);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ cost, currency: 'EUR', days });
  });
}

// TODO (students): express = true, cost x 1.5 rounded to cents, fewer days
// Use calculateShippingExpress
// test.fixme('shipping: express surcharge and days', async () => {});

const casesExpressSurchargeDays = [
    { country: 'EE', weightKg: 1, cost: 4.5, days: 1 },
    { country: 'LV', weightKg: 1.01,cost: 15, days: 2 },
    { country: 'US', weightKg: 5, cost: 30, days: 4 },
    { country: 'LT', weightKg: 5.01, cost: 27, days: 2 },
    { country: 'FI', weightKg: 20, cost: 27, days: 2 },
];

for (const { country, weightKg, cost, days } of casesExpressSurchargeDays) {
    test(`shipping:express surcharge and days ${country}, ${weightKg} kg,`, async ({ request }) => {
        const response = await calculateShippingExpress(request, country, weightKg, true);

        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({ cost, currency: 'EUR', days });
    });
}

// TODO (students): 400 for country "ee" / "XX", weightKg 0 / -1 / 20.01 / "abc", express "yes"
// Use calculateShipping for country and weightKg, calculateShippingExpress for express
// test.fixme('shipping: invalid params return 400', async () => {});

const casesInvalidParametres = [
    { country: 'ee', weightKg: 1, express: false },
    { country: 'XX', weightKg: 1.01, express: false },
    { country: 'US', weightKg: 0, express: false },
    { country: 'LT', weightKg: -1, express: false },
    { country: 'FI', weightKg: 20.01, express: false },
    { country: 'FI', weightKg: 'abc', express: false },
    { country: 'FI', weightKg: 20, express: 'yes' },
];

for (const { country, weightKg, express} of casesInvalidParametres) {
    test(`shipping: invalid params return 400 ${country}, ${weightKg} kg,`, async ({ request }) => {
        const response = await calculateShippingExpress(request, country, weightKg, express);

        expect(response.status()).toBe(400);
    });
}

// TODO (students): GET on an unknown URL returns 404
test.fixme('shipping: unknown URL returns 404', async () => {});

// TODO (students): POST on a GET endpoint returns 405
test.fixme('shipping: unsupported method returns 405', async () => {});
