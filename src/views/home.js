import { BRAND, categories, products } from '../data.js'
import { icon, heroImg } from '../lib.js'
import { TopApp } from '../components/TopApp.js'
import { BottomNav } from '../components/BottomNav.js'
import { ProductCard } from '../components/ProductCard.js'

const newArrivals = products.slice(0, 3)
const recommended = products.slice(3)

export default {
  render() {
    return `
      ${TopApp({ title: BRAND, left: 'menu', right: 'search' })}

      <main class="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-6 pt-16">
        <!-- Hero Banner -->
        <section class="px-4 pt-4">
          <div class="relative w-full h-[360px] rounded-xl overflow-hidden shadow-sm flex items-end p-6 bg-cover bg-center" style="background-image:url('${heroImg}')">
            <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent pointer-events-none"></div>
            <div class="relative z-10 text-on-primary flex flex-col gap-2">
              <span class="text-xs font-semibold uppercase tracking-widest text-accent-soft">Promo Spesial</span>
              <h2 class="text-4xl font-bold">Diskon Cetak 20%</h2>
              <p class="text-base opacity-90 max-w-sm mb-2">Cetak dokumen, foto, dan merchandise berkualitas dengan harga bersahabat.</p>
              <a href="#/cart" class="bg-accent-container text-on-primary text-base font-semibold py-2 px-6 rounded-lg w-fit hover:opacity-90 active:scale-95 transition shadow-sm">Pesan Sekarang</a>
            </div>
          </div>
        </section>

        <!-- Kategori -->
        <section class="flex flex-col gap-2">
          <div class="px-4 flex justify-between items-center">
            <h3 class="text-xl font-semibold text-text-primary">Kategori</h3>
          </div>
          <div class="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-2 snap-x">
            ${categories
              .map(
                (c) => `
                <div class="snap-start flex flex-col items-center gap-1 min-w-[80px] group cursor-pointer">
                  <div class="w-16 h-16 rounded-full bg-surface-mid flex items-center justify-center group-hover:bg-surface-high transition-colors shadow-sm border border-outline-variant/30">
                    ${icon(c.icon, 'text-accent-container text-2xl')}
                  </div>
                  <span class="text-sm font-semibold text-text-muted">${c.label}</span>
                </div>`,
              )
              .join('')}
          </div>
        </section>

        <!-- Terbaru -->
        <section class="flex flex-col gap-4 bg-surface py-6 border-y border-border">
          <div class="px-4 flex justify-between items-center">
            <h3 class="text-xl font-semibold text-text-primary">Terbaru</h3>
            <button class="text-sm font-semibold text-accent-deep hover:underline">Lihat Semua</button>
          </div>
          <div class="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4 snap-x">
            ${newArrivals.map((p) => ProductCard(p, { horizontal: true })).join('')}
          </div>
        </section>

        <!-- Rekomendasi -->
        <section class="flex flex-col gap-4 px-4">
          <h3 class="text-xl font-semibold text-text-primary">Rekomendasi untuk Anda</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            ${recommended.map((p) => ProductCard(p)).join('')}
          </div>
        </section>
      </main>

      ${BottomNav('home')}
    `
  },
}