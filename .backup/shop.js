import { categories, products } from '../data.js'
import { icon, formatRp } from '../lib.js'
import { Layout } from '../components/Layout.js'
import { ProductCard } from '../components/ProductCard.js'

const featured = products.slice(0, 2)
const state = {
  q: '',
  category: 'all',
}
let shopRouteWatcher = false

function resetShopState() {
  state.q = ''
  state.category = 'all'
}

function normalize(v) {
  return String(v || '').toLowerCase().trim()
}

function filteredProducts() {
  const q = normalize(state.q)
  return products.filter((p) => {
    const matchCategory = state.category === 'all' || p.categoryId === state.category
    const matchQuery = !q || normalize(p.name).includes(q) || normalize(p.desc).includes(q)
    return matchCategory && matchQuery
  })
}

function renderChips() {
  const chips = [{ id: 'all', label: 'Semua' }, ...categories]
  return chips
    .map((c) => {
      const active = state.category === c.id
      return `
        <button data-chip="${c.id}" class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
          active
            ? 'bg-accent-soft text-accent border-transparent'
            : 'bg-surface text-text-muted border-border hover:border-primary/30 hover:text-text-primary'
        }">${c.label}</button>`
    })
    .join('')
}

function renderFeatured() {
  return featured
    .map(
      (p) => `
        <a href="#/product?id=${p.id}" class="snap-start min-w-[260px] md:min-w-[320px] bg-surface border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div class="relative h-40 bg-gradient-to-br from-primary via-primary/95 to-accent overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,.35),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.12),transparent_36%)]"></div>
            <div class="relative z-10 h-full p-4 flex flex-col justify-between text-white">
              <div class="flex items-center justify-between gap-3">
                <span class="text-xs font-semibold uppercase tracking-widest text-accent-soft">Unggulan</span>
                ${p.badge ? `<span class="bg-white/15 backdrop-blur px-2 py-1 rounded-full text-[10px] font-semibold uppercase">${p.badge}</span>` : ''}
              </div>
              <div>
                <h3 class="text-lg font-bold leading-tight line-clamp-2">${p.name}</h3>
                <p class="text-sm text-white/80 mt-1 line-clamp-2">${p.desc}</p>
              </div>
            </div>
          </div>
          <div class="p-4 flex items-end justify-between gap-3">
            <div>
              <p class="text-xs text-text-muted">Mulai dari</p>
              <p class="text-lg font-bold text-text-primary">${formatRp(p.price)}</p>
            </div>
            <span class="inline-flex items-center gap-1 text-sm font-semibold text-accent-deep">
              ${icon('arrow_forward', 'text-[18px]')}
              Detail
            </span>
          </div>
        </a>`,
    )
    .join('')
}

