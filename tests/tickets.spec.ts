import { test, expect } from '@playwright/test';
import { getTicketPrice } from '../helpers/helpers';

// Example from the spec
test('tickets: age 17, SAT is CHILD for 7', async ({ request }) => {
  const response = await getTicketPrice(request, 17, 'SAT');

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ category: 'CHILD', price: 7 });
});

// Example of parametrization: same test, different data
const cases = [
  { age: 6, day: 'MON', category: 'FREE', price: 0 },
  { age: 7, day: 'FRI', category: 'CHILD', price: 5 },
  { age: 30, day: 'SUN', category: 'ADULT', price: 12},
  { age: 65, day: 'WED', category: 'SENIOR', price: 7},
  // TODO (students): add more cases: ADULT (age 30, SUN, 12), SENIOR (age 65, WED, 7)
];

for (const { age, day, category, price } of cases) {
  test(`tickets: age ${age}, ${day} is ${category} for ${price}`, async ({ request }) => {
    const response = await getTicketPrice(request, age, day);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ category, price });
  });
}

// TODO (students): age boundaries 0, 6, 7, 17, 18, 64, 65, 120
test.fixme('age boundary: category by age boundaries', async () => {});

const casesAgeBoundaries = [
  {age: 0, day: 'MON', category: 'FREE', price: 0},
  {age: 6, day: 'MON', category: 'FREE', price: 0},
  {age: 7, day: 'MON', category: 'CHILD', price: 5},
  {age: 17, day: 'MON', category: 'CHILD', price: 5},
  {age: 18, day: 'MON', category: 'ADULT', price: 10},
  {age: 64, day: 'MON', category: 'ADULT', price: 10},
  {age: 65, day: 'MON', category: 'SENIOR', price: 7},
  {age: 120, day: 'MON', category: 'SENIOR', price: 7},
];

for (const { age, day, category, price } of casesAgeBoundaries) {
  test(`age boundary: age ${age}, ${day} is ${category} for ${price}`, async ({ request }) => {
    const response = await getTicketPrice(request, age, day);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ category, price });
  });
}


// TODO (students): 400 for age -1 / 121 / 1.5 / "abc", day "mon" / "XXX", missing params
test.fixme('tickets: invalid params return 400', async () => {});

const casesInvalid = [
  {age: -1, day: 'MON', category: 'FREE', price: 0},
  {age: 121, day: 'MON', category: 'SENIOR', price: 7},
  {age: 1.5, day: 'MON', category: 'FREE', price: 0},
  {age: 'abc', day: 'MON', category: 'CHILD', price: 5},
  {age: 17, day: 'mon', category: 'CHILD', price: 5},
  {age: 18, day: 'XXX', category: 'ADULT', price: 10},
  {age: 64, day: '', category: 'ADULT', price: 10},
];

for (const { age, day} of casesInvalid) {
  test(`invalid cases: age ${age}, day ${day}`, async ({ request }) => {
    const response = await getTicketPrice(request, age, day);

    expect(response.status()).toBe(400);
  });
}
