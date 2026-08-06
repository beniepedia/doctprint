import { icon, formatRp, placeholder, toast } from '../lib.js'
import { TopApp } from '../components/TopApp.js'
import { BottomNav } from '../components/BottomNav.js'
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
                <div class="bg-surface rounded-lg border border-border p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <img class="w-full sm:w-24 h-24 object-cover rounded-md bg-surface-low flex-shrink-0" src="${placeholder()}" alt="${p.name}" />
                  <div class="flex-grow flex flex-col justify-between h-full">
                    <div class="flex justify-between items-start mb-1">
                      <div>
                        <h3 class="text-xl font-semibold text-text-primary">${p.name}</h3>
                        <p class="text-sm text-text-muted">${item.variant || p.unit}</p>
                      </div>
                      <span class="text-xl font-semibold text-text-primary">${formatRp(p.price * item.qty)}</span>
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

    return `
      ${TopApp({ title: 'DoctPrint', left: 'menu', right: 'search' })}

      <main class="max-w-7xl mx-auto px-4 md:px-8 py-6 pt-16">
        <div class="mb-6">
          <h2 class="text-4xl font-bold text-text-primary mb-1">Keranjang Anda</h2>
          <p class="text-base text-text-muted">${count} item di keranjang</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Daftar Item -->
          <div class="md:col-span-8 flex flex-col gap-4">
            ${itemsHtml}
          </div>

          <!-- Ringkasan -->
          <div class="md:col-span-4">
            <div class="bg-surface rounded-lg p-6 border border-border sticky top-20">
              <h3 class="text-xl font-semibold text-text-primary border-b border-border pb-4 mb-4">Ringkasan Pesanan</h3>
              <div class="space-y-2 mb-6">
                <div class="flex justify-between text-base text-text-muted"><span>Subtotal</span><span class="text-text-primary font-semibold">${formatRp(subtotal)}</span></div>
                <div class="flex justify-between text-base text-text-muted"><span>Pengiriman</span><span class="text-text-primary font-semibold">Dihitung saat checkout</span></div>
                <div class="flex justify-between text-base text-text-muted"><span>Estimasi Pajak</span><span class="text-text-primary font-semibold">${formatRp(tax)}</span></div>
              </div>
              <div class="border-t border-border pt-4 mb-6">
                <div class="flex justify-between items-center">
                  <span class="text-2xl font-bold text-text-primary">Total</span>
                  <span class="text-2xl font-bold text-text-primary">${formatRp(total)}</span>
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-semibold text-text-muted mb-1" for="promo">Kode Promo</label>
                <div class="flex gap-2">
                  <input id="promo" class="w-full text-base bg-surface border border-border-input rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-all" placeholder="Masukkan kode" />
                  <button data-action="promo" class="px-4 py-2 border border-primary text-primary text-base font-semibold rounded-lg hover:bg-surface-low transition-colors whitespace-nowrap">Pakai</button>
                </div>
              </div>

              <a href="#/checkout" class="bg-accent w-full py-4 rounded-lg text-base font-semibold text-white flex justify-center items-center gap-2 shadow-sm hover:opacity-90 transition-opacity">
                <span>Lanjut ke Checkout</span>${icon('arrow_forward')}
              </a>
              <div class="mt-4 flex items-center justify-center gap-1 text-text-muted text-sm">
                ${icon('lock', 'text-[16px]')}<span>Checkout Aman</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      ${BottomNav('cart')}
    `
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