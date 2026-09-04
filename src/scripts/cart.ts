interface Line {
  name: string
  price: number
  qty: number
}

type Cart = Record<string, Line>

const KEY = 'nimes-cart'

const isLine = (value: unknown): value is Line => {
  if (typeof value !== 'object' || value === null) return false

  const line = value as Record<string, unknown>

  return (
    typeof line['name'] === 'string' &&
    typeof line['price'] === 'number' &&
    typeof line['qty'] === 'number'
  )
}

const read = (): Cart => {
  const raw = window.localStorage.getItem(KEY)

  if (raw === null) return {}

  try {
    const parsed: unknown = JSON.parse(raw)

    if (typeof parsed !== 'object' || parsed === null) return {}

    const cart: Cart = {}

    for (const [id, line] of Object.entries(parsed))
      if (isLine(line)) cart[id] = line

    return cart
  } catch {
    return {}
  }
}

const write = (cart: Cart): void => {
  window.localStorage.setItem(KEY, JSON.stringify(cart))
}

const countOf = (cart: Cart): number =>
  Object.values(cart).reduce((sum, line) => sum + line.qty, 0)

const totalOf = (cart: Cart): number =>
  Object.values(cart).reduce((sum, line) => sum + line.price * line.qty, 0)

const lineOf = (id: string, line: Line): HTMLLIElement => {
  const item = document.createElement('li')

  item.className = 'cart-line'

  const name = document.createElement('span')

  name.className = 'cart-line-name'
  name.textContent =
    line.qty > 1 ? `${line.name} × ${String(line.qty)}` : line.name

  const price = document.createElement('span')

  price.className = 'cart-line-price'
  price.textContent = `$${String(line.price * line.qty)}`

  const remove = document.createElement('button')

  remove.className = 'cart-remove'
  remove.type = 'button'
  remove.dataset['cartRemove'] = id
  remove.textContent = 'Remove'

  item.append(name, price, remove)

  return item
}

export function initCart(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-cart-toggle]')
  const panel = document.querySelector<HTMLElement>('[data-cart-panel]')
  const badge = document.querySelector<HTMLElement>('[data-cart-count]')
  const list = document.querySelector<HTMLElement>('[data-cart-list]')
  const empty = document.querySelector<HTMLElement>('[data-cart-empty]')
  const total = document.querySelector<HTMLElement>('[data-cart-total]')
  const say = document.querySelector<HTMLElement>('[data-cart-status]')

  if (
    toggle === null ||
    panel === null ||
    badge === null ||
    list === null ||
    empty === null ||
    total === null ||
    say === null
  )
    return

  let cart = read()

  const render = (): void => {
    const count = countOf(cart)

    badge.textContent = String(count)
    badge.hidden = count === 0

    list.replaceChildren(
      ...Object.entries(cart).map(([id, line]) => lineOf(id, line)),
    )

    empty.hidden = count > 0
    total.hidden = count === 0
    total.replaceChildren()

    if (count > 0) {
      const label = document.createElement('span')

      label.textContent = 'Total'

      const sum = document.createElement('span')

      sum.textContent = `$${String(totalOf(cart))}`

      total.append(label, sum)
    }
  }

  const close = (): void => {
    panel.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
  }

  render()

  toggle.addEventListener('click', () => {
    const open = panel.hidden

    panel.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
  })

  panel.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return

    const id = event.target.dataset['cartRemove']

    if (id === undefined) return

    const { [id]: gone, ...rest } = cart

    cart = rest
    write(cart)
    render()

    say.textContent =
      gone === undefined
        ? ''
        : `${gone.name} removed — ${String(countOf(cart))} items`

    const nextRemove =
      list.querySelector<HTMLButtonElement>('[data-cart-remove]')

    if (nextRemove === null) toggle.focus()
    else nextRemove.focus()
  })

  document.addEventListener('click', (event) => {
    if (panel.hidden) return
    if (!(event.target instanceof Node)) return
    if (!event.target.isConnected) return
    if (panel.contains(event.target) || toggle.contains(event.target)) return

    close()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || panel.hidden) return

    close()
    toggle.focus()
  })

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return

    const button = event.target.closest<HTMLElement>('[data-cart-add]')

    if (button === null) return

    const id = button.dataset['cartId']
    const name = button.dataset['cartName']
    const price = Number(button.dataset['cartPrice'])

    if (id === undefined || name === undefined || !Number.isFinite(price))
      return

    const line = cart[id]

    cart = { ...cart, [id]: { name, price, qty: (line?.qty ?? 0) + 1 } }
    write(cart)
    render()

    say.textContent = `${name} added — ${String(countOf(cart))} items, $${String(totalOf(cart))}`

    panel.hidden = false
    toggle.setAttribute('aria-expanded', 'true')
  })
}
