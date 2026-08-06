import { BRAND, categories, products, heroSlides } from '../data.js'
import { icon } from '../lib.js'
import { Layout } from '../components/Layout.js'
import { ProductCard } from '../components/ProductCard.js'

const newArrivals = products.slice(0, 3)
const recommended = products.slice(3)

export default {
  render() {
    return Layout({
      top: { title: BRAND, left: 'menu', right: 'search' },
      active: 'home',
      children: `
      <!-- Hero Slider (Full Bleed) -->
      <section class="w-full">
        <div data-hero-track class="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth">
          ${heroSlides
            .map(
              (s) => `
              <div class="w-full shrink-0 snap-start h-[260px] md:h-[400px] relative overflow-hidden">
                <div class="absolute inset-0" style="background:${s.bg}"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent pointer-events-none"></div>
                <div class="relative z-10 h-full flex flex-col items-start justify-end gap-2 px-4 md:px-8 py-6 md:py-10 text-on-primary">
                  <span class="text-xs font-semibold uppercase tracking-widest text-accent-soft">${s.eyebrow}</span>
                  <h2 class="text-2xl md:text-4xl font-bold max-w-xl">${s.title}</h2>
                  <p class="text-sm md:text-base opacity-90 max-w-md mb-3">${s.desc}</p>
                  <a href="${s.href}" class="bg-accent-container text-on-primary text-base font-semibold py-2.5 px-6 rounded-lg w-fit hover:opacity-90 active:scale-95 transition shadow-sm">${s.cta}</a>
                </div>
              </div>`,
            )
            .join('')}
        </div>
        <div class="flex justify-center gap-2 py-4">
          ${heroSlides
            .map(
              (s, i) =>
                `<button data-slide="${i}" aria-label="Slide ${i + 1}" class="w-2 h-2 rounded-full transition-colors ${i === 0 ? 'bg-accent' : 'bg-border'}"></button>`,
            )
            .join('')}
        </div>
      </section>

      <main class="max-w-7xl mx-auto w-full flex flex-col gap-6">
        <!-- Kategori -->
        <section class="flex flex-col gap-3">
          <div class="px-4 flex justify-between items-center">
            <h3 class="text-lg md:text-xl font-semibold text-text-primary">Kategori</h3>
          </div>
          <div class="flex overflow-x-auto no-scrollbar gap-4 pl-6 pr-4 pb-2 snap-x">
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
            <div class="w-4 shrink-0"></div>
          </div>
        </section>

        <!-- Terbaru -->
        <section class="flex flex-col gap-4 bg-surface py-6 border-y border-border">
          <div class="px-4 flex justify-between items-center">
            <h3 class="text-lg md:text-xl font-semibold text-text-primary">Terbaru</h3>
            <button class="text-sm font-semibold text-accent-deep hover:underline">Lihat Semua</button>
          </div>
          <div class="px-4 pb-4">
            <div class="flex overflow-x-auto no-scrollbar gap-2 snap-x">
              ${newArrivals.map((p) => ProductCard(p, { horizontal: true })).join('')}
            </div>
          </div>
        </section>

        <!-- Rekomendasi -->
        <section class="flex flex-col gap-4 px-4">
          <h3 class="text-lg md:text-xl font-semibold text-text-primary">Rekomendasi untuk Anda</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            ${recommended.map((p) => ProductCard(p)).join('')}
          </div>
        </section>
      </main>
      `,
    })
  },

  mount(root) {
    const track = root.querySelector('[data-hero-track]')
    if (track) {
      track.addEventListener('scroll', () => {
        const idx = Math.round(track.scrollLeft / track.clientWidth)
        root.querySelectorAll('[data-slide]').forEach((d, i) => {
          d.classList.toggle('bg-accent', i === idx)
          d.classList.toggle('bg-border', i !== idx)
        })
      })
    }
    root.querySelectorAll('[data-slide]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.slide)
        track?.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' })
      })
    })
  },
}
