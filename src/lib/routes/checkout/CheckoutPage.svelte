<script>
  import { cart, orderTotals } from '../../stores/cart.js'
  import { formatRp } from '../../utils/icons.js'

  const shippingOptions = [
    { id: 'standard', label: 'Pengiriman Standar', desc: '3-5 Hari Kerja', price: 0 },
    { id: 'express', label: 'Pengiriman Ekspres', desc: '1-2 Hari Kerja', price: 15000 },
  ]

  const provinces = ['Jawa Barat', 'DKI Jakarta', 'Jawa Timur']
  $: ({ subtotal, tax, total } = $orderTotals)

  const placeholder =
    'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23eef1f5"/%3E%3Cg fill="none" stroke="%23c3cad4" stroke-width="8" stroke-linecap="round"%3E%3Crect x="170" y="150" width="260" height="360" rx="20"/%3E%3Cline x1="230" y1="260" x2="370" y2="260"/%3E%3Cline x1="230" y1="320" x2="370" y2="320"/%3E%3Cline x1="230" y1="380" x2="330" y2="380"/%3E%3C/g%3E%3C/svg%3E'
</script>

<section style="view-transition-name:checkout" class="max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
    <div class="md:col-span-8 space-y-6">
      <div>
        <div class="w-full bg-surface-high rounded-full h-2 mb-4"><div class="bg-primary-container h-2 rounded-full" style="width:33%"></div></div>
        <div class="flex justify-between items-center text-text-muted">
          <span class="text-sm font-bold text-primary-container">1. Pengiriman</span>
          <span class="text-sm">2. Pembayaran</span>
          <span class="text-sm">3. Konfirmasi</span>
        </div>
      </div>

      <section class="bg-surface rounded-lg border border-border p-4 md:p-6 shadow-sm">
        <h2 class="text-lg md:text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Alamat Pengiriman</h2>
        <form class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label for="firstName" class="block text-sm font-semibold text-text-muted mb-1">Nama Depan</label><input id="firstName" class="w-full rounded-lg border border-border-input p-4 bg-transparent" placeholder="Nama depan" /></div>
            <div><label for="lastName" class="block text-sm font-semibold text-text-muted mb-1">Nama Belakang</label><input id="lastName" class="w-full rounded-lg border border-border-input p-4 bg-transparent" placeholder="Nama belakang" /></div>
          </div>
          <div><label for="addressLine1" class="block text-sm font-semibold text-text-muted mb-1">Alamat Lengkap</label><input id="addressLine1" class="w-full rounded-lg border border-border-input p-4 bg-transparent" placeholder="Alamat" /></div>
          <div><label for="city" class="block text-sm font-semibold text-text-muted mb-1">Kota / Kabupaten</label><input id="city" class="w-full rounded-lg border border-border-input p-4 bg-transparent" placeholder="Kota" /></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label for="province" class="block text-sm font-semibold text-text-muted mb-1">Provinsi</label><select id="province" class="w-full rounded-lg border border-border-input p-4 bg-transparent"><option>Pilih Provinsi</option>{#each provinces as p}<option>{p}</option>{/each}</select></div>
            <div><label for="zip" class="block text-sm font-semibold text-text-muted mb-1">Kode Pos</label><input id="zip" class="w-full rounded-lg border border-border-input p-4 bg-transparent" placeholder="Kode pos" /></div>
          </div>
        </form>
      </section>

      <section class="bg-surface rounded-lg border border-border p-4 md:p-6 shadow-sm">
        <h2 class="text-lg md:text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Metode Pengiriman</h2>
        <div class="space-y-2">
          {#each shippingOptions as s, i}
            <label class={`flex items-center p-4 ${i === 0 ? 'border-2 border-accent bg-surface-low' : 'border border-border-input hover:bg-surface-low'} rounded-lg cursor-pointer transition-colors`}>
              <input class="w-5 h-5 text-accent border-border-input focus:ring-accent" type="radio" name="shipping" value={s.id} checked={i === 0} />
              <div class="ml-4 flex-1">
                <span class="block text-sm font-semibold text-text-primary">{s.label}</span>
                <span class="block text-sm text-text-muted">{s.desc}</span>
              </div>
              <span class="text-base font-semibold text-text-primary">{s.price === 0 ? 'Gratis' : formatRp(s.price)}</span>
            </label>
          {/each}
        </div>
      </section>

      <a href="#/checkout" class="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95 px-4 py-3.5 text-base w-full bg-accent text-white hover:bg-accent-hover shadow-sm">Lanjut ke Pembayaran</a>
    </div>

    <aside class="md:col-span-4">
      <div class="bg-surface rounded-lg border border-border p-4 md:p-6 shadow-sm sticky top-24">
        <h3 class="text-lg md:text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Ringkasan Pesanan</h3>
        <div class="space-y-4 mb-6">
          {#if $cart.length === 0}
            <p class="text-sm text-text-muted">Tidak ada item di keranjang.</p>
          {:else}
            {#each $cart as item}
              {@const p = item.product}
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded bg-surface-low flex-shrink-0 relative overflow-hidden"><img class="w-full h-full object-cover absolute inset-0" src={placeholder} alt={p?.name} /></div>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-text-primary line-clamp-2">{p?.name}</h4>
                  <p class="text-sm text-text-muted">Qty: {item.qty}</p>
                </div>
                <span class="text-base font-semibold text-text-primary">{formatRp((p?.price || 0) * item.qty)}</span>
              </div>
            {/each}
          {/if}
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-base text-text-muted"><span>Subtotal</span><span class="text-text-primary font-semibold">{formatRp(subtotal)}</span></div>
          <div class="flex justify-between text-base text-text-muted"><span>Pengiriman</span><span class="text-text-primary font-semibold">Gratis</span></div>
          <div class="flex justify-between text-base text-text-muted"><span>Pajak</span><span class="text-text-primary font-semibold">{formatRp(tax)}</span></div>
          <div class="flex justify-between text-xl md:text-2xl font-semibold text-text-primary pt-2 border-t border-border"><span>Total</span><span>{formatRp(total)}</span></div>
        </div>
      </div>
    </aside>
  </div>
</section>
