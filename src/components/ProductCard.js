import { icon, formatRp, placeholder } from '../lib.js'

export function ProductCard(p, opts = {}) {
  const { horizontal = false } = opts
  const cardCls = horizontal ? 'w-[160px] md:w-[220px] shrink-0' : ''
  const badgeCls = p.badge === 'Sale' ? 'bg-error' : 'bg-accent-container'

  return `
    <a href="#/product?id=${p.id}" class="snap-start ${cardCls} bg-surface rounded-lg border border-border/60 flex flex-col overflow-hidden hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-shadow duration-300">
      <div class="aspect-square bg-surface-low w-full relative">
        <img class="w-full h-full object-cover" src="${placeholder()}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="absolute top-2 left-2 ${badgeCls} text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase">${p.badge}</span>` : ''}
        ${p.stock === 0
          ? `<span class="absolute top-2 right-2 bg-text-primary/80 text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase">Stok Habis</span>`
          : `<button aria-label="Favorit" class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-surface/80 text-text-muted hover:text-accent transition-colors">${icon('favorite', 'text-[18px] leading-none')}</button>`}
      </div>
      <div class="p-2 flex flex-col gap-1 flex-grow justify-between">
        <div>
          <p class="text-sm text-text-primary line-clamp-2">${p.name}</p>
          <div class="flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[14px] text-accent-container" style="font-variation-settings:'FILL' 1">star</span>
            <span class="text-xs font-semibold text-text-muted">${p.rating}</span>
          </div>
        </div>
        <div class="mt-2 flex flex-col">
          ${p.oldPrice ? `<p class="text-xs text-text-muted line-through">${formatRp(p.oldPrice)}</p>` : ''}
          <p class="text-base font-bold text-text-primary">${formatRp(p.price)}</p>
        </div>
      </div>
    </a>`
}