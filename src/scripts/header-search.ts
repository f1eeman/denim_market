export function initHeaderSearch(): void {
  const form = document.querySelector<HTMLFormElement>('[data-search]')

  if (form === null) return

  const toggle = form.querySelector<HTMLButtonElement>('[data-search-toggle]')
  const field = form.querySelector<HTMLInputElement>('[data-search-field]')

  if (toggle === null || field === null) return

  const query = new URL(window.location.href).searchParams.get('q')

  const open = (): void => {
    form.dataset['searchOpen'] = ''
    toggle.setAttribute('aria-expanded', 'true')
  }

  const close = (): void => {
    delete form.dataset['searchOpen']
    toggle.setAttribute('aria-expanded', 'false')
  }

  if (query !== null && query !== '') {
    field.value = query
    open()
  }

  toggle.addEventListener('click', () => {
    if (form.dataset['searchOpen'] === undefined) {
      open()
      field.focus()

      return
    }

    if (field.value.trim() !== '') {
      form.requestSubmit()

      return
    }

    close()
  })

  document.addEventListener('click', (event) => {
    if (form.dataset['searchOpen'] === undefined) return
    if (field.value.trim() !== '') return
    if (!(event.target instanceof Node)) return
    if (form.contains(event.target)) return

    close()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    if (form.dataset['searchOpen'] === undefined) return

    field.value = ''
    close()
    toggle.focus()
  })
}
