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
    const supportsViewTransition = 'startViewTransition' in document
    
    console.log('navigateWithTransition called')
    console.log('  targetHash:', targetHash)
    console.log('  next:', next)
    console.log('  current route:', route)
    console.log('  supportsViewTransition:', supportsViewTransition)
    
    if (next === route) {
      console.log('  -> skipping (same route)')
      location.hash = targetHash
      return
    }
    
    if (!supportsViewTransition) {
      console.log('  -> skipping (API not supported)')
      location.hash = targetHash
      return
    }

    const back = (routes[next] ? 0 : 0) < (routes[route] ? 0 : 0)
    console.log('  -> starting view transition (back:', back + ')')

    document.documentElement.style.setProperty('--vt-x', back ? '-36px' : '36px')
    document.documentElement.style.setProperty('--vt-dur', back ? '0.35s' : '0.3s')

    isNavigating = true
    
    // Check for view-transition-name elements
    const elements = document.querySelectorAll('[style*="view-transition-name"]')
    console.log('  view-transition-name elements:', elements.length)
    
    const transition = document.startViewTransition(() => {
      console.log('  -> startViewTransition callback')
      location.hash = targetHash
    })
    
    transition.ready.then(() => {
      console.log('  -> transition ready')
    })
    
    transition.finished.then(() => {
      console.log('  -> transition finished')
      isNavigating = false
    })
  }

  onMount(() => {
    syncRoute()

    // Check if view transition API is supported
    const supportsViewTransition = 'startViewTransition' in document
    console.log('onMount - View transition supported:', supportsViewTransition)

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
