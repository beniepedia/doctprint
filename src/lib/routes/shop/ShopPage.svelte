<script>
  import { categories } from '../../data/site.js'
  import { products } from '../../data/products.js'
  import Icon from '../../components/atoms/Icon.svelte'
  import ProductCard from '../../components/organisms/ProductCard.svelte'

  let q = ''
  let category = 'all'

  $: list = products.filter((p) => {
    const matchCategory = category === 'all' || p.categoryId === category
    const matchQuery = !q || `${p.name} ${p.desc}`.toLowerCase().includes(q.toLowerCase().trim())
    return matchCategory && matchQuery
  })
</script>

<section class="max-w-7xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
  <div class="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(15,23,42,0.08)]">
    <span class="w-10 h-10 rounded-xl bg-surface-low text-text-muted flex items-center justify-center shrink-0 border border-border/70"><Icon name="search" className="text-[20px]" /></span>
    <input bind:value={q} type="search" placeholder="Cari produk" class="w-full appearance-none border-0 bg-transparent p-0 text-[15px] leading-6 font-medium text-text-primary placeholder:text-text-muted focus:ring-0 focus:outline-none" />
  </div>

  <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
    <button on:click={() => (category = 'all')} class={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border ${category === 'all' ? 'bg-accent-soft text-accent border-transparent' : 'bg-surface text-text-muted border-border'}`}>Semua</button>
    {#each categories as c}
      <button on:click={() => (category = c.id)} class={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border ${category === c.id ? 'bg-accent-soft text-accent border-transparent' : 'bg-surface text-text-muted border-border'}`}>{c.label}</button>
    {/each}
  </div>

  <div class="flex justify-between items-center">
    <h2 class="text-lg font-semibold text-text-primary">Katalog Produk</h2>
    <span class="text-xs font-semibold text-accent-deep">{list.length} item</span>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
    {#each list as p}
      <ProductCard {p} />
    {/each}
  </div>
</section>
