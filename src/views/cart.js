import { icon, formatRp, placeholder, toast } from '../lib.js'
import { Layout } from '../components/Layout.js'
import { Button } from '../components/Button.js'
import { OrderSummary } from '../components/OrderSummary.js'
import { state, cartProduct, orderTotals, changeQty, removeItem } from '../state.js'

export default {
  render() {
    const { count, subtotal, tax, total } = orderTotals()

    const itemsHtml =
      state.cart.length === 0
        ? `<div class="bg-surface rounded-lg border border-border p-8 text-center text-text-muted">Keranjang kosong.</div>`
        : state.cart
            .map((item) => {
              const p = cartProduct(item.id)
              return `
                <div class="bg-surface rounded-lg border border-border p-3 sm:p-4 flex gap-3 sm:gap-4 items-center">
                  <img class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md bg-surface-low flex-shrink-0" src="${placeholder()}" alt="${p.name}" />
                  <div class="flex-grow flex flex-col justify-between h-full min-w-0">
                    <div class="flex justify-between items-start gap-3 mb-1">
                      <div class="min-w-0">
                        <h3 class="text-base md:text-lg font-semibold text-text-primary line-clamp-2">${p.name}</h3>
                        <p class="text-sm text-text-muted">${item.variant || p.unit}</p>
                      </div>
                      <span class="text-base md:text-lg font-semibold text-text-primary whitespace-nowrap">${formatRp(p.price * item.qty)}</span>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                      <div class="flex items-center border border-border-input rounded-md overflow-hidden bg-surface">
                        <button data-action="dec" data-id="${item.id}" aria-label="Kurangi jumlah" class="px-3 py-1 hover:bg-surface-low text-text-muted transition-colors">-</button>
                        <span class="px-3 py-1 text-base text-text-primary border-x border-border-input">${item.qty}</span>
                        <button data-action="inc" data-id="${item.id}" aria-label="Tambah jumlah" class="px-3 py-1 hover:bg-surface-low text-text-muted transition-colors">+</button>
                      </div>
                      <button data-action="remove" data-id="${item.id}" class="text-error hover:text-on-error-container flex items-center gap-1 text-sm font-semibold transition-colors active:scale-95">
                        ${icon('delete', 'text-[18px]')}<span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>`
            })
            .join('')

    const summaryFooter = `
      <div class="mt-6 mb-6">
        <label class="block text-sm font-semibold text-text-muted mb-1" for="promo">Kode Promo</label>
        <div class="flex gap-2">
          <input id="promo" class="w-full text-base bg-surface border border-border-input rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-all" placeholder="Masukkan kode" />
          ${Button({ label: 'Pakai', variant: 'secondary', size: 'sm', attrs: 'data-action="promo"' })}
        </div>
      </div>
      ${Button({ label: 'Lanjut ke Checkout', href: '#/checkout', icon: 'arrow_forward', full: true, extra: 'shadow-sm' })}`

    return Layout({
      top: { title: 'DoctPrint', left: 'menu', right: 'search' },
      active: 'cart',
      children: `
      <main class="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div class="mb-6">
          <h2 class="text-2xl md:text-4xl font-bold text-text-primary mb-1">Keranjang Anda</h2>
          <p class="text-base text-text-muted">${count} item di keranjang</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Daftar Item -->
          <div class="md:col-span-8 flex flex-col gap-4">
            ${itemsHtml}
          </div>

          <!-- Ringkasan -->
          <div class="md:col-span-4">
            ${OrderSummary({
              subtotal,
              tax,
              total,
              shipping: 'Dihitung saat checkout',
              taxLabel: 'Estimasi Pajak',
              footer: summaryFooter,
              sticky: 'top-20',
            })}
          </div>
        </div>
      </main>
      `,
    })
  },

  mount(root) {
    const refresh = () => {
      root.innerHTML = this.render()
      this.mount(root)
    }

    root.querySelectorAll('[data-action="dec"]').forEach((btn) =>
      btn.addEventListener('click', () => {
        changeQty(btn.dataset.id, -1)
        refresh()
      }),
    )
    root.querySelectorAll('[data-action="inc"]').forEach((btn) =>
      btn.addEventListener('click', () => {
        changeQty(btn.dataset.id, 1)
        refresh()
      }),
    )
    root.querySelectorAll('[data-action="remove"]').forEach((btn) =>
      btn.addEventListener('click', () => {
        removeItem(btn.dataset.id)
        refresh()
      }),
    )
    root.querySelector('[data-action="promo"]')?.addEventListener('click', () => {
      toast('Demo: kode promo belum tersedia')
    })
  },
}