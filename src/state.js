import { products } from './data.js'

export const TAX_RATE = 0.08

export const state = {
  cart: [
    { id: 'cetak-fullcolor', qty: 10, variant: 'HVS 100gsm' },
    { id: 'jilid-skripsi', qty: 2, variant: 'Hard Cover' },
    { id: 'cetak-foto', qty: 12, variant: 'Glossy 4R' },
  ],
}

export function cartProduct(id) {
  return products.find((p) => p.id === id)
}

export function cartCount() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0)
}

export function orderTotals() {
  const subtotal = state.cart.reduce((sum, i) => sum + cartProduct(i.id).price * i.qty, 0)
  const tax = Math.round(subtotal * TAX_RATE)
  return { count: cartCount(), subtotal, tax, total: subtotal + tax }
}

export function addToCart(id, qty = 1, variant = '') {
  const item = state.cart.find((i) => i.id === id)
  if (item) item.qty += qty
  else state.cart.push({ id, qty, variant })
}

export function changeQty(id, delta) {
  const item = state.cart.find((i) => i.id === id)
  if (!item) return
  const next = item.qty + delta
  if (next <= 0) state.cart = state.cart.filter((i) => i.id !== id)
  else item.qty = next
}

export function removeItem(id) {
  state.cart = state.cart.filter((i) => i.id !== id)
}