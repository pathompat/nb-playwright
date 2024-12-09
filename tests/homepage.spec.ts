import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('test', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'รายการสั่งผลิต' })).toBeVisible();
});