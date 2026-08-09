<script>
  import { onMount, tick } from 'svelte'
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

  // Saved scroll positions per route
  const savedScroll = {}
  const routeRank = { home: 0, shop: 1, product: 2, cart: 3, checkout: 4, profile: 5 }

  let route = 'home'

  function parseRoute() {
    const hash = location.hash.replace(/^#\/?/, '')
    const [path] = hash.split('?')
    return path || 'home'
  }

  function syncRoute() {
    const path = parseRoute()
    if (path !== route) route = path
  }

  async function navigateWithTransition(targetHash) {
    const next = targetHash.replace(/^#\/?/, '')?.split('?')[0] || 'home'

    if (next === route) {
      location.hash = targetHash
      return
    }

    const back = (routeRank[next] ?? 0) < (routeRank[route] ?? 0)

    // Save current scroll position BEFORE any changes
    savedScroll[route] = window.scrollY

    // Set CSS variables for slide direction & duration
    document.documentElement.style.setProperty('--vt-x', back ? '-100%' : '100%')
    document.documentElement.style.setProperty('--vt-dur', back ? '0.35s' : '0.3s')

    const update = async () => {
      location.hash = targetHash
      syncRoute()
      await tick()
      // Restore scroll right after the new page is rendered (inside the
      // transition callback, so the new snapshot captures the right position)
      if (back) window.scrollTo(0, savedScroll[next] ?? 0)
      else window.scrollTo(0, 0)
    }

    if (document.startViewTransition) {
      document.startViewTransition(update)
    } else {
      update()
    }
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

    const onHashChange = () => {
      syncRoute()
    }
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
  <div id="page-container" class="min-h-screen">
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
  </div>
</DefaultLayout>
