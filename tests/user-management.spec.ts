import { test, expect } from '@playwright/test';

const randomLowercaseString = (length = 6) =>  {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const randomStr = randomLowercaseString(6)
const newUser = 'playwright' + randomStr
const newStore = 'store ' + randomStr

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

  test('should display error when space on store name', async ({ page }) => {
    await page.getByLabel('ร้านค้า').click();
    await page.getByLabel('ร้านค้า').fill(' ');
    await expect(page.getByText('กรุณากรอกข้อมูล')).toBeVisible();
  });

  test('should display correct tier when click', async ({ page }) => {
    await page.getByText('tier1tier').click();
    await expect(page.getByRole('option', { name: '1' })).toBeVisible();
    await expect(page.getByRole('option', { name: '2' })).toBeVisible();
    await expect(page.getByRole('option', { name: '3' })).toBeVisible();
  });

  // TODO: need to update locator for v-select
  test('should able to change tier 1 to 2', async ({ page }) => {
    await page.getByText('tier1tier').click();
    const option2 = await page.getByRole('option', { name: '2' });
    await expect(option2).toBeVisible()
    await option2.click();
    await expect(page.getByText('tier2tier')).toBeVisible();
  });

  test('should able to change tier 1 to 3', async ({ page }) => {
    await page.getByText('tier1tier').click();
    const option3 = await page.getByRole('option', { name: '3' });
    await expect(option3).toBeVisible()
    await option3.click();
    await expect(page.getByText('tier3tier')).toBeVisible();
  });

  test('should able create user when fill correct information', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill(newUser);
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('Password#1234');
    await page.getByLabel('ร้านค้า').click();
    await page.getByLabel('ร้านค้า').fill(newStore);

    const addBtn = await page.getByRole('button', { name: 'บันทึก' })
    await expect(addBtn).toBeEnabled()
    await addBtn.click();

    await expect(page.getByTestId('toast-content')).toBeVisible();
    await expect(page.getByTestId('toast-content')).toContainText('สร้างสำเร็จ');

    const filterBox = await page.getByPlaceholder('username,ร้านค้า')
    await expect(filterBox).toBeVisible();
    await filterBox.fill(newUser);

    await expect(page.getByRole('cell', { name: newUser })).toBeVisible();
    await expect(page.getByRole('cell', { name: newStore })).toBeVisible();
  });

  // TODO: check unable to create duplicate username
})

test.describe('Edit User', () => {
  test.beforeEach(async ({ page }) => {
    const existingUser = process.env.EXISTING_USERNAME || 'playwrightexisting'
    const row = await page.locator('tr', { has: page.locator('td', { hasText: existingUser }) });
    await row.getByRole('button', { name: /แก้ไข/i }).click()
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

})

