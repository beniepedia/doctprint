import { icon } from '../lib.js'

export function TopApp({ title, left = 'menu', right = 'search', onBack = false }) {
  const leftBtn = onBack
    ? `<a href="#/home" aria-label="Kembali" class="text-accent-deep hover:bg-surface-low active:scale-95 transition p-2 rounded-full">${icon('arrow_back')}</a>`
    : left
      ? `<button aria-label="Menu" class="hidden md:block text-accent-deep hover:bg-surface-low active:scale-95 transition p-2 rounded-full">${icon(left)}</button>`
      : '<div class="w-10 hidden md:block"></div>'

  const rightBtn = right
    ? `<button aria-label="Cari" class="text-accent-deep hover:bg-surface-low active:scale-95 transition p-2 rounded-full">${icon(right)}</button>`
    : '<div class="w-10"></div>'

  return `
    <header class="fixed top-0 inset-x-0 z-50 bg-surface border-b border-border shadow-sm flex items-center gap-3 px-4 h-16">
      ${leftBtn}
      <h1 class="font-bold text-base md:text-lg text-accent-deep flex-grow">${title}</h1>
      ${rightBtn}
    </header>`
}