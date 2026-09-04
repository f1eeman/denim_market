import { REDUCE } from '@/scripts/gsap'

const chosen = (name: string): string => {
  const input = document.querySelector<HTMLInputElement>(
    `input[data-choice="${name}"]:checked`,
  )

  return input?.value ?? ''
}

const initGallery = (): void => {
  const gallery = document.querySelector<HTMLElement>('[data-gallery]')

  if (gallery === null) return

  const slides = Array.from(
    gallery.querySelectorAll<HTMLImageElement>('[data-gallery-slide]'),
  )
  const thumbs = Array.from(
    gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-thumb]'),
  )
  const prev = gallery.querySelector<HTMLButtonElement>('[data-gallery-prev]')
  const next = gallery.querySelector<HTMLButtonElement>('[data-gallery-next]')
  const status = gallery.querySelector<HTMLElement>('[data-gallery-status]')

  if (slides.length === 0) return

  let active = 0
  let pending = 0

  const settle = (): void => {
    slides.forEach((slide, at) => {
      slide.hidden = at !== active
    })
  }

  const mark = (): void => {
    slides.forEach((slide, at) => {
      slide.setAttribute('aria-hidden', String(at !== active))

      if (at === active) slide.dataset['galleryCurrent'] = ''
      else delete slide.dataset['galleryCurrent']
    })

    thumbs.forEach((thumb, at) => {
      thumb.setAttribute('aria-current', String(at === active))
    })

    if (status !== null)
      status.textContent = `Shot ${String(active + 1)} of ${String(slides.length)}`

    thumbs[active]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  const show = (index: number): void => {
    const at = (index + slides.length) % slides.length

    if (at === active) return

    const slide = slides[at]

    if (slide === undefined) return

    const token = pending + 1

    pending = token
    slide.hidden = false

    const paint = (): void => {
      if (pending !== token) return

      active = at
      mark()

      if (window.matchMedia(REDUCE).matches) {
        settle()

        return
      }

      slide.addEventListener('animationend', settle, { once: true })
    }

    if (slide.complete) {
      paint()

      return
    }

    slide
      .decode()
      .then(paint)
      .catch(() => {
        paint()
      })
  }

  mark()

  for (const [at, thumb] of thumbs.entries())
    thumb.addEventListener('click', () => {
      show(at)
    })

  prev?.addEventListener('click', () => {
    show(active - 1)
  })

  next?.addEventListener('click', () => {
    show(active + 1)
  })
}

const initChoices = (): void => {
  const button = document.querySelector<HTMLElement>('[data-cart-add]')

  if (button === null) return

  const base = button.dataset['cartName'] ?? ''
  const id = button.dataset['cartId'] ?? ''

  const sync = (): void => {
    const size = chosen('size')
    const color = chosen('color')
    const suffix = [size, color].filter((part) => part !== '').join(' / ')

    button.dataset['cartName'] = suffix === '' ? base : `${base} (${suffix})`
    button.dataset['cartId'] =
      suffix === ''
        ? id
        : `${id}-${suffix.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
  }

  sync()

  for (const input of document.querySelectorAll<HTMLInputElement>(
    'input[data-choice]',
  ))
    input.addEventListener('change', sync)
}

export function initProduct(): void {
  initGallery()
  initChoices()
}
