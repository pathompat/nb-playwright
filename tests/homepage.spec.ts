import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('');
  await page.waitForResponse("api/quotation/stat");
});

test('should see title', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'รายการสั่งผลิต' })).toBeVisible();
});

test('should able to see number of production statistic', async ({ page }) => {
  await expect(page.locator('p').filter({ hasText: 'รออนุมัติ' })).toBeVisible();
  await expect(page.locator('p').filter({ hasText: 'ออกเเบบ' })).toBeVisible();
  await expect(page.locator('p').filter({ hasText: 'พิมพ์' })).toBeVisible();
  await expect(page.locator('p').filter({ hasText: 'เย็บเข้าเล่ม' })).toBeVisible();
  await expect(page.locator('p').filter({ hasText: 'แพ็ค' })).toBeVisible();
  await expect(page.locator('p').filter({ hasText: 'พร้อมจัดส่ง' })).toBeVisible();

  const amountElements = page.locator('span.text-amount');
  const count = await amountElements.count();

  for (let i = 0; i < count; i++) {
    const text = await amountElements.nth(i).textContent() || '-1';
    const number = parseInt(text.trim());
    expect(number).toBeGreaterThanOrEqual(0);
  }
})

test('should able to go to create quotation', async ({ page }) => {
  await page.getByRole('link', { name: 'เพิ่มรายการสั่งผลิต' }).click();
  await page.waitForURL('**/quotation/create');
  await expect(page.getByRole('heading', { name: 'สร้างใบเสนอราคา' })).toBeVisible();
})


test.describe('Customer', () => {
  test.use({ storageState: 'playwright/.auth/customer.json' });
  test('should unable to see user menu', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'จัดการ User' })).toBeHidden();
  });
})