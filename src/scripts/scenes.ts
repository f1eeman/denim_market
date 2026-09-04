import { DESKTOP, gsap, MOTION, mm, ScrollTrigger, WIDE } from '@/scripts/gsap'
import { BASE, DEFAULT_STAGGER, STILL_START } from '@/scripts/reveal'

const CUE_SHIFT = 4

const WIPE_ROTATION = -45

const initCue = (): void => {
  const glyph = document.querySelector<HTMLElement>('[data-scene-cue]')

  if (glyph === null) return

  const carrier = glyph.closest<HTMLElement>('[data-scene-cue-carrier]')

  if (carrier === null) return

  mm.add(MOTION, () => {
    const loop = gsap.to(glyph, {
      y: CUE_SHIFT,
      duration: BASE.duration,
      ease: BASE.ease,
      repeat: -1,
      repeatDelay: BASE.duration,
      yoyo: true,
      yoyoEase: true,
    })

    const hold = (): void => {
      loop.pause()
      gsap.set(glyph, { y: 0 })
    }

    const resume = (): void => {
      loop.resume()
    }

    const trigger = ScrollTrigger.create({
      trigger: carrier,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: resume,
      onEnterBack: resume,
      onLeave: hold,
      onLeaveBack: hold,
    })

    return () => {
      trigger.kill()
      loop.kill()
      gsap.set(glyph, { clearProps: 'transform' })
    }
  })
}

const initWipe = (): void => {
  const grids = gsap.utils.toArray<HTMLElement>('[data-scene-wipe]')

  if (grids.length === 0) return

  mm.add(`${MOTION} and ${DESKTOP}`, () => {
    for (const grid of grids) {
      const wipes = gsap.utils.toArray<HTMLElement>('[data-wipe]', grid)

      if (wipes.length === 0) continue

      gsap
        .timeline({
          scrollTrigger: { trigger: grid, start: STILL_START, once: true },
        })
        .set(wipes, { display: 'block', rotation: WIPE_ROTATION, yPercent: 0 })
        .to(wipes, {
          yPercent: -100,
          duration: BASE.duration,
          ease: BASE.ease,
          stagger: DEFAULT_STAGGER,
        })
        .set(wipes, { clearProps: 'display,transform' })
    }
  })
}

const initDiptych = (): void => {
  const bodies = gsap.utils.toArray<HTMLElement>('[data-scene-diptych]')

  if (bodies.length === 0) return

  mm.add(`${MOTION} and ${WIDE}`, () => {
    for (const body of bodies) {
      const wipe = body.querySelector<HTMLElement>('[data-wipe]')
      const pattern = body.querySelector<HTMLElement>('[data-scene-pattern]')
      const card = body.querySelector<HTMLElement>('[data-scene-card]')

      if (wipe === null || pattern === null || card === null) continue

      const line = gsap.timeline({
        scrollTrigger: { trigger: body, start: STILL_START, once: true },
      })

      line
        .set(wipe, { display: 'block', yPercent: 0 })
        .to(wipe, {
          yPercent: -101,
          duration: BASE.duration,
          ease: BASE.ease,
        })
        .set(wipe, { clearProps: 'display,transform' })
        .from(
          pattern,
          { opacity: 0, duration: BASE.duration, ease: BASE.ease },
          DEFAULT_STAGGER,
        )
        .from(
          card,
          {
            opacity: 0,
            y: BASE.shift,
            duration: BASE.duration,
            ease: BASE.ease,
          },
          DEFAULT_STAGGER * 2,
        )
    }
  })
}

export function initScenes(): void {
  initCue()
  initWipe()
  initDiptych()
}
