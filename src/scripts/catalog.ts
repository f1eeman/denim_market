import { gsap, REDUCE, ScrollTrigger } from '@/scripts/gsap'
import { BASE, DEFAULT_STAGGER } from '@/scripts/reveal'

interface Band {
  min: number
  max: number
}

const bandOf = (button: HTMLElement): Band => {
  const min = Number(button.dataset['min'] ?? '0')
  const raw = button.dataset['max'] ?? ''

  return {
    min: Number.isFinite(min) ? min : 0,
    max: raw === '' ? Number.POSITIVE_INFINITY : Number(raw),
  }
}

export function initCatalog(): void {
  const filter = document.querySelector<HTMLElement>('[data-filter]')
  const toggle = document.querySelector<HTMLButtonElement>(
    '[data-filter-toggle]',
  )
  const label = document.querySelector<HTMLElement>('[data-filter-label]')
  const options = document.querySelector<HTMLElement>('[data-filter-options]')
  const shownOut = document.querySelector<HTMLElement>('[data-catalog-shown]')
  const totalOut = document.querySelector<HTMLElement>('[data-catalog-total]')
  const fill = document.querySelector<HTMLElement>('[data-catalog-fill]')
  const more = document.querySelector<HTMLButtonElement>('[data-catalog-more]')
  const empty = document.querySelector<HTMLElement>('[data-catalog-empty]')
  const counter = document.querySelector<HTMLElement>('[data-catalog-counter]')

  if (
    filter === null ||
    toggle === null ||
    label === null ||
    options === null ||
    shownOut === null ||
    totalOut === null ||
    fill === null ||
    more === null ||
    empty === null ||
    counter === null
  )
    return

  const items = Array.from(
    document.querySelectorAll<HTMLElement>('[data-item]'),
  )

  if (items.length === 0) return

  const page = items.filter((item) => !item.hidden).length || items.length

  let band: Band = { min: 0, max: Number.POSITIVE_INFINITY }
  let query = (new URL(window.location.href).searchParams.get('q') ?? '')
    .trim()
    .toLowerCase()
  let shown = page

  const matches = (item: HTMLElement): boolean => {
    const price = Number(item.dataset['price'] ?? '0')
    const name = (item.dataset['name'] ?? '').toLowerCase()

    if (price < band.min || price > band.max) return false

    return query === '' || name.includes(query)
  }

  const render = (animate = false): void => {
    const matched = items.filter(matches)

    shown = Math.min(shown, Math.max(matched.length, page))

    gsap.killTweensOf(items)
    gsap.set(items, { clearProps: 'opacity,transform' })

    const arrived: HTMLElement[] = []

    let visible = 0

    for (const item of items) {
      const pass = matched.includes(item) && visible < shown

      if (animate && pass && item.hidden) arrived.push(item)

      item.hidden = !pass

      if (pass) visible += 1
    }

    if (arrived.length > 0 && !window.matchMedia(REDUCE).matches)
      gsap.from(arrived, {
        opacity: 0,
        y: BASE.shift,
        duration: BASE.duration,
        ease: BASE.ease,
        stagger: DEFAULT_STAGGER,
        clearProps: 'opacity,transform',
      })

    const total = matched.length

    shownOut.textContent = String(visible)
    totalOut.textContent = String(total)
    fill.style.transform =
      total === 0 ? 'scaleX(0)' : `scaleX(${String(visible / total)})`
    const spent = visible >= total

    if (spent && !more.hidden && more.contains(document.activeElement))
      counter.focus()

    more.hidden = spent
    empty.hidden = total > 0

    ScrollTrigger.refresh()
  }

  const close = (): void => {
    options.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
  }

  render()

  toggle.addEventListener('click', () => {
    const open = options.hidden

    options.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
  })

  options.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return

    const button = event.target.closest<HTMLElement>('[data-filter-band]')

    if (button === null) return

    for (const option of options.querySelectorAll('[data-filter-band]'))
      option.setAttribute('aria-current', String(option === button))

    band = bandOf(button)
    label.textContent = button.textContent?.trim() ?? 'Filter by'
    shown = page

    toggle.focus()
    close()
    render()
  })

  document.addEventListener('click', (event) => {
    if (options.hidden) return
    if (!(event.target instanceof Node)) return
    if (filter.contains(event.target)) return

    close()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || options.hidden) return

    close()
    toggle.focus()
  })

  more.addEventListener('click', () => {
    shown += page
    render(true)
  })

  const search = document.querySelector<HTMLFormElement>('[data-search]')

  if (search !== null)
    search.addEventListener('submit', (event) => {
      const field = search.querySelector<HTMLInputElement>(
        '[data-search-field]',
      )

      if (field === null) return

      event.preventDefault()

      query = field.value.trim().toLowerCase()
      shown = page
      render()
    })
}
