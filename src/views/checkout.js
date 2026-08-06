import { formatRp, placeholder, toast, field, btnClass } from '../lib.js'
import { Layout } from '../components/Layout.js'
import { OrderSummary } from '../components/OrderSummary.js'
import { state, cartProduct, orderTotals } from '../state.js'
import { shippingOptions, provinces } from '../data.js'

export default {
  render() {
    const { subtotal, tax, total } = orderTotals()

    const itemsHtml = state.cart.length
      ? state.cart
          .map((item) => {
            const p = cartProduct(item.id)
            return `
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded bg-surface-low flex-shrink-0 relative overflow-hidden">
                  <img class="w-full h-full object-cover absolute inset-0" src="${placeholder()}" alt="${p.name}" />
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-text-primary line-clamp-2">${p.name}</h4>
                  <p class="text-sm text-text-muted">Qty: ${item.qty}</p>
                </div>
                <span class="text-base font-semibold text-text-primary">${formatRp(p.price * item.qty)}</span>
              </div>`
          })
          .join('')
      : `<p class="text-sm text-text-muted">Tidak ada item di keranjang.</p>`

    const shippingHtml = shippingOptions
      .map(
        (s, i) => `
        <label class="flex items-center p-4 ${i === 0 ? 'border-2 border-accent bg-surface-low' : 'border border-border-input hover:bg-surface-low'} rounded-lg cursor-pointer transition-colors">
          <input ${i === 0 ? 'checked' : ''} class="w-5 h-5 text-accent border-border-input focus:ring-accent" type="radio" name="shipping" value="${s.id}" />
          <div class="ml-4 flex-1">
            <span class="block text-sm font-semibold text-text-primary">${s.label}</span>
            <span class="block text-sm text-text-muted">${s.desc}</span>
          </div>
          <span class="text-base font-semibold text-text-primary">${s.price === 0 ? 'Gratis' : formatRp(s.price)}</span>
        </label>`,
      )
      .join('')

    return Layout({
      top: { title: 'DoctPrint', left: '', right: '', onBack: true },
      bottomNav: false,
      children: `
      <main class="max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col md:flex-row gap-6 md:gap-8">
        <!-- Kolom Kiri: Langkah Checkout -->
        <div class="flex-1 space-y-6">
          <!-- Progress -->
          <div>
            <div class="w-full bg-surface-high rounded-full h-2 mb-4"><div class="bg-primary-container h-2 rounded-full" style="width:33%"></div></div>
            <div class="flex justify-between items-center text-text-muted">
              <span class="text-sm font-bold text-primary-container">1. Pengiriman</span>
              <span class="text-sm">2. Pembayaran</span>
              <span class="text-sm">3. Konfirmasi</span>
            </div>
          </div>

          <!-- Alamat Pengiriman -->
          <section class="bg-surface rounded-lg border border-border p-4 md:p-6 shadow-sm">
            <h2 class="text-lg md:text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Alamat Pengiriman</h2>
            <form class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${field({ label: 'Nama Depan', id: 'firstName', required: true })}
                ${field({ label: 'Nama Belakang', id: 'lastName', required: true })}
              </div>
              ${field({ label: 'Alamat Lengkap', id: 'addressLine1', required: true })}
              ${field({ label: 'Kota / Kabupaten', id: 'city', required: true })}
              <div class="grid grid-cols-2 gap-4">
                ${field({ label: 'Provinsi', id: 'province', options: provinces, placeholder: 'Pilih Provinsi' })}
                ${field({ label: 'Kode Pos', id: 'zip', required: true })}
              </div>
            </form>
          </section>

          <!-- Metode Pengiriman -->
          <section class="bg-surface rounded-lg border border-border p-4 md:p-6 shadow-sm">
            <h2 class="text-lg md:text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Metode Pengiriman</h2>
            <div class="space-y-2">
              ${shippingHtml}
            </div>
          </section>

          <button data-action="continue" class="${btnClass('primary', 'w-full')}">Lanjut ke Pembayaran</button>
        </div>

        <!-- Kolom Kanan: Ringkasan Pesanan -->
        <aside class="w-full md:w-[380px] flex-shrink-0">
          ${OrderSummary({ items: itemsHtml, subtotal, tax, total, shipping: 'Gratis', taxLabel: 'Pajak', sticky: 'top-24' })}
        </aside>
      </main>
      `,
    })
  },

  mount(root) {
    root.querySelector('[data-action="continue"]')?.addEventListener('click', () => {
      toast('Demo: lanjut ke langkah pembayaran')
    })
  },
}
