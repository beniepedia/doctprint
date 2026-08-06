function parseHash() {
  const hash = location.hash.replace(/^#\/?/, '')
  const [path, query = ''] = hash.split('?')
  return { path: path || 'home', params: new URLSearchParams(query) }
}

const RANK = { home: 0, profile: 1, product: 2, cart: 3, checkout: 4 }
let lastPath = null

function settleSharedMedia(root) {
  const images = [...root.querySelectorAll('[style*="view-transition-name"] img')].filter((i) => !i.complete)
  if (!images.length) return Promise.resolve()
  return Promise.race([
    Promise.all(images.map((i) => (typeof i.decode === 'function' ? i.decode().catch(() => {}) : Promise.resolve()))),
    new Promise((r) => setTimeout(r, 900)),
  ])
}

export function start(root, views) {
  const render = (back) => {
    const { path, params } = parseHash()
    lastPath = path
    document.documentElement.style.setProperty('--vt-x', back ? '-36px' : '36px')
    document.documentElement.style.setProperty('--vt-dur', back ? '0.5s' : '0.3s')

    const view = views[path] || views.home
    root.innerHTML = view.render(params)
    if (view.mount) view.mount(root, params)
    window.scrollTo(0, 0)
  }

  const navigate = () => {
    const { path } = parseHash()
    const back = lastPath != null && (RANK[path] ?? 0) < (RANK[lastPath] ?? 0)
    if (back) window.scrollTo(0, 0)
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        render(back)
        await settleSharedMedia(root)
      })
    } else {
      render(back)
    }
  }

  window.addEventListener('hashchange', navigate)
  navigate()
}
