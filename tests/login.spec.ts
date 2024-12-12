import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test.describe('Validation', () => {
  test('should display error when fill username 5 symbol', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').click();
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').fill('abcde');
    await expect(page.locator('#username-messages')).toContainText('บัญชีผู้ใช้งานต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });

  test('should display error when fill username with uppercase', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').click();
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').fill('ABCDEF');
    await expect(page.locator('#username-messages')).toContainText('บัญชีผู้ใช้งานต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์เล็กเท่านั้น');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });

  test('should display error when fill username with non-english character', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').click();
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').fill('หหกดหหฟกฟหหห');
    await expect(page.locator('#username-messages')).toContainText('บัญชีผู้ใช้งานต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });

  test('should display error when fill less than 8 password', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill('asdF1');
    await expect(page.locator('#password-messages')).toContainText('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });

  test('should display error when fill no lowercase password', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill('AAASDASDAA');
    await expect(page.locator('#password-messages')).toContainText('รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });

  test('should display error when fill no uppercase password', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill('uasdasdasdsa');
    await expect(page.locator('#password-messages')).toContainText('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });

  test('should display error when fill no symbol password', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill('Uasdasdasdsa');
    await expect(page.locator('#password-messages')).toContainText('รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });

  test('should display error when fill no number password', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill('Uasdasdas@');
    await expect(page.locator('#password-messages')).toContainText('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' })
    await expect(loginBtn).toBeDisabled()
  });
});

test.describe('Failed', () => {
  test('should display alert error when wrong username or password', async ({ page }) => {
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').click();
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').fill("testgooduser");
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill("G00dP@ssword");
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page.getByTestId('toast-content')).toBeVisible();
    await expect(page.getByTestId('toast-content')).toContainText('Invalid username or password');
  });
});

test.describe('Success', () => {
  test('login with correct username and password should go to homepage', async ({ page }) => {
    const username: string =  process.env.ADMIN_USERNAME || 'admin'
    const password: string = process.env.ADMIN_PASSWORD || 'Pass@123'
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').click();
    await page.getByPlaceholder('กรุณากรอกบัญชีผู้ใช้งาน').fill(username);
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').click();
    await page.getByPlaceholder('กรุณากรอกรหัสผ่าน').fill(password);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await page.waitForURL('/');
    await expect(page.getByRole('heading', { name: 'รายการสั่งผลิต' })).toBeVisible();
  });
});