export default {
  render() {
    const list = filteredProducts()
    const hasFilters = normalize(state.q) || state.category !== 'all'

    if (!shopRouteWatcher) {
      shopRouteWatcher = true
      window.addEventListener('hashchange', () => {
        if (!location.hash.startsWith('#/shop')) resetShopState()
      })
    }

    return Layout({
      top: { title: 'Belanja Produk', left: 'menu', right: 'search' },
      active: 'shop',
      children: `
        <main class="max-w-7xl mx-auto w-full flex flex-col gap-6 px-4 py-6">
          <section class="flex flex-col gap-4">
            <label class="group block">
              <span class="sr-only">Cari produk</span>
              <div class="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(15,23,42,0.08)]">
                <span class="w-10 h-10 rounded-xl bg-surface-low text-text-muted flex items-center justify-center shrink-0 border border-border/70">
                  ${icon('search', 'text-[20px]')}
                </span>
                <input data-search value="${state.q}" type="search" placeholder="Cari produk" class="w-full appearance-none border-0 bg-transparent p-0 text-[15px] leading-6 font-medium text-text-primary placeholder:text-text-muted focus:ring-0 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none" />
                <button data-reset type="button" aria-label="Reset filter" class="${hasFilters ? '' : 'hidden '}w-9 h-9 rounded-full bg-surface-low text-text-muted border border-border hover:text-text-primary hover:bg-surface-mid flex items-center justify-center transition-colors shrink-0">${icon('restart_alt', 'text-[18px]')}</button>
              </div>
            </label>
          </section>

          <section>
            <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">${renderChips()}</div>
          </section>

          <section class="flex flex-col gap-3">
            <div class="flex items-center justify-between px-1">
              <div>
                <h2 class="text-lg font-semibold text-text-primary">Produk Unggulan</h2>
                <p class="text-sm text-text-muted">Rekomendasi pilihan untuk memulai belanja.</p>
              </div>
              <span class="text-xs font-semibold text-accent-deep">${featured.length} item</span>
            </div>
            <div class="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x">${renderFeatured()}</div>
          </section>

          <section class="flex flex-col gap-3 pb-4">
            <div class="flex items-center justify-between px-1">
              <div>
                <h2 class="text-lg font-semibold text-text-primary">Katalog Produk</h2>
                <p data-result-count class="text-sm text-text-muted">${list.length} produk ditemukan</p>
              </div>
            </div>
            <div data-result-list>
              ${list.length
                ? `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">${list.map((p) => ProductCard(p)).join('')}</div>`
                : `<div class="bg-surface border border-border rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                    <div class="w-14 h-14 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                      ${icon('search_off', 'text-3xl')}
                    </div>
                    <div>
                      <h3 class="text-base font-semibold text-text-primary">Produk tidak ditemukan</h3>
                      <p class="text-sm text-text-muted mt-1">Coba kata kunci lain atau reset filter untuk melihat seluruh katalog.</p>
                    </div>
                    <button data-reset class="inline-flex items-center gap-2 rounded-lg bg-accent text-white px-4 py-2 text-sm font-semibold hover:bg-accent-hover">
                      ${icon('restart_alt', 'text-[18px]')}
                      Reset Filter
                    </button>
                  </div>`}
            </div>
          </section>
        </main>
      `,
    })
  },

  mount(root) {
    const search = root.querySelector('[data-search]')
    const resetBtn = root.querySelector('[data-reset]')
    const resultCount = root.querySelector('[data-result-count]')
    const resultList = root.querySelector('[data-result-list]')
    const clearSearch = () => {
      state.q = ''
      if (search) search.value = ''
      update()
      search?.focus()
    }

    const update = () => {
      const list = filteredProducts()
      const hasFiltersNow = normalize(state.q) || state.category !== 'all'
      if (resultCount) resultCount.textContent = `${list.length} produk ditemukan`
      if (resetBtn) resetBtn.classList.toggle('hidden', !hasFiltersNow)
      if (resultList) {
        resultList.innerHTML = list.length
          ? `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">${list.map((p) => ProductCard(p)).join('')}</div>`
          : `<div class="bg-surface border border-border rounded-2xl p-8 text-center flex flex-col items-center gap-3">
              <div class="w-14 h-14 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                ${icon('search_off', 'text-3xl')}
              </div>
              <div>
                <h3 class="text-base font-semibold text-text-primary">Produk tidak ditemukan</h3>
                <p class="text-sm text-text-muted mt-1">Coba kata kunci lain atau reset filter untuk melihat seluruh katalog.</p>
              </div>
              <button data-reset class="inline-flex items-center gap-2 rounded-lg bg-accent text-white px-4 py-2 text-sm font-semibold hover:bg-accent-hover">
                ${icon('restart_alt', 'text-[18px]')}
                Reset Filter
              </button>
            </div>`
      }
      root.querySelectorAll('[data-reset]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.q = ''
          state.category = 'all'
          if (search) search.value = ''
          update()
        })
      })
      root.querySelectorAll('[data-clear-search]').forEach((btn) => {
        btn.addEventListener('click', clearSearch)
      })
    }

    root.querySelectorAll('[data-chip]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.category = btn.dataset.chip
        update()
      })
    })

    if (search) {
      search.addEventListener('input', (e) => {
        state.q = e.target.value
        update()
      })
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetShopState()
        if (search) search.value = ''
        update()
        search?.focus()
      })
    }

    update()
  },
}
