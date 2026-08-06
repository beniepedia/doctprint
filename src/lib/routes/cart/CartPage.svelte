<script>
  import { cart, changeQty, removeItem, orderTotals } from '../../stores/cart.js'
  import { formatRp } from '../../utils/icons.js'

  const placeholder =
    'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23eef1f5"/%3E%3Cg fill="none" stroke="%23c3cad4" stroke-width="8" stroke-linecap="round"%3E%3Crect x="170" y="150" width="260" height="360" rx="20"/%3E%3Cline x1="230" y1="260" x2="370" y2="260"/%3E%3Cline x1="230" y1="320" x2="370" y2="320"/%3E%3Cline x1="230" y1="380" x2="330" y2="380"/%3E%3C/g%3E%3C/svg%3E'

  $: ({ subtotal, tax, total, count } = $orderTotals)
</script>

<section class="max-w-7xl mx-auto px-4 md:px-8 py-6">
  <div class="mb-6">
    <h2 class="text-2xl md:text-4xl font-bold text-text-primary mb-1">Keranjang Anda</h2>
    <p class="text-base text-text-muted">{count} item di keranjang</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div class="md:col-span-8 flex flex-col gap-4">
      {#if $cart.length === 0}
        <div class="bg-surface rounded-lg border border-border p-8 text-center text-text-muted">Keranjang kosong.</div>
      {:else}
        {#each $cart as item}
          {#key item.id}
            {@const p = item.product}
            <div class="bg-surface rounded-lg border border-border p-3 sm:p-4 flex gap-3 sm:gap-4 items-center">
              <img class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md bg-surface-low flex-shrink-0" src={placeholder} alt={p?.name} />
              <div class="flex-grow flex flex-col justify-between h-full min-w-0">
                <div class="flex justify-between items-start gap-3 mb-1">
                  <div class="min-w-0">
                    <h3 class="text-base md:text-lg font-semibold text-text-primary line-clamp-2">{p?.name}</h3>
                    <p class="text-sm text-text-muted">{item.variant || p?.unit}</p>
                  </div>
                  <span class="text-base md:text-lg font-semibold text-text-primary whitespace-nowrap">{formatRp((p?.price || 0) * item.qty)}</span>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center border border-border-input rounded-md overflow-hidden bg-surface">
                    <button aria-label="Kurangi jumlah" class="px-3 py-1 hover:bg-surface-low text-text-muted transition-colors" on:click={() => changeQty(item.id, -1)}>-</button>
                    <span class="px-3 py-1 text-base text-text-primary border-x border-border-input">{item.qty}</span>
                    <button aria-label="Tambah jumlah" class="px-3 py-1 hover:bg-surface-low text-text-muted transition-colors" on:click={() => changeQty(item.id, 1)}>+</button>
                  </div>
                  <button class="text-error hover:text-on-error-container flex items-center gap-1 text-sm font-semibold transition-colors active:scale-95" on:click={() => removeItem(item.id)}>
                    <span class="material-symbols-outlined text-[18px]">delete</span><span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          {/key}
        {/each}
      {/if}
    </div>

    <div class="md:col-span-4">
      <div class="bg-surface rounded-lg border border-border p-4 md:p-6 shadow-sm sticky top-20 md:top-24">
        <h3 class="text-lg md:text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Ringkasan Pesanan</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-base text-text-muted"><span>Subtotal</span><span class="text-text-primary font-semibold">{formatRp(subtotal)}</span></div>
          <div class="flex justify-between text-base text-text-muted"><span>Pengiriman</span><span class="text-text-primary font-semibold">Gratis</span></div>
          <div class="flex justify-between text-base text-text-muted"><span>Pajak</span><span class="text-text-primary font-semibold">{formatRp(tax)}</span></div>
          <div class="flex justify-between text-xl md:text-2xl font-semibold text-text-primary pt-2 border-t border-border"><span>Total</span><span>{formatRp(total)}</span></div>
        </div>

        <div class="mt-6 mb-6">
          <label class="block text-sm font-semibold text-text-muted mb-1" for="promo">Kode Promo</label>
          <div class="flex gap-2">
            <input id="promo" class="w-full text-base bg-surface border border-border-input rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-all" placeholder="Masukkan kode" />
            <button class="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95 px-3 py-2 text-sm bg-surface border border-primary text-primary hover:bg-surface-low">Pakai</button>
          </div>
        </div>

        <a href="#/checkout" class="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95 px-4 py-3.5 text-base w-full bg-accent text-white hover:bg-accent-hover shadow-sm">
          <span class="material-symbols-outlined">arrow_forward</span>
          Lanjut ke Checkout
        </a>

        <div class="mt-4 flex items-center justify-center gap-1 text-text-muted text-sm">
          <span class="material-symbols-outlined text-[16px]">lock</span><span>Checkout Aman</span>
        </div>
      </div>
    </div>
  </div>
</section>
