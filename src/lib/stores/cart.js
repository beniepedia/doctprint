import { derived, writable } from 'svelte/store'
import { products } from '../data/products.js'

export const cart = writable([
  { id: 'printer-ecotank-l3110', qty: 1, variant: 'Multi Function' },
  { id: 'printer-canon-ip2770', qty: 2, variant: 'Original' },
])

export const cartItems = derived(cart, ($cart) =>
  $cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.id) }))
    .filter((item) => item.product),
)

export const cartCount = derived(cart, ($cart) => $cart.reduce((sum, item) => sum + item.qty, 0))

export const orderTotals = derived(cart, ($cart) => {
  const subtotal = $cart.reduce((sum, item) => sum + (products.find((p) => p.id === item.id)?.price || 0) * item.qty, 0)
  const tax = Math.round(subtotal * 0.08)
  return { count: $cart.reduce((sum, item) => sum + item.qty, 0), subtotal, tax, total: subtotal + tax }
})

export function addToCart(id, qty = 1, variant = '') {
  cart.update((items) => {
    const item = items.find((i) => i.id === id)
    if (item) item.qty += qty
    else items.push({ id, qty, variant })
    return [...items]
  })
}

export function changeQty(id, delta) {
  cart.update((items) => {
    const next = items
      .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
      .filter((item) => item.qty > 0)
    return next
  })
}

export function removeItem(id) {
  cart.update((items) => items.filter((item) => item.id !== id))
}
