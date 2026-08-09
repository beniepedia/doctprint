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

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const nextFrame = () => new Promise((r) => requestAnimationFrame(r))
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Menunggu animasi slide benar-benar selesai (via animationend) supaya
  // pergantian halaman sinkron dengan animasi, bukan berdasarkan timer.
  // Timeout hanya sebagai pengaman (mis. animasi tidak berjalan).
  function waitForSlide(el, name, fallbackMs) {
    return Promise.race([
      new Promise((resolve) => {
        const done = (e) => {
          if (e.animationName !== name) return
          el.removeEventListener('animationend', done)
          resolve()
        }
        el.addEventListener('animationend', done)
      }),
      sleep(fallbackMs),
    ])
  }

  let navInProgress = false

  async function navigateWithTransition(targetHash) {
    const next = targetHash.replace(/^#\/?/, '')?.split('?')[0] || 'home'

    if (next === route) {
      location.hash = targetHash
      return
    }

    // Skip animation if a navigation is already running (rapid taps)
    if (navInProgress) {
      location.hash = targetHash
      return
    }

    // Animasi slide maju (kanan ke kiri) untuk halaman tanpa tombol back
    // (home/shop/cart/profile). Arah mundur hanya untuk keluar dari halaman
    // yang punya tombol back (halaman detail produk).
    const isBackPage = route === 'product'

    // Restore posisi scroll tetap mengikuti urutan halaman (rank)
    const back = (routeRank[next] ?? 0) < (routeRank[route] ?? 0)

    // Save current scroll position BEFORE any changes
    savedScroll[route] = window.scrollY

    const anim = !reduceMotion()
    const exitCls = isBackPage ? 'vt-exit-back' : 'vt-exit-forward'
    const enterCls = isBackPage ? 'vt-enter-back' : 'vt-enter-forward'
    const exitName = isBackPage ? 'vt-slide-out-right' : 'vt-slide-out-left'
    const enterName = isBackPage ? 'vt-slide-in-from-left' : 'vt-slide-in-from-right'
    const container = document.getElementById('page-container')

    navInProgress = true
    try {
      // 1. Slide halaman lama keluar (arah sesuai maju/mundur)
      if (anim) {
        document.body.classList.add(exitCls)
        await waitForSlide(container, exitName, 250)
      }

      // 2. Tukar halaman di dalam container
      location.hash = targetHash
      syncRoute()
      await tick()
      // Restore scroll right after the new page is rendered
      if (back) window.scrollTo(0, savedScroll[next] ?? 0)
      else window.scrollTo(0, 0)

      // 3. Slide halaman baru masuk — beri 2 frame agar halaman baru sempat
      //    ter-paint (masih di luar layar) sebelum animasi jalan, sehingga
      //    tidak ada frame-drop saat mulai bergerak.
      if (anim) {
        await nextFrame()
        await nextFrame()
        document.body.classList.remove('vt-exit-back', 'vt-exit-forward')
        document.body.classList.add(enterCls)
        await waitForSlide(container, enterName, 320)
      }
    } finally {
      document.body.classList.remove('vt-exit-back', 'vt-exit-forward', 'vt-enter-back', 'vt-enter-forward')
      navInProgress = false
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
