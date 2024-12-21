import { test, expect } from '@playwright/test';

test.describe('Create Quotation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quotation/create');
    await page.waitForResponse("/api/user");
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
    await expect(page.getByRole('button', { name: /บันทึก/i })).toBeDisabled();
  })

  test('should able to change user then autofill store, enable school select', async ({ page }) => {
    await page.getByText('UserUser').click();
    await page.waitForSelector('.v-select--active-menu');

    const options = await page.locator('.v-menu .v-list-item');
    const optionCount = await options.count()

    await expect(optionCount).toBeGreaterThan(0);
    await options.nth(0).click();

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe('');

    await expect(page.getByLabel('โรงเรียน *')).toBeEnabled();
    await expect(page.getByRole('button', { name: /บันทึก/i })).toBeDisabled();
  })

  test.describe('Customer', () => {
    test.use({ storageState: 'playwright/.auth/customer.json' });
    // TODO: add customer only test
  })
})