import { products } from '../data.js'
import { icon, formatRp, photo, toast, youtubeEmbed } from '../lib.js'
import { Layout } from '../components/Layout.js'
import { Button } from '../components/Button.js'
import { addToCart } from '../state.js'

const DEFAULT_ID = 'printer-ecotank-l3110'

export default {
  render(params) {
    const id = params.get('id') || DEFAULT_ID
    const p = products.find((x) => x.id === id) || products[0]
    const badgeCls = p.badge === 'Sale' ? 'bg-error' : 'bg-accent-container'
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null
    const stock = p.stock ?? 10
    const soldOut = stock === 0
    const stockInfo = soldOut
      ? { label: 'Stok Habis', cls: 'text-error', dot: 'bg-error' }
      : stock <= 5
        ? { label: `Stok Menipis · Sisa ${stock}`, cls: 'text-accent-deep', dot: 'bg-accent' }
        : { label: 'Stok Tersedia', cls: 'text-success', dot: 'bg-success' }
    const videoEmbed = p.video ? youtubeEmbed(p.video) : null
    const initialMedia = p.video
      ? videoEmbed
        ? `<iframe class="w-full h-full" src="${videoEmbed}" title="Video produk" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        : `<video class="w-full h-full object-contain bg-surface" controls playsinline src="${p.video}"></video>`
      : `<img class="w-full h-full object-cover" src="${photo(p.id, 900, 900)}" alt="${p.name}" />`
    const starRow = (n, cls = 'text-[14px]') =>
      Array.from({ length: n }, () => `<span class="material-symbols-outlined ${cls} text-accent-container" style="font-variation-settings:'FILL' 1">star</span>`).join('')

    return Layout({
      top: { title: 'DoctPrint', left: '', right: 'search', onBack: true },
      bottomNav: false,
      children: `
      <main class="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Galeri -->
          <div class="space-y-2">
            <div data-media-frame class="w-full aspect-square max-h-[600px] rounded-xl bg-surface shadow-sm border border-border overflow-hidden relative">
              <div data-main-media class="w-full h-full">
                ${initialMedia}
              </div>
              ${soldOut ? `<span class="absolute top-3 right-3 bg-text-primary/80 text-white px-2.5 py-1 rounded text-xs font-semibold uppercase">Stok Habis</span>` : ''}
            </div>
            <div class="flex gap-2 overflow-x-auto no-scrollbar snap-x p-2">
              ${[
                ...(p.video ? [{ type: 'video', src: p.video, alt: 'Video' }] : []),
                ...[0, 1, 2, 3].map((i) => ({ type: 'image', src: photo(p.id + '-' + i, 200, 200), alt: 'Pratinjau ' + (i + 1) })),
              ]
                .map(
                  (m, i) => `
                  <button data-media data-media-type="${m.type}" data-media-src="${m.src}" aria-label="${m.alt}" class="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer snap-start shrink-0 ${i === 0 ? 'ring-2 ring-accent border-transparent' : 'border border-border'}">
                    <img class="w-full h-full object-cover" src="${m.type === 'video' ? photo(p.id + '-video', 200, 200) : m.src}" alt="${m.alt}" />
                    ${m.type === 'video' ? `<span class="absolute inset-0 flex items-center justify-center bg-black/30">${icon('play_circle', 'text-white text-3xl')}</span>` : ''}
                  </button>`,
                )
                .join('')}
            </div>
          </div>

          <!-- Info Produk -->
          <div class="flex flex-col space-y-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                ${p.badge ? `<span class="${badgeCls} text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase">${p.badge}</span>` : ''}
                <span class="flex items-center gap-1 text-sm font-semibold text-text-primary">
                  <span class="material-symbols-outlined text-[16px] text-accent-container" style="font-variation-settings:'FILL' 1">star</span>${p.rating}
                </span>
                ${p.sold ? `<span class="text-sm text-text-muted">· Terjual ${p.sold.toLocaleString('id-ID')}+</span>` : ''}
              </div>
              <h1 class="text-2xl md:text-4xl font-bold text-text-primary">${p.name}</h1>
              <div class="mt-2 flex items-end gap-2">
                ${p.oldPrice ? `<p class="text-base text-text-muted line-through">${formatRp(p.oldPrice)}</p>` : ''}
                <p class="text-2xl md:text-3xl font-bold text-accent-deep">${formatRp(p.price)}</p>
                ${discount ? `<span class="bg-error text-white text-xs font-bold px-2 py-0.5 rounded mb-1">-${discount}%</span>` : ''}
              </div>
              <div class="mt-3 flex items-center gap-1.5 text-sm font-medium ${stockInfo.cls}">
                <span class="w-2 h-2 rounded-full ${stockInfo.dot}"></span>${stockInfo.label}
              </div>
            </div>

            <!-- Pilihan -->
            <section class="bg-surface rounded-lg border border-border p-4 md:p-6 space-y-4">
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
              <div class="space-y-2">
                <h3 class="text-sm font-semibold text-text-muted uppercase">Pilihan Tipe</h3>
                <div class="grid grid-cols-3 gap-3">
                  ${p.paperOptions
                    .map(
                      (s, i) => `<button data-paper class="py-3 ${i === 0 ? 'border-2 border-accent' : 'border border-border-input'} rounded-lg text-sm md:text-base font-semibold text-text-primary bg-surface text-center hover:border-accent transition-colors">${s}</button>`,
                    )
                    .join('')}
                </div>
              </div>
            </section>

            <!-- Deskripsi -->
            <section class="bg-surface rounded-lg border border-border p-4 md:p-6">
              <h3 class="text-lg md:text-xl font-semibold text-text-primary mb-2">Deskripsi Produk</h3>
              <p class="text-base text-text-muted leading-relaxed">${p.desc}</p>
            </section>

            <!-- Ulasan Pelanggan -->
            <section class="bg-surface rounded-lg border border-border p-4 md:p-6">
              <h3 class="text-lg md:text-xl font-semibold text-text-primary mb-4">Ulasan Pelanggan</h3>
              ${
                p.reviews && p.reviews.length
                  ? `
                  <div class="flex items-center gap-3 mb-6">
                    <span class="text-3xl font-bold text-text-primary">${p.rating}</span>
                    <div class="flex flex-col">
                      <div class="flex items-center gap-0.5">${starRow(Math.round(p.rating), 'text-[18px]')}</div>
                      <span class="text-sm text-text-muted">Rata-rata dari ${p.reviews.length} ulasan</span>
                    </div>
                  </div>
                  <div class="flex flex-col divide-y divide-border">
                    ${p.reviews
                      .map(
                        (r) => `
                        <div class="py-4 first:pt-0 last:pb-0">
                          <div class="flex items-center gap-3 mb-2">
                            <div class="w-9 h-9 rounded-full bg-surface-mid flex items-center justify-center text-sm font-semibold text-text-primary flex-shrink-0">${r.name
                              .split(' ')
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join('')}</div>
                            <div class="min-w-0">
                              <p class="text-sm font-semibold text-text-primary truncate">${r.name}</p>
                              <p class="text-xs text-text-muted">${r.date}</p>
                            </div>
                            <div class="ml-auto flex items-center gap-0.5">${starRow(r.rating)}</div>
                          </div>
                          <p class="text-sm text-text-muted leading-relaxed">${r.comment}</p>
                        </div>`,
                      )
                      .join('')}
                  </div>`
                  : `<p class="text-base text-text-muted">Belum ada ulasan untuk produk ini.</p>`
              }
            </section>
          </div>
        </div>
      </main>

      <!-- Sticky Action Bar -->
      <div class="fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 pb-safe flex gap-4">
        ${Button({ label: '+ Keranjang', variant: 'secondary', size: 'sm', extra: 'flex-1' + (soldOut ? ' opacity-50 pointer-events-none' : ''), attrs: 'data-action="add-to-cart"' + (soldOut ? ' disabled' : '') })}
        ${Button({ label: 'Beli Sekarang', size: 'sm', extra: 'flex-1' + (soldOut ? ' opacity-50 pointer-events-none' : ''), attrs: 'data-action="buy-now"' + (soldOut ? ' disabled' : '') })}
      </div>
      `,
    })
  },

  mount(root) {
    const currentId = () =>
      new URLSearchParams(location.hash.split('?')[1] || '').get('id') || DEFAULT_ID

    const addBtn = root.querySelector('[data-action="add-to-cart"]')
    const buyBtn = root.querySelector('[data-action="buy-now"]')
    addBtn?.addEventListener('click', () => {
      if (addBtn.disabled) return
      addToCart(currentId(), 1)
      toast('Ditambahkan ke keranjang')
    })
    buyBtn?.addEventListener('click', () => {
      if (buyBtn.disabled) return
      toast('Demo: lanjut ke pembayaran')
    })

    root.querySelectorAll('[data-media]').forEach((thumb) =>
      thumb.addEventListener('click', () => {
        const host = root.querySelector('[data-main-media]')
        const { mediaType, mediaSrc } = thumb.dataset
        if (mediaType === 'video') {
          const embed = youtubeEmbed(mediaSrc)
          if (host) {
            host.innerHTML = embed
              ? `<iframe class="w-full h-full" src="${embed}" title="Video produk" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
              : `<video class="w-full h-full object-contain bg-surface" controls autoplay playsinline src="${mediaSrc}"></video>`
          }
        } else {
          if (host) host.innerHTML = `<img class="w-full h-full object-cover" src="${mediaSrc}" alt="Pratinjau" />`
        }
        root.querySelectorAll('[data-media]').forEach((t) => {
          t.classList.remove('ring-2', 'ring-accent', 'border-transparent')
          t.classList.add('border', 'border-border')
        })
        thumb.classList.remove('border', 'border-border')
        thumb.classList.add('ring-2', 'ring-accent', 'border-transparent')
      }),
    )

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
