import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/user');
});

test('should see user in nav bar', async ({ page }) => {
  await expect(page.getByRole('listbox')).toMatchAriaSnapshot(`- link "จัดการ User"`);
});

test('should see header', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'จัดการ User' })).toBeVisible();
});

test('use search non-user in filter input should see no-data', async ({ page }) => {
  const filterBox = await page.getByPlaceholder('username,ร้านค้า')
  await expect(filterBox).toBeVisible();
  await filterBox.fill('userinanothersystem331');
  await expect(page.locator('td')).toContainText('No data available');
});