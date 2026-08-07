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

  // Saved scroll positions per route
  const savedScroll = {}
  const routeRank = { home: 0, shop: 1, product: 2, cart: 3, checkout: 4, profile: 5 }
  let lastRoute = null

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
    
    console.log('navigateWithTransition called')
    console.log('  targetHash:', targetHash)
    console.log('  next:', next)
    console.log('  current route:', route)
    
    if (next === route) {
      console.log('  -> skipping (same route)')
      location.hash = targetHash
      return
    }
    
    const back = (routeRank[next] ?? 0) < (routeRank[route] ?? 0)
    
    // Save current scroll position BEFORE any changes
    savedScroll[route] = window.scrollY
    console.log('  -> saved scroll for route', route, ':', window.scrollY)
    
    // Set CSS variables for animation
    document.documentElement.style.setProperty('--vt-x', back ? '-100%' : '100%')
    document.documentElement.style.setProperty('--vt-dur', back ? '0.35s' : '0.3s')
    document.documentElement.classList.add('transitioning')
    
    // Reset scroll IMMEDIATELY (before animation)
    // Use requestAnimationFrame to ensure it happens before paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (back) {
          const saved = savedScroll[next] ?? 0
          console.log('  -> restoring scroll for', next, ':', saved)
          window.scrollTo(0, saved)
        } else {
          console.log('  -> reset scroll to 0 (forward)')
          window.scrollTo(0, 0)
        }
      })
    })
    
    // Wait for animation to complete, then remove class
    setTimeout(() => {
      document.documentElement.classList.remove('transitioning')
    }, 400)
    
    // Perform navigation
    location.hash = targetHash
  }

  onMount(() => {
    syncRoute()

    // Check if view transition API is supported
    const supportsViewTransition = 'startViewTransition' in document
    console.log('onMount - View transition supported:', supportsViewTransition)

    // Handle navigation with view transition
    function handleLinkClick(e) {
      const link = e.target.closest('a')
      console.log('handleLinkClick:', e.target.tagName, link?.href)
      if (!link) return
      const href = link.getAttribute('href')
      console.log('  href:', href, 'starts with #/:', href?.startsWith('#/'))
      if (href?.startsWith('#/') && !link.getAttribute('target')) {
        e.preventDefault()
        navigateWithTransition(href)
      }
    }

    // Also listen for pointerdown for more reliable detection
    function handlePointerDown(e) {
      const link = e.target.closest('a')
      console.log('handlePointerDown:', e.target.tagName, link?.href)
    }

    document.addEventListener('click', handleLinkClick)
    document.addEventListener('pointerdown', handlePointerDown)
    
    console.log('Event listeners registered: click, pointerdown, hashchange')

    const onHashChange = () => {
      console.log('onHashChange: location.hash =', location.hash)
      syncRoute()
    }
    window.addEventListener('hashchange', onHashChange)
    return () => {
      document.removeEventListener('click', handleLinkClick)
      window.removeEventListener('hashchange', onHashChange)
    }
  })

  // Test function to trigger animation directly (for debugging)
  function testTransition() {
    navigateWithTransition('#/shop')
  }

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
