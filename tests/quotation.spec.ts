import { test, expect, type Page } from '@playwright/test';
import { randomAlphanumericLowerCase, randomNumber, randomFloatingNumber } from '../helpers/random';

const NEW_SCHOOL_NAME = 'playwright school ' + randomAlphanumericLowerCase(4)
const NEW_SCHOOL_ADDRESS = 'playwright test 99/11 TH'
const SCHOOL_TELEPHONE_WRONG_FORMAT = '02122112'
const SCHOOL_TELEPHONE_CORRECT_FORMAT = '0891123312'
const DUEDATE_CORRECT_FORMAT = '20/12/2024'
const QTY_WRONG_FORMAT = '0'
const PRICE_WRONG_FORMAT = '0'

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
    await options.first().click();

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe('');

    await expect(page.getByLabel('โรงเรียน *')).toBeEnabled();
    await expect(page.getByRole('button', { name: /บันทึก/i })).toBeDisabled();
  })

  test('should able to open modal create new school', async ({ page }) => {
    await page.getByText('UserUser').click();
    await page.waitForSelector('.v-select--active-menu');

    const options = await page.locator('.v-menu .v-list-item');
    const optionCount = await options.count()

    await expect(optionCount).toBeGreaterThan(0);
    const randomUser = await options.filter({ hasText: /^playwright/i })
    await randomUser.first().click();
    await page.waitForResponse(response => response.url().includes('/api/school') && response.status() === 200)

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe(''); 

    const dropdownSchool = page.getByLabel('โรงเรียน *')
    await expect(dropdownSchool).toBeEnabled();

    dropdownSchool.click()

    await page.getByText('เพิ่มโรงเรียนใหม่').click();
    
    const modalSchool = page.getByRole('dialog').locator('div')
    await expect(page.locator('.v-overlay__scrim')).toBeVisible();
    await expect(modalSchool.getByLabel('ที่อยู่จัดส่ง')).toBeEnabled();
    await expect(modalSchool.getByLabel('ชื่อโรงเรียน')).toBeEnabled();
    await expect(modalSchool.getByLabel('เบอร์โทรติดต่อ')).toBeEnabled();
    await expect(modalSchool.getByRole('button', { name: /บันทึก/i })).toBeDisabled();
  })

  test('should not able to create school with wrong telephone format', async ({ page }) => {
    await page.getByText('UserUser').click();
    await page.waitForSelector('.v-select--active-menu');

    const options = await page.locator('.v-menu .v-list-item');
    const optionCount = await options.count()

    await expect(optionCount).toBeGreaterThan(0);
    const randomUser = await options.filter({ hasText: /^playwright/i })
    await randomUser.first().click();
    await page.waitForResponse(response => response.url().includes('/api/school') && response.status() === 200)

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe(''); 

    const dropdownSchool = page.getByLabel('โรงเรียน *')
    await expect(dropdownSchool).toBeEnabled();

    dropdownSchool.click()

    await page.getByText('เพิ่มโรงเรียนใหม่').click();
    await expect(page.locator('.v-overlay__scrim')).toBeVisible();

    const modalSchool = page.getByRole('dialog').locator('div')

    await modalSchool.getByLabel('ชื่อโรงเรียน').fill(NEW_SCHOOL_NAME);
    await modalSchool.getByLabel('ที่อยู่จัดส่ง').fill(NEW_SCHOOL_ADDRESS);
    await modalSchool.getByLabel('เบอร์โทรติดต่อ').fill(SCHOOL_TELEPHONE_WRONG_FORMAT);
    await expect(modalSchool.getByText('กรุณากรอกเบอร์มือถือที่ถูกต้อง (เช่น 08xxxxxxxx)')).toBeVisible();
    await expect(modalSchool.getByRole('button', { name: /บันทึก/i })).toBeDisabled();
  })

  test('should able to create school when fill correct information', async ({ page }) => {
    await page.getByText('UserUser').click();
    await page.waitForSelector('.v-select--active-menu');

    const options = await page.locator('.v-menu .v-list-item');
    const optionCount = await options.count()

    await expect(optionCount).toBeGreaterThan(0);
    const randomUser = await options.filter({ hasText: /^playwright/i })
    await randomUser.nth(0).click();

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe(''); 

    const dropdownSchool = page.getByLabel('โรงเรียน *')
    await expect(dropdownSchool).toBeEnabled();

    dropdownSchool.click()

    await page.getByText('เพิ่มโรงเรียนใหม่').click();
    await expect(page.locator('.v-overlay__scrim')).toBeVisible();

    const modalSchool = page.getByRole('dialog').locator('div')

    await modalSchool.getByLabel('ชื่อโรงเรียน').fill(NEW_SCHOOL_NAME);
    await modalSchool.getByLabel('ที่อยู่จัดส่ง').fill(NEW_SCHOOL_ADDRESS);
    await modalSchool.getByLabel('เบอร์โทรติดต่อ').fill(SCHOOL_TELEPHONE_CORRECT_FORMAT);
    const btnSubmitSchool = modalSchool.getByRole('button', { name: /บันทึก/i })
    await expect(btnSubmitSchool).toBeEnabled();

    btnSubmitSchool.click()

    await expect(page.getByTestId('toast-content')).toBeVisible();
    await expect(page.getByTestId('toast-content')).toContainText('เพิ่มโรงเรียนสำเร็จ');
    await expect(page.locator('.v-overlay__scrim')).toBeHidden();
  })

  test('should autofill address and telehone when selected school', async ({ page }) => {
    await page.getByText('UserUser').click();
    await page.waitForSelector('.v-select--active-menu');

    const optionUser = await page.locator('.v-menu .v-list-item');
    const optionUserCount = await optionUser.count()

    await expect(optionUserCount).toBeGreaterThan(0);
    const randomUser = await optionUser.filter({ hasText: /^playwright/i })
    await randomUser.nth(0).click();

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe(''); 

    const dropdownSchool = page.getByLabel('โรงเรียน *')
    await expect(dropdownSchool).toBeEnabled();

    dropdownSchool.click()

    const optionSchool = await page.locator('.v-menu .v-list-item');
    const optionSchoolCount = await optionSchool.count()

    await expect(optionSchoolCount).toBeGreaterThan(1);
    const randomSchool = await optionSchool.filter({ hasNotText: /^เพิ่มโรงเรียนใหม่/i })
    await randomSchool.nth(1).click();

    await expect(page.getByLabel('ที่อยู่ *')).not.toBe('');
    await expect(page.getByLabel('เบอร์ติดต่อ *')).not.toBe('');
  })

  test('should not able to add item with wrong quantity', async ({ page }) => {
    await page.getByText('UserUser').click();
    await page.waitForSelector('.v-select--active-menu');

    const optionUser = await page.locator('.v-menu .v-list-item');
    const optionUserCount = await optionUser.count()

    await expect(optionUserCount).toBeGreaterThan(0);
    const randomUser = await optionUser.filter({ hasText: /^playwright/i })
    await randomUser.first().click();
    await page.waitForResponse(response => response.url().includes('/api/school') && response.status() === 200)

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe(''); 

    const dropdownSchool = page.getByLabel('โรงเรียน *')
    await expect(dropdownSchool).toBeEnabled();

    dropdownSchool.click()

    const optionSchool = await page.locator('.v-menu .v-list-item');
    const optionSchoolCount = await optionSchool.count()

    await expect(optionSchoolCount).toBeGreaterThan(0);
    const randomSchool = await optionSchool.filter({ hasNotText: /^เพิ่มโรงเรียนใหม่/i })
    await randomSchool.nth(1).click();

    await page.getByLabel(/^วันที่ต้องส่ง/i).fill(DUEDATE_CORRECT_FORMAT);

    await page.getByRole('button', { name: /^เพิ่มรายการสินค้าใหม่/i }).click()

    const modalAddItem = await page.getByRole('dialog').locator('div')
    await modalAddItem.locator('div.v-select', { hasText: 'เพลท' }).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'attached' });
    let options = await page.locator('.v-menu .v-list-item');
    let randomOption = randomNumber(0, 2) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

    await modalAddItem.locator('div.v-select', { hasText: 'แกรม' }).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'attached' });
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 7) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

    await modalAddItem.locator('div.v-select', { hasText: 'สี' }).click();
    await page.waitForSelector('.v-select--active-menu');
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 5) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

    await modalAddItem.locator('div.v-select', { hasText: 'แผ่น' }).click();
    await page.waitForSelector('.v-select--active-menu');
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 4) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached' });
    
    await modalAddItem.locator('div.v-select', { hasText: 'ประเภท' }).click();;
    await page.waitForSelector('.v-select--active-menu');
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 3) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached', strict: true });

    await modalAddItem.locator('div.v-select', { hasText: 'เส้น' }).click();;
    await page.waitForSelector('.v-select--active-menu');
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 31) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached', strict: true });

    await modalAddItem.getByLabel('มีแบบ').check();
    await modalAddItem.getByLabel('จำนวน').fill(QTY_WRONG_FORMAT);
    await expect(modalAddItem.getByText('กรุณากรอกข้อมูลที่มากกว่า 0').first()).toBeVisible();
  })

  test('should not able to add item with wrong price', async ({ page }) => {
    await page.getByText('UserUser').click();
    await page.waitForSelector('.v-select--active-menu');

    const optionUser = await page.locator('.v-menu .v-list-item');
    const optionUserCount = await optionUser.count()

    await expect(optionUserCount).toBeGreaterThan(0);
    const randomUser = await optionUser.filter({ hasText: /^playwright/i })
    await randomUser.first().click();
    await page.waitForResponse(response => response.url().includes('/api/school') && response.status() === 200)

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe(''); 

    const dropdownSchool = page.getByLabel('โรงเรียน *')
    await expect(dropdownSchool).toBeEnabled();

    dropdownSchool.click()

    const optionSchool = await page.locator('.v-menu .v-list-item');
    const optionSchoolCount = await optionSchool.count()

    await expect(optionSchoolCount).toBeGreaterThan(0);
    const randomSchool = await optionSchool.filter({ hasNotText: /^เพิ่มโรงเรียนใหม่/i })
    await randomSchool.nth(1).click();

    await page.getByLabel(/^วันที่ต้องส่ง/i).fill(DUEDATE_CORRECT_FORMAT);

    await page.getByRole('button', { name: /^เพิ่มรายการสินค้าใหม่/i }).click()

    const modalAddItem = await page.getByRole('dialog').locator('div')
    await modalAddItem.locator('div.v-select', { hasText: 'เพลท' }).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'attached' });
    let options = await page.locator('.v-menu .v-list-item');
    let randomOption = randomNumber(0, 2) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

    await modalAddItem.locator('div.v-select', { hasText: 'แกรม' }).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'attached' });
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 7) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

    await modalAddItem.locator('div.v-select', { hasText: 'สี' }).click();
    await page.waitForSelector('.v-select--active-menu');
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 5) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

    await modalAddItem.locator('div.v-select', { hasText: 'แผ่น' }).click();
    await page.waitForSelector('.v-select--active-menu');
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 4) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached' });
    
    await modalAddItem.locator('div.v-select', { hasText: 'ประเภท' }).click();;
    await page.waitForSelector('.v-select--active-menu');
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 3) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached', strict: true });

    await modalAddItem.locator('div.v-select', { hasText: 'เส้น' }).click();;
    await page.waitForSelector('.v-select--active-menu');
    options = await page.locator('.v-menu .v-list-item');
    randomOption = randomNumber(0, 31) // TODO: fix length to dynamic
    await options.nth(randomOption).click();
    await page.waitForSelector('.v-select--active-menu', { state: 'detached', strict: true });

    await modalAddItem.getByLabel('มีแบบ').check();
    const randomQty = randomNumber(500, 5000)
    await modalAddItem.getByLabel('จำนวน').fill(randomQty.toString());
    await modalAddItem.getByLabel('ราคา').fill(PRICE_WRONG_FORMAT);
    await expect(modalAddItem.getByText('กรุณากรอกข้อมูลที่มากกว่า 0').first()).toBeVisible();
  })

  test('should able to create quotation with 1 item when correct information', async ({ page }) => {
    await page.getByText('UserUser').click();
    await page.waitForSelector('.v-select--active-menu');

    const optionUser = await page.locator('.v-menu .v-list-item');
    const optionUserCount = await optionUser.count()

    await expect(optionUserCount).toBeGreaterThan(0);
    const randomUser = await optionUser.filter({ hasText: /^playwright/i })
    await randomUser.first().click();
    await page.waitForResponse(response => response.url().includes('/api/school') && response.status() === 200)

    const selectedText = await page.locator('.v-select__selection-text').innerText();
    await expect(selectedText).not.toBe('');

    const storeName = await page.getByLabel('ร้าน *').inputValue()
    await expect(storeName).not.toBe(''); 

    const dropdownSchool = page.getByLabel('โรงเรียน *')
    await expect(dropdownSchool).toBeEnabled();

    dropdownSchool.click()
    await page.waitForSelector('.v-menu .v-list-item');

    const school = await page.locator('.v-menu .v-list-item');
    const schoolCount = await school.count()
    const randomSchool = randomNumber(1, schoolCount - 1)

    await expect(schoolCount).toBeGreaterThan(0);
    await school.nth(randomSchool).click();

    await page.getByLabel(/^วันที่ต้องส่ง/i).fill(DUEDATE_CORRECT_FORMAT);

    await addItemSuccess(page)

    const submitBtn = await page.getByRole('button', { name: /บันทึก/i, disabled: false })
    await expect(submitBtn).toBeEnabled();

    await submitBtn.click();

    await page.waitForResponse(response => response.url().includes('/api/quotation') && response.status() === 201)
    await page.waitForURL(/\/quotation\/\d+$/);
  })

  test.describe('Customer', () => {
    test.use({ storageState: 'playwright/.auth/customer.json' });
    // TODO: add customer only test
  })
})

