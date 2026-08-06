import { icon, formatRp, placeholder, toast } from '../lib.js'
import { TopApp } from '../components/TopApp.js'
import { state, cartProduct, orderTotals } from '../state.js'

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

    return `
      ${TopApp({ title: 'DoctPrint', left: '', right: '', onBack: true })}

      <main class="max-w-7xl mx-auto w-full pt-20 pb-16 px-4 md:px-8 flex flex-col md:flex-row gap-6 md:gap-8 mt-2">
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
            <h2 class="text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Alamat Pengiriman</h2>
            <form class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col">
                  <label class="text-sm font-semibold text-text-muted mb-1" for="firstName">Nama Depan</label>
                  <input class="rounded-lg border border-border-input p-4 text-base text-text-primary bg-transparent focus:border-primary focus:outline-none transition-all" id="firstName" required />
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-semibold text-text-muted mb-1" for="lastName">Nama Belakang</label>
                  <input class="rounded-lg border border-border-input p-4 text-base text-text-primary bg-transparent focus:border-primary focus:outline-none transition-all" id="lastName" required />
                </div>
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-semibold text-text-muted mb-1" for="addressLine1">Alamat Lengkap</label>
                <input class="rounded-lg border border-border-input p-4 text-base text-text-primary bg-transparent focus:border-primary focus:outline-none transition-all" id="addressLine1" required />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-semibold text-text-muted mb-1" for="city">Kota / Kabupaten</label>
                <input class="rounded-lg border border-border-input p-4 text-base text-text-primary bg-transparent focus:border-primary focus:outline-none transition-all" id="city" required />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col">
                  <label class="text-sm font-semibold text-text-muted mb-1" for="province">Provinsi</label>
                  <select class="rounded-lg border border-border-input p-4 text-base text-text-primary bg-transparent focus:border-primary focus:outline-none transition-all appearance-none" id="province">
                    <option disabled selected>Pilih Provinsi</option>
                    <option>Jawa Barat</option>
                    <option>DKI Jakarta</option>
                    <option>Jawa Timur</option>
                  </select>
                </div>
                <div class="flex flex-col">
                  <label class="text-sm font-semibold text-text-muted mb-1" for="zip">Kode Pos</label>
                  <input class="rounded-lg border border-border-input p-4 text-base text-text-primary bg-transparent focus:border-primary focus:outline-none transition-all" id="zip" required />
                </div>
              </div>
            </form>
          </section>

          <!-- Metode Pengiriman -->
          <section class="bg-surface rounded-lg border border-border p-4 md:p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Metode Pengiriman</h2>
            <div class="space-y-2">
              <label class="flex items-center p-4 border-2 border-accent rounded-lg cursor-pointer bg-surface-low transition-colors">
                <input checked class="w-5 h-5 text-accent border-border-input focus:ring-accent" type="radio" name="shipping" value="standard" />
                <div class="ml-4 flex-1">
                  <span class="block text-sm font-semibold text-text-primary">Pengiriman Standar</span>
                  <span class="block text-sm text-text-muted">3-5 Hari Kerja</span>
                </div>
                <span class="text-base font-semibold text-text-primary">Gratis</span>
              </label>
              <label class="flex items-center p-4 border border-border-input rounded-lg cursor-pointer hover:bg-surface-low transition-colors">
                <input class="w-5 h-5 text-accent border-border-input focus:ring-accent" type="radio" name="shipping" value="express" />
                <div class="ml-4 flex-1">
                  <span class="block text-sm font-semibold text-text-primary">Pengiriman Ekspres</span>
                  <span class="block text-sm text-text-muted">1-2 Hari Kerja</span>
                </div>
                <span class="text-base font-semibold text-text-primary">${formatRp(15000)}</span>
              </label>
            </div>
          </section>

          <button data-action="continue" class="w-full bg-accent text-white text-base font-semibold py-4 rounded-lg hover:bg-opacity-90 transition-opacity active:scale-[0.98]">Lanjut ke Pembayaran</button>
        </div>

        <!-- Kolom Kanan: Ringkasan Pesanan -->
        <aside class="w-full md:w-[380px] flex-shrink-0">
          <div class="bg-surface rounded-lg border border-border p-4 shadow-sm sticky top-24">
            <h3 class="text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Ringkasan Pesanan</h3>
            <div class="space-y-4 mb-6">
              ${itemsHtml}
            </div>
            <div class="border-t border-border pt-4 space-y-2">
              <div class="flex justify-between text-base text-text-muted"><span>Subtotal</span><span>${formatRp(subtotal)}</span></div>
              <div class="flex justify-between text-base text-text-muted"><span>Pengiriman</span><span>Gratis</span></div>
              <div class="flex justify-between text-base text-text-muted"><span>Pajak</span><span>${formatRp(tax)}</span></div>
              <div class="flex justify-between text-2xl font-semibold text-text-primary pt-2 border-t border-border"><span>Total</span><span>${formatRp(total)}</span></div>
            </div>
            <div class="mt-4 flex items-center justify-center gap-1 text-text-muted text-sm">
              ${icon('lock', 'text-[16px]')}<span>Checkout Aman</span>
            </div>
          </div>
        </aside>
      </main>
    `
  },

  mount(root) {
    root.querySelector('[data-action="continue"]')?.addEventListener('click', () => {
      toast('Demo: lanjut ke langkah pembayaran')
    })
  },
}