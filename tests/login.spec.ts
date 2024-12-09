import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test.describe('Failed login', () => {
  test('should display error when fill uncomplete username', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').click();
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').fill('abc');
    await page.getByText('บัญชีผู้ใช้งานต้องมีความยาวอย่างน้อย 6 ตัวอักษร').click();
    await expect(page.locator('#username-messages')).toContainText('บัญชีผู้ใช้งานต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });

  test('should display error when fill uncomplete password', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill('asdF1');
    await expect(page.locator('#password-messages')).toContainText('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });
});

test.describe('Success login', () => {
  test('login with correct username and password should go to homepage', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งานs').click();
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งานs').fill('adminmunggy');
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill('Password@1234');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await page.waitForURL('/');
    await expect(page.getByRole('heading', { name: 'รายการสั่งผลิต' })).toBeVisible();
  });
});