<script>
  import { onMount } from 'svelte'
  import { cart } from './lib/stores/cart.js'
  import DefaultLayout from './lib/layouts/DefaultLayout.svelte'
  import HomePage from './lib/routes/home/HomePage.svelte'
  import ShopPage from './lib/routes/shop/ShopPage.svelte'
  import ProductPage from './lib/routes/product/ProductPage.svelte'
  import CartPage from './lib/routes/cart/CartPage.svelte'
  import CheckoutPage from './lib/routes/checkout/CheckoutPage.svelte'
  import ProfilePage from './lib/routes/profile/ProfilePage.svelte'

  const routes = {
    home: 'DoctPrint',
    shop: 'Belanja Produk',
    product: 'Detail Produk',
    cart: 'Keranjang',
    checkout: 'Checkout',
    profile: 'Profil',
  }

  let route = 'home'

  function parseRoute() {
    const hash = location.hash.replace(/^#\/?/, '')
    const [path] = hash.split('?')
    route = path || 'home'
  }

  function syncRoute() {
    parseRoute()
  }

  onMount(() => {
    syncRoute()
    const onHashChange = () => syncRoute()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  })

  $: title = routes[route] || 'DoctPrint'
  $: cartSize = $cart.length

  $: if (typeof window !== 'undefined') {
    const next = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home'
    if (next !== route) route = next
  }
</script>

<DefaultLayout {route} {title} {cartSize}>
  {#if route === 'home'}
    <HomePage />
  {:else if route === 'shop'}
    <ShopPage />
  {:else if route === 'product'}
    <ProductPage />
  {:else if route === 'cart'}
    <CartPage />
  {:else if route === 'checkout'}
    <CheckoutPage />
  {:else if route === 'profile'}
    <ProfilePage />
  {:else}
    <div class="max-w-7xl mx-auto w-full px-4 py-6">
      <div class="rounded-2xl border border-border bg-surface p-6 text-text-muted">
        Route aktif: <span class="font-semibold text-text-primary">{route}</span>
      </div>
    </div>
  {/if}
</DefaultLayout>
