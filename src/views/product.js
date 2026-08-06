import { products } from '../data.js'
import { icon, formatRp, placeholder, toast } from '../lib.js'
import { TopApp } from '../components/TopApp.js'
import { addToCart } from '../state.js'

const DEFAULT_ID = 'printer-ecotank-l3110'

export default {
  render(params) {
    const id = params.get('id') || DEFAULT_ID
    const p = products.find((x) => x.id === id) || products[0]

    return `
      ${TopApp({ title: 'DoctPrint', left: '', right: 'search', onBack: true })}

      <main class="max-w-7xl mx-auto px-4 md:px-8 py-6 pt-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Galeri -->
          <div class="space-y-2">
            <div class="w-full h-[400px] md:h-[600px] rounded-lg bg-surface shadow-sm border border-border overflow-hidden relative">
              <img class="w-full h-full object-cover" src="${placeholder()}" alt="${p.name}" />
            </div>
            <div class="flex gap-2 overflow-x-auto no-scrollbar snap-x">
              ${[0, 1, 2, 3]
                .map(() => `<img class="w-20 h-20 rounded-lg object-cover cursor-pointer border border-border snap-start shrink-0" src="${placeholder()}" alt="Pratinjau" />`)
                .join('')}
            </div>
          </div>

          <!-- Info Produk -->
          <div class="flex flex-col space-y-6">
            <div>
              <h1 class="text-2xl md:text-4xl font-bold text-text-primary">${p.name}</h1>
              <p class="text-xl md:text-2xl font-semibold text-accent-deep mt-1">${formatRp(p.price)}<span class="text-sm text-text-muted"> ${p.unit}</span></p>
            </div>

            <!-- Warna Kertas -->
            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-text-muted uppercase">Pilihan Warna</h3>
              <div class="flex gap-4">
                ${p.colorOptions
                  .map(
                    (c, i) => `<button data-color aria-label="${c.label}" title="${c.label}" class="w-10 h-10 rounded-full ${i === 0 ? 'ring-2 ring-offset-2 ring-accent' : ''} transition-all" style="background:${c.hex}"></button>`,
                  )
                  .join('')}
              </div>
            </div>

            <!-- Jenis Kertas -->
            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-text-muted uppercase">Tipe / Varian</h3>
              <div class="grid grid-cols-3 gap-4">
                ${p.paperOptions
                  .map(
                    (s, i) => `<button data-paper class="py-3 ${i === 0 ? 'border-2 border-accent' : 'border border-border-input'} rounded-lg text-sm md:text-base font-semibold text-text-primary bg-surface text-center hover:border-accent transition-colors">${s}</button>`,
                  )
                  .join('')}
              </div>
            </div>

            <!-- Deskripsi -->
            <div class="space-y-2">
              <h3 class="text-lg md:text-xl font-semibold text-text-primary">Tentang Layanan</h3>
              <p class="text-base text-text-muted leading-relaxed">${p.desc}</p>
            </div>

            <!-- Spesifikasi -->
            <div class="grid grid-cols-2 gap-4">
              ${p.specs
                .map(
                  (s) => `
                  <div class="bg-surface-low p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    ${icon(s.icon, 'text-accent-container text-2xl mb-1')}
                    <span class="text-sm font-semibold">${s.label}</span>
                  </div>`,
                )
                .join('')}
            </div>
          </div>
        </div>
      </main>

      <!-- Sticky Action Bar -->
      <div class="fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 pb-safe flex gap-4">
        <button data-action="add-to-cart" class="flex-1 py-3.5 bg-surface border border-primary rounded-lg text-base font-semibold text-primary hover:bg-surface-low transition-colors">Tambah ke Keranjang</button>
        <button data-action="buy-now" class="flex-1 py-3.5 bg-accent rounded-lg text-base font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">Beli Sekarang</button>
      </div>
    `
  },

  mount(root) {
    const currentId = () =>
      new URLSearchParams(location.hash.split('?')[1] || '').get('id') || DEFAULT_ID

    root.querySelector('[data-action="add-to-cart"]')?.addEventListener('click', () => {
      addToCart(currentId(), 1)
      toast('Ditambahkan ke keranjang')
    })
    root.querySelector('[data-action="buy-now"]')?.addEventListener('click', () => {
      toast('Demo: lanjut ke pembayaran')
    })

    root.querySelectorAll('[data-color]').forEach((btn) =>
      btn.addEventListener('click', () => {
        root.querySelectorAll('[data-color]').forEach((b) => b.classList.remove('ring-2', 'ring-offset-2', 'ring-accent'))
        btn.classList.add('ring-2', 'ring-offset-2', 'ring-accent')
      }),
    )

    root.querySelectorAll('[data-paper]').forEach((btn) =>
      btn.addEventListener('click', () => {
        root.querySelectorAll('[data-paper]').forEach((b) => {
          b.classList.remove('border-2', 'border-accent')
          b.classList.add('border', 'border-border-input')
        })
        btn.classList.remove('border', 'border-border-input')
        btn.classList.add('border-2', 'border-accent')
      }),
    )
  },
}