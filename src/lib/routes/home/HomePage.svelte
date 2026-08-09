<script>
  import { onMount } from 'svelte'
  import { BRAND, categories, heroSlides } from '../../data/site.js'
  import { products } from '../../data/products.js'
  import Icon from '../../components/atoms/Icon.svelte'
  import ProductCard from '../../components/organisms/ProductCard.svelte'

  const newArrivals = products.slice(0, 3)
  const recommended = products.slice(0, 4)

  let track
  let heroTimer
  let heroControls

  function syncDots() {
    if (!track) return
    const idx = Math.round(track.scrollLeft / track.clientWidth)
    document.querySelectorAll('[data-slide]').forEach((d, i) => {
      d.classList.toggle('bg-accent', i === idx)
      d.classList.toggle('bg-border', i !== idx)
    })
  }

  function advance() {
    if (!track || document.hidden) return
    const idx = Math.round(track.scrollLeft / track.clientWidth)
    const next = (idx + 1) % track.children.length
    track.scrollTo({ left: track.clientWidth * next, behavior: 'smooth' })
  }

  function goToSlide(index) {
    if (!track) return
    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' })
  }

  onMount(() => {
    if (track && track.children.length > 1) {
      // Start auto-play
      heroTimer = setInterval(advance, 4000)
      
      // Sync dots on scroll
      track.addEventListener('scroll', syncDots)
      
      // Auto-pause on interaction
      const start = () => {
        if (document.hidden) return
        if (heroTimer) return
        heroTimer = setInterval(advance, 4000)
      }
      const stop = () => {
        if (heroTimer) {
          clearInterval(heroTimer)
          heroTimer = null
        }
      }
      track.addEventListener('pointerdown', stop)
      track.addEventListener('pointerenter', stop)
      track.addEventListener('pointerleave', start)
      
      // Document visibility handler
      if (!heroControls) {
        heroControls = () => (document.hidden ? stop() : start())
        document.addEventListener('visibilitychange', heroControls)
      }
      
      // Setup click handlers for dots
      const dots = document.querySelectorAll('[data-slide]')
      dots.forEach((btn, i) => {
        btn.addEventListener('click', () => goToSlide(i))
      })
    }
    return () => {
      clearInterval(heroTimer)
      if (heroControls) document.removeEventListener('visibilitychange', heroControls)
    }
  })
</script>

<section style="view-transition-name:home" class="w-full">
  <div bind:this={track} class="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth">
    {#each heroSlides as s}
      <div class="w-full shrink-0 snap-start h-[260px] md:h-[400px] relative overflow-hidden" style="view-transition-name:hero-{s.id}">
        <div class="absolute inset-0 anim-kenburns" style={`background:${s.bg}`}></div>
        <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent pointer-events-none"></div>
        <div class="relative z-10 h-full flex flex-col items-start justify-end gap-2 px-4 md:px-8 py-6 md:py-10 text-on-primary">
          <span class="text-xs font-semibold uppercase tracking-widest text-accent-soft">{s.eyebrow}</span>
          <h2 class="text-2xl md:text-4xl font-bold max-w-xl">{s.title}</h2>
          <p class="text-sm md:text-base opacity-90 max-w-md mb-3">{s.desc}</p>
          <a href={s.href} class="bg-accent-container text-on-primary text-base font-semibold py-2.5 px-6 rounded-lg w-fit hover:opacity-90 active:scale-95 transition shadow-sm">{s.cta}</a>
        </div>
      </div>
    {/each}
  </div>
  <div class="flex justify-center gap-2 py-4">
    {#each heroSlides as _, i}
      <button data-slide={i} aria-label={`Slide ${i + 1}`} class={`w-2 h-2 rounded-full transition-colors ${i === 0 ? 'bg-accent' : 'bg-border'}`}></button>
    {/each}
  </div>
</section>

<main class="max-w-7xl mx-auto w-full flex flex-col">
  <section class="flex flex-col gap-3 px-4">
    <div class="px-0 flex justify-between items-center">
      <h3 class="text-lg md:text-xl font-semibold text-text-primary">Kategori</h3>
    </div>
    <div class="flex overflow-x-auto no-scrollbar gap-4 pl-2  pb-2 snap-x">
      {#each categories as c}
        <a href="#/shop" class="snap-start flex flex-col items-center gap-1 min-w-[80px] group cursor-pointer">
          <div class="w-16 h-16 rounded-full bg-surface-mid flex items-center justify-center group-hover:bg-surface-high transition-colors shadow-sm border border-outline-variant/30">
            <Icon name={c.icon} className="text-accent-container text-2xl" filled={false} />
          </div>
          <span class="text-sm font-semibold text-text-muted">{c.label}</span>
        </a>
      {/each}
      <div class="w-4 shrink-0"></div>
    </div>
  </section>

  <section class="flex flex-col gap-4 bg-surface py-6 border-y border-border">
    <div class="px-4 flex justify-between items-center">
      <h3 class="text-lg md:text-xl font-semibold text-text-primary">Terbaru</h3>
      <a href="#/shop" class="text-sm font-semibold text-accent-deep hover:underline">Lihat Semua</a>
    </div>
    <div class="pb-4 px-4">
      <div class="flex overflow-x-auto no-scrollbar gap-2 snap-x">
        {#each newArrivals as p}
          <ProductCard {p} horizontal={true} />
        {/each}
      </div>
    </div>
  </section>

  <section class="flex flex-col gap-4 bg-surface py-6 border-y border-border px-4">
    <div class="px-0 flex justify-between items-center">
      <h3 class="text-lg md:text-xl font-semibold text-text-primary">Rekomendasi untuk Anda</h3>
    </div>
    <div class="pb-4">
      <div class="flex overflow-x-auto no-scrollbar gap-2 snap-x">
        {#each recommended as p}
          <ProductCard {p} horizontal={true} />
        {/each}
      </div>
    </div>
  </section>
</main>
