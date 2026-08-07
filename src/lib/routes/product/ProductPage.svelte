<script>
  import { onMount } from 'svelte'
  import { products } from '../../data/products.js'
  import { formatRp, youtubeEmbed } from '../../utils/icons.js'
  import Icon from '../../components/atoms/Icon.svelte'
  import { addToCart } from '../../stores/cart.js'
  import Button from '../../components/atoms/Button.svelte'

  const DEFAULT_ID = 'printer-ecotank-l3110'

  let product = products[0]
  let media = ''
  let colorIndex = 0
  let paperIndex = 0
  let mediaIndex = 0

  function setFromHash() {
    const params = new URLSearchParams(location.hash.split('?')[1] || '')
    const id = params.get('id') || DEFAULT_ID
    product = products.find((x) => x.id === id) || products[0]
    media = product.video || ''
    colorIndex = 0
    paperIndex = 0
    mediaIndex = 0
  }

  function selectMedia(item, idx) {
    mediaIndex = idx
    media = item.type === 'video' ? item.src : item.src
  }

  function currentMediaHtml() {
    if (product.video && media === product.video) {
      const embed = youtubeEmbed(product.video)
      return embed
        ? `<iframe class="w-full h-full" src="${embed}" title="Video produk" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        : `<video class="w-full h-full object-contain bg-surface" controls playsinline src="${product.video}"></video>`
    }
    return `<img class="w-full h-full object-cover" src="https://picsum.photos/seed/${encodeURIComponent(product.id)}/900/900" alt="${product.name}" />`
  }

  $: discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null
  $: stock = product.stock ?? 10
  $: soldOut = stock === 0
  $: stockInfo = soldOut
    ? { label: 'Stok Habis', cls: 'text-error', dot: 'bg-error' }
    : stock <= 5
      ? { label: `Stok Menipis · Sisa ${stock}`, cls: 'text-accent-deep', dot: 'bg-accent' }
      : { label: 'Stok Tersedia', cls: 'text-success', dot: 'bg-success' }

  $: mediaItems = [
    ...(product.video ? [{ type: 'video', src: product.video, alt: 'Video' }] : []),
    ...[0, 1, 2, 3].map((i) => ({ type: 'image', src: `https://picsum.photos/seed/${encodeURIComponent(product.id + '-' + i)}/200/200`, alt: `Pratinjau ${i + 1}` })),
  ]

  onMount(() => {
    setFromHash()
    const onHashChange = () => setFromHash()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  })
</script>

<section class="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-28">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="space-y-2">
      <div class="w-full aspect-square max-h-[600px] rounded-xl bg-surface shadow-sm border border-border overflow-hidden relative">
        <div class="w-full h-full" style={`view-transition-name:pt-${product.id}`}>{@html currentMediaHtml()}</div>
        {#if soldOut}
          <span class="absolute top-3 right-3 bg-text-primary/80 text-white px-2.5 py-1 rounded text-xs font-semibold uppercase">Stok Habis</span>
        {/if}
      </div>
      <div class="flex gap-2 overflow-x-auto no-scrollbar snap-x p-2">
        {#each mediaItems as m, i}
          <button on:click={() => selectMedia(m, i)} class={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer snap-start shrink-0 ${mediaIndex === i ? 'ring-2 ring-accent border-transparent' : 'border border-border'}`}>
            <img class="w-full h-full object-cover" src={m.type === 'video' ? `https://picsum.photos/seed/${encodeURIComponent(product.id + '-video')}/200/200` : m.src} alt={m.alt} />
            {#if m.type === 'video'}
              <span class="absolute inset-0 flex items-center justify-center bg-black/30"><Icon name="play_circle" className="text-white text-3xl" /></span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex flex-col space-y-4">
      <div>
        <div class="flex items-center gap-2 mb-2">
          {#if product.badge}
            <span class="bg-accent-container text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase">{product.badge}</span>
          {/if}
          <span class="flex items-center gap-1 text-sm font-semibold text-text-primary"><span class="material-symbols-outlined text-[16px] text-accent-container" style="font-variation-settings:'FILL' 1">star</span>{product.rating}</span>
          {#if product.sold}
            <span class="text-sm text-text-muted">· Terjual {product.sold.toLocaleString('id-ID')}+</span>
          {/if}
        </div>
        <h1 class="text-2xl md:text-4xl font-bold text-text-primary">{product.name}</h1>
        <div class="mt-2 flex items-end gap-2">
          {#if product.oldPrice}<p class="text-base text-text-muted line-through">{formatRp(product.oldPrice)}</p>{/if}
          <p class="text-2xl md:text-3xl font-bold text-accent-deep">{formatRp(product.price)}</p>
          {#if discount}<span class="bg-error text-white text-xs font-bold px-2 py-0.5 rounded mb-1">-{discount}%</span>{/if}
        </div>
        <div class={`mt-3 flex items-center gap-1.5 text-sm font-medium ${stockInfo.cls}`}>
          <span class={`w-2 h-2 rounded-full ${stockInfo.dot}`}></span>{stockInfo.label}
        </div>
      </div>

      <section class="bg-surface rounded-lg border border-border p-4 md:p-6 space-y-4">
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-text-muted uppercase">Pilihan Warna</h3>
          <div class="flex gap-4">
            {#each product.colorOptions || [] as c, i}
              <button on:click={() => (colorIndex = i)} aria-label={c.label} title={c.label} class={`w-10 h-10 rounded-full ${colorIndex === i ? 'ring-2 ring-offset-2 ring-accent' : ''} transition-all`} style={`background:${c.hex}`}></button>
            {/each}
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-text-muted uppercase">Pilihan Tipe</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            {#each product.paperOptions || [] as s, i}
              <button on:click={() => (paperIndex = i)} class={`py-3 ${paperIndex === i ? 'border-2 border-accent' : 'border border-border-input'} rounded-lg text-sm md:text-base font-semibold text-text-primary bg-surface text-center hover:border-accent transition-colors`}>{s}</button>
            {/each}
          </div>
        </div>
      </section>

      <section class="bg-surface rounded-lg border border-border p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-semibold text-text-primary mb-2">Deskripsi Produk</h3>
        <p class="text-base text-text-muted leading-relaxed">{product.desc}</p>
      </section>

      <section class="bg-surface rounded-lg border border-border p-4 md:p-6">
        <h3 class="text-lg md:text-xl font-semibold text-text-primary mb-4">Ulasan Pelanggan</h3>
        {#if product.reviews?.length}
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl font-bold text-text-primary">{product.rating}</span>
            <div class="flex flex-col">
              <div class="flex items-center gap-0.5">{#each Array(Math.round(product.rating)) as _}<span class="material-symbols-outlined text-[18px] text-accent-container" style="font-variation-settings:'FILL' 1">star</span>{/each}</div>
              <span class="text-sm text-text-muted">Rata-rata dari {product.reviews.length} ulasan</span>
            </div>
          </div>
          <div class="flex flex-col divide-y divide-border">
            {#each product.reviews as r}
              <div class="py-4 first:pt-0 last:pb-0">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-9 h-9 rounded-full bg-surface-mid flex items-center justify-center text-sm font-semibold text-text-primary flex-shrink-0">{r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-text-primary truncate">{r.name}</p>
                    <p class="text-xs text-text-muted">{r.date}</p>
                  </div>
                  <div class="ml-auto flex items-center gap-0.5">{#each Array(r.rating) as _}<span class="material-symbols-outlined text-[14px] text-accent-container" style="font-variation-settings:'FILL' 1">star</span>{/each}</div>
                </div>
                <p class="text-sm text-text-muted leading-relaxed">{r.comment}</p>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-base text-text-muted">Belum ada ulasan untuk produk ini.</p>
        {/if}
      </section>
    </div>
  </div>
</section>

<div class="fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 pb-safe flex gap-4 md:pb-4">
  <button class={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95 px-3 py-2 text-sm flex-1 bg-surface border border-primary text-primary hover:bg-surface-low ${soldOut ? 'opacity-50 pointer-events-none' : ''}`} disabled={soldOut} on:click={() => addToCart(product.id, 1)}>
    <span class="material-symbols-outlined">add_shopping_cart</span>
    + Keranjang
  </button>
  <Button label="Beli Sekarang" size="sm" extra={`flex-1 ${soldOut ? 'opacity-50 pointer-events-none' : ''}`} disabled={soldOut} />
</div>
