import { expect, test, type Page } from '@playwright/test'

const ROUTES = [
  '/',
  '/catalog',
  '/product',
  '/shop',
  '/shop/jeans',
  '/shop/shirts',
  '/shop/overalls',
  '/delivery',
  '/service',
  '/news',
  '/sitemap',
]

const WITH_SECTIONS = ['/delivery', '/service', '/shop/jeans', '/shop/shirts']

const TITLE_FROM_HEADING = ROUTES.filter((path) => path !== '/')

const FILLER = ['placeholder', 'lorem', 'coming soon', 'tbd', 'готовится']

const bodyText = (page: Page) =>
  page.locator('main').evaluate((node) => node.textContent ?? '')

test('каждая ссылка шапки и подвала отдаёт страницу', async ({ page }) => {
  await page.goto('/')

  const hrefs = await page
    .locator('header .nav-link, footer .link')
    .evaluateAll((nodes) =>
      nodes
        .map((node) => node.getAttribute('href'))
        .filter(
          (href): href is string => href !== null && !href.startsWith('#'),
        ),
    )

  expect(hrefs.length).toBeGreaterThan(5)

  for (const href of hrefs) {
    const response = await page.request.get(href)

    expect(response.status(), href).toBe(200)
  }
})

test('плитки категорий ведут на живые страницы', async ({ page }) => {
  await page.goto('/')

  const hrefs = await page
    .locator('#categories .tile')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))

  expect(hrefs).toHaveLength(4)

  for (const href of hrefs) {
    const response = await page.request.get(String(href))

    expect(response.status(), String(href)).toBe(200)
  }
})

test('«Read more ...» новости ведёт в статью с текстом', async ({ page }) => {
  await page.goto('/')

  await page.locator('#news .action').click()

  await expect(page).toHaveURL(/\/news\/?$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('G-Star')
  await expect(page.locator('time[datetime]')).toHaveAttribute(
    'datetime',
    '2020-02-12',
  )
  await expect(page.locator('.body .text')).not.toHaveCount(0)

  const lead = await page.locator('.lead').innerText()

  expect(lead.endsWith('...')).toBe(false)
  expect(lead.endsWith('…')).toBe(false)
})

test('несуществующий адрес отдаёт нашу страницу 404', async ({ page }) => {
  const response = await page.goto('/no-such-page')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Page not found',
  )
  await expect(page.locator('.exit')).toHaveCount(4)
})

test('все страницы индексируются, кроме 404', async ({ page }) => {
  for (const path of ROUTES) {
    await page.goto(path)

    await expect(page.locator('meta[name="robots"]'), path).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 }), path).toHaveCount(1)
  }

  await page.goto('/no-such-page')

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, follow',
  )
})

test('заголовок вкладки начинается с h1', async ({ page }) => {
  for (const path of TITLE_FROM_HEADING) {
    await page.goto(path)

    const heading = (await page.getByRole('heading', { level: 1 }).innerText())
      .replace(/\s+/gu, ' ')
      .trim()
    const title = await page.title()

    expect(title.startsWith(heading), `${path}: ${title} / ${heading}`).toBe(
      true,
    )
  }
})

test('текстовые страницы устроены как документ', async ({ page }) => {
  for (const path of WITH_SECTIONS) {
    await page.goto(path)

    const headings = page.getByRole('heading', { level: 2 })

    expect(await headings.count(), path).toBeGreaterThan(0)

    const shape = await page.evaluate(() =>
      [...document.querySelectorAll('main h2')].map((node) => ({
        text: (node.textContent ?? '').trim(),
        next: node.nextElementSibling?.tagName ?? '',
        nextText: (node.nextElementSibling?.textContent ?? '').trim(),
      })),
    )

    for (const block of shape) {
      expect(block.text, path).not.toBe('')
      expect(['P', 'UL', 'DL'], `${path}: ${block.text}`).toContain(block.next)
      expect(block.nextText, `${path}: ${block.text}`).not.toBe('')
    }
  }
})

test('на страницах не осталось слов-заполнителей', async ({ page }) => {
  for (const path of ROUTES) {
    await page.goto(path)

    const text = (await bodyText(page)).toLowerCase()

    for (const word of FILLER)
      expect(text, `${path}: ${word}`).not.toContain(word)
  }
})

test('aria-labelledby секций указывает на живой id', async ({ page }) => {
  for (const path of ROUTES) {
    await page.goto(path)

    const broken = await page.evaluate(() =>
      [...document.querySelectorAll('[aria-labelledby]')]
        .map((node) => node.getAttribute('aria-labelledby') ?? '')
        .filter((id) => document.getElementById(id) === null),
    )

    expect(broken, path).toStrictEqual([])
  }
})

test('страница категории отдаёт либо товары, либо текст', async ({ page }) => {
  await page.goto('/shop/overalls')

  const cards = page.locator('.grid > li')

  expect(await cards.count()).toBeGreaterThan(0)
  await expect(page.locator('.grid [data-item]')).toHaveCount(0)

  for (const path of ['/shop/jeans', '/shop/shirts']) {
    await page.goto(path)

    await expect(page.locator('.grid'), path).toHaveCount(0)
    await expect(page.locator('.figure img'), path).toHaveCount(1)
    await expect(page.locator('.prose .block'), path).not.toHaveCount(0)
  }
})

test('карта сайта совпадает с машинной', async ({ page }) => {
  const response = await page.request.get('/sitemap-0.xml')

  expect(response.status()).toBe(200)

  const xml = await response.text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) =>
    new URL(match[1] ?? '').pathname.replace(/\/$/u, ''),
  )

  expect(locs).toHaveLength(ROUTES.length)
  expect(new Set(locs)).toStrictEqual(
    new Set(ROUTES.map((path) => path.replace(/\/$/u, ''))),
  )
  expect(xml).not.toContain('/404')

  await page.goto('/sitemap')

  const listed = await page
    .locator('.link')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href') ?? ''),
    )

  for (const path of ROUTES)
    expect(listed, `нет ссылки на ${path}`).toContain(path)

  for (const href of listed) {
    const page404 = await page.request.get(href)

    expect(page404.status(), href).toBe(200)
  }
})

test('крошки каталога: ссылка, простая и текущая', async ({ page }) => {
  await page.goto('/catalog')

  await expect(page.locator('.crumb-link')).toHaveCount(1)
  await expect(page.locator('.plain')).toHaveText('Woman')
  await expect(page.locator('[aria-current="page"]')).toHaveText('Jackets')
})

test('обход содержимого доступен с клавиатуры', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')

  const skip = page.locator('.skip')

  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()

  await skip.press('Enter')

  expect(new URL(page.url()).hash).toBe('#content')
})
