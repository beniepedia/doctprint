import { icon, formatRp } from '../lib.js'

export function OrderSummary({
  items = '',
  subtotal,
  tax,
  total,
  shipping = 'Gratis',
  taxLabel = 'Pajak',
  footer = '',
  cls = '',
  sticky = 'top-20 md:top-24',
}) {
  return `
    <div class="bg-surface rounded-lg border border-border p-4 md:p-6 shadow-sm sticky ${sticky} ${cls}">
      <h3 class="text-lg md:text-xl font-semibold text-text-primary mb-4 border-b border-border pb-2">Ringkasan Pesanan</h3>
      ${items ? `<div class="space-y-4 mb-6">${items}</div>` : ''}
      <div class="space-y-2 ${items ? 'border-t border-border pt-4' : ''}">
        <div class="flex justify-between text-base text-text-muted"><span>Subtotal</span><span class="text-text-primary font-semibold">${formatRp(subtotal)}</span></div>
        <div class="flex justify-between text-base text-text-muted"><span>Pengiriman</span><span class="text-text-primary font-semibold">${shipping}</span></div>
        <div class="flex justify-between text-base text-text-muted"><span>${taxLabel}</span><span class="text-text-primary font-semibold">${formatRp(tax)}</span></div>
        <div class="flex justify-between text-xl md:text-2xl font-semibold text-text-primary pt-2 border-t border-border"><span>Total</span><span>${formatRp(total)}</span></div>
      </div>
      ${footer}
      <div class="mt-4 flex items-center justify-center gap-1 text-text-muted text-sm">
        ${icon('lock', 'text-[16px]')}<span>Checkout Aman</span>
      </div>
    </div>`
}
