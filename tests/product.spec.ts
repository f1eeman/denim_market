import { expect, test, type Page } from '@playwright/test'

const slideOf = (page: Page) =>
  page.locator('[data-gallery-slide][data-gallery-current]')

test.beforeEach(async ({ page }) => {
  await page.goto('/product')
})

test('галерея открывается первым кадром', async ({ page }) => {
  await expect(slideOf(page)).toHaveCount(1)
  await expect(slideOf(page)).toHaveAttribute('data-gallery-slide', '0')
  await expect(page.locator('[data-gallery-thumb="0"]')).toHaveAttribute(
    'aria-current',
    'true',
  )
})

test('миниатюра переключает кадр и отмечается текущей', async ({ page }) => {
  await page.locator('[data-gallery-thumb="3"]').click()

  await expect(slideOf(page)).toHaveAttribute('data-gallery-slide', '3')
  await expect(page.locator('[data-gallery-thumb="3"]')).toHaveAttribute(
    'aria-current',
    'true',
  )
  await expect(page.locator('[data-gallery-thumb="0"]')).toHaveAttribute(
    'aria-current',
    'false',
  )
})

test('стрелки ходят по кругу', async ({ page }) => {
  await page.locator('[data-gallery-prev]').click()

  await expect(slideOf(page)).toHaveAttribute('data-gallery-slide', '4')

  await page.locator('[data-gallery-next]').click()

  await expect(slideOf(page)).toHaveAttribute('data-gallery-slide', '0')
})

test('размер и цвет выбираются, выбор уезжает в корзину', async ({ page }) => {
  await expect(page.locator('#size-S')).toBeChecked()

  await page.locator('label[for="size-XL"]').click()
  await page.locator('label[for="color-stone"]').click()

  await expect(page.locator('#size-XL')).toBeChecked()
  await expect(page.locator('#color-stone')).toBeChecked()
  await expect(page.locator('[data-cart-add]')).toHaveAttribute(
    'data-cart-name',
    'Overalls (XL / Stone)',
  )
})

test('«Add to cart» набивает корзину и считает сумму', async ({ page }) => {
  const badge = page.locator('[data-cart-count]')

  await page.locator('[data-cart-add]').click()

  await expect(badge).toHaveText('1')
  await expect(page.locator('[data-cart-panel]')).toBeVisible()

  await page.locator('[data-cart-add]').click()

  await expect(badge).toHaveText('2')
  await expect(page.locator('[data-cart-total]')).toContainText('$320')
})

test('строка корзины удаляется, панель остаётся открытой', async ({ page }) => {
  await page.locator('[data-cart-add]').click()
  await page.locator('[data-cart-remove]').click()

  await expect(page.locator('[data-cart-panel]')).toBeVisible()
  await expect(page.locator('[data-cart-empty]')).toBeVisible()
  await expect(page.locator('[data-cart-count]')).toBeHidden()
})

test('корзина держится между переходами', async ({ page }) => {
  await page.locator('[data-cart-add]').click()
  await page.goto('/')

  await expect(page.locator('[data-cart-count]')).toHaveText('1')
})

test('разные размеры лежат в корзине отдельными строками', async ({ page }) => {
  await page.locator('label[for="size-S"]').click()
  await page.locator('[data-cart-add]').click()

  await page.locator('label[for="size-M"]').click()
  await page.locator('[data-cart-add]').click()

  await expect(page.locator('.cart-line')).toHaveCount(2)
  await expect(page.locator('[data-cart-count]')).toHaveText('2')
})
