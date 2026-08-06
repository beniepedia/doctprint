import { profileMenu } from '../data.js'
import { icon, placeholder, toast } from '../lib.js'
import { TopApp } from '../components/TopApp.js'
import { BottomNav } from '../components/BottomNav.js'

const stats = [
  { icon: 'local_shipping', value: '2', label: 'Pesanan Aktif' },
  { icon: 'favorite', value: '14', label: 'Wishlist' },
  { icon: 'confirmation_number', value: '5', label: 'Kupon' },
]

export default {
  render() {
    return `
      ${TopApp({ title: 'DoctPrint', left: '', right: '' })}

      <main class="w-full max-w-3xl mx-auto px-4 md:px-8 flex flex-col gap-6 pt-20 pb-8">
        <!-- Kepala Profil -->
        <section class="flex flex-col items-center text-center mt-4">
          <div class="w-24 h-24 rounded-full bg-surface-top border-2 border-border mb-4 overflow-hidden relative shadow-sm flex items-center justify-center">
            <img class="w-full h-full object-cover" src="${placeholder()}" alt="Foto profil" />
          </div>
          <h1 class="text-xl md:text-2xl font-bold text-primary">Budi Santoso</h1>
          <p class="text-base text-text-muted">budi.santoso@email.com</p>
          <button data-action="edit" class="mt-4 border border-border rounded bg-surface px-4 py-2 text-base font-semibold text-text-primary hover:bg-surface-low transition-colors shadow-sm">Edit Profil</button>
        </section>

        <!-- Ringkasan Akun -->
        <section class="grid grid-cols-3 gap-2 md:gap-4 mt-4">
          ${stats
            .map(
              (s) => `
              <div class="bg-surface border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <span class="material-symbols-outlined text-accent-container text-2xl mb-2" style="font-variation-settings:'FILL' 1">${s.icon}</span>
                <span class="text-lg md:text-xl font-semibold text-primary">${s.value}</span>
                <span class="text-sm text-text-muted text-center mt-1">${s.label}</span>
              </div>`,
            )
            .join('')}
        </section>

        <!-- Daftar Menu -->
        <section class="bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col mt-4">
          ${profileMenu
            .map(
              (m, i) => `
              <a href="#" class="flex items-center justify-between p-4 ${i < profileMenu.length - 1 ? 'border-b border-border' : ''} hover:bg-surface-low transition-colors group">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-surface-mid flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">${icon(m.icon)}</div>
                  <span class="text-base text-text-primary">${m.label}</span>
                </div>
                ${icon('chevron_right', 'text-outline')}
              </a>`,
            )
            .join('')}
        </section>

        <!-- Keluar -->
        <section class="mt-6 mb-8">
          <button data-action="logout" class="w-full bg-surface border border-error text-error rounded-lg py-3.5 text-base font-semibold hover:bg-error-container hover:border-error transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95 duration-150">
            ${icon('logout', 'text-[20px]')} Keluar
          </button>
        </section>
      </main>

      ${BottomNav('profile')}
    `
  },

  mount(root) {
    root.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
      toast('Demo: keluar dari akun')
    })
    root.querySelector('[data-action="edit"]')?.addEventListener('click', () => {
      toast('Demo: edit profil')
    })
  },
}