<script>
  import Icon from '../atoms/Icon.svelte'
  export let title = 'DoctPrint'
  export let left = 'menu'
  export let right = 'search'
  export let onBack = false
</script>

<header class="fixed top-0 inset-x-0 z-50 bg-surface border-b border-border shadow-sm flex items-center gap-3 px-4 h-16">
  {#if onBack}
    <a href="#/home" aria-label="Kembali" class="text-accent-deep hover:bg-surface-low active:scale-95 transition p-2 rounded-full">
      <Icon name="arrow_back" />
    </a>
  {:else if left}
    <button aria-label="Menu" class="hidden md:block text-accent-deep hover:bg-surface-low active:scale-95 transition p-2 rounded-full">
      <Icon name={left} />
    </button>
  {:else}
    <div class="w-10 hidden md:block"></div>
  {/if}

  <h1 class="font-bold text-base md:text-lg text-accent-deep flex-grow">{title}</h1>

  {#if right}
    <button aria-label="Cari" class="text-accent-deep hover:bg-surface-low active:scale-95 transition p-2 rounded-full">
      <Icon name={right} />
    </button>
  {:else}
    <div class="w-10"></div>
  {/if}
</header>
