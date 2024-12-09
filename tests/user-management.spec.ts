import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/user');
});

test('should see user menu in nav bar and header', async ({ page }) => {
  await expect(page.getByRole('listbox')).toMatchAriaSnapshot(`- link "จัดการ User"`);
  await expect(page.getByRole('heading', { name: 'จัดการ User' })).toBeVisible();
});

test('use search non-user in filter input should see no-data', async ({ page }) => {
  const filterBox = await page.getByPlaceholder('username,ร้านค้า')
  await expect(filterBox).toBeVisible();
  await filterBox.fill('userinanothersystem331');
  await expect(page.locator('td')).toContainText('No data available');
});

test.describe('Create User', () => {
  test.beforeEach(async ({ page }) => {
    await page.waitForResponse("/api/user/");
    await page.getByRole('button', { name: /เพิ่มผู้ใช้งาน/i }).click()
  });

  test('should see input username, password, store name, tier', async ({ page }) => {
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('ร้านค้า')).toBeVisible();
  });

  test('should display error when fill username 5 symbol', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('abcde');
    await expect(page.getByText('บัญชีผู้ใช้งานต้องมีความยาวอย่างน้อย 6 ตัวอักษร')).toBeVisible();
  });

  test('should display error when fill username with uppercase', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('ABCDEF');
    await expect(page.getByText('บัญชีผู้ใช้งานต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์เล็กเท่านั้น')).toBeVisible();
  });

  test('should display error when fill username with non-english character', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('หหกดหหฟกฟหหห');
    await expect(page.getByText('บัญชีผู้ใช้งานต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น')).toBeVisible();
  });

  test('should display error when fill less than 8 password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('asdF1');
    await expect(page.getByText('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')).toBeVisible();
  });

  test('should display error when fill no lowercase password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('AAASDASDAA');
    await expect(page.getByText('รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว')).toBeVisible();
  });

  test('should display error when fill no uppercase password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('uasdasdasdsa');
    await expect(page.getByText('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')).toBeVisible();
  });

  test('should display error when fill no symbol password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('Uasdasdasdsa');
    await expect(page.getByText('รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว')).toBeVisible();
  });

  test('should display error when fill no number password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('Uasdasdas@');
    await expect(page.getByText('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว')).toBeVisible();
  });

  // TODO: check store name and tier, check can add
})