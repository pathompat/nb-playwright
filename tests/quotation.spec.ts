import { test, expect } from '@playwright/test';

test.describe('Create Quotation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quotation/create');
    await page.waitForResponse("api/user/");
  });

  test('should see form input correctly', async ({ page }) => {
    await expect(page.getByText('UserUser')).toBeEnabled();
    await expect(page.getByLabel('ร้าน *')).toBeDisabled();
    await expect(page.getByLabel('โรงเรียน *')).toBeDisabled();
    await expect(page.getByLabel('วันที่พร้อมรับสินค้า', { exact: true })).toBeDisabled();
    await expect(page.getByLabel('วันที่ต้องส่ง', { exact: true })).toBeEnabled();
    await expect(page.getByLabel('ที่อยู่ *')).toBeEnabled();
    await expect(page.getByLabel('เบอร์ติดต่อ *')).toBeEnabled();
    await expect(page.getByLabel('หมายเหตุ')).toBeVisible();
    await expect(page.locator('td')).toContainText('ไม่มีรายการ');
  })

  test.describe('Customer', () => {
    test.use({ storageState: 'playwright/.auth/customer.json' });
    // TODO: add customer only test
  })
})