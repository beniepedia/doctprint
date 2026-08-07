<script>
  import Icon from '../atoms/Icon.svelte'
  import CartBadge from './CartBadge.svelte'
  export let active = 'home'
  export let count = 0

  const items = [
    { id: 'home', label: 'Beranda', icon: 'home', href: '#/home' },
    { id: 'shop', label: 'Belanja', icon: 'storefront', href: '#/shop' },
    { id: 'cart', label: 'Keranjang', icon: 'shopping_cart', href: '#/cart' },
    { id: 'profile', label: 'Profil', icon: 'person', href: '#/profile' },
  ]
</script>

<nav style="view-transition-name:bottom-nav" class="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-surface border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around items-center h-18 px-2 pb-safe pointer-events-auto touch-manipulation" aria-label="Navigasi utama">
  {#each items as it}
    {@const isActive = it.id === active}
    <a href={it.href} aria-label={it.label} class="flex flex-col items-center justify-center hover:opacity-80 transition-opacity group pointer-events-auto min-w-0 flex-1 py-2">
      <div class={`px-4 py-1 rounded-full flex items-center justify-center relative ${isActive ? 'text-accent bg-accent-soft' : 'text-text-muted'} transition-colors leading-none`}>
        <Icon name={it.icon} className="mb-1" filled={isActive} />
        {#if it.id === 'cart'}
          <CartBadge {count} />
        {/if}
      </div>
      <span class={`text-xs ${isActive ? 'font-bold text-accent' : 'text-text-muted'}`}>{it.label}</span>
    </a>
  {/each}
</nav>