const addItemSuccess = async (page: Page) => {
  await page.getByRole('button', { name: /^เพิ่มรายการสินค้าใหม่/i }).click()

  const modalAddItem = await page.getByRole('dialog').locator('div')
  await modalAddItem.locator('div.v-select', { hasText: 'เพลท' }).click();
  await page.waitForSelector('.v-select--active-menu', { state: 'attached' });
  let options = await page.locator('.v-menu .v-list-item');
  let randomOption = randomNumber(0, 2) // TODO: fix length to dynamic
  await options.nth(randomOption).click();
  await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

  await modalAddItem.locator('div.v-select', { hasText: 'แกรม' }).click();
  await page.waitForSelector('.v-select--active-menu', { state: 'attached' });
  options = await page.locator('.v-menu .v-list-item');
  randomOption = randomNumber(0, 7) // TODO: fix length to dynamic
  await options.nth(randomOption).click();
  await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

  await modalAddItem.locator('div.v-select', { hasText: 'สี' }).click();
  await page.waitForSelector('.v-select--active-menu');
  options = await page.locator('.v-menu .v-list-item');
  randomOption = randomNumber(0, 5) // TODO: fix length to dynamic
  await options.nth(randomOption).click();
  await page.waitForSelector('.v-select--active-menu', { state: 'detached' });

  await modalAddItem.locator('div.v-select', { hasText: 'แผ่น' }).click();
  await page.waitForSelector('.v-select--active-menu');
  options = await page.locator('.v-menu .v-list-item');
  randomOption = randomNumber(0, 4) // TODO: fix length to dynamic
  await options.nth(randomOption).click();
  await page.waitForSelector('.v-select--active-menu', { state: 'detached' });
  
  await modalAddItem.locator('div.v-select', { hasText: 'ประเภท' }).click();;
  await page.waitForSelector('.v-select--active-menu');
  options = await page.locator('.v-menu .v-list-item');
  randomOption = randomNumber(0, 3) // TODO: fix length to dynamic
  await options.nth(randomOption).click();
  await page.waitForSelector('.v-select--active-menu', { state: 'detached', strict: true });

  await modalAddItem.locator('div.v-select', { hasText: 'เส้น' }).click();;
  await page.waitForSelector('.v-select--active-menu');
  options = await page.locator('.v-menu .v-list-item');
  randomOption = randomNumber(0, 31) // TODO: fix length to dynamic
  await options.nth(randomOption).click();
  await page.waitForSelector('.v-select--active-menu', { state: 'detached', strict: true });

  await modalAddItem.getByLabel('มีแบบ').check();
  const randomQty = randomNumber(500, 5000)
  await modalAddItem.getByLabel('จำนวน').fill(randomQty.toString());
  const randomPrice = randomFloatingNumber(0.1, 29.9)
  await modalAddItem.getByLabel('ราคา').fill(randomPrice.toString());
  const btnAddItem = modalAddItem.getByRole('button', { name: /บันทึก/i })
  await expect(btnAddItem).toBeEnabled();

  await btnAddItem.click();

  await expect(page.getByRole('cell', { name: 'ไม่มีรายการ' })).not.toBeVisible();
}