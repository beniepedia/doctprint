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

  const rectOf = (r) => ({ left: r.left, top: r.top, width: r.width, height: r.height })
  const productImageUrl = (id, size) => `https://picsum.photos/seed/${encodeURIComponent(id)}/${size}/${size}`
  const productIdFromHash = (hash) => new URLSearchParams((hash.split('?')[1] || '')).get('id') || ''

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

  // Tangkap gambar kartu produk yang diklik untuk shared-image morph
  function captureCardShared(link, href) {
    const img = link.querySelector('img')
    if (!img) return null
    const r = img.getBoundingClientRect()
    if (!r.width || !r.height) return null
    return {
      id: productIdFromHash(href),
      src: img.currentSrc || img.src,
      rect: rectOf(r),
    }
  }

  // Tangkap rect + sumber gambar hero produk SEBELUM halaman di-swap
  // (dipakai untuk morph arah mundur / back dari halaman produk).
  function captureHeroForBack() {
    const hero = document.getElementById('product-hero')
    if (!hero) return null
    const id = productIdFromHash(location.hash)
    const img = hero.querySelector('img')
    return {
      kind: 'back',
      id,
      fromRect: rectOf(hero.getBoundingClientRect()),
      src: img ? img.currentSrc || img.src : productImageUrl(id, 900),
    }
  }

  // Tentukan rect tujuan morph SETELAH halaman baru ter-render
  function resolveMorphTarget(spec) {
    if (spec.kind === 'forward') {
      const hero = document.getElementById('product-hero')
      if (!hero) return null
      return rectOf(hero.getBoundingClientRect())
    }
    const card = document.querySelector(`a[href="#/product?id=${spec.id}"] img`)
    if (!card) return null
    return rectOf(card.getBoundingClientRect())
  }

  // Buat clone gambar di posisi asal SEBELUM halaman di-swap, supaya gerakan
  // "lepas" dari kartu/hero terlihat jelas.
  function createSharedClone(spec) {
    const img = document.createElement('img')
    img.className = 'vt-shared-img'
    img.alt = ''
    img.setAttribute('aria-hidden', 'true')
    img.style.left = spec.fromRect.left + 'px'
    img.style.top = spec.fromRect.top + 'px'
    img.style.width = spec.fromRect.width + 'px'
    img.style.height = spec.fromRect.height + 'px'
    img.style.transform = 'translate(0px, 0px) scale(1)'
    img.src = spec.src
    document.body.appendChild(img)
    return img
  }

  // FLIP: animasikan clone dari posisi asal ke posisi tujuan, lalu fade-out.
  function morphSharedClone(img, toRect) {
    return new Promise((resolve) => {
      const fromRect = {
        left: parseFloat(img.style.left),
        top: parseFloat(img.style.top),
        width: parseFloat(img.style.width),
        height: parseFloat(img.style.height),
      }
      const sx = toRect.width / fromRect.width
      const sy = toRect.height / fromRect.height
      const tx = toRect.left - fromRect.left
      const ty = toRect.top - fromRect.top

      const start = () => {
        requestAnimationFrame(() => {
          img.style.borderRadius = '12px'
          img.style.transform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`
        })
        setTimeout(() => {
          img.style.opacity = '0'
          setTimeout(() => {
            img.remove()
            resolve()
          }, 200)
        }, 480)
      }

      if (img.decode) {
        img.decode().then(start, start)
      } else {
        img.addEventListener('load', start, { once: true })
        img.addEventListener('error', start, { once: true })
      }
      // Pengaman: gambar lambat dimuat, tetap jalankan morph
      setTimeout(start, 800)
    })
  }

  let navInProgress = false

  async function navigateWithTransition(targetHash, shared = null) {
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

    const toProduct = next === 'product'
    const fromProduct = route === 'product'

    // Restore posisi scroll tetap mengikuti urutan halaman (rank)
    const back = (routeRank[next] ?? 0) < (routeRank[route] ?? 0)

    // Save current scroll position BEFORE any changes
    savedScroll[route] = window.scrollY

    const anim = !reduceMotion()
    const container = document.getElementById('page-container')

    // Shared-image morph untuk masuk/keluar halaman produk (gambar kartu
    // membesar jadi hero, dan sebaliknya saat back)
    const sharedSpec = anim && toProduct && shared
      ? { kind: 'forward', id: shared.id, src: shared.src, fromRect: shared.rect }
      : anim && fromProduct
        ? captureHeroForBack()
        : null

    navInProgress = true
    try {
      if (sharedSpec) {
        // --- Mode morph + crossfade (halaman produk) ---
        // 1. Clone gambar di posisi asal — terlihat "lepas" dari kartu/hero
        const clone = createSharedClone(sharedSpec)

        // 2. Tukar halaman langsung
        location.hash = targetHash
        syncRoute()
        await tick()
        if (back) window.scrollTo(0, savedScroll[next] ?? 0)
        else window.scrollTo(0, 0)

        // 3. Fade-in konten baru. Kelas diberi sebelum paint supaya tidak
        //    ada kilatan halaman lama yang langsung tergantikan.
        document.body.classList.add('vt-crossfade')
        await nextFrame()
        await nextFrame()

        // 4. Morph paralel dengan crossfade
        const toRect = resolveMorphTarget(sharedSpec)
        const crossfadeDone = waitForSlide(container, 'vt-crossfade', 240)
        if (toRect) await Promise.all([crossfadeDone, morphSharedClone(clone, toRect)])
        else {
          clone.remove()
          await crossfadeDone
        }
      } else {
        // --- Mode slide (halaman lain / fallback) ---
        const exitCls = fromProduct ? 'vt-exit-back' : 'vt-exit-forward'
        const enterCls = fromProduct ? 'vt-enter-back' : 'vt-enter-forward'
        const exitName = fromProduct ? 'vt-slide-out-right' : 'vt-slide-out-left'
        const enterName = fromProduct ? 'vt-slide-in-from-left' : 'vt-slide-in-from-right'

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
      }
    } finally {
      document.body.classList.remove('vt-exit-back', 'vt-exit-forward', 'vt-enter-back', 'vt-enter-forward', 'vt-crossfade')
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
        const shared = href.startsWith('#/product') ? captureCardShared(link, href) : null
        navigateWithTransition(href, shared)
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
