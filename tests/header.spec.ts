import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('логотип стоит по центру окна', async ({ page }) => {
  const logo = await page.locator('header .logo').boundingBox()
  const width = page.viewportSize()?.width

  if (logo === null || width === undefined) throw new Error('нет замеров шапки')

  expect(Math.abs(logo.x + logo.width / 2 - width / 2)).toBeLessThan(2)
})

test('пункты шапки ведут на существующие страницы', async ({ page }) => {
  const links = page.locator('header .nav-link')

  await expect(links).toHaveCount(3)

  for (const href of await links.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('href')),
  )) {
    const response = await page.request.get(String(href))

    expect(response.status(), String(href)).toBe(200)
  }
})

test('поиск раскрывается кнопкой и уводит запрос в каталог', async ({
  page,
}) => {
  const field = page.locator('[data-search-field]')

  await expect(field).toBeHidden()

  await page.locator('[data-search-toggle]').click()

  await expect(field).toBeVisible()

  await field.fill('jacket')
  await field.press('Enter')

  await expect(page).toHaveURL(/\/catalog\/?\?q=jacket$/)
  await expect(page.locator('[data-search-field]')).toHaveValue('jacket')
})

test('корзина пуста при первом заходе', async ({ page }) => {
  await expect(page.locator('[data-cart-count]')).toBeHidden()

  await page.locator('[data-cart-toggle]').click()

  await expect(page.locator('[data-cart-empty]')).toBeVisible()
  await expect(page.locator('[data-cart-total]')).toBeHidden()
})

test('якорь «Contacts» ведёт на соцсети подвала', async ({ page }) => {
  await page.locator('footer .link', { hasText: 'Contacts' }).click()

  const contacts = page.locator('#contacts')

  await expect(contacts).toBeInViewport()
  await expect(contacts.getByRole('link')).toHaveCount(4)
})
