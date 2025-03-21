import { test, expect } from '@playwright/test';

test('loads the homepage', async ({ page }) => {
  test.setTimeout(30000);
  try {
    await page.goto('http://localhost:50044/');
  } catch (error) {
    console.error(error);
    throw error;
  }
});