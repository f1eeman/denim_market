import { expect, test, type Page } from '@playwright/test'

const PAGE_SIZE = 8

const cardsOf = (page: Page) => page.locator('[data-item]:not([hidden])')
const shownOf = (page: Page) => page.locator('[data-catalog-shown]')
const totalOf = (page: Page) => page.locator('[data-catalog-total]')

test.beforeEach(async ({ page }) => {
  await page.goto('/catalog')
})

test('первая страница — восемь карточек из сорока пяти', async ({ page }) => {
  await expect(cardsOf(page)).toHaveCount(PAGE_SIZE)
  await expect(shownOf(page)).toHaveText(String(PAGE_SIZE))
  await expect(totalOf(page)).toHaveText('45')
})

const fillRatio = async (page: Page): Promise<number> => {
  const value = await page
    .locator('[data-catalog-fill]')
    .evaluate((el: HTMLElement) => el.style.transform)

  return Number(/scaleX\(([\d.]+)\)/.exec(value)?.[1])
}

test('полоса прогресса показывает долю выданного', async ({ page }) => {
  expect(await fillRatio(page)).toBeCloseTo(PAGE_SIZE / 45, 4)
})

test('полоса прогресса растёт вместе с догрузкой', async ({ page }) => {
  await page.locator('[data-catalog-more]').click()

  expect(await fillRatio(page)).toBeCloseTo((PAGE_SIZE * 2) / 45, 4)
})

test('«Load more» догружает следующую страницу и правит счётчик', async ({
  page,
}) => {
  await page.locator('[data-catalog-more]').click()

  await expect(cardsOf(page)).toHaveCount(PAGE_SIZE * 2)
  await expect(shownOf(page)).toHaveText(String(PAGE_SIZE * 2))
})

test('«Load more» уходит, когда выдано всё', async ({ page }) => {
  const more = page.locator('[data-catalog-more]')

  for (let click = 0; click < 6; click += 1) {
    if (await more.isHidden()) break

    await more.click()
  }

  await expect(more).toBeHidden()
  await expect(cardsOf(page)).toHaveCount(45)
  await expect(shownOf(page)).toHaveText('45')
})

test('фильтр по цене оставляет только подходящие карточки', async ({
  page,
}) => {
  await page.locator('[data-filter-toggle]').click()

  const options = page.locator('[data-filter-options]')

  await expect(options).toBeVisible()

  await page.locator('[data-filter-band="over-100"]').click()

  await expect(options).toBeHidden()
  await expect(page.locator('[data-filter-label]')).toHaveText('$100 and up')

  const prices = await cardsOf(page).evaluateAll((nodes) =>
    nodes.map((node) => Number(node.getAttribute('data-price'))),
  )

  expect(prices.length).toBeGreaterThan(0)

  for (const price of prices) expect(price).toBeGreaterThan(100)

  expect(Number(await totalOf(page).textContent())).toBeLessThan(45)
})

test('Esc закрывает список фильтра и возвращает фокус', async ({ page }) => {
  const toggle = page.locator('[data-filter-toggle]')

  await toggle.click()
  await page.keyboard.press('Escape')

  await expect(page.locator('[data-filter-options]')).toBeHidden()
  await expect(toggle).toBeFocused()
})

test('запрос из адреса сужает выдачу', async ({ page }) => {
  await page.goto('/catalog?q=overalls')

  await expect(cardsOf(page)).toHaveCount(0)
  await expect(totalOf(page)).toHaveText('0')
  await expect(page.locator('[data-catalog-empty]')).toBeVisible()
})

test('карточка ведёт на страницу товара', async ({ page }) => {
  await cardsOf(page).first().locator('a').click()

  await expect(page).toHaveURL(/\/product\/?$/)
})
