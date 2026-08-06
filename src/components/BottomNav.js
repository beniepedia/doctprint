import { icon } from '../lib.js'
import { cartCount } from '../state.js'

export function BottomNav(active) {
  const items = [
    { id: 'home', label: 'Beranda', icon: 'home', href: '#/home' },
    { id: 'shop', label: 'Belanja', icon: 'storefront', href: '#/home' },
    { id: 'cart', label: 'Keranjang', icon: 'shopping_cart', href: '#/cart', badge: cartCount() },
    { id: 'profile', label: 'Profil', icon: 'person', href: '#/profile' },
  ]

  return `
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around items-center h-20 px-2 pb-safe" aria-label="Navigasi utama">
      ${items
        .map((it) => {
          const isActive = it.id === active
          const pill = isActive ? 'text-accent bg-accent-soft' : 'text-text-muted'
          const fill = isActive ? "style=\"font-variation-settings:'FILL' 1\"" : ''
          const badge = it.badge
            ? `<span class="absolute -top-1 -right-2 bg-accent-container text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">${it.badge}</span>`
            : ''
          return `
            <a href="${it.href}" aria-label="${it.label}" class="flex flex-col items-center justify-center hover:opacity-80 transition-opacity group">
              <div class="px-4 py-1 rounded-full flex items-center justify-center relative ${pill} transition-colors">
                <span class="material-symbols-outlined mb-1" ${fill}>${it.icon}</span>
                ${badge}
              </div>
              <span class="text-xs ${isActive ? 'font-bold text-accent' : 'text-text-muted'}">${it.label}</span>
            </a>`
        })
        .join('')}
    </nav>`
}