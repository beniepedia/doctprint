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
  let isNavigating = false

  function parseRoute() {
    const hash = location.hash.replace(/^#\/?/, '')
    const [path] = hash.split('?')
    route = path || 'home'
  }

  function syncRoute() {
    parseRoute()
  }

  function navigateWithTransition(targetHash) {
    const next = targetHash.replace(/^#\/?/, '')?.split('?')[0] || 'home'
    if (next === route || !document.startViewTransition) {
      location.hash = targetHash
      return
    }

    const back = (routes[next] ? 0 : 0) < (routes[route] ? 0 : 0)

    document.documentElement.style.setProperty('--vt-x', back ? '-36px' : '36px')
    document.documentElement.style.setProperty('--vt-dur', back ? '0.35s' : '0.3s')

    isNavigating = true
    document.startViewTransition(() => {
      location.hash = targetHash
    }).finally(() => {
      isNavigating = false
    })
  }

  onMount(() => {
    syncRoute()

    // Handle navigation with view transition
    function handleLinkClick(e) {
      const link = e.target.closest('a')
      if (!link) return
      const href = link.getAttribute('href')
      if (href?.startsWith('#/') && !link.getAttribute('target')) {
        e.preventDefault()
        navigateWithTransition(href)
      }
    }

    document.addEventListener('click', handleLinkClick)

    const onHashChange = () => syncRoute()
    window.addEventListener('hashchange', onHashChange)
    return () => {
      document.removeEventListener('click', handleLinkClick)
      window.removeEventListener('hashchange', onHashChange)
    }
  })

  $: title = routes[route] || 'DoctPrint'
  $: cartSize = $cart.length
</script>

<DefaultLayout {route} {title} {cartSize} onBack={route === 'product'} showBottomNav={route !== 'product'}>
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
