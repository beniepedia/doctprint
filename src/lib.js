import heroImg from './assets/hero.png'

export { heroImg }

export function icon(name, cls = '') {
  return `<span class="material-symbols-outlined ${cls}">${name}</span>`
}

export function formatRp(value) {
  return 'Rp ' + Number(value).toLocaleString('id-ID')
}

export function placeholder() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">',
    '<rect width="600" height="600" fill="#eef1f5"/>',
    '<g fill="none" stroke="#c3cad4" stroke-width="8" stroke-linecap="round">',
    '<rect x="170" y="150" width="260" height="360" rx="20"/>',
    '<line x1="230" y1="260" x2="370" y2="260"/>',
    '<line x1="230" y1="320" x2="370" y2="320"/>',
    '<line x1="230" y1="380" x2="330" y2="380"/>',
    '</g></svg>',
  ].join('')
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const FIELD_BASE =
  'rounded-lg border border-border-input p-4 text-base text-text-primary bg-transparent focus:border-primary focus:outline-none transition-all w-full'

export function field({ label, id, type = 'text', required = false, options = null, placeholder = '' }) {
  const control = options
    ? `<select id="${id}" class="${FIELD_BASE} appearance-none">${placeholder ? `<option disabled selected>${placeholder}</option>` : ''}${options
        .map((o) => `<option>${o}</option>`)
        .join('')}</select>`
    : `<input id="${id}" type="${type}" ${required ? 'required' : ''} ${placeholder ? `placeholder="${placeholder}"` : ''} class="${FIELD_BASE}" />`

  return `
    <div class="flex flex-col">
      <label class="text-sm font-semibold text-text-muted mb-1" for="${id}">${label}</label>
      ${control}
    </div>`
}

const BTN_VARIANTS = {
  primary: 'bg-accent text-white hover:opacity-90',
  secondary: 'bg-surface border border-primary text-primary hover:bg-surface-low',
  danger: 'bg-surface border border-error text-error hover:bg-error-container hover:border-error',
}

export function btnClass(variant = 'primary', extra = '') {
  return `inline-flex items-center justify-center gap-2 rounded-lg text-base font-semibold py-3.5 px-4 transition-colors active:scale-95 ${BTN_VARIANTS[variant]} ${extra}`.trim()
}

export function toast(msg) {
  let el = document.querySelector('#toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'toast'
    document.body.appendChild(el)
  }
  el.textContent = msg
  el.className =
    'fixed left-1/2 -translate-x-1/2 bottom-24 z-[60] bg-text-primary text-white text-sm px-4 py-2 rounded-lg shadow-lg opacity-0 transition-opacity duration-300'
  requestAnimationFrame(() => el.classList.remove('opacity-0'))
  clearTimeout(el._t)
  el._t = setTimeout(() => el.classList.add('opacity-0'), 2000)
}
