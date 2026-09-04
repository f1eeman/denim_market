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
  '/404',
]

const SURFACES = [
  '.head',
  '.title',
  '.eyebrow',
  '.action',
  '.cue',
  '.crumbs',
  '.info',
  '.card',
  '.grid > li',
  '.thumbs > li',
  '[data-item]:not([hidden])',
  '.prose .heading',
  '.prose .text',
  '.terms .value',
  '.exit',
]

const faded = (page: Page) =>
  page.evaluate((selectors: string[]) => {
    const bad: string[] = []

    for (const selector of selectors)
      for (const node of document.querySelectorAll(selector)) {
        const style = getComputedStyle(node)

        if (style.display === 'none') continue
        if (style.visibility === 'hidden' || Number(style.opacity) < 0.99)
          bad.push(
            `${selector} opacity=${style.opacity} vis=${style.visibility}`,
          )
      }

    return bad
  }, SURFACES)

const toEnd = async (page: Page): Promise<void> => {
  for (let step = 0; step < 12; step += 1) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(220)
  }
}

test.describe('движение ничего не прячет насовсем', () => {
  for (const route of ROUTES) {
    test(`после полной прокрутки ни один блок не прозрачен — ${route}`, async ({
      page,
    }) => {
      await page.goto(route)
      await toEnd(page)

      expect(await faded(page)).toStrictEqual([])
    })
  }

  for (const route of ROUTES) {
    test(`под reduce страница собрана сразу — ${route}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(route)

      expect(await faded(page)).toStrictEqual([])
    })
  }

  test('слой вытирания сеток убирается после хода', async ({ page }) => {
    await page.goto('/')
    await toEnd(page)

    const shown = await page
      .locator('.wipe')
      .evaluateAll((nodes) =>
        nodes
          .map((node) => getComputedStyle(node).display)
          .filter((display) => display !== 'none'),
      )

    expect(shown).toStrictEqual([])
  })

  test('под reduce слой вытирания не включается вовсе', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await toEnd(page)

    const shown = await page
      .locator('.wipe')
      .evaluateAll((nodes) =>
        nodes
          .map((node) => getComputedStyle(node).display)
          .filter((display) => display !== 'none'),
      )

    expect(shown).toStrictEqual([])
  })

  test('цикл курсора промо гасится за пределами кадра', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1200)

    const moving = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const glyph = document.querySelector('[data-scene-cue]')

          if (glyph === null) {
            resolve(0)

            return
          }

          const seen = new Set<string>()
          let left = 40

          const tick = (): void => {
            seen.add(getComputedStyle(glyph).transform)

            if (--left > 0) requestAnimationFrame(tick)
            else resolve(seen.size)
          }

          requestAnimationFrame(tick)
        }),
    )

    expect(moving).toBeGreaterThan(2)

    await toEnd(page)

    const parked = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const glyph = document.querySelector('[data-scene-cue]')

          if (glyph === null) {
            resolve(0)

            return
          }

          const seen = new Set<string>()
          let left = 30

          const tick = (): void => {
            seen.add(getComputedStyle(glyph).transform)

            if (--left > 0) requestAnimationFrame(tick)
            else resolve(seen.size)
          }

          requestAnimationFrame(tick)
        }),
    )

    expect(parked).toBe(1)
  })

  test('каждый селектор страховки встречается хотя бы на одной странице', async ({
    page,
  }) => {
    const seen = new Set<string>()

    for (const route of ROUTES) {
      await page.goto(route)

      for (const selector of SURFACES)
        if ((await page.locator(selector).count()) > 0) seen.add(selector)
    }

    expect(
      [...SURFACES].filter((selector) => !seen.has(selector)),
    ).toStrictEqual([])
  })

  test('галерея объявляет смену кадра', async ({ page }) => {
    await page.goto('/product')

    const status = page.locator('[data-gallery-status]')

    await expect(status).toHaveText('Shot 1 of 5')

    await page.locator('[data-gallery-thumb="3"]').click()

    await expect(status).toHaveText('Shot 4 of 5')
  })

  test('корзина объявляет добавление', async ({ page }) => {
    await page.goto('/product')
    await page.locator('[data-cart-add]').click()

    await expect(page.locator('[data-cart-status]')).toContainText('added')
  })
})
