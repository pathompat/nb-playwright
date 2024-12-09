import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('user should see title', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'รายการสั่งผลิต' })).toBeVisible();
});