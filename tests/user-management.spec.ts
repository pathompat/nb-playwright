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
const RANDOM_USER = 'userinanothersystem331'
const NEW_USER = 'playwright' + randomStr
const NEW_STORE = 'store ' + randomStr
const USER_TOO_SHORT = 'abcde'
const USER_ONLY_UPPERCASE = 'ABCDEF'
const USER_NO_EN_CHAR = 'หหกดหหฟกฟหหห'
const PASSWORD_TOO_SHORT = 'asdF1'
const PASSWORD_NO_LOWERCASE = 'AAASDASDAA'
const PASSWORD_NO_UPPERCASE = 'uasdasdasdsa'
const PASSWORD_NO_SYMBOL = 'Uasdasdasdsa'
const PASSWORD_NO_NUMBER = 'Uasdasdas@'
const PASSWORD_CORRECTLY = 'Password@1234'

let editedUser = ''
let deletedUser = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/user');
});

test.describe('Common UI & Views', () => {
  test('should see user menu in nav bar and header', async ({ page }) => {
    await expect(page.getByRole('listbox')).toMatchAriaSnapshot(`- link "จัดการ User"`);
    await expect(page.getByRole('heading', { name: 'จัดการ User' })).toBeVisible();
  });

  test('use search non-user in filter input should see no-data', async ({ page }) => {
    const filterBox = await page.getByPlaceholder('username,ร้านค้า')
    await expect(filterBox).toBeVisible();
    await filterBox.fill(RANDOM_USER);
    await expect(page.locator('td')).toContainText('No data available');
  });
})

test.describe('Create User', () => {
  test.beforeEach(async ({ page }) => {
    await page.waitForResponse("/api/user");
    await page.getByRole('button', { name: /เพิ่มผู้ใช้งาน/i }).click()
  });

  test('should see input username, password, store name, tier', async ({ page }) => {
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('ร้านค้า')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill username 5 symbol', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill(USER_TOO_SHORT);
    await expect(page.getByText('บัญชีผู้ใช้งานต้องมีความยาวอย่างน้อย 6 ตัวอักษร')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill username with uppercase', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill(USER_ONLY_UPPERCASE);
    await expect(page.getByText('บัญชีผู้ใช้งานต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์เล็กหรือตัวเลขเท่านั้น')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill username with non-english character', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill(USER_NO_EN_CHAR);
    await expect(page.getByText('บัญชีผู้ใช้งานต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์เล็กหรือตัวเลขเท่านั้น')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill less than 8 password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_TOO_SHORT);
    await expect(page.getByText('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill no lowercase password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_NO_LOWERCASE);
    await expect(page.getByText('รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill no uppercase password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_NO_UPPERCASE);
    await expect(page.getByText('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill no symbol password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_NO_SYMBOL);
    await expect(page.getByText('รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error when and disable button fill no number password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_NO_NUMBER);
    await expect(page.getByText('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when space on store name', async ({ page }) => {
    await page.getByLabel('ร้านค้า').click();
    await page.getByLabel('ร้านค้า').fill(' ');
    await expect(page.getByText('กรุณากรอกข้อมูล')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
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
    await page.getByLabel('Username').fill(NEW_USER);
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_CORRECTLY);
    await page.getByLabel('ร้านค้า').click();
    await page.getByLabel('ร้านค้า').fill(NEW_STORE);

    const addBtn = await page.getByRole('button', { name: 'บันทึก' })
    await expect(addBtn).toBeEnabled()
    await addBtn.click();

    await expect(page.getByTestId('toast-content')).toBeVisible();
    await expect(page.getByTestId('toast-content')).toContainText('สร้างสำเร็จ');

    const filterBox = await page.getByPlaceholder('username,ร้านค้า')
    await expect(filterBox).toBeVisible();
    await filterBox.fill(NEW_USER);

    await expect(page.getByRole('cell', { name: NEW_USER })).toBeVisible();
    await expect(page.getByRole('cell', { name: NEW_STORE })).toBeVisible();
  });

  // TODO: check unable to create duplicate username
})

test.describe('Edit User', () => {
  test.beforeEach(async ({ page }) => {
    const row = await page.locator('tr', { has: page.locator('td', { hasText: /^playwright/i }) }).first();
    editedUser = await row.locator('td').nth(1).textContent() || '';
    await row.getByRole('button', { name: /แก้ไข/i }).click()
  });

  test('should display error and disable button when fill less than 8 password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_TOO_SHORT);
    await expect(page.getByText('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill no lowercase password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_NO_LOWERCASE);
    await expect(page.getByText('รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill no uppercase password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_NO_UPPERCASE);
    await expect(page.getByText('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill no symbol password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_NO_SYMBOL);
    await expect(page.getByText('รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when fill no number password', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_NO_NUMBER);
    await expect(page.getByText('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should display error and disable button when space on store name', async ({ page }) => {
    await page.getByLabel('ร้านค้า').click();
    await page.getByLabel('ร้านค้า').fill(' ');
    await expect(page.getByText('กรุณากรอกข้อมูล')).toBeVisible();
    await expect(page.getByRole('button', { name: 'บันทึก' })).toBeDisabled()
  });

  test('should able update user when fill correct information', async ({ page }) => {
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill(PASSWORD_CORRECTLY);
    await page.getByLabel('ร้านค้า').click();
    await page.getByLabel('ร้านค้า').fill(NEW_STORE);

    const addBtn = await page.getByRole('button', { name: 'บันทึก' })
    await expect(addBtn).toBeEnabled()
    await addBtn.click();

    const filterBox = await page.getByPlaceholder('username,ร้านค้า')
    await expect(filterBox).toBeVisible();
    await filterBox.fill(editedUser);

    await expect(page.getByRole('cell', { name: NEW_STORE })).toBeVisible();
  });

})

test.describe('Delete User', () => {
  test.beforeEach(async ({ page }) => {
    const row = await page.locator('tr', { has: page.locator('td', { hasText: /^playwright/i }) }).first();
    deletedUser = await row.locator('td').nth(1).textContent() || '';
    await row.getByRole('button', { name: /ยกเลิก/i }).click()
  });

  test('should display confirm box before delete', async ({ page }) => {
    
    await expect(page.getByRole('dialog')).toContainText('ยืนยันปิดใช้งาน');
    await expect(page.getByRole('dialog')).toContainText('จะไม่สามารถทำรายการใดๆได้อีก');
    await expect(page.getByRole('dialog').getByRole('button', { name: 'ยืนยัน' })).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('button', { name: 'ยกเลิก' })).toBeVisible();
    await expect(page.locator('.v-overlay__scrim')).toBeVisible();
  });

  test('should close modal when click cancel button', async ({ page }) => {
    await page.getByRole('dialog').getByRole('button', { name: 'ยกเลิก' }).click();
    await expect(page.locator('.v-overlay__scrim')).toBeHidden();
  });

  test('should remove user in table when click confirm button', async ({ page }) => {
    await page.getByRole('dialog').getByRole('button', { name: 'ยืนยัน' }).click();
    await expect(page.getByTestId('toast-content')).toContainText('ยกเลิกใช้งานสำเร็จ');
    await expect(page.locator('.v-overlay__scrim')).toBeHidden();

    const filterBox = await page.getByPlaceholder('username,ร้านค้า')
    await filterBox.fill(deletedUser);
    await expect(page.locator('td')).toContainText('No data available');
  });

})